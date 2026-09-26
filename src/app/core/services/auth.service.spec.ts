import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../config/api.config';
import type { AuthSession } from '../models/auth.models';
import { SessionStore } from '../storage/session.store';
import { AuthService } from './auth.service';

const SESSION: AuthSession = {
  token: 'jwt-de-ejemplo',
  user: { id: 12, name: 'ONG Avisti Perú', email: 'contacto@ongavisti.org', created_at: '2026-01-01' },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: SessionStore;

  beforeEach(() => {
    window.localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    httpMock.verify();
    window.localStorage.clear();
  });

  it('login() llama al endpoint correcto y persiste la sesión', () => {
    let received: AuthSession | undefined;

    service
      .login({ email: 'contacto@ongavisti.org', password: 'Chepita2026' })
      .subscribe((session) => (received = session));

    const request = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'contacto@ongavisti.org',
      password: 'Chepita2026',
    });

    request.flush({ status: 'success', message: 'ok', data: SESSION });

    expect(received?.token).toBe(SESSION.token);
    expect(store.token()).toBe(SESSION.token);
    expect(store.user()?.email).toBe(SESSION.user.email);
    expect(service.isAuthenticated()).toBe(true);
    expect(window.localStorage.getItem('avisti_connect.session')).toContain(SESSION.token);
  });

  it('register() llama a /auth/register y guarda la sesión', () => {
    service.register({ name: 'ONG X', email: 'nuevo@ong.org', password: 'secret1' }).subscribe();

    const request = httpMock.expectOne(`${API_BASE_URL}/auth/register`);
    expect(request.request.method).toBe('POST');
    request.flush({ status: 'success', message: 'ok', data: SESSION });

    expect(service.token()).toBe(SESSION.token);
  });

  it('logout() limpia Signals y localStorage', () => {
    store.save(SESSION);
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
    expect(window.localStorage.getItem('avisti_connect.session')).toBeNull();
  });

  it('arranca sin sesión cuando no hay token almacenado', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });
});
