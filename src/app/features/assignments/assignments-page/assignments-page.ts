import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { DonationAssignment } from '../../../core/models/donation-assignment.models';
import { DonationAssignmentService } from '../../../core/services/donation-assignment.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

/** Listado de convenios / asignaciones aprobadas de la entidad. */
@Component({
  selector: 'app-assignments-page',
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
  templateUrl: './assignments-page.html',
})
export class AssignmentsPage implements OnInit {
  private readonly assignmentService = inject(DonationAssignmentService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<DonationAssignment[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly totalPages = signal(0);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.assignmentService.list({ page: this.page(), limit: this.pageSize }).subscribe({
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
