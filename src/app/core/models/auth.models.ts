/** Usuario autenticado (sin el password, nunca expuesto por la API). */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

/** Sesión devuelta por login y registro: token JWT + usuario. */
export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
