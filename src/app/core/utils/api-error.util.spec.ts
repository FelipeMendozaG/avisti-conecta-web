import { HttpErrorResponse } from '@angular/common/http';
import { parseApiError } from './api-error.util';

describe('parseApiError', () => {
  it('traduce los códigos de negocio a mensajes amigables', () => {
    const parsed = parseApiError(
      new HttpErrorResponse({
        status: 409,
        error: { status: 'error', message: 'Ocurrio un problema', data: 'EMAIL_ALREADY_EXISTS' },
      }),
    );

    expect(parsed.status).toBe(409);
    expect(parsed.code).toBe('EMAIL_ALREADY_EXISTS');
    expect(parsed.message).toContain('ya está registrado');
  });

  it('expone los errores de validación (403) por campo', () => {
    const parsed = parseApiError(
      new HttpErrorResponse({
        status: 403,
        error: {
          errors: [
            {
              type: 'field',
              value: '123',
              msg: 'La contrasena debe tener al menos 6 caracteres',
              path: 'password',
              location: 'body',
            },
          ],
        },
      }),
    );

    expect(parsed.fieldErrors['password']).toContain('6 caracteres');
    expect(parsed.message).toContain('6 caracteres');
  });

  it('usa el mensaje de error de sesión (401 { error })', () => {
    const parsed = parseApiError(
      new HttpErrorResponse({ status: 401, error: { error: 'ERROR_NO_EXISTS_TOKEN' } }),
    );

    expect(parsed.code).toBe('ERROR_NO_EXISTS_TOKEN');
    expect(parsed.message).toContain('sesión');
  });

  it('detecta errores de red (sin conexión)', () => {
    const parsed = parseApiError(new HttpErrorResponse({ status: 0 }));

    expect(parsed.status).toBe(0);
    expect(parsed.message).toContain('conectar');
  });

  it('devuelve un mensaje genérico para errores locales no HTTP', () => {
    const parsed = parseApiError(new Error('boom'));

    expect(parsed.code).toBeNull();
    expect(parsed.status).toBeNull();
    expect(parsed.message).toContain('No pudimos completar');
  });
});
