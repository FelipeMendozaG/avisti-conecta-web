import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import type { AuthSession, User } from '../models/auth.models';

const STORAGE_KEY = 'avisti_connect.session';

/**
 * Almacenamiento de la sesión (token JWT + usuario) con Signals.
 *
 * Es SSR-safe: en el servidor nunca toca `localStorage` y la sesión
 * se considera inexistente (el guard la resuelve en el navegador).
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly initialSession = this.read();

  /** Token JWT de la sesión actual (`null` en servidor y sin sesión). */
  readonly token = signal<string | null>(this.initialSession?.token ?? null);
  /** Usuario autenticado en la sesión actual. */
  readonly user = signal<User | null>(this.initialSession?.user ?? null);

  /** Guarda la sesión en Signals y `localStorage` (solo navegador). */
  save(session: AuthSession): void {
    this.token.set(session.token);
    this.user.set(session.user);

    if (this.isBrowser) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch {
        // Storage no disponible (modo privado / cuota): la sesión vive en Signals.
      }
    }
  }

  /** Limpia la sesión de Signals y `localStorage`. */
  clear(): void {
    this.token.set(null);
    this.user.set(null);

    if (this.isBrowser) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorar: no hay nada que limpiar de forma segura.
      }
    }
  }

  private read(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<AuthSession> | null;
      if (typeof parsed?.token !== 'string' || !parsed.token || typeof parsed.user !== 'object') {
        return null;
      }

      return { token: parsed.token, user: parsed.user as User };
    } catch {
      return null;
    }
  }
}
