import type { Equipment } from './catalog.models';
import type { DonationRequest } from './donation-request.models';

/**
 * Asignación / convenio aprobado con un equipo entregado
 * (tabla `donation_assignments`).
 */
export interface DonationAssignment {
  assignment_id: number;
  request_id: number;
  equipment_id: number;
  delivery_date: string | null;
  donation_deed_ref: string | null;
  estimated_beneficiaries_impact: number | null;
  /** Presente al consultar listados y detalle de asignaciones. */
  request?: DonationRequest;
  /** Presente al consultar listados, detalle y dentro de solicitudes. */
  equipment?: Equipment;
}

/** Filtros de `GET /donation-assignments/`. */
export interface DonationAssignmentFilters {
  request_id?: number | null;
  page?: number | null;
  limit?: number | null;
}
