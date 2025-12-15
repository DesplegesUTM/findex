import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pagos } from '../../../services/pagos/pagos';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-registrar-pago',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-pago.html',
  styleUrl: './registrar-pago.css',
})
export class RegistrarPago {
  metodoPago: any[] = [];
  pago = {
    id_prestamo: 0,
    fecha_pago: new Date().toISOString().split('T')[0],
    monto_pagado: 0,
    id_metodo: 0,
    comprobante_url: '',
    estado: true,
  };
  montoPrestamo: number = 0;
  montoCuota: number = 0;
  saldoPendiente: number = 0;
  archivoComprobante: File | null = null;
  nombreArchivo: string | null = null;
  private _totalPagadoAcumulado: number = 0;

  get totalPagado(): number {
    return this._totalPagadoAcumulado;
  }

  constructor(
    private pagos: Pagos,
    private prestamos: Prestamos,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    // Cargar métodos de pago
    this.pagos.metodoPago().subscribe((metodos) => {
      this.metodoPago = metodos;
    });
    // Leer id_prestamo desde ruta y cargar datos
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.pago.id_prestamo = +id;
        this.cargarDatosPrestamo(this.pago.id_prestamo);
      }
    });
  }

  cargarDatosPrestamo(id_prestamo: number) {
    // Paso 1: obtener registro de prestamo para conocer id_oferta
    this.prestamos.obtenerPrestamoPorIdPrestamo(id_prestamo).subscribe((pr) => {
      if (!pr?.id_oferta) {
        this.notification.showError('No se encontró información del préstamo');
        return;
      }
      // Paso 2: con id_oferta, obtener atributos de la oferta (monto, interés, cuota)
      this.prestamos
        .obtenerPrestamo(Number(pr.id_oferta))
        .subscribe((oferta) => {
          const monto = Number(oferta.monto) || 0;
          const tasa = Number(oferta.tasa_interes) || 0;
          const montoTotal = monto + (monto * tasa) / 100;
          this.montoPrestamo = montoTotal;
          this.montoCuota = Number(oferta.monto_cuota) || 0;
          this.pago.monto_pagado = this.montoCuota;
          // Paso 3: cargar pagos para cálculo de saldo
          this.pagos
            .obtenerPagosPorPrestamo(id_prestamo)
            .subscribe((pagos: any[]) => {
              this._totalPagadoAcumulado = pagos.reduce(
                (acc: number, p: any) => acc + Number(p.monto_pagado),
                0
              );
              this.saldoPendiente = montoTotal - this._totalPagadoAcumulado;
            });
        });
    });
  }

  guardarCambios() {
    // Validaciones previas de UX
    if (!this.pago.id_prestamo) {
      this.notification.showError('Falta el identificador del préstamo');
      return;
    }
    if (!this.pago.id_metodo || this.pago.id_metodo === 0) {
      this.notification.showError('Selecciona un método de pago');
      return;
    }
    if (!this.archivoComprobante) {
      this.notification.showError('Adjunta el comprobante del pago');
      return;
    }
    const formData = new FormData();
    // Campos requeridos para el backend
    formData.append('id_prestamo', this.pago.id_prestamo.toString());
    formData.append('fecha_pago', this.pago.fecha_pago);
    formData.append('monto_pagado', this.pago.monto_pagado.toString());
    formData.append('id_metodo', this.pago.id_metodo.toString());
    formData.append('estado', this.pago.estado.toString());
    // Comprobante (archivo)
    formData.append('comprobante', this.archivoComprobante);
    this.pagos.crearPago(formData).subscribe({
      next: (response) => {
        console.log('Pago registrado:', response);
        this.notification.showSuccess('Pago registrado correctamente');
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al registrar pago:', err);
        const msg = err?.error?.message || 'Error al registrar el pago';
        this.notification.showError(msg);
      },
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.archivoComprobante = fileInput.files[0];
      this.nombreArchivo = this.archivoComprobante?.name || null;
    }
  }

  private resetFormulario() {
    this.pago.monto_pagado = this.montoCuota;
    this.pago.id_metodo = 0;
    this.archivoComprobante = null;
    this.nombreArchivo = null;
    // recálculo de saldo pendiente (ya se debió actualizar backend; opcional volver a cargar)
    this.cargarDatosPrestamo(this.pago.id_prestamo);
  }

  volver() {
    window.history.back();
  }
}
