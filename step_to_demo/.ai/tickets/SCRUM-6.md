# SCRUM-6: GET /venues/:id returns 200 + null for missing venues

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

## Environment
- Endpoint: `GET /venues/:id`
- Affected branch: main

## Acceptance Criteria
- [ ] `GET /venues/:id` for a missing id returns HTTP 404.
- [ ] Response body is `{ "error": "Venue not found" }`.
- [ ] Existing behaviour for a valid id is unchanged (200 + venue object).
- [ ] A regression test is added that fails before the fix and passes after.

## Affected Area (known)
- `src/venue/` — controller, service, or repository (to be narrowed by agent)
- `tests/`

## Constraints / Non-goals
- Do not change the service or repository layer — this is purely an HTTP-layer fix.

## Reviewer
@backend-lead
