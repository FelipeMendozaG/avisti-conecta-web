import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { DonationRequestDetail } from '../../../core/models/donation-request.models';
import { DonationRequestService } from '../../../core/services/donation-request.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

/** Detalle de una solicitud con sus asignaciones generadas. */
@Component({
  selector: 'app-request-detail',
  imports: [
    RouterLink,
    DatePipe,
    StatusBadgeComponent,
    SkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './request-detail.html',
})
export class RequestDetail implements OnInit {
  private readonly requestService = inject(DonationRequestService);

  /** ID de la ruta `:requestId` (binding de inputs de ruta; llega como string). */
  readonly requestId = input.required<string>();

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly request = signal<DonationRequestDetail | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = Number.parseInt(this.requestId(), 10);
    this.loading.set(true);
    this.error.set(null);

    this.requestService.getById(id).subscribe({
      next: (data) => {
        this.request.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(parseApiError(err).message);
        this.loading.set(false);
      },
    });
  }
}
