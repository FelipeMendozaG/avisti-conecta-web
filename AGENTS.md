# Agent Instructions

## Project Overview

- This is a standalone Angular 22 application named `app-avisti-connect`.
- The app uses Angular SSR with an Express entry point and prerendered server routes.
- The current root template is Angular CLI starter content; replace it deliberately when implementing the product UI.
- See [README.md](README.md) for the standard Angular CLI workflow and links.

## Important Paths

- `src/app/app.ts`, `app.html`, and `app.css`: root standalone component and its view styles.
- `src/app/app.routes.ts`: browser route definitions.
- `src/app/app.config.ts`: shared browser application providers.
- `src/app/app.config.server.ts` and `app.routes.server.ts`: server rendering configuration.
- `src/server.ts`: Express server, static assets, and Angular SSR request handling.
- `src/styles.css`: global styles; Tailwind CSS is imported here.
- `public/`: static assets copied into the build.

## Development Workflow

- Use npm 11 as declared by `packageManager` and keep `package-lock.json` synchronized with dependency changes.
- Start development with `npm start` or `ng serve`.
- Build with `npm run build` or `ng build`.
- Run unit tests with `npm test` or `ng test`; tests use Vitest through the Angular CLI.
- To exercise the built SSR server, build first, then run `npm run serve:ssr:app-avisti-connect`.
- There is no e2e framework configured in this repository; do not assume `ng e2e` is runnable.

## Implementation Conventions

- Follow the existing standalone Angular style: components declare their imports directly and are bootstrapped with `bootstrapApplication`.
- Keep browser providers in `app.config.ts` and server-only providers in `app.config.server.ts`; preserve the merged SSR configuration.
- Add routes to `src/app/app.routes.ts` and update server rendering behavior in `src/app/app.routes.server.ts` when route rendering requirements change.
- Keep server endpoints and SSR request handling in `src/server.ts`; avoid putting Express concerns in components.
- Prefer Angular template control flow and signals where they fit the existing code. Keep component styles local unless a rule is intentionally global.
- Preserve SSR compatibility: browser-only APIs must be guarded or used only after browser-side initialization.
- Add or update focused `*.spec.ts` tests for component behavior and run the relevant test command after changes.

## Change Validation

- For UI or routing changes, run `npm test` and `npm run build`.
- For SSR/server changes, also build and run the SSR entry point when practical.
- Do not edit generated output under `dist/`; it is produced by the build.