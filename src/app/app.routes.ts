import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { DashboardLayout } from './shared/layout/dashboard-layout/dashboard-layout';

/**
 * Rutas del navegador (lazy loading por componente).
 * Las rutas privadas (`/panel/**`) usan `authGuard` y el shell con sidebar.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Avisti Connect — Donaciones que generan impacto',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'ingresar',
    title: 'Iniciar sesión — Avisti Connect',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta — Avisti Connect',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'catalogo',
    title: 'Catálogo — Avisti Connect',
    loadComponent: () =>
      import('./features/catalog/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },
  {
    path: 'panel',
    canActivate: [authGuard],
    component: DashboardLayout,
    children: [
      {
        path: '',
        title: 'Mi panel — Avisti Connect',
        loadComponent: () =>
          import('./features/dashboard/dashboard-home/dashboard-home').then((m) => m.DashboardHome),
      },
      {
        path: 'solicitudes',
        title: 'Solicitudes — Avisti Connect',
        loadComponent: () =>
          import('./features/requests/requests-page/requests-page').then((m) => m.RequestsPage),
      },
      {
        path: 'solicitudes/nueva',
        title: 'Nueva solicitud — Avisti Connect',
        loadComponent: () =>
          import('./features/requests/request-form/request-form').then((m) => m.RequestForm),
      },
      {
        path: 'solicitudes/:requestId',
        title: 'Detalle de solicitud — Avisti Connect',
        loadComponent: () =>
          import('./features/requests/request-detail/request-detail').then((m) => m.RequestDetail),
      },
      {
        path: 'asignaciones',
        title: 'Asignaciones — Avisti Connect',
        loadComponent: () =>
          import('./features/assignments/assignments-page/assignments-page').then(
            (m) => m.AssignmentsPage,
          ),
      },
      {
        path: 'asignaciones/:assignmentId',
        title: 'Detalle de asignación — Avisti Connect',
        loadComponent: () =>
          import('./features/assignments/assignment-detail/assignment-detail').then(
            (m) => m.AssignmentDetail,
          ),
      },
      {
        path: 'perfil',
        title: 'Perfil institucional — Avisti Connect',
        loadComponent: () =>
          import('./features/profile/profile-page/profile-page').then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: '**',
    title: 'Página no encontrada — Avisti Connect',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];

