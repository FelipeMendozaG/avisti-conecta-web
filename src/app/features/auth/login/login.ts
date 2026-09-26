import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { parseApiError } from '../../../core/utils/api-error.util';
import { AuthShellComponent } from '../auth-shell';

/** Inicio de sesión con validación reactiva y manejo de errores de la API. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** Mensaje de error para un campo (validación propia o error del servidor). */
  controlError(name: 'email' | 'password'): string | null {
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

    this.loading.set(true);
    this.serverError.set(null);

    const { email, password } = this.form.getRawValue();
    this.auth.login({ email, password }).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.toast.success('Bienvenido de vuelta', `Hola, ${session.user.name}.`);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/panel';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        const parsed = parseApiError(err);
        this.loading.set(false);
        this.serverError.set(parsed.message);
        this.applyFieldErrors(parsed.fieldErrors);
      },
    });
  }

  private applyFieldErrors(fieldErrors: Record<string, string>): void {
    for (const [path, message] of Object.entries(fieldErrors)) {
      this.form.get(path)?.setErrors({ server: message });
      this.form.get(path)?.markAsTouched();
    }
  }
}
