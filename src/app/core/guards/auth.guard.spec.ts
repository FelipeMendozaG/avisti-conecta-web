import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { SessionStore } from '../storage/session.store';

const USER = { id: 1, name: 'Test', email: 't@t.com', created_at: '2026-01-01' };

describe('auth guards', () => {
  let store: SessionStore;

  beforeEach(() => {
    window.localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    store = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe('authGuard', () => {
    it('permite el acceso cuando existe sesión', () => {
      store.save({ token: 'jwt-123', user: USER });

      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, { url: '/panel' } as RouterStateSnapshot),
      );

      expect(result).toBe(true);
    });

    it('redirige a /ingresar conservando returnUrl cuando no hay sesión', () => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard(
          {} as ActivatedRouteSnapshot,
          { url: '/panel/solicitudes' } as RouterStateSnapshot,
        ),
      );

      expect(result).toBeInstanceOf(UrlTree);
      const tree = result as UrlTree;
      expect(tree.root.children['primary']?.segments.map((s) => s.path)).toEqual(['ingresar']);
      expect(tree.queryParams['returnUrl']).toBe('/panel/solicitudes');
    });
  });

  describe('guestGuard', () => {
    it('permite el acceso a invitados sin sesión', () => {
      const result = TestBed.runInInjectionContext(() =>
        guestGuard({} as ActivatedRouteSnapshot, { url: '/ingresar' } as RouterStateSnapshot),
      );

      expect(result).toBe(true);
    });

    it('redirige al panel cuando ya hay sesión', () => {
      store.save({ token: 'jwt-123', user: USER });

      const result = TestBed.runInInjectionContext(() =>
        guestGuard({} as ActivatedRouteSnapshot, { url: '/ingresar' } as RouterStateSnapshot),
      );

      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/panel');
    });
  });
});
