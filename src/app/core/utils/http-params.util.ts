import { HttpParams } from '@angular/common/http';

/** Valores admitidos como query params en los listados de la API. */
export type HttpFilterValue = string | number | boolean | null | undefined;

/**
 * Construye `HttpParams` ignorando campos vacíos (`null`, `undefined` o `''`)
 * para que los filtros opcionales de la API no viajen cuando no aplican.
 */
export function buildHttpParams(filters: Record<string, HttpFilterValue>): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    params = params.set(key, String(value));
  }

  return params;
}
