import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandComponent } from '../brand/brand';

/** Pie de página público. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
})
export class FooterComponent {
  /** Año actual para el copyright (cálculo seguro en servidor y navegador). */
  protected readonly year = new Date().getFullYear();
}
