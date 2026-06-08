# Scenario 1b — Single Dev: New Feature (Local Only)

**Ticket:** SCRUM-5 — Filter venues by city and max price
**Branch:** `feat/SCRUM-5-venue-filter`

---

## The Story

A developer picks up a ticket and hands it to the AI with one prompt.
The agent implements and tests locally, then stops — the developer reviews the diff
and decides when to push and open a PR.

---

## What to Show

### Step 1 — Give the prompt

**From pre-written ticket:**
```
Implement ticket SCRUM-5
```

**From Jira (live fetch):**
```
Fetch ticket SCRUM-5 from Jira and implement it
```

The agent reads or fetches the ticket, creates the branch, runs tests before and after,
and commits locally. It does **not** push or open a PR.

### Step 2 — Watch the agent work

Point out to the audience as it happens:
- It reads `AGENTS.md` first — the rules file shapes its behaviour
- It states the plan before touching any code
- It adds `VenueFilter` to `src/types.ts`
- Filtering is in SQL (repository layer), not JS — because the ticket says so
- It runs `npm test` itself and only continues if they pass
- It commits and stops — no push, no PR

### Step 3 — Push and open a PR (when ready)

Only when the developer is satisfied with the diff:
```
Push the branch and open a draft PR. Assign the reviewer from the ticket file.
```

---

## Acceptance Criteria (what to verify live)

- `GET /venues?city=Hanoi` → only Hanoi venues
- `GET /venues?maxPrice=100` → only venues ≤ $100/night
- `GET /venues?city=Hanoi&maxPrice=120` → both filters combined
- `GET /venues` (no params) → all venues, unchanged
- `GET /venues?maxPrice=abc` → HTTP 400
