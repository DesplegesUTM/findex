import { Component } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Header } from '../../header/header';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { SolicitudService } from '../../../services/solicitud/solicitud.service';

@Component({
  selector: 'app-gestionar-solicitudes',
  standalone: true,
  imports: [CommonModule, Header, NgFor, NgIf, DatePipe],
  templateUrl: './gestionar-solicitudes.html',
  styleUrl: './gestionar-solicitudes.css',
})
export class GestionarSolicitudes {
  idPrestamista = Number(localStorage.getItem('id'));
  ofertas: any[] = [];
  solicitudes: any[] = [];
  cargando = false;
  seleccionada: any = null;

  constructor(
    private prestamos: Prestamos,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.cargando = true;
    this.prestamos.obtenerOfertasPorPrestamista(this.idPrestamista).subscribe({
      next: (data: any[]) => {
        this.ofertas = data;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  verSolicitudes(oferta: any) {
    if (oferta._cargando) return;
    this.seleccionada = oferta;
    oferta._cargando = true;
    this.solicitudService.listarPorOferta(oferta.id_oferta).subscribe({
      next: (data) => {
        this.solicitudes = data;
        oferta._cargando = false;
      },
      error: (err) => {
        oferta._cargando = false;
        oferta._error = err.error?.message || 'Error al cargar solicitudes';
      },
    });
  }

  aceptar(sol: any) {
    if (sol._procesando) return;
    sol._procesando = true;
    this.solicitudService.aceptar(sol.id_solicitud).subscribe({
      next: (res) => {
        sol.estado = 'aceptada';
        sol._procesando = false;
        sol._mensaje = 'Aceptada';
      },
      error: (err) => {
        sol._procesando = false;
        sol._mensaje = err.error?.message || 'Error';
      },
    });
  }

  rechazar(sol: any) {
    if (sol._procesando) return;
    sol._procesando = true;
    this.solicitudService.rechazar(sol.id_solicitud).subscribe({
      next: () => {
        sol.estado = 'rechazada';
        sol._procesando = false;
        sol._mensaje = 'Rechazada';
      },
      error: (err) => {
        sol._procesando = false;
        sol._mensaje = err.error?.message || 'Error';
      },
    });
  }

  // Getters resumen
  get totalOfertas(): number {
    return this.ofertas.length;
  }
  get ofertasActivas(): number {
    return this.ofertas.filter((o) => o.estado).length;
  }
  get ofertasInactivas(): number {
    return this.ofertas.filter((o) => !o.estado).length;
  }

  // trackBy helpers
  trackByOferta(_i: number, o: any) {
    return o.id_oferta || o.codigo_oferta || _i;
  }
  trackBySolicitud(_i: number, s: any) {
    return s.id_solicitud || _i;
  }
}
