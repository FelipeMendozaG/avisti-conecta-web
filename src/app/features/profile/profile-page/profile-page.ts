import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Entity } from '../../../core/models/entity.models';
import { EntityService } from '../../../core/services/entity.service';
import { ToastService } from '../../../core/services/toast.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

type ProfileMode = 'loading' | 'error' | 'create' | 'view' | 'edit';

/**
 * Perfil institucional: onboarding (`POST`), consulta (`GET /me`)
 * y actualización (`PUT`) de los datos corporativos.
 */
@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    StatusBadgeComponent,
    SkeletonComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly entityService = inject(EntityService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mode = signal<ProfileMode>('loading');
  readonly entity = signal<Entity | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly serverError = signal<string | null>(null);
  readonly saving = signal(false);

  readonly borderValid = 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/30';
  readonly borderInvalid = 'border-rose-300 focus:border-rose-400 focus:ring-rose-200';

  readonly entityTypes = ['ONG', 'FUNDACION', 'EMPRESA', 'COOPERATIVA', 'ESTADO', 'OTRO'];

  readonly form = this.fb.nonNullable.group({
    tax_id: ['', [Validators.required, Validators.minLength(6)]],
    company_name: ['', [Validators.required, Validators.minLength(2)]],
    entity_type: ['ONG', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    contact_name: ['', [Validators.required, Validators.minLength(2)]],
    contact_email: ['', [Validators.required, Validators.email]],
    contact_phone: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    // Los endpoints están protegidos: la consulta ocurre solo en el navegador.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.load();
  }

  load(): void {
    this.mode.set('loading');
    this.loadError.set(null);

    this.entityService.getMyProfile().subscribe({
      next: (entity) => {
        this.entity.set(entity);
        this.mode.set('view');
      },
      error: (err: unknown) => {
        const parsed = parseApiError(err);
        if (parsed.code === 'ENTITY_NOT_FOUND') {
          this.entity.set(null);
          this.mode.set('create');
          return;
        }
        this.loadError.set(parsed.message);
        this.mode.set('error');
      },
    });
  }

  startEdit(): void {
    const entity = this.entity();
    if (!entity) {
      return;
    }

    this.form.setValue({
      tax_id: entity.tax_id,
      company_name: entity.company_name,
      entity_type: entity.entity_type,
      address: entity.address,
      contact_name: entity.contact_name,
      contact_email: entity.contact_email,
      contact_phone: entity.contact_phone,
    });
    this.serverError.set(null);
    this.mode.set('edit');
  }

  cancel(): void {
    this.serverError.set(null);
    this.mode.set(this.entity() ? 'view' : 'create');
  }

  controlError(
    name: 'tax_id' | 'company_name' | 'entity_type' | 'address' | 'contact_name' | 'contact_email' | 'contact_phone',
  ): string | null {
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
    if (errors['email']) {
      return 'Ingresa un correo electrónico válido.';
    }
    if (errors['minlength']) {
      return `Debe tener al menos ${errors['minlength']['requiredLength']} caracteres.`;
    }
    return 'Revisa este campo.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.serverError.set(null);

    const payload = this.form.getRawValue();
    const existing = this.entity();
    const request$ = existing
      ? this.entityService.update(existing.entity_id, payload)
      : this.entityService.create(payload);

    request$.subscribe({
      next: (entity) => {
        this.saving.set(false);
        this.entity.set(entity);
        this.mode.set('view');
        this.toast.success(
          existing ? 'Perfil actualizado' : 'Perfil institucional creado',
          existing
            ? 'Los datos corporativos se guardaron correctamente.'
            : 'Tu entidad quedó registrada y en proceso de verificación.',
        );
      },
      error: (err: unknown) => {
        const parsed = parseApiError(err);
        this.saving.set(false);
        this.serverError.set(parsed.message);
        for (const [path, message] of Object.entries(parsed.fieldErrors)) {
          this.form.get(path)?.setErrors({ server: message });
          this.form.get(path)?.markAsTouched();
        }
      },
    });
  }
}
