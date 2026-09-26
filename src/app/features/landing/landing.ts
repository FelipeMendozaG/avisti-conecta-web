import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../core/services/catalog.service';
import type { Product } from '../../core/models/catalog.models';
import { parseApiError } from '../../core/utils/api-error.util';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { FooterComponent } from '../../shared/components/footer/footer';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { SpinnerComponent } from '../../shared/components/spinner/spinner';

/** Página pública de presentación con CTA y vista previa del catálogo. */
@Component({
  selector: 'app-landing',
  imports: [
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    SpinnerComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.html',
})
export class Landing implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly products = signal<Product[]>([]);
  readonly totalProducts = signal(0);
  readonly totalEquipments = signal(0);
  readonly search = signal('');

  readonly steps = [
    {
      title: 'Explora el catálogo',
      description:
        'Revisa los productos y equipos disponibles, con su ciclo de vida y características técnicas.',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M16.5 7.5V18a2.25 2.25 0 01-2.25 2.25H9.75a2.25 2.25 0 01-2.25-2.25V7.5m16.5 0H3.75m16.5 0a2.25 2.25 0 00-2.25-2.25H5.99a2.25 2.25 0 00-2.247 2.25',
    },
    {
      title: 'Crea tu solicitud',
      description:
        'Registra una donación o convenio con la cantidad y el detalle de la necesidad de tu entidad.',
      icon: 'M12 4.5v15m7.5-7.5h-15',
    },
    {
      title: 'Recibe lo asignado',
      description:
        'Da seguimiento al estado de tu solicitud y consulta los convenios y equipos aprobados.',
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      products: this.catalog.getProducts({
        page: 1,
        limit: 6,
        search: this.search().trim() || null,
      }),
      equipments: this.catalog.getEquipments({ page: 1, limit: 1 }),
    }).subscribe({
      next: ({ products, equipments }) => {
        this.products.set(products.items);
        this.totalProducts.set(products.total);
        this.totalEquipments.set(equipments.total);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(parseApiError(err).message);
        this.loading.set(false);
      },
    });
  }

  searchInCatalog(): void {
    void this.router.navigate(['/catalogo'], {
      queryParams: this.search().trim() ? { q: this.search().trim() } : undefined,
    });
  }

  openProduct(): void {
    void this.router.navigate(['/catalogo']);
  }
}
