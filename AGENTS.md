# AGENTS.md

## Project overview

This repository contains a mixed-stack marketplace project:

- A static frontend built as HTML/CSS/JS files in the repository root (`index.html`, `dashboard.html`, `sale.html`, `stock.html`, etc.)
- A Node.js/Express backend in `Kasuwa backend/`
- MongoDB models and routes for a shop/marketplace backend

The repository is not yet a single coherent production service. The frontend and backend were developed as separate concepts and currently have naming, routing, and architecture inconsistencies that must be resolved before production deployment.

## Working rules

1. Do not claim production-readiness without evidence from the actual codebase.
2. Do not introduce new mock/demo data into production flows.
3. Preserve working functionality while fixing broken paths and mismatches.
4. Prefer small, verifiable changes over broad rewrites.
5. Keep all business logic out of UI files.
6. Validate server-side/authz/security before trusting frontend behavior.

## Architecture expectations

- Frontend should remain presentation-focused and consume a real API.
- Backend should own auth, validation, persistence, and authorization.
- Data models should be explicit and validated.
- Route names, import paths, and casing must match exactly.

## Coding standards

- Use lowercase, consistent naming for directories and files.
- Use CommonJS in the current backend unless the repo is intentionally migrated.
- Keep route handlers thin; move logic into service functions when necessary.
- Add validation on all incoming request data.
- Add sensible error responses with standard JSON structures.
- Avoid hard-coded credentials, demo accounts, and fake payments.

## Security rules

- Never commit secrets or `.env` values.
- Never trust client-supplied auth state.
- Validate all request inputs server-side.
- Use authorization checks on every protected route.
- Hash passwords server-side.
- Do not expose stack traces in API responses.
- Do not allow path traversal or malicious file uploads.

## Database rules

- Use MongoDB via Mongoose only when configured and connected.
- Preserve existing schema when possible and add safe migrations for changes.
- Validate required fields and integrity constraints.
- Add indexes for search and common access patterns.
- Avoid writing business logic directly inside models unless it is a genuine model concern.

## Testing rules

- Add tests for auth, product CRUD, stock validation, and order flows.
- Prefer deterministic tests with seeded fixtures.
- Fail fast on invalid data and authorization misuse.
- Do not rely on browser-only logic for security checks.

## Deployment rules

- Use explicit environment variables from `.env.example`.
- Require a real MongoDB connection string and JWT secret.
- Never rely on placeholder API domains like `api.kasuwadan.com` without configuration.
- Ensure rate limiting, CORS, and secure headers are production-safe.
- Verify health checks and startup behavior before deployment.

## Git workflow

- Work in small, reviewable commits with meaningful messages.
- Keep code changes scoped to the issue being fixed.
- Do not mix unrelated refactors with security or auth fixes.
- Validate before merging.

## Forbidden shortcuts

- No fake payment confirmations.
- No hard-coded admin tokens.
- No skipping auth checks by hiding UI elements.
- No bypassing validation in frontend-only flows.
- No trusting user-provided totals or order statuses.
- No demo data in production paths.

## Definition of done

A change is not done until it is verified by:

- reading the actual repository code,
- validating routes and imports,
- running relevant tests or smoke checks,
- confirming auth and authorization behavior,
- verifying no obvious security or production blockers remain.

---

## Repository-specific facts

- The backend directory is named `Kasuwa backend` with space-separated casing.
- Critical imports in the backend are inconsistent (`controllers` vs `controller`, `middleware` vs `Middleware`, `models` vs `Models`, `routes` vs `Routes`).
- The backend is not wired as an installable production app from the repository root.
- The frontend is static HTML/JS and is not a secured production client without a proper API layer and real validation.
- The project currently still needs a real production audit and concrete remediation before it can be called production-ready.
