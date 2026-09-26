import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { sessionInterceptor } from './core/interceptors/session.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    // Hidratación con caché de transferencia HTTP habilitada por defecto
    // (evita duplicar las llamadas GET tras el renderizado SSR).
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor, sessionInterceptor])),
  ],
};
