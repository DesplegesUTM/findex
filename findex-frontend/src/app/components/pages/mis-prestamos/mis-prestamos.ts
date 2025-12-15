import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { Header } from '../../header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-prestamos',
  imports: [CommonModule, Header, RouterModule, CurrencyPipe],
  templateUrl: './mis-prestamos.html',
  styleUrls: ['./mis-prestamos.css'],
})
export class MisPrestamos {
  id = Number(localStorage.getItem('id'));
  tipo = Number(localStorage.getItem('tipo'));
  misPrestamos: any[] = [];
  constructor(private prestamos: Prestamos) {}

  ngOnInit() {
    if (this.tipo === 2) {
      this.prestamos.misPrestamosPrestatario(this.id).subscribe((prestamos) => {
        console.log('estos son mis prestamos ', prestamos);
        this.misPrestamos = prestamos;
      });
    } else if (this.tipo === 1) {
      this.prestamos.misPrestamosPrestamista(this.id).subscribe((prestamos) => {
        console.log('estos son mis prestamos ', prestamos);
        this.misPrestamos = prestamos;
      });
    }
  }

  // Total del monto (si existe la propiedad monto)
  get totalMonto(): number {
    return this.misPrestamos.reduce(
      (acc, p) => acc + (Number(p?.monto) || 0),
      0
    );
  }

  trackById(index: number, item: any) {
    return item?.id_oferta || index;
  }

  // Calcula % transcurrido entre fecha inicio y fin
  calcularProgreso(fechaInicio: any, fechaFin: any): number {
    if (!fechaInicio || !fechaFin) return 0;
    const ini = new Date(fechaInicio).getTime();
    const fin = new Date(fechaFin).getTime();
    const hoy = Date.now();
    if (isNaN(ini) || isNaN(fin) || fin <= ini) return 0;
    if (hoy <= ini) return 0;
    if (hoy >= fin) return 100;
    return Math.round(((hoy - ini) / (fin - ini)) * 100);
  }
}
