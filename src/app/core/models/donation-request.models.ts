import type { PaginationFilters } from './api.models';
import type { DonationAssignment } from './donation-assignment.models';

/** Tipo de solicitud: donación puntual o convenio marco. */
export type RequestType = 'DONATION' | 'AGREEMENT' | (string & {});

/** Estado de la solicitud (inicia siempre en `ON_HOLD`). */
export type RequestStatus = 'ON_HOLD' | 'APPROVED' | 'REJECTED' | (string & {});

/** Solicitud de donación / convenio (tabla `donation_requests`). */
export interface DonationRequest {
  request_id: number;
  entity_id: number;
  request_type: RequestType;
  request_date: string;
  requested_quantity: number;
  need_description: string;
  request_status: RequestStatus;
}

/** Detalle de la solicitud con sus asignaciones generadas. */
export interface DonationRequestDetail extends DonationRequest {
  assignments: DonationAssignment[];
}

/** Payload de creación (`POST /donation-requests/`). */
export interface CreateDonationRequest {
  request_type: RequestType;
  requested_quantity: number;
  need_description: string;
}

/** Filtros de `GET /donation-requests/`. */
export interface DonationRequestFilters extends PaginationFilters {
  request_status?: string | null;
  request_type?: string | null;
}
