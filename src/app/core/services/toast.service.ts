import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

/** Notificación flotante mostrada por el `ToastContainerComponent`. */
export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const TOAST_DURATION_MS = 5000;
const MAX_VISIBLE_TOASTS = 4;

/**
 * Servicio de notificaciones toast basado en Signals.
 * Los toasts se muestran desde el `ToastContainerComponent` del shell raíz.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly state = signal<ToastItem[]>([]);
  private nextId = 1;

  /** Lista inmutable de visibles para renderizar en la UI. */
  readonly toasts = this.state.asReadonly();

  success(title: string, message?: string): void {
    this.push('success', title, message);
  }

  error(title: string, message?: string): void {
    this.push('error', title, message);
  }

  info(title: string, message?: string): void {
    this.push('info', title, message);
  }

  dismiss(id: number): void {
    this.state.update((list) => list.filter((toast) => toast.id !== id));
  }

  private push(type: ToastType, title: string, message?: string): void {
    const id = this.nextId++;

    this.state.update((list) => [...list, { id, type, title, message }].slice(-MAX_VISIBLE_TOASTS));

    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }
}
