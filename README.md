# Avisti Connect — `app-avisti-connect`

Plataforma web que conecta el catálogo de productos y equipos disponibles para donación con entidades sociales: las entidades se registran, completan su perfil institucional, crean solicitudes o convenios de donación, les dan seguimiento y reciben los equipos asignados aprobados.

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | Angular 22 (standalone components, signals, control flow nativo `@if`/`@for`/`@switch`, Reactive Forms) |
| Renderizado | SSR con Express (`src/server.ts`) + hidratación con caché de transferencia HTTP |
| Estilos | Tailwind CSS 4 (utilidades, diseño responsivo mobile/tablet/desktop) |
| HTTP | `HttpClient` + interceptores (`token`, `session`) |
| Estado local | Signals (`signal`, `computed`) |
| Tests | Vitest vía Angular CLI — **25 tests, 7 archivos, todo en verde** |
| Despliegue | Google App Engine, entorno estándar (`app.yaml`, runtime `nodejs22`) |

## Requisitos previos

- Node.js 20+ (desarrollo local probado con Node 24) y npm 11 (`packageManager` declarado en `package.json`).
- Backend REST corriendo y accesible (ver [Configuración de la API](#configuración-de-la-api)).
- Google Cloud SDK (`gcloud`) solo para el despliegue.

## Puesta en marcha en local

```bash
npm install
npm start        # ng serve → http://localhost:4200/
```

## Configuración de la API

La URL base vive en un solo punto: `src/app/core/config/api.config.ts` (`API_BASE_URL`).

| Entorno | Valor actual |
| --- | --- |
| Desarrollo | `http://localhost:4005/api/v1` |
| Producción (App Engine) | `https://api-avisti-web-dot-project-d5c1b1cb-efd2-47ae-ad8.uc.r.appspot.com/api/v1` |

> ⚠️ El navegador llama a la API **directamente** (`HttpClient`), así que `API_BASE_URL` debe ser la URL pública del backend antes de compilar/desplegar. La colección Postman de referencia está en `avisti_conecta_collection.json` (raíz del repo).

## Scripts npm

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Build de producción SSR → `dist/app-avisti-connect` (browser + server) |
| `npm run gcp-build` | Alias de `ng build` que App Engine ejecuta durante el deploy |
| `npm test` | Tests unitarios (`ng test`, Vitest, `--watch=false` en CI) |
| `npm run serve:ssr:app-avisti-connect` | Sirve el build SSR: `node dist/app-avisti-connect/server/server.mjs` (puerto `PORT` o 4000) |

## Estructura del proyecto (`src/app/`)

```text
core/
  config/         → api.config.ts (URL base de la API)
  models/         → interfaces TS por módulo + envelope {status,message,data} y paginación
  storage/        → SessionStore (signals token/user, localStorage protegido con isPlatformBrowser)
  services/       → Auth, Entity, Catalog, DonationRequest, DonationAssignment, Toast (+ specs)
  guards/         → authGuard (rutas /panel/**), guestGuard (/ingresar, /registro) (+ spec)
  interceptors/   → token (Bearer JWT) y session (401 → logout + toast + redirect) (+ spec)
  utils/          → parseApiError (códigos de negocio → mensajes amigables) (+ spec)
shared/
  components/     → brand, navbar, footer, sidebar, toast, modal, spinner, skeleton,
                    empty-state, error-state, status-badge, pagination, product/equipment-card
  layout/         → dashboard-layout (shell privado con sidebar)
features/
  landing/        → página pública con hero, CTA y vista previa del catálogo
  auth/           → login y registro (formularios reactivos + errores de servidor por campo)
  catalog/        → pestañas productos/equipos, filtros, paginación y modales de detalle
  dashboard/      → panel con KPIs y accesos rápidos
  requests/       → listado, nueva solicitud y detalle
  assignments/    → convenios/equipos asignados y detalle
  profile/        → perfil institucional (onboarding POST / actualización PUT)
  not-found/      → página 404
```

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Pública | Landing + preview del catálogo |
| `/ingresar`, `/registro` | Solo invitados (`guestGuard`) | Auth con validación reactiva |
| `/catalogo` | Pública | Productos y equipos con filtros y paginación |
| `/panel` | Privada (`authGuard`) | Resumen del panel |
| `/panel/solicitudes`, `/panel/solicitudes/nueva`, `/panel/solicitudes/:requestId` | Privada | Seguimiento y creación de solicitudes |
| `/panel/asignaciones`, `/panel/asignaciones/:assignmentId` | Privada | Convenios y equipos asignados |
| `/panel/perfil` | Privada | Perfil institucional |
| `/**` | — | Página 404 |

## Integración con la API (5 módulos, 12 endpoints)

| Módulo | Endpoints consumidos |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login` (retorna JWT) |
| Entidades | `POST /entities/`, `GET /entities/my-profile`, `PUT /entities/` |
| Catálogo | `GET /products/…`, `GET /equipments/…` (públicos, con filtros y paginación) |
| Solicitudes | `POST /donation-requests/`, `GET /donation-requests/`, `GET /donation-requests/:id` |
| Asignaciones | `GET /donation-assignments/`, `GET /donation-assignments/:id` |

Autenticación: el JWT se guarda en `SessionStore` (signals + `localStorage`, solo en navegador) y `tokenInterceptor` lo inyecta como `Authorization: Bearer …` en cada petición protegida. `sessionInterceptor` gestiona los 401 (sesión expirada/ausente): limpia la sesión, muestra un toast y redirige a `/ingresar` conservando `returnUrl`. Los códigos de error del backend (`EMAIL_ALREADY_EXISTS`, errores de validación 403 por campo, etc.) se traducen a mensajes amigables en español.

## SSR

- `app.routes.server.ts`: `/ingresar` y `/registro` se prerenderizan en el build; el resto usa render en servidor por petición (landing y catálogo consumen la API en runtime e hidratan sin duplicar llamadas gracias a la transfer cache).
- Todo acceso a `localStorage` u otras APIs del navegador está protegido con `isPlatformBrowser`.
- La validación anti-SSRF de Angular exige hosts permitidos: en local están `localhost`, `127.0.0.1` y `[::1]` (`angular.json` → `security.allowedHosts`); en App Engine se usa la variable `NG_ALLOWED_HOSTS` (ver `app.yaml`).

## Tests

```bash
npx ng test --watch=false
```

Cobertura actual: `AuthService`, `tokenInterceptor`, `authGuard`/`guestGuard`, `ToastService`, `parseApiError`, `Login` (formulario) y `App` (router-outlet + toasts).

## Build

```bash
npm run build
```

Último build verificado: bundle inicial ~375 kB (presupuesto 500 kB), 2 rutas prerenderizadas y chunks lazy por feature. Smoke test del servidor SSR en vivo: `/` y `/catalogo` devuelven HTML con datos reales de la API; `/ingresar`, `/panel` y 404 responden 200 correctamente.

## Despliegue en App Engine

`app.yaml` (servicio `avisti-conecta`, runtime `nodejs22`, `instance_class: F2`, escalado `0–2` instancias) y `.gcloudignore` ya están en la raíz. El `entrypoint` arranca el servidor SSR compilado y `NG_ALLOWED_HOSTS: '*.appspot.com'` cubre las URLs `VERSION-dot-SERVICE-dot-PROJECT.appspot.com`.

```bash
# 1. Apuntar API_BASE_URL a la URL pública del backend (ver tabla de entornos)
# 2. Desplegar (compila con gcp-build en el servidor)
gcloud app deploy app.yaml
# 3. Ver logs
gcloud app logs tail -s avisti-conecta
```

> Si usas un dominio personalizado, añádelo a `NG_ALLOWED_HOSTS` separado por comas, p. ej. `"*.appspot.com, app.tudominio.com"`. No se definen `handlers` estáticos en `app.yaml` a propósito: los assets se generan durante el deploy y los sirve Express (`src/server.ts`) con caché de 1 año.

## Recursos adicionales

- [Angular CLI — Overview and Command Reference](https://angular.dev/tools/cli)
- [App Engine — Node.js standard: `app.yaml`](https://docs.cloud.google.com/appengine/docs/standard/nodejs/configuring-your-app-with-app-yaml)
- [App Engine — custom build step (`gcp-build`)](https://cloud.google.com/appengine/docs/standard/nodejs/running-custom-build-step)

