import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  const isAuth = auth.isAuthenticated();

  console.log('AuthGuard - Verificando acceso a:', state.url);
  console.log('AuthGuard - Token existe:', !!token);
  console.log('AuthGuard - isAuthenticated:', isAuth);
  console.log('AuthGuard - LocalStorage completo:', {
    token: token ? 'EXISTS' : 'NULL',
    id: localStorage.getItem('id'),
    tipo: localStorage.getItem('tipo'),
  });

  if (isAuth) {
    console.log('AuthGuard - ACCESO PERMITIDO');
    return true;
  } else {
    console.log('AuthGuard - ACCESO DENEGADO - Redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }
};
