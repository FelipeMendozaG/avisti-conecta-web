import type { PaginationFilters } from './api.models';
import type { DonationAssignment } from './donation-assignment.models';

/** Categoría de producto (catálogo observado: `EQUIPMENT`). */
export type ProductCategory = 'EQUIPMENT' | (string & {});

/** Estados del ciclo de vida de un equipo (documentados en la API). */
export type LifeCycleStatus = 'AVAILABLE' | 'DEPRECIATED' | 'ASSIGNED' | (string & {});

/** Producto del catálogo general (tabla `products`). */
export interface Product {
  product_id: number;
  product_code: string;
  name: string;
  url_image: string | null;
  description: string | null;
  category: ProductCategory;
  created_at: string;
}

/** Equipo individual y su estado en el ciclo de vida (tabla `equipments`). */
export interface Equipment {
  equipment_id: number;
  product_id: number;
  load_id: number;
  serial_number: string;
  acquisition_date: string | null;
  end_of_useful_life: string | null;
  current_market_value: string;
  life_cycle_status: LifeCycleStatus;
  created_at: string;
  updated_at: string;
  product: Pick<Product, 'product_id' | 'product_code' | 'name' | 'category' | 'url_image'>;
  assignment?: DonationAssignment | null;
}

/** Filtros de `GET /products/`. */
export interface ProductFilters extends PaginationFilters {
  category?: string | null;
  search?: string | null;
}

/** Filtros de `GET /equipments/`. */
export interface EquipmentFilters extends PaginationFilters {
  product_id?: number | null;
  life_cycle_status?: string | null;
}
