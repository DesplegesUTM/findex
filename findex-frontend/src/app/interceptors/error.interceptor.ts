import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo manejar errores críticos automáticamente
      switch (error.status) {
        case 401:
          notificationService.showError(
            'Sesión expirada. Por favor inicia sesión nuevamente'
          );
          // Limpiar datos de autenticación y redirigir al login
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('tipo');
          router.navigate(['/login']);
          break;
        case 403:
          notificationService.showError(
            'No tienes permisos para realizar esta acción Inicia secion denuevo por favor'
          );
          break;
        case 500:
          notificationService.showError(
            'Error interno del servidor. Intenta más tarde'
          );
          break;
        // No manejar automáticamente otros errores (400, 404, etc.)
        // Dejar que los componentes los manejen específicamente
      }

      return throwError(() => error);
    })
  );
};
