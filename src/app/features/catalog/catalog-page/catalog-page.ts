import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { PaginatedResponse } from '../../../core/models/api.models';
import type { Equipment, Product } from '../../../core/models/catalog.models';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { EquipmentCardComponent } from '../../../shared/components/equipment-card/equipment-card';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

type CatalogTab = 'products' | 'equipments';

/** Catálogo público con pestañas productos/equipos, filtros y paginación. */
@Component({
  selector: 'app-catalog-page',
  imports: [
    RouterLink,
    DatePipe,
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    EquipmentCardComponent,
    PaginationComponent,
    SkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ModalComponent,
    StatusBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);

  readonly isAuthenticated = inject(AuthService).isAuthenticated;

  readonly tab = signal<CatalogTab>('products');
  readonly search = signal('');
  readonly category = signal('');
  readonly lifeCycle = signal('');
  readonly productIdInput = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;

  readonly products = signal<PaginatedResponse<Product> | null>(null);
  readonly equipments = signal<PaginatedResponse<Equipment> | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedProduct = signal<Product | null>(null);
  readonly selectedEquipment = signal<Equipment | null>(null);

  readonly totalPages = computed(() =>
    this.tab() === 'products'
      ? (this.products()?.total_pages ?? 0)
      : (this.equipments()?.total_pages ?? 0),
  );

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q');
    if (query) {
      this.search.set(query);
    }
    this.loadProducts();
  }

  switchTab(tab: CatalogTab): void {
    if (this.tab() === tab) {
      return;
    }
    this.tab.set(tab);
    this.page.set(1);
    this.error.set(null);

    if (tab === 'products') {
      this.loadProducts();
    } else {
      this.loadEquipments();
    }
  }

  applySearch(): void {
    this.page.set(1);
    this.loadProducts();
  }

  applyProductFilters(): void {
    this.page.set(1);
    this.loadProducts();
  }

  applyEquipmentFilters(): void {
    this.page.set(1);
    this.loadEquipments();
  }

  goToPage(page: number): void {
    this.page.set(page);
    if (this.tab() === 'products') {
      this.loadProducts();
    } else {
      this.loadEquipments();
    }
  }

  clearProductFilters(): void {
    this.search.set('');
    this.category.set('');
    this.applySearch();
  }

  clearEquipmentFilters(): void {
    this.lifeCycle.set('');
    this.productIdInput.set('');
    this.applyEquipmentFilters();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.catalog
      .getProducts({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || null,
        category: this.category() || null,
      })
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(parseApiError(err).message);
          this.loading.set(false);
        },
      });
  }

  loadEquipments(): void {
    this.loading.set(true);
    this.error.set(null);

    const productId = Number.parseInt(this.productIdInput(), 10);
    this.catalog
      .getEquipments({
        page: this.page(),
        limit: this.pageSize,
        life_cycle_status: this.lifeCycle() || null,
        product_id: Number.isNaN(productId) ? null : productId,
      })
      .subscribe({
        next: (data) => {
          this.equipments.set(data);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(parseApiError(err).message);
          this.loading.set(false);
        },
      });
  }

  openProduct(product: Product): void {
    this.selectedProduct.set(product);
  }

  openEquipment(equipment: Equipment): void {
    this.selectedEquipment.set(equipment);
  }

  closeModals(): void {
    this.selectedProduct.set(null);
    this.selectedEquipment.set(null);
  }
}
