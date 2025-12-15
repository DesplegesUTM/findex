import { DatePipe, NgIf, NgClass, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../services/completar_perfil/usuario/usuario';
import { Prestamista } from '../../../services/completar_perfil/prestamista/prestamista';
import { Prestatario } from '../../../services/completar_perfil/prestatario/prestatario';
import { Router } from '@angular/router';
import { Header } from '../../header/header';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, NgClass, DatePipe, CurrencyPipe, Header],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  datosUsuario: any = {};
  datosPrestamista: any = {};
  datosPrestatario: any = {};
  id: number = Number(localStorage.getItem('id'));
  tipo: number = Number(localStorage.getItem('tipo')); // 1 = prestamista, 2 = prestatario

  constructor(
    private usuario: Usuario,
    private prestamista: Prestamista,
    private prestatario: Prestatario,
    private router: Router
  ) {
    // Inicializar objetos vacíos para evitar errores de template
    this.datosUsuario = {};
    this.datosPrestamista = {};
    this.datosPrestatario = {};
  }

  ngOnInit(): void {
    if (!this.id || this.id === 0) {
      console.warn('ID inválido, redirigiendo...');
      this.router.navigate(['/login']);
      return;
    }

    // Cargar datos generales del usuario
    this.usuario.obtenerUsuario(this.id).subscribe({
      next: (user) => {
        this.datosUsuario = { ...this.datosUsuario, ...user };
        console.log('Datos de usuario cargados:', user);

        // Cargar datos específicos por tipo (si existen)
        if (this.tipo === 1) {
          // Prestamista
          this.prestamista.obtenerPrestamista(this.id).subscribe({
            next: (extra) => {
              this.datosPrestamista = { ...this.datosPrestamista, ...extra };
              console.log('Datos de prestamista cargados:', extra);
            },
            error: (err) => {
              console.log(
                'Usuario no tiene perfil de prestamista completado aún'
              );
              // No redirigir, solo mostrar que el perfil no está completo
            },
          });
        } else if (this.tipo === 2) {
          // Prestatario
          this.prestatario.obtenerPrestatario(this.id).subscribe({
            next: (extra) => {
              this.datosPrestatario = { ...this.datosPrestatario, ...extra };
              console.log('Datos de prestatario cargados:', extra);
            },
            error: (err) => {
              console.log(
                'Usuario no tiene perfil de prestatario completado aún'
              );
              // No redirigir, solo mostrar que el perfil no está completo
            },
          });
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener usuario:', err);
        this.router.navigate(['/login']);
      },
    });
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}
