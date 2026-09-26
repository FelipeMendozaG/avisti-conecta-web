import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { SessionStore } from '../storage/session.store';

/** Endpoints de autenticación: un 401 allí significa credenciales inválidas. */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

/**
 * Maneja sesiones expiradas (HTTP 401 fuera de `/auth/*`):
 * limpia la sesión, notifica con un toast y redirige al login.
 * Solo actúa en el navegador para no interferir con el renderizado SSR.
 */
export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const session = inject(SessionStore);
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      const isExpiredSession =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !AUTH_ENDPOINTS.some((endpoint) => request.url.includes(endpoint));

      if (isBrowser && isExpiredSession) {
        session.clear();
        toast.error('Sesión expirada', 'Tu sesión expiró. Inicia sesión nuevamente.');
        void router.navigate(['/ingresar']);
      }

      return throwError(() => error);
    }),
  );
};
