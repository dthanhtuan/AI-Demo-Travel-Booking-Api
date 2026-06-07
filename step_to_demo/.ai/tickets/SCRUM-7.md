# SCRUM-7: Booking cancellation

## Type
Feature

## Description
Customers need to cancel a confirmed booking. Add a cancellation endpoint that marks a
booking as `cancelled` and records when it happened. A cancelled booking no longer counts
against venue capacity.

## Shared Contract (LOCKED — see DECISIONS.md)
```ts
export interface CancelBookingResult {
  id: number;
  status: "cancelled";
  cancelled_at: string; // ISO timestamp
}
```
- `POST /bookings/:id/cancel`
- Success → 200 + `CancelBookingResult`
- Already cancelled → 409 `{ error: "Booking already cancelled" }`
- Not found → 404 `{ error: "Booking not found" }`

## Tasks
- [ ] 1. Add `CancelBookingResult` to `src/types.ts`
- [ ] 2. New migration — add `cancelled_at` column to the bookings table
- [ ] 3. `booking.repository.ts` — add `cancel(id)` method (sets status + cancelled_at, returns the row)
- [ ] 4. `booking.service.ts` — add `cancelBooking(id)` enforcing 404 / 409 rules
- [ ] 5. `booking.controller.ts` — add `POST /:id/cancel`, map service errors to 200 / 404 / 409
- [ ] 6. Tests — unit tests for service (success, 409, 404) + supertest integration for controller

## Acceptance Criteria
- [ ] `POST /bookings/:id/cancel` returns 200 + `CancelBookingResult` on success.
- [ ] Returns 409 if booking is already cancelled.
- [ ] Returns 404 if booking does not exist.
- [ ] A cancelled booking no longer counts against venue capacity.

## Affected Area (known)
- `db/migrations/` — new migration only (do not edit existing ones)
- `src/booking/` — repository, service, controller
- `src/types.ts`
- `tests/`

## Constraints / Non-goals
- Do NOT edit existing migration files — add a new numbered migration.
- Do NOT change the capacity rule's SQL beyond what `status = 'cancelled'` already implies.

## Reviewer
@dthanhtuan
