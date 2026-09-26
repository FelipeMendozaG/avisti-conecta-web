import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { AuthShellComponent } from '../auth-shell';

/** Validador de grupo: la confirmación debe coincidir con la contraseña. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmation = group.get('confirmPassword')?.value;
  return password === confirmation ? null : { passwordMismatch: true };
}

/** Registro de cuenta con validación reactiva; redirige al onboarding institucional. */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);

  /** Clases de input según haya error de validación o no. */
  readonly borderValid =
    'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/30';
  readonly borderInvalid = 'border-rose-300 focus:border-rose-400 focus:ring-rose-200';

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  controlError(name: 'name' | 'email' | 'password' | 'confirmPassword'): string | null {
    const control = this.form.get(name);
    if (!control?.errors && !(name === 'confirmPassword' && this.form.errors?.['passwordMismatch'])) {
      return null;
    }
    if (!control?.touched && !control?.dirty) {
      return null;
    }

    const errors = control?.errors;
    if (typeof errors?.['server'] === 'string') {
      return errors['server'];
    }
    if (errors?.['required']) {
      return 'Este campo es obligatorio.';
    }
    if (errors?.['email']) {
      return 'Ingresa un correo electrónico válido.';
    }
    if (errors?.['minlength']) {
      return `Debe tener al menos ${errors['minlength']['requiredLength']} caracteres.`;
    }
    if (errors?.['maxlength']) {
      return `Debe tener como máximo ${errors['maxlength']['requiredLength']} caracteres.`;
    }
    if (
      name === 'confirmPassword' &&
      this.form.errors?.['passwordMismatch'] &&
      control?.dirty
    ) {
      return 'Las contraseñas no coinciden.';
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

    const { name, email, password } = this.form.getRawValue();
    this.auth.register({ name, email, password }).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.toast.success(
          'Cuenta creada',
          `Bienvenido, ${session.user.name}. Completa tu perfil institucional.`,
        );
        void this.router.navigate(['/panel/perfil']);
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
