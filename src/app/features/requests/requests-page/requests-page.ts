import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { DonationRequest } from '../../../core/models/donation-request.models';
import { DonationRequestService } from '../../../core/services/donation-request.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

/** Listado / seguimiento de solicitudes de la entidad con filtros y paginación. */
@Component({
  selector: 'app-requests-page',
  imports: [
    RouterLink,
    DatePipe,
    StatusBadgeComponent,
    PaginationComponent,
    SkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requests-page.html',
})
export class RequestsPage implements OnInit {
  private readonly requestService = inject(DonationRequestService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<DonationRequest[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly totalPages = signal(0);
  readonly pageSize = 10;

  readonly statusFilter = signal('');
  readonly typeFilter = signal('');

  readonly hasFilters = () => this.statusFilter() !== '' || this.typeFilter() !== '';

  ngOnInit(): void {
    this.load();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.typeFilter.set('');
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.requestService
      .list({
        page: this.page(),
        limit: this.pageSize,
        request_status: this.statusFilter() || null,
        request_type: this.typeFilter() || null,
      })
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.total.set(data.total);
          this.totalPages.set(data.total_pages);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(parseApiError(err).message);
          this.loading.set(false);
        },
      });
  }
}
