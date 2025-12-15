import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification/notification.service';
import { Prestamista } from '../../../services/completar_perfil/prestamista/prestamista';
import { Calendario } from '../../calendario/calendario';

@Component({
  selector: 'app-crear-prestamo',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-prestamo.html',
  styleUrl: './crear-prestamo.css',
})
export class CrearPrestamo {
  constructor(
    private prestamos: Prestamos,
    private notification: NotificationService,
    private prestamistaService: Prestamista
  ) {}

  frecuenciaPago: any[] = [];
  id = Number(localStorage.getItem('id'));
  capitalDisponible = 0;

  prestamo = {
    id_prestamista: this.id,
    codigo_oferta: '',
    monto: 0,
    tasa_interes: 0,
    id_frecuencia: 0,
    nro_cuotas: 0,
    monto_cuota: 0,
    fecha_publicacion: new Date().toISOString().split('T')[0],
    estado: true,
  };

  ngOnInit() {
    this.prestamos.frecuenciaPago().subscribe((frecuencia) => {
      this.frecuenciaPago = frecuencia;
    });
    // cargar capital del prestamista autenticado
    if (this.id) {
      this.prestamistaService.obtenerPrestamista(this.id).subscribe({
        next: (data) => {
          const cap = Number(data?.capital ?? 0);
          this.capitalDisponible = Number.isFinite(cap) ? cap : 0;
        },
        error: () => {
          this.capitalDisponible = 0;
        },
      });
    }
  }

  recalcularPrestamo() {
    const monto = this.prestamo.monto;
    const tasa = this.prestamo.tasa_interes;
    const idFrecuencia = this.prestamo.id_frecuencia;

    if (monto > 0 && tasa >= 0 && idFrecuencia > 0) {
      const interesTotal = monto * (tasa / 100);
      const totalAPagar = monto + interesTotal;

      let cuotas = 0;

      switch (idFrecuencia) {
        case 1: // Diaria (30 días promedio)
          cuotas = 30;
          break;
        case 2: // Semanal (4 semanas)
          cuotas = 4;
          break;
        case 3: // Quincenal (2 pagos por mes)
          cuotas = 2;
          break;
        case 4: // Mensual
          cuotas = 1;
          break;
        case 5: // Trimestral
          cuotas = 1;
          break;
        case 6: // Anual
          cuotas = 1;
          break;
        default:
          cuotas = 1;
          break;
      }

      const montoCuota = totalAPagar / cuotas;

      this.prestamo.nro_cuotas = cuotas;
      this.prestamo.monto_cuota = parseFloat(montoCuota.toFixed(2));
    }
  }

  calcularMontoCuota() {
    const monto = this.prestamo.monto;
    const tasa = this.prestamo.tasa_interes;
    const cuotas = this.prestamo.nro_cuotas;

    // Solo calcular si todos los campos tienen valores válidos
    if (monto > 0 && tasa >= 0 && cuotas > 0) {
      const interesTotal = monto * (tasa / 100);
      const totalAPagar = monto + interesTotal;
      const cuota = totalAPagar / cuotas;

      this.prestamo.monto_cuota = Number(cuota.toFixed(2)); // Redondear a 2 decimales
    } else {
      this.prestamo.monto_cuota = 0;
    }
  }

  generarCodigoOferta() {
    const codigo = 'oferta-' + Math.random().toString(36).substring(2, 10);

    // Verificar que no exista en la base de datos
    this.prestamos.codigoExiste(codigo).subscribe((existe) => {
      if (!existe) {
        this.prestamo.codigo_oferta = codigo;
      } else {
        // Si existe, intentamos nuevamente
        this.generarCodigoOferta();
      }
    });
  }

  guardarCambios() {
    // validación previa en el cliente: monto no puede exceder capital
    if (this.excedeCapital) {
      this.notification.showError(
        'El monto solicitado excede su capital disponible'
      );
      return;
    }
    this.prestamos.crearPrestamo(this.prestamo).subscribe({
      next: (response) => {
        console.log('Préstamo creado:', response);
        this.notification.showSuccess('Préstamo creado correctamente');
        this.resetFormulario();
      },
      error: (error) => {
        console.error('Error al crear préstamo:', error);
        const msg = error?.error?.message || 'Error al crear préstamo';
        this.notification.showError(msg);
      },
    });
  }

  volver() {
    window.history.back();
  }

  // Getters de resumen dinámico
  get interesTotal(): number {
    const m = this.prestamo.monto;
    const t = this.prestamo.tasa_interes;
    if (m > 0 && t >= 0) return +(m * (t / 100)).toFixed(2);
    return 0;
  }
  get totalAPagar(): number {
    return +(this.prestamo.monto + this.interesTotal).toFixed(2);
  }

  private resetFormulario() {
    // Mantener id_prestamista; reset de campos editables
    const id_prestamista = this.prestamo.id_prestamista;
    this.prestamo = {
      id_prestamista,
      codigo_oferta: '',
      monto: 0,
      tasa_interes: 0,
      id_frecuencia: 0,
      nro_cuotas: 0,
      monto_cuota: 0,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      estado: true,
    };
  }

  // reglas de validación de capital
  get excedeCapital(): boolean {
    const monto = Number(this.prestamo.monto || 0);
    return this.capitalDisponible > 0 && monto > this.capitalDisponible;
  }
}

// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Prestamos } from '../../../services/prestamo/prestamos';
// import { CommonModule } from '@angular/common';
// import { Calendario } from '../../calendario/calendario';

// @Component({
//   selector: 'app-crear-prestamo',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './crear-prestamo.html',
//   styleUrl: './crear-prestamo.css',
// })
// export class CrearPrestamo {
//   constructor(private prestamos: Prestamos) {}
//   frecuenciaPago: any[] = [];

//   id = Number(localStorage.getItem('id'));

//   prestamo = {
//     id_prestamista: this.id,
//     codigo_oferta: '',
//     monto: 0,
//     tasa_interes: 0,
//     id_frecuencia: 0,
//     nro_cuotas: 0,
//     monto_cuota: 0,
//     fecha_publicacion: new Date().toISOString().split('T')[0],
//     estado: true,
//   };

//   ngOnInit() {
//     this.prestamos.frecuenciaPago().subscribe((frecuencia) => {
//       this.frecuenciaPago = frecuencia;
//     });
//   }
//   guardarCambios() {
//     this.prestamos.crearPrestamo(this.prestamo).subscribe(
//       (response) => {
//         console.log('Préstamo creado:', response);
//       },
//       (error) => {
//         console.error('Error al crear préstamo:', error);
//       }
//     );
//   }
//   volver() {
//     window.history.back();
//   }
// }
