import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Renderizado SSR por ruta:
 * - Auth (`/ingresar`, `/registro`): prerender estático en build (sin llamadas API).
 * - Resto: render en servidor por petición (la landing y el catálogo consumen
 *   la API en runtime y usan transfer cache para hidratar sin duplicar llamadas).
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'ingresar', renderMode: RenderMode.Prerender },
  { path: 'registro', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
