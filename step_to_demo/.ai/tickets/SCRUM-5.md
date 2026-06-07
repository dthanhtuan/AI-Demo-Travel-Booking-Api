# SCRUM-5: Filter venues by city and max price

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

## Affected Area (known)
- `src/venue/` — repository, service, controller
- `tests/` — new unit tests for filter logic

## Constraints / Non-goals
- Do NOT change the venue response shape.
- Do NOT add pagination (out of scope for this ticket).
- Follow the existing layered pattern (controller → service → repository).
- Filtering must happen in SQL (in the repository), not in JS after fetching all rows.

## Reviewer
@dthanhtuan
