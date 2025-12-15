import { Component } from '@angular/core';
import { Pagos } from '../../../services/pagos/pagos';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Header } from '../../header/header';

@Component({
  selector: 'app-mis-pagos',
  imports: [CommonModule, Header, CurrencyPipe, DatePipe],
  templateUrl: './mis-pagos.html',
  styleUrl: './mis-pagos.css',
})
export class MisPagos {
  pagosList: any[] = [];
  id = Number(localStorage.getItem('id'));

  constructor(private pagos: Pagos) {}

  ngOnInit() {
    this.pagos.obtenerPagosPorPrestatario(this.id).subscribe((data) => {
      this.pagosList = data || [];
    });
  }

  get cantidadPagados(): number {
    return this.pagosList.filter((p) => p?.estado).length;
  }
  get cantidadPendientes(): number {
    return this.pagosList.filter((p) => !p?.estado).length;
  }

  trackById(index: number, item: any) {
    return item?.id_pago || item?.codigo_oferta || index;
  }

  volver() {
    window.history.back();
  }
}
