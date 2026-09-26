import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Estado de error elegante con opción de reintentar. */
@Component({
  selector: 'app-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-6 w-6" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </span>
      <div>
        <p class="font-medium text-rose-900">Algo salió mal</p>
        <p class="mt-1 max-w-md text-sm text-rose-700">{{ message() }}</p>
      </div>
      @if (withRetry()) {
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          (click)="retry.emit()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reintentar
        </button>
      }
    </div>
  `,
})
export class ErrorStateComponent {
  readonly message = input('No pudimos cargar la información. Intenta nuevamente.');
  readonly withRetry = input(true);
  readonly retry = output<void>();
}
