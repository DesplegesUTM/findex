import { Component } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  mostrarLogin = false;
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  toggleLoginForm() {
    this.mostrarLogin = !this.mostrarLogin;
  }

  login() {
    if (!this.email || !this.password) {
      this.notificationService.showWarning(
        'Por favor complete todos los campos'
      );
      return;
    }

    this.isLoading = true;

    this.auth
      .login({ email: this.email, contraseña: this.password })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.notificationService.showSuccess('¡Inicio de sesión exitoso!');
          console.log('Login exitoso', res);

          // Verificar que los datos se guardaron correctamente
          setTimeout(() => {
            console.log('Verificando localStorage después del login:');
            console.log('Token:', localStorage.getItem('token'));
            console.log('User:', localStorage.getItem('user'));
            console.log('isAuthenticated:', this.auth.isAuthenticated());
          }, 100);

          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage = err.error?.message || 'Credenciales incorrectas';
          this.notificationService.showError(errorMessage);
          console.error('Error al iniciar sesión', err);
        },
      });
  }
}
