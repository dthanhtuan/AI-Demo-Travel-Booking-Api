# SCRUM-102: GET /venues/:id returns 200 + null for missing venues

## Type
Bug

## Description
When a client requests a venue that does not exist, the API responds with HTTP 200 and
a body of `null` instead of a proper 404. This breaks clients that rely on the status
code to detect "not found".

## Steps to Reproduce
1. Start the API (`docker compose up`).
2. `curl -i http://localhost:3000/venues/999999`
3. Observe: status is `200 OK`, body is `null`.
4. Expected: status `404 Not Found`, body `{ "error": "Venue not found" }`.

## Root Cause (to be confirmed by the agent)
`src/venue/venue.controller.ts` — the `GET /:id` handler calls `res.json(venue)`
directly without checking whether `venue` is `null`. Compare with
`customer.controller.ts`, which handles this correctly.

## Acceptance Criteria
- [ ] `GET /venues/:id` for a missing id returns HTTP 404.
- [ ] Response body is `{ "error": "Venue not found" }`.
- [ ] Existing behaviour for a valid id is unchanged (200 + venue object).
- [ ] A regression test is added that fails before the fix and passes after.

## Affected Files
- `src/venue/venue.controller.ts`
- `tests/` — add a regression test (use `supertest` against the app).

## Constraints / Non-goals
- Do not change the service or repository layer — this is purely an HTTP-layer fix.

## Test Expectations
- Regression test: request a non-existent venue id, assert 404 and the error body.

## Reviewer
@backend-lead
