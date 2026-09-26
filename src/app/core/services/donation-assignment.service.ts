import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ApiEnvelope, PaginatedResponse } from '../models/api.models';
import type {
  DonationAssignment,
  DonationAssignmentFilters,
} from '../models/donation-assignment.models';
import { buildHttpParams } from '../utils/http-params.util';

/** Convenios / asignaciones aprobadas y equipos entregados a la entidad. */
@Injectable({ providedIn: 'root' })
export class DonationAssignmentService {
  private readonly http = inject(HttpClient);

  /** `GET /donation-assignments/` — listado paginado de asignaciones. */
  list(
    filters: DonationAssignmentFilters = {},
  ): Observable<PaginatedResponse<DonationAssignment>> {
    return this.http
      .get<ApiEnvelope<PaginatedResponse<DonationAssignment>>>(
        `${API_BASE_URL}/donation-assignments/`,
        { params: buildHttpParams({ ...filters }) },
      )
      .pipe(map((response) => response.data));
  }

  /** `GET /donation-assignments/:assignmentId` — detalle de la asignación. */
  getById(assignmentId: number): Observable<DonationAssignment> {
    return this.http
      .get<ApiEnvelope<DonationAssignment>>(`${API_BASE_URL}/donation-assignments/${assignmentId}`)
      .pipe(map((response) => response.data));
  }
}
