# SCRUM-8: Add JWT authentication to protected endpoints

## Type
Feature

## Description
The API currently has no authentication. Add JWT-based authentication so that only
requests with a valid token can access booking and customer endpoints. Venue endpoints
remain public. Tokens are issued via a new `POST /auth/login` endpoint using email +
password, and verified via a shared middleware applied to protected routes.

## Acceptance Criteria
- [ ] `POST /auth/login` accepts `{ "email": "...", "password": "..." }` and returns `{ "token": "<jwt>" }` on success.
- [ ] `POST /auth/login` returns HTTP 401 with `{ "error": "Invalid credentials" }` on failure.
- [ ] `GET /bookings`, `POST /bookings`, `GET /bookings/:id` require a valid `Authorization: Bearer <token>` header.
- [ ] `GET /customers`, `GET /customers/:id` require a valid `Authorization: Bearer <token>` header.
- [ ] `GET /venues`, `GET /venues/:id`, `GET /health` remain public (no token required).
- [ ] Requests to protected routes without a token return HTTP 401 with `{ "error": "Unauthorized" }`.
- [ ] Requests with an expired or malformed token return HTTP 401 with `{ "error": "Invalid token" }`.
- [ ] JWT secret is loaded from `process.env.JWT_SECRET` — never hard-coded.
- [ ] Token expiry is 1 hour.

## Affected Area (known)
- `src/auth/` — new module: controller, service (issue + verify token)
- `src/middleware/authenticate.ts` — new JWT guard middleware
- `src/routes.ts` — apply middleware to protected route groups
- `src/types.ts` — extend `Request` type if needed (attach decoded payload)
- `migrations/` — ensure `customers` table has `password_hash` column (or add migration)
- `tests/` — new integration tests for login and protected routes

## Shared Contract (for parallel work)
```ts
// src/types.ts — add before starting
export interface AuthPayload {
  customerId: number;
  email: string;
}
```
Any agent touching `src/types.ts` must confirm this interface is present in this ticket
before adding it, to avoid merge conflicts.

## Constraints / Non-goals
- Use the `jsonwebtoken` npm package — do not use a different JWT library.
- Store only `customerId` and `email` in the token payload (no roles in this ticket).
- Do NOT implement refresh tokens (out of scope).
- Do NOT add rate-limiting to the login endpoint (separate ticket).
- Password hashing must use `bcrypt` (the dependency already exists or add it).
- Follow the existing layered pattern: controller → service → repository.

## Reviewer
@security-lead
