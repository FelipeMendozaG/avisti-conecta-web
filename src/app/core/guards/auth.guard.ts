import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SessionStore } from '../storage/session.store';

/**
 * Protege las rutas privadas (`/panel/**`).
 *
 * En el servidor se permite el render (no hay acceso a `localStorage`);
 * la redirección efectiva ocurre en el navegador durante la hidratación.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (inject(SessionStore).token()) {
    return true;
  }

  return inject(Router).createUrlTree(['/ingresar'], {
    queryParams: state.url !== '/' ? { returnUrl: state.url } : undefined,
  });
};

/** Rutas de invitado (login/registro): con sesión activa redirige al panel. */
export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return inject(SessionStore).token() ? inject(Router).createUrlTree(['/panel']) : true;
};
