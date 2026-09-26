import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ApiEnvelope, PaginatedResponse } from '../models/api.models';
import type {
  CreateDonationRequest,
  DonationRequest,
  DonationRequestDetail,
  DonationRequestFilters,
} from '../models/donation-request.models';
import { buildHttpParams } from '../utils/http-params.util';

/** Solicitudes de donación / convenios de la entidad autenticada. */
@Injectable({ providedIn: 'root' })
export class DonationRequestService {
  private readonly http = inject(HttpClient);

  /** `POST /donation-requests/` — crea una solicitud (estado inicial `ON_HOLD`). */
  create(payload: CreateDonationRequest): Observable<DonationRequest> {
    return this.http
      .post<ApiEnvelope<DonationRequest>>(`${API_BASE_URL}/donation-requests/`, payload)
      .pipe(map((response) => response.data));
  }

  /** `GET /donation-requests/` — historial paginado de la entidad en sesión. */
  list(filters: DonationRequestFilters = {}): Observable<PaginatedResponse<DonationRequest>> {
    return this.http
      .get<ApiEnvelope<PaginatedResponse<DonationRequest>>>(`${API_BASE_URL}/donation-requests/`, {
        params: buildHttpParams({ ...filters }),
      })
      .pipe(map((response) => response.data));
  }

  /** `GET /donation-requests/:requestId` — detalle con asignaciones. */
  getById(requestId: number): Observable<DonationRequestDetail> {
    return this.http
      .get<ApiEnvelope<DonationRequestDetail>>(`${API_BASE_URL}/donation-requests/${requestId}`)
      .pipe(map((response) => response.data));
  }
}
