import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '../storage/session.store';

/**
 * Inyecta el JWT de la sesión en la cabecera `Authorization: Bearer ...`
 * de cada petición cuando existe un token vigente.
 *
 * En el servidor no hay sesión (SSR-safe), así que las peticiones salen
 * sin cabecera y los endpoints públicos no se ven afectados.
 */
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(SessionStore).token();

  if (!token) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
