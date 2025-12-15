import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Si hay token, agregarlo a la petición
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log('AuthInterceptor: Agregando token a petición:', req.url);
    return next(authReq);
  }

  console.log('AuthInterceptor: No hay token para petición:', req.url);
  return next(req);
};
