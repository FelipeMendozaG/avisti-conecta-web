import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeKind = 'request-status' | 'request-type' | 'life-cycle' | 'verification';

const LABELS: Record<string, string> = {
  ON_HOLD: 'En espera',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  PENDING: 'Pendiente',
  VERIFIED: 'Verificado',
  DONATION: 'Donación',
  AGREEMENT: 'Convenio',
  AVAILABLE: 'Disponible',
  DEPRECIATED: 'En baja',
  ASSIGNED: 'Asignado',
};

const TONES: Record<string, string> = {
  ON_HOLD: 'bg-amber-50 text-amber-700 ring-amber-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  VERIFIED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  AVAILABLE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  DONATION: 'bg-sky-50 text-sky-700 ring-sky-200',
  AGREEMENT: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  ASSIGNED: 'bg-violet-50 text-violet-700 ring-violet-200',
  DEPRECIATED: 'bg-slate-100 text-slate-600 ring-slate-200',
};

/** Chip de estado reutilizable para solicitudes, equipos y verificación. */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
      [class]="toneClasses()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  /** Dominio del valor: define el vocabulario de etiquetas/colores. */
  readonly kind = input.required<BadgeKind>();
  /** Valor crudo devuelto por la API (ej. `ON_HOLD`). */
  readonly value = input.required<string>();

  protected readonly label = computed(() => LABELS[this.value()] ?? this.value());

  protected readonly toneClasses = computed(
    () =>
      TONES[this.value()] ??
      'bg-slate-100 text-slate-600 ring-slate-200',
  );
}
