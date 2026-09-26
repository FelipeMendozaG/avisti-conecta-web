import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { BrandComponent } from '../brand/brand';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  end: boolean;
}

/**
 * Lateral de navegación del panel. En móvil se muestra como cajón
 * off-canvas controlado por el input `open`; en desktop es fijo.
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** Estado del cajón móvil (`true` visible). */
  readonly open = input(false);
  /** Solicita el cierre del cajón móvil (backdrop o navegación). */
  readonly close = output<void>();

  readonly user = this.auth.user;

  readonly navItems: NavItem[] = [
    {
      path: '/panel',
      label: 'Resumen',
      end: true,
      icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    },
    {
      path: '/catalogo',
      label: 'Catálogo',
      end: false,
      icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    },
    {
      path: '/panel/solicitudes',
      label: 'Solicitudes',
      end: false,
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    },
    {
      path: '/panel/asignaciones',
      label: 'Asignaciones',
      end: false,
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/panel/perfil',
      label: 'Perfil institucional',
      end: false,
      icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    },
  ];

  logout(): void {
    this.auth.logout();
    this.close.emit();
    this.toast.info('Sesión cerrada', 'Esperamos verte pronto de nuevo.');
    void this.router.navigate(['/']);
  }
}
