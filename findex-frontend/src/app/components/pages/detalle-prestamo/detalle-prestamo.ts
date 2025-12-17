import { Component, inject } from '@angular/core';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { PagosService } from '../../../services/pago/pagos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../../header/header';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-detalle-prestamo',
  imports: [Header, CommonModule, RouterModule],
  templateUrl: './detalle-prestamo.html',
  styleUrl: './detalle-prestamo.css',
})
export class DetallePrestamo {
  constructor(
    private prestamos: Prestamos,
    private pagosService: PagosService
  ) {}
  private activatedRoute = inject(ActivatedRoute);
  public baseUrl = environment.apiUrl;
  tipo = Number(localStorage.getItem('tipo'));
  prestamo: any = {};
  pagos: any[] = [];
  filasPagos: any[][] = [];
  prestamoIdParaPago: number | null = null;

  get totalAPagar(): number {
    if (!this.prestamo?.monto || !this.prestamo?.tasa_interes) return 0;
    const monto = Number(this.prestamo.monto) || 0;
    const interes = Number(this.prestamo.tasa_interes) || 0;
    return monto + +monto * (+interes / 100);
  }

  get totalPagado(): number {
    return this.pagos.reduce(
      (acc, p) => acc + (Number(p.monto_pagado) || 0),
      0
    );
  }

  get progresoPorcentaje(): number {
    const total = this.totalAPagar;
    if (!total) return 0;
    const pct = (this.totalPagado / total) * 100;
    return Math.min(100, Math.max(0, pct));
  }

  get saldoRestanteTotal(): number {
    return Math.max(0, this.totalAPagar - this.totalPagado);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.prestamos.obtenerPrestamo(id).subscribe((data) => {
      this.prestamo = data;
      // id_prestamo se intentará derivar de la lista de pagos (si existen)
      // intentar obtener id_prestamo real a partir de pagos por oferta (si API lo soporta)
      // Como fallback, derivaremos del primer pago (si lo tiene) o lo dejaremos nulo

      // Obtener pagos relacionados con la oferta
      if (data && data.id_oferta) {
        this.pagosService
          .obtenerPagosPorOferta(data.id_oferta)
          .subscribe((pagos) => {
            this.pagos = pagos;
            if (this.pagos.length > 0 && this.pagos[0].id_prestamo) {
              this.prestamoIdParaPago = Number(this.pagos[0].id_prestamo);
            }
            // Si no hay pagos aún, intentar resolver el préstamo del usuario autenticado para esta oferta
            if (!this.prestamoIdParaPago) {
              this.prestamos
                .obtenerMiPrestamoPorOferta(data.id_oferta)
                .subscribe({
                  next: (pr) => {
                    if (pr && pr.id_prestamo) {
                      this.prestamoIdParaPago = Number(pr.id_prestamo);
                    }
                  },
                  error: () => {
                    // Silenciar: simplemente no habrá botón si no existe préstamo
                  },
                });
            }
            // Ordenar pagos por fecha ascendente
            const pagosOrdenados = pagos.sort(
              (a: any, b: any) =>
                new Date(a.fecha_pago).getTime() -
                new Date(b.fecha_pago).getTime()
            );
            // Calcular saldo restante después de cada pago
            let saldoRestante = this.prestamo.monto;
            this.pagos = pagosOrdenados.map((pago: any, idx: number) => {
              // Sumar todos los pagos anteriores (incluyendo el actual)
              const pagadoHastaAhora = pagosOrdenados
                .slice(0, idx + 1)
                .reduce(
                  (acc: number, p: any) => acc + Number(p.monto_pagado),
                  0
                );
              return {
                ...pago,
                saldo_restante:
                  saldoRestante -
                  pagadoHastaAhora +
                  +this.prestamo.monto * (+this.prestamo.tasa_interes / 100),
              };
            });
            // Agrupar pagos en filas de máximo 3
            this.filasPagos = [];
            for (let i = 0; i < this.pagos.length; i += 3) {
              this.filasPagos.push(this.pagos.slice(i, i + 3));
            }
          });
      }
    });
  }
}
