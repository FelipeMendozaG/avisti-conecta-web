import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../storage/session.store';
import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let store: SessionStore;

  beforeEach(() => {
    window.localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    httpMock.verify();
    window.localStorage.clear();
  });

  it('adjunta Authorization: Bearer cuando hay token en sesión', () => {
    store.save({
      token: 'jwt-123',
      user: { id: 1, name: 'Test', email: 't@t.com', created_at: '2026-01-01' },
    });

    http.get('/api/privado').subscribe();

    const request = httpMock.expectOne('/api/privado');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-123');
    request.flush({ ok: true });
  });

  it('no adjunta Authorization cuando no hay sesión', () => {
    http.get('/api/publico').subscribe();

    const request = httpMock.expectOne('/api/publico');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ ok: true });
  });
});
