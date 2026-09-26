import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('crea el formulario inválido al iniciar', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    expect(component.form).toBeTruthy();
    expect(component.form.valid).toBe(false);
    expect(component.loading()).toBe(false);
    expect(component.serverError()).toBeNull();
  });

  it('marca los campos vacíos como obligatorios tras tocarlos', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.markAllAsTouched();

    expect(component.controlError('email')).toBe('Este campo es obligatorio.');
    expect(component.controlError('password')).toBe('Este campo es obligatorio.');
  });

  it('valida el formato del correo electrónico', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'no-es-correo', password: 'secret1' });
    component.form.get('email')?.markAsTouched();

    expect(component.controlError('email')).toBe('Ingresa un correo electrónico válido.');
    expect(component.form.valid).toBe(false);
  });

  it('es válido con credenciales correctas', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'contacto@ongavisti.org', password: 'Chepita2026' });

    expect(component.form.valid).toBe(true);
    expect(component.controlError('password')).toBeNull();
  });

  it('muestra errores de validación del servidor por campo', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.get('password')?.setErrors({ server: 'La contraseña es incorrecta.' });
    component.form.get('password')?.markAsTouched();

    expect(component.controlError('password')).toBe('La contraseña es incorrecta.');
  });
});
