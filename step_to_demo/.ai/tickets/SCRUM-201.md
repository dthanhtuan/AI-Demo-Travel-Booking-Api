# SCRUM-201: Booking cancellation (parallel feature — Claude + Gemini)

> This ticket is the **team scenario**: two developers using two different AI models
> build one feature in parallel without colliding. The shared contract is already
> locked in `.ai/DECISIONS.md` (entry dated 2026-06-05).

## Type
Feature (split across two developers)

## Description
Customers need to cancel a confirmed booking. Add a cancellation endpoint that marks a
booking as `cancelled` and records when it happened. A cancelled booking frees its slot
against venue capacity (it no longer counts as a confirmed overlapping booking).

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

## Ownership Split (work in parallel)

### Dev A — Gemini — DATA LAYER
- [ ] Add `cancelled_at` column via a NEW migration file (do not edit existing ones).
- [ ] `booking.repository.ts`: add `cancel(id)` that sets status + cancelled_at and returns the row.
- [ ] `booking.service.ts`: add `cancelBooking(id)` enforcing the already-cancelled (409) and not-found (404) rules.
- [ ] Unit tests for the service: success, already-cancelled, not-found.

### Dev B — Claude — HTTP LAYER
- [ ] `booking.controller.ts`: add `POST /:id/cancel`, map service errors to 200/404/409.
- [ ] Integration test with `supertest`: cancel a booking, then assert 409 on second cancel.
- [ ] Confirm the `CancelBookingResult` shape matches the locked contract.

## Integration Point
- Only ONE developer adds `CancelBookingResult` to `src/types.ts` (per DECISIONS.md).
- Everything else lives in separate files, so the two branches merge cleanly.

## Constraints / Non-goals
- Do NOT edit existing migration files — add a new numbered migration.
- Do NOT change the capacity rule's SQL beyond what `status = 'cancelled'` already implies
  (cancelled bookings are already excluded because the overlap query filters on
  `status = 'confirmed'`).

## Test Expectations
- Service: success, already-cancelled (409), not-found (404).
- Controller: end-to-end cancel + double-cancel via supertest.
- Coverage stays above 85%.

## Reviewer
@backend-lead
