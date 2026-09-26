import { ChangeDetectionStrategy, Component, HostListener, output, input } from '@angular/core';

/**
 * Modal reutilizable con fondo oscuro, cierre con Escape / clic exterior
 * y contenido proyectado vía `<ng-content>`.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      (click)="close.emit()"
    >
      <div
        class="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="$event.stopPropagation()"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <h2 class="text-lg font-semibold text-slate-900">{{ title() }}</h2>
          <button
            type="button"
            class="-m-1.5 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            (click)="close.emit()"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {
  /** Título accesible y visible del modal. */
  readonly title = input<string>('');
  /** Se emite al solicitar el cierre (Escape, botón o clic en el fondo). */
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
