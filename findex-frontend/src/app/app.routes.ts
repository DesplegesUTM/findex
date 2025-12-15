import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'gestionar-solicitudes',
    loadComponent: () =>
      import(
        './components/pages/gestionar-solicitudes/gestionar-solicitudes'
      ).then((m) => m.GestionarSolicitudes),
    canActivate: [authGuard, roleGuard],
    data: { role: 1 }, // solo prestamistas
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./components/pages/feed/feed').then((m) => m.Feed),
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./components/pages/perfil/perfil').then((m) => m.Perfil),
    canActivate: [authGuard],
  },
  {
    path: 'editar-perfil',
    loadComponent: () =>
      import('./components/pages/editar-perfil/editar-perfil').then(
        (m) => m.EditarPerfil
      ),
    canActivate: [authGuard],
  },
  {
    path: 'crear-prestamo',
    loadComponent: () =>
      import('./components/pages/crear-prestamo/crear-prestamo').then(
        (m) => m.CrearPrestamo
      ),
    canActivate: [authGuard, roleGuard],
    data: { role: 1 }, // Solo prestamistas
  },
  {
    path: 'mis-pagos',
    loadComponent: () =>
      import('./components/pages/mis-pagos/mis-pagos').then((m) => m.MisPagos),
    canActivate: [authGuard, roleGuard],
    data: { role: 2 }, // Solo prestatarios
  },
  {
    path: 'registrar-pago/:id',
    loadComponent: () =>
      import('./components/pages/registrar-pago/registrar-pago').then(
        (m) => m.RegistrarPago
      ),
    canActivate: [authGuard, roleGuard],
    data: { role: 2 }, // Solo prestatarios
  },
  {
    path: 'mis-prestamos',
    loadComponent: () =>
      import('./components/pages/mis-prestamos/mis-prestamos').then(
        (m) => m.MisPrestamos
      ),
    canActivate: [authGuard],
  },
  {
    path: 'detalle-prestamo/:id',
    loadComponent: () =>
      import('./components/pages/detalle-prestamo/detalle-prestamo').then(
        (m) => m.DetallePrestamo
      ),
    canActivate: [authGuard, roleGuard],
    // data: { role: 2 }, // Solo prestatarios pueden ver detalles para aplicar
  },
];
