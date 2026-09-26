import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService, type ToastItem } from '../../../core/services/toast.service';

/**
 * Contenedor de notificaciones toast del shell raíz.
 * Se renderiza de forma fija en la parte superior de la pantalla.
 */
@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      role="status"
      aria-live="polite"
    >
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lg shadow-slate-900/10"
          [class.border-emerald-200]="toast.type === 'success'"
          [class.border-rose-200]="toast.type === 'error'"
          [class.border-sky-200]="toast.type === 'info'"
        >
          <span
            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
            [class.bg-emerald-600]="toast.type === 'success'"
            [class.bg-rose-600]="toast.type === 'error'"
            [class.bg-sky-600]="toast.type === 'info'"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            >
              @switch (toast.type) {
                @case ('success') {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                }
                @case ('error') {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                }
                @default {
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 11h2m-1-4v2m9 5a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                }
              }
            </svg>
          </span>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-900">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="mt-0.5 text-sm text-slate-600">{{ toast.message }}</p>
            }
          </div>

          <button
            type="button"
            class="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            (click)="dismiss(toast.id)"
            [attr.aria-label]="'Cerrar notificación'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  readonly toasts = this.toastService.toasts;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  protected readonly trackByToast = (_index: number, toast: ToastItem) => toast.id;
}
