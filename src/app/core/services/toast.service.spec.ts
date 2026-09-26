import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('agrega un toast con el tipo y los mensajes dados', () => {
    service.success('Solicitud creada', 'En espera de revisión.');

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].title).toBe('Solicitud creada');
    expect(toasts[0].message).toBe('En espera de revisión.');
  });

  it('descarta toasts por id', () => {
    service.error('Error de red');
    const id = service.toasts()[0].id;

    service.dismiss(id);

    expect(service.toasts().length).toBe(0);
  });

  it('mantiene como máximo 4 toasts visibles', () => {
    service.info('Uno');
    service.info('Dos');
    service.info('Tres');
    service.info('Cuatro');
    service.info('Cinco');

    expect(service.toasts().length).toBe(4);
    expect(service.toasts()[3].title).toBe('Cinco');
  });
});
