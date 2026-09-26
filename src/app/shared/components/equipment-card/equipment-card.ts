import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Equipment } from '../../../core/models/catalog.models';
import { StatusBadgeComponent } from '../status-badge/status-badge';

/** Tarjeta de equipo con su serial, estado de ciclo de vida y fechas. */
@Component({
  selector: 'app-equipment-card',
  imports: [StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      (click)="select.emit()"
    >
      <div class="flex items-start justify-between gap-3">
        <span
          class="rounded-md bg-slate-900 px-2 py-1 font-mono text-xs tracking-wide text-slate-100"
          title="Número de serie"
        >
          {{ equipment().serial_number }}
        </span>
        <app-status-badge kind="life-cycle" [value]="equipment().life_cycle_status" />
      </div>

      <h3 class="mt-3 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
        {{ equipment().product.name }}
      </h3>
      <p class="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Código {{ equipment().product.product_code }}
      </p>

      <dl class="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div class="flex items-center justify-between gap-2">
          <dt>Valor de mercado</dt>
          <dd class="font-medium text-slate-700">S/ {{ equipment().current_market_value }}</dd>
        </div>
        @if (equipment().end_of_useful_life) {
          <div class="flex items-center justify-between gap-2">
            <dt>Fin de vida útil</dt>
            <dd class="font-medium text-slate-700">{{ equipment().end_of_useful_life }}</dd>
          </div>
        }
      </dl>

      <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
        Ver detalle
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </button>
  `,
})
export class EquipmentCardComponent {
  readonly equipment = input.required<Equipment>();
  readonly select = output<void>();
}
