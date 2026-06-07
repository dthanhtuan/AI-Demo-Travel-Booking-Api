# SCRUM-101: Filter venues by city and max price

> This ticket doubles as the **automation workflow** example: an AI agent reads this
> file, implements it on a branch, opens a PR, and tags the reviewer named below.

## Type
Feature

## Description
Users browsing venues need to narrow the list. Add optional query-parameter filtering
to the existing `GET /venues` endpoint so clients can filter by city and by a maximum
price per night.

## Acceptance Criteria
- [ ] `GET /venues?city=Hanoi` returns only venues in that city (case-insensitive).
- [ ] `GET /venues?maxPrice=100` returns only venues with `price_per_night <= 100`.
- [ ] Both filters combine: `GET /venues?city=Hanoi&maxPrice=120`.
- [ ] With no query params, behaviour is unchanged (returns all venues).
- [ ] Invalid `maxPrice` (non-numeric) returns HTTP 400 with a clear error.

## Affected Files
- `src/venue/venue.repository.ts` — add a filtered query.
- `src/venue/venue.service.ts` — accept and pass through filter options.
- `src/venue/venue.controller.ts` — parse query params, validate `maxPrice`.
- `tests/` — add `venue.service.test.ts` covering the filter logic.

## Constraints / Non-goals
- Do NOT change the venue response shape.
- Do NOT add pagination (out of scope for this ticket).
- Follow the existing layered pattern (controller → service → repository).
- Filtering must happen in SQL (in the repository), not in JS after fetching all rows.

## Test Expectations
- Unit tests for: city filter, maxPrice filter, combined filter, no-filter passthrough,
  invalid maxPrice.
- Service-layer coverage stays above 85%.

## Reviewer
@backend-lead
