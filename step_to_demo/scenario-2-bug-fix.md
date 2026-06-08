# Scenario 2 — Single Dev: Bug Fix

**Ticket:** SCRUM-6 — GET /venues/:id returns 200 + null for missing venues
**Branch:** `feat/SCRUM-6-venue-404`

---

## The Story

A bug has been reported: requesting a venue that doesn't exist returns `200 OK` with
a `null` body instead of a proper `404`. A developer uses the AI to diagnose the root
cause first, then fix it — showing the **diagnose-before-fix** workflow.

The bug is real and already planted in `src/venue/venue.controller.ts`.

---

## What to Show

### Step 1 — Reproduce the bug live (optional but impactful)

```bash
curl -i http://localhost:3000/venues/999999
```

Show the audience: `200 OK` with body `null`. Then say:
> "This is what clients see today. Let's hand this ticket to the agent."

### Step 2 — Give the prompt

```
Read .ai/tickets/SCRUM-6.md. Diagnose the root cause, then fix it on branch
feat/SCRUM-6-venue-404. Add a regression test that fails before the fix and
passes after. Run the full test suite when done.
```

### Step 3 — Watch the diagnosis
The agent will:
- Compare `venue.controller.ts` (broken) with `customer.controller.ts` (correct)
- Identify the missing null-check on the `GET /:id` handler
- Fix only the controller — no service or repository changes
- Add a `supertest` regression test

---

## Acceptance Criteria (what to verify live)

```bash
curl -i http://localhost:3000/venues/999999
# Expected: 404 Not Found  {"error":"Venue not found"}

curl -i http://localhost:3000/venues/1
# Expected: 200 OK  { venue object }
```

