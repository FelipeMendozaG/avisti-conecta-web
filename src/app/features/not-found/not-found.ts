import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandComponent } from '../../shared/components/brand/brand';

/** Página 404 con enlaces de vuelta al inicio. */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <a routerLink="/" aria-label="Ir al inicio">
        <app-brand />
      </a>
      <p class="mt-10 text-7xl font-bold tracking-tight text-emerald-600">404</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Página no encontrada</h1>
      <p class="mt-2 max-w-md text-sm text-slate-500">
        La página que buscas no existe o fue movida. Vuelve al inicio para continuar.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a
          routerLink="/"
          class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Ir al inicio
        </a>
        <a
          routerLink="/catalogo"
          class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Ver catálogo
        </a>
      </div>
    </div>
  `,
})
export class NotFound {}
