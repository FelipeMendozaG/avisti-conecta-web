import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Estado vacío amigable para listados sin resultados. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-6 w-6" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </span>
      <div>
        <p class="font-medium text-slate-900">{{ title() }}</p>
        <p class="mt-1 text-sm text-slate-500">{{ message() }}</p>
      </div>
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Sin resultados');
  readonly message = input('Ajusta los filtros o vuelve más tarde para ver novedades.');
}
