import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ApiEnvelope, PaginatedResponse } from '../models/api.models';
import type {
  Equipment,
  EquipmentFilters,
  Product,
  ProductFilters,
} from '../models/catalog.models';
import { buildHttpParams } from '../utils/http-params.util';

/**
 * Catálogo público de productos y equipos.
 * Ambos endpoints son públicos (no requieren token).
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  /** `GET /products/` — catálogo general paginado (`category`, `search`, `page`, `limit`). */
  getProducts(filters: ProductFilters = {}): Observable<PaginatedResponse<Product>> {
    return this.http
      .get<ApiEnvelope<PaginatedResponse<Product>>>(`${API_BASE_URL}/products/`, {
        params: buildHttpParams({ ...filters }),
      })
      .pipe(map((response) => response.data));
  }

  /** `GET /equipments/` — equipos y su ciclo de vida (`product_id`, `life_cycle_status`, ...). */
  getEquipments(filters: EquipmentFilters = {}): Observable<PaginatedResponse<Equipment>> {
    return this.http
      .get<ApiEnvelope<PaginatedResponse<Equipment>>>(`${API_BASE_URL}/equipments/`, {
        params: buildHttpParams({ ...filters }),
      })
      .pipe(map((response) => response.data));
  }
}
