import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkeletonVariant = 'grid' | 'rows' | 'detail';

/** Esqueletos de carga (shimmer) para listados, tablas y detalles. */
@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (variant()) {
      @case ('grid') {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
          @for (item of items; track item) {
            <div class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
              <div class="h-32 rounded-xl bg-slate-200"></div>
              <div class="mt-4 h-3 w-3/4 rounded bg-slate-200"></div>
              <div class="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
              <div class="mt-4 h-8 w-full rounded-lg bg-slate-200"></div>
            </div>
          }
        </div>
      }
      @case ('detail') {
        <div class="space-y-4" aria-hidden="true">
          <div class="h-8 w-2/3 animate-pulse rounded bg-slate-200"></div>
          <div class="h-40 animate-pulse rounded-2xl bg-slate-200"></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="h-20 animate-pulse rounded-xl bg-slate-200"></div>
            <div class="h-20 animate-pulse rounded-xl bg-slate-200"></div>
          </div>
        </div>
      }
      @default {
        <div class="space-y-3" aria-hidden="true">
          @for (item of items; track item) {
            <div class="h-16 animate-pulse rounded-xl bg-slate-200"></div>
          }
        </div>
      }
    }
  `,
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('rows');
  protected readonly items = [1, 2, 3, 4, 5, 6];
}
