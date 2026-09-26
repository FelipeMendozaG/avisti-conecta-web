import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ApiEnvelope } from '../models/api.models';
import type { AuthSession, LoginRequest, RegisterRequest } from '../models/auth.models';
import { SessionStore } from '../storage/session.store';

/**
 * Servicio de autenticación: registro, inicio de sesión y cierre de sesión.
 * La sesión se persiste vía `SessionStore` (Signals + localStorage SSR-safe).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);

  /** Token JWT de la sesión actual. */
  readonly token = this.session.token.asReadonly();
  /** Usuario autenticado. */
  readonly user = this.session.user.asReadonly();
  /** `true` cuando existe un token de sesión. */
  readonly isAuthenticated = computed(() => this.session.token() !== null);

  /** `POST /auth/login` — devuelve la sesión y la persiste. */
  login(credentials: LoginRequest): Observable<AuthSession> {
    return this.http
      .post<ApiEnvelope<AuthSession>>(`${API_BASE_URL}/auth/login`, credentials)
      .pipe(
        map((response) => response.data),
        tap((session) => this.session.save(session)),
      );
  }

  /** `POST /auth/register` — crea la cuenta, devuelve y persiste la sesión. */
  register(payload: RegisterRequest): Observable<AuthSession> {
    return this.http
      .post<ApiEnvelope<AuthSession>>(`${API_BASE_URL}/auth/register`, payload)
      .pipe(
        map((response) => response.data),
        tap((session) => this.session.save(session)),
      );
  }

  /** Cierra la sesión limpiando Signals y `localStorage`. */
  logout(): void {
    this.session.clear();
  }
}
