import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  tipo: number = Number(localStorage.getItem('tipo'));
  termino = '';
  @Output() buscarCodigo = new EventEmitter<string>();

  constructor(
    private auth: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  logout() {
    this.auth.logout();
    this.notificationService.showInfo('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  onBuscarEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.dispararBusqueda();
    }
  }

  dispararBusqueda() {
    const codigo = this.termino.trim();
    if (!codigo) return;
    // emite evento para componentes padres que estén interesados
    this.buscarCodigo.emit(codigo);
    // si estamos en el feed podemos navegar con el query param
    if (this.router.url.startsWith('/feed')) {
      this.router.navigate(['/feed'], { queryParams: { buscar: codigo } });
    } else {
      // navegar al feed con el código
      this.router.navigate(['/feed'], { queryParams: { buscar: codigo } });
    }
  }

  closeSidebar() {
    const checkbox = document.getElementById(
      'btn-menu'
    ) as HTMLInputElement | null;
    if (checkbox) checkbox.checked = false;
  }
}
