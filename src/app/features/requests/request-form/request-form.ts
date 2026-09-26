import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonationRequestService } from '../../../core/services/donation-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { parseApiError } from '../../../core/utils/api-error.util';

/** Formulario de creación de solicitudes de donación o convenio. */
@Component({
  selector: 'app-request-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './request-form.html',
})
export class RequestForm {
  private readonly fb = inject(FormBuilder);
  private readonly requestService = inject(DonationRequestService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly borderValid = 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/30';
  readonly borderInvalid = 'border-rose-300 focus:border-rose-400 focus:ring-rose-200';

  readonly form = this.fb.nonNullable.group({
    request_type: ['DONATION', Validators.required],
    requested_quantity: [1, [Validators.required, Validators.min(1)]],
    need_description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
  });

  controlError(name: 'request_type' | 'requested_quantity' | 'need_description'): string | null {
    const control = this.form.get(name);
    if (!control?.errors || (!control.touched && !control.dirty)) {
      return null;
    }

    const errors = control.errors;
    if (typeof errors['server'] === 'string') {
      return errors['server'];
    }
    if (errors['required']) {
      return 'Este campo es obligatorio.';
    }
    if (errors['min']) {
      return `Debe ser al menos ${errors['min']['min']}.`;
    }
    if (errors['minlength']) {
      return `Debe tener al menos ${errors['minlength']['requiredLength']} caracteres.`;
    }
    if (errors['maxlength']) {
      return `Debe tener como máximo ${errors['maxlength']['requiredLength']} caracteres.`;
    }
    return 'Revisa este campo.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    const { request_type, requested_quantity, need_description } = this.form.getRawValue();
    this.requestService
      .create({
        request_type,
        requested_quantity: Number(requested_quantity),
        need_description: need_description.trim(),
      })
      .subscribe({
        next: (request) => {
          this.loading.set(false);
          this.toast.success(
            'Solicitud creada',
            `La solicitud #${request.request_id} quedó en espera de revisión.`,
          );
          void this.router.navigate(['/panel/solicitudes', request.request_id]);
        },
        error: (err: unknown) => {
          const parsed = parseApiError(err);
          this.loading.set(false);
          this.serverError.set(parsed.message);
          for (const [path, message] of Object.entries(parsed.fieldErrors)) {
            this.form.get(path)?.setErrors({ server: message });
            this.form.get(path)?.markAsTouched();
          }
        },
      });
  }
}
