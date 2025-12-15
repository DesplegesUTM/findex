import { Component } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  registrar() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.notificationService.showWarning(
        'Por favor complete todos los campos'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.showError('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.notificationService.showWarning(
        'La contraseña debe tener al menos 6 caracteres'
      );
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        email: this.email,
        contraseña: this.password,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.notificationService.showSuccess(
            'Usuario registrado exitosamente. Iniciando sesión...'
          );
          console.log('Usuario registrado:', res);

          // Hacer login automático después del registro exitoso
          this.auth
            .login({ email: this.email, contraseña: this.password })
            .subscribe({
              next: (loginRes) => {
                this.notificationService.showSuccess('¡Bienvenido a Findex!');
                this.router.navigate(['/feed']);
              },
              error: (loginErr) => {
                console.error('Error en login automático:', loginErr);
                this.notificationService.showInfo(
                  'Registro exitoso. Por favor inicia sesión'
                );
                this.router.navigate(['/login']);
              },
            });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error en registro:', err);

          let errorMessage = 'Error al registrar usuario';

          if (err.status === 409) {
            errorMessage =
              'Este correo electrónico ya está registrado. Intenta con otro email o inicia sesión.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          this.notificationService.showError(errorMessage);
        },
      });
  }
}
