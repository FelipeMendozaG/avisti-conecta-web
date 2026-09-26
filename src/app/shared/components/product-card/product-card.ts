import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Product } from '../../../core/models/catalog.models';

/** Tarjeta de producto del catálogo (clic para ver el detalle). */
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      (click)="select.emit()"
    >
      <div
        class="relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100"
      >
        @if (product().url_image) {
          <img
            [src]="product().url_image"
            [alt]="product().name"
            class="h-full w-full object-contain p-3"
            loading="lazy"
          />
        } @else {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="h-10 w-10 text-slate-300"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0H3.75m16.5 0a2.25 2.25 0 00-2.25-2.25H5.99a2.25 2.25 0 00-2.247 2.25m16.5 0v.375c0 .621-.504 1.125-1.125 1.125H5.875c-.621 0-1.125-.504-1.125-1.125V7.5"
            />
          </svg>
        }
        <span
          class="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
        >
          {{ product().category }}
        </span>
      </div>

      <div class="mt-4 flex-1">
        <p class="text-xs font-medium uppercase tracking-wide text-emerald-700">
          Código {{ product().product_code }}
        </p>
        <h3 class="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {{ product().name }}
        </h3>
        @if (product().description) {
          <p class="mt-1 line-clamp-2 text-xs text-slate-500">{{ product().description }}</p>
        }
      </div>

      <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
        Ver detalle
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </button>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly select = output<void>();
}
