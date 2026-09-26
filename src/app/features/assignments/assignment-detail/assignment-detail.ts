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
import type { DonationAssignment } from '../../../core/models/donation-assignment.models';
import { DonationAssignmentService } from '../../../core/services/donation-assignment.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

/** Detalle de una asignación: solicitud, equipo y datos de entrega. */
@Component({
  selector: 'app-assignment-detail',
  imports: [RouterLink, DatePipe, StatusBadgeComponent, SkeletonComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-detail.html',
})
export class AssignmentDetail implements OnInit {
  private readonly assignmentService = inject(DonationAssignmentService);

  /** ID de la ruta `:assignmentId` (binding de inputs de ruta; llega como string). */
  readonly assignmentId = input.required<string>();

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly assignment = signal<DonationAssignment | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = Number.parseInt(this.assignmentId(), 10);
    this.loading.set(true);
    this.error.set(null);

    this.assignmentService.getById(id).subscribe({
      next: (data) => {
        this.assignment.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(parseApiError(err).message);
        this.loading.set(false);
      },
    });
  }
}
