import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Indicador de carga centrado con etiqueta legible para lectores de pantalla. */
@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-12 text-slate-500" role="status">
      <span
        class="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-600"
        aria-hidden="true"
      ></span>
      <span class="text-sm">{{ label() }}</span>
    </div>
  `,
})
export class SpinnerComponent {
  readonly label = input('Cargando información…');
}
