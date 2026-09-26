import { HttpErrorResponse } from '@angular/common/http';
import type { ApiErrorBody } from '../models/api.models';

/** Error de API traducido a un formato listo para la UI. */
export interface ParsedApiError {
  /** HTTP status cuando hubo respuesta; `0` sin conexión, `null` error local. */
  status: number | null;
  /** Código de negocio (`EMAIL_ALREADY_EXISTS`, `ENTITY_NOT_FOUND`, ...). */
  code: string | null;
  /** Mensaje amigable en español. */
  message: string;
  /** Errores de validación por campo (`path` → `msg`). */
  fieldErrors: Record<string, string>;
}

const FALLBACK_MESSAGE = 'No pudimos completar la operación. Intenta nuevamente.';
const NETWORK_MESSAGE =
  'No pudimos conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.';

/** Mapeo de códigos de negocio documentados en la API a mensajes amigables. */
const CODE_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado. Inicia sesión o usa otro correo.',
  USER_NOT_FOUND: 'No encontramos una cuenta con ese correo electrónico.',
  INVALID_PASSWORD: 'La contraseña es incorrecta. Inténtalo de nuevo.',
  ENTITY_ALREADY_EXISTS: 'Este usuario ya tiene un perfil institucional registrado.',
  ENTITY_NOT_FOUND: 'Aún no has registrado tu perfil institucional.',
  ENTITY_FORBIDDEN: 'No tienes permiso para modificar este registro.',
  EMPTY_UPDATE: 'Debes enviar al menos un campo para actualizar.',
  REQUEST_NOT_FOUND: 'No encontramos la solicitud indicada.',
  ASSIGNMENT_NOT_FOUND: 'No encontramos la asignación indicada.',
  ERROR_NO_EXISTS_TOKEN: 'Tu sesión no es válida. Inicia sesión nuevamente.',
  ERROR_NO_VALID_TOKEN: 'Tu sesión expiró. Inicia sesión nuevamente.',
};

/**
 * Convierte cualquier error HTTP de la API en un `ParsedApiError` con un
 * mensaje amigable y los errores de validación por campo (403 `errors[]`).
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: null, code: null, message: FALLBACK_MESSAGE, fieldErrors: {} };
  }

  if (error.status === 0) {
    return { status: 0, code: 'NETWORK_ERROR', message: NETWORK_MESSAGE, fieldErrors: {} };
  }

  const body: ApiErrorBody =
    typeof error.error === 'object' && error.error !== null
      ? (error.error as ApiErrorBody)
      : {};

  const fieldErrors: Record<string, string> = {};
  let firstFieldMessage: string | null = null;

  for (const fieldError of body.errors ?? []) {
    if (!fieldError?.path || fieldError.path in fieldErrors) {
      continue;
    }
    fieldErrors[fieldError.path] = fieldError.msg;
    firstFieldMessage ??= fieldError.msg;
  }

  const code =
    typeof body.data === 'string' ? body.data : typeof body.error === 'string' ? body.error : null;

  const message =
    (code ? CODE_MESSAGES[code] : undefined) ??
    firstFieldMessage ??
    (code ? FALLBACK_MESSAGE : (body.message ?? FALLBACK_MESSAGE));

  return { status: error.status, code, message, fieldErrors };
}
