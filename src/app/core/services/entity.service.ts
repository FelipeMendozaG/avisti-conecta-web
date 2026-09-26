import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ApiEnvelope } from '../models/api.models';
import type {
  CreateEntityRequest,
  Entity,
  UpdateEntityRequest,
} from '../models/entity.models';

/**
 * Perfil institucional de la entidad en sesión.
 *
 * `GET /entities/me` responde 404 `ENTITY_NOT_FOUND` cuando el usuario
 * aún no ha completado el onboarding institucional.
 */
@Injectable({ providedIn: 'root' })
export class EntityService {
  private readonly http = inject(HttpClient);

  /** `POST /entities/` — registro institucional (onboarding). */
  create(payload: CreateEntityRequest): Observable<Entity> {
    return this.http
      .post<ApiEnvelope<Entity>>(`${API_BASE_URL}/entities/`, payload)
      .pipe(map((response) => response.data));
  }

  /** `GET /entities/me` — perfil institucional de la sesión. */
  getMyProfile(): Observable<Entity> {
    return this.http
      .get<ApiEnvelope<Entity>>(`${API_BASE_URL}/entities/me`)
      .pipe(map((response) => response.data));
  }

  /** `PUT /entities/:entityId` — actualización parcial de datos corporativos. */
  update(entityId: number, payload: UpdateEntityRequest): Observable<Entity> {
    return this.http
      .put<ApiEnvelope<Entity>>(`${API_BASE_URL}/entities/${entityId}`, payload)
      .pipe(map((response) => response.data));
  }
}
