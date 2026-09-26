import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandComponent } from '../../shared/components/brand/brand';

/**
 * Marco compartido de las pantallas de autenticación: fondo suave,
 * marca enlazada al inicio y tarjeta centrada con contenido proyectado.
 * El enlace de pie se proyecta con `<span footer>…</span>`.
 */
@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4 py-10"
    >
      <a routerLink="/" class="mb-8" aria-label="Ir al inicio">
        <app-brand size="lg" />
      </a>

      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ng-content />
      </div>

      <p class="mt-6 text-center text-sm text-slate-500">
        <ng-content select="[footer]" />
      </p>
    </div>
  `,
})
export class AuthShellComponent {
  /** Subtítulo opcional bajo el título proyectado. */
  readonly subtitle = input<string>('');
}
