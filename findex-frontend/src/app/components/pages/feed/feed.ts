import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Header } from '../../header/header';
import { Prestamos } from '../../../services/prestamo/prestamos';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud/solicitud.service';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, CurrencyPipe, DatePipe, Header, RouterModule],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  tipo = Number(localStorage.getItem('tipo'));
  ofertas_prestamos: any[] = [];
  terminoBusqueda = '';

  constructor(
    private prestamos: Prestamos,
    private solicitud: SolicitudService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Feed cargado - Verificando localStorage:');
    console.log('- Token:', localStorage.getItem('token'));
    console.log('- ID:', localStorage.getItem('id'));
    console.log('- Tipo:', localStorage.getItem('tipo'));

    this.route.queryParams.subscribe((params) => {
      this.terminoBusqueda = (params['buscar'] || '').trim();
      this.cargarOfertas();
    });
  }

  cargarOfertas() {
    this.prestamos.obtenerPrestamos().subscribe((data) => {
      let lista = data;
      if (this.terminoBusqueda) {
        const term = this.terminoBusqueda.toLowerCase();
        lista = lista.filter((o: any) =>
          String(o.codigo_oferta).toLowerCase().includes(term)
        );
      }
      this.ofertas_prestamos = lista;
      if (this.tipo === 2) {
        const id_prestatario = Number(localStorage.getItem('id'));
        this.ofertas_prestamos.forEach((oferta) => {
          this.solicitud.yaAplico(oferta.id_oferta, id_prestatario).subscribe({
            next: (res) => {
              if (res.yaAplico) {
                oferta._yaAplico = true;
                oferta._mensaje =
                  res.estado === 'aceptada'
                    ? 'Ya aceptada'
                    : 'Solicitud enviada';
              }
            },
            error: () => {},
          });
        });
      }
    });
  }

  onBuscarCodigo(codigo: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { buscar: codigo },
      queryParamsHandling: 'merge',
    });
  }

  aplicar(oferta: any) {
    if (oferta._aplicando || oferta._yaAplico) return;
    oferta._aplicando = true;
    const id_prestatario = Number(localStorage.getItem('id'));
    this.solicitud
      .crear({
        id_oferta: oferta.id_oferta,
        id_prestatario,
        monto_solicitado: oferta.monto,
        comentario: '',
      })
      .subscribe({
        next: (res) => {
          oferta._aplicando = false;
          oferta._yaAplico = true;
          oferta._mensaje = 'Solicitud enviada';
        },
        error: (err) => {
          oferta._aplicando = false;
          oferta._mensaje = err.error?.message || 'Error al aplicar';
        },
      });
  }

  trackById(index: number, item: any) {
    return item?.id_oferta || index;
  }
}
