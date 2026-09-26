/** Estado general del envelope estándar de la API: `{ status, message, data }`. */
export type ApiEnvelopeStatus = 'success' | 'error';

/** Envelope estándar de respuestas de negocio. */
export interface ApiEnvelope<T> {
  status: ApiEnvelopeStatus;
  message: string;
  data: T;
}

/** Error de validación (403) generado por express-validator. */
export interface ApiFieldError {
  type: string;
  value: unknown;
  msg: string;
  path: string;
  location: string;
}

/**
 * Cuerpos de error observados:
 * - Negocio: `{ status, message, data: 'ERROR_CODE' }`
 * - Sesión (401): `{ error: 'ERROR_CODE' }`
 * - Validación (403): `{ errors: ApiFieldError[] }`
 */
export interface ApiErrorBody {
  status?: ApiEnvelopeStatus;
  message?: string;
  data?: string;
  error?: string;
  errors?: ApiFieldError[];
}

/** Respuesta paginada de los listados: `{ total, page, limit, total_pages, items }`. */
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  items: T[];
}

/** Filtros de paginación comunes a todos los listados. */
export interface PaginationFilters {
  page?: number | null;
  limit?: number | null;
}
