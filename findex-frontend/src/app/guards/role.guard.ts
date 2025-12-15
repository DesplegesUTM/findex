import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  const userRole = Number(localStorage.getItem('tipo'));

  if (requiredRole && userRole !== requiredRole) {
    // Redirigir a página apropiada según el rol del usuario
    if (userRole === 1) {
      router.navigate(['/feed']); // Prestamista
    } else if (userRole === 2) {
      router.navigate(['/feed']); // Prestatario
    } else {
      router.navigate(['/login']);
    }
    return false;
  }

  return true;
};
