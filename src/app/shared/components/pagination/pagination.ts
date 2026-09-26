import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Paginación con anterior/siguiente y indicador de página (solo si hay >1). */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="flex items-center justify-between gap-4 pt-4" aria-label="Paginación">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="page() <= 1"
          (click)="pageChange.emit(page() - 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Anterior
        </button>

        <span class="text-sm text-slate-600">
          Página <span class="font-semibold text-slate-900">{{ page() }}</span> de {{ totalPages() }}
        </span>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="page() >= totalPages()"
          (click)="pageChange.emit(page() + 1)"
        >
          Siguiente
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  /** Página actual (1-based). */
  readonly page = input.required<number>();
  /** Total de páginas disponibles. */
  readonly totalPages = input.required<number>();
  /** Emite la página solicitada al pulsar anterior/siguiente. */
  readonly pageChange = output<number>();
}
