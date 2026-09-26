import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marca de la aplicación: logotipo (círculos entrelazados) + nombre.
 * Se reutiliza en navbar, footer, sidebar y pantallas de autenticación.
 */
@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-2.5">
      <span class="text-emerald-600" [class]="size() === 'lg' ? 'h-10 w-10' : 'h-8 w-8'">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="h-full w-full">
          <rect width="32" height="32" rx="9" fill="currentColor" />
          <circle cx="12.5" cy="16" r="5.25" stroke="white" stroke-width="2.4" />
          <circle cx="19.5" cy="16" r="5.25" stroke="white" stroke-width="2.4" />
        </svg>
      </span>
      <span
        class="font-semibold tracking-tight text-slate-900"
        [class]="size() === 'lg' ? 'text-xl' : 'text-base'"
      >
        Avisti <span class="text-emerald-600">Connect</span>
      </span>
    </span>
  `,
})
export class BrandComponent {
  readonly size = input<'sm' | 'lg'>('sm');
}
