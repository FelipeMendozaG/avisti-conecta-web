import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DonationAssignmentService } from '../../../core/services/donation-assignment.service';
import { DonationRequestService } from '../../../core/services/donation-request.service';
import { EntityService } from '../../../core/services/entity.service';
import type { Entity } from '../../../core/models/entity.models';
import type { DonationAssignment } from '../../../core/models/donation-assignment.models';
import type { DonationRequest } from '../../../core/models/donation-request.models';
import { parseApiError } from '../../../core/utils/api-error.util';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

/**
 * Resumen del panel: indicadores clave, últimas solicitudes y asignaciones.
 * Los datos privados solo se cargan en el navegador (SSR-safe).
 */
@Component({
  selector: 'app-dashboard-home',
  imports: [
    RouterLink,
    DatePipe,
    StatusBadgeComponent,
    SkeletonComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-home.html',
})
export class DashboardHome implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly requestService = inject(DonationRequestService);
  private readonly assignmentService = inject(DonationAssignmentService);
  private readonly entityService = inject(EntityService);

  readonly user = inject(AuthService).user;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly entity = signal<Entity | null>(null);
  readonly recentRequests = signal<DonationRequest[]>([]);
  readonly recentAssignments = signal<DonationAssignment[]>([]);

  readonly totalRequests = signal(0);
  readonly onHoldRequests = signal(0);
  readonly approvedRequests = signal(0);
  readonly totalAssignments = signal(0);

  readonly today = new Date();

  readonly greeting = computed(() => {
    const hour = this.today.getHours();
    if (hour < 12) {
      return 'Buenos días';
    }
    return hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  });

  ngOnInit(): void {
    // En el servidor no hay sesión: la carga efectiva ocurre en el navegador.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.load();
    this.entityService.getMyProfile().subscribe({
      next: (entity) => this.entity.set(entity),
      error: () => undefined,
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      requests: this.requestService.list({ page: 1, limit: 5 }),
      onHold: this.requestService.list({ page: 1, limit: 1, request_status: 'ON_HOLD' }),
      approved: this.requestService.list({ page: 1, limit: 1, request_status: 'APPROVED' }),
      assignments: this.assignmentService.list({ page: 1, limit: 5 }),
    }).subscribe({
      next: ({ requests, onHold, approved, assignments }) => {
        this.recentRequests.set(requests.items);
        this.totalRequests.set(requests.total);
        this.onHoldRequests.set(onHold.total);
        this.approvedRequests.set(approved.total);
        this.recentAssignments.set(assignments.items);
        this.totalAssignments.set(assignments.total);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(parseApiError(err).message);
        this.loading.set(false);
      },
    });
  }
}
