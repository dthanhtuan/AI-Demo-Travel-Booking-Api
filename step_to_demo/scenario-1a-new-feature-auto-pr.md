# Scenario 1a — Single Dev: New Feature (Auto PR)

**Ticket:** SCRUM-5 — Filter venues by city and max price
**Branch:** `feat/SCRUM-5-venue-filter`

---

## The Story

A developer picks up a ticket and hands it to the AI with one prompt.
The agent fetches the ticket, implements, tests, pushes, and opens a draft PR — fully autonomously.
The developer just reviews and approves.

---

## What to Show

### Step 1 — Give the prompt

**From pre-written ticket:**
```
Implement ticket SCRUM-5 and open a PR
```

**From Jira (live fetch):**
```
Fetch ticket SCRUM-5 from Jira and implement it, then open a PR
```

### Step 2 — Watch the agent work

Point out to the audience as it happens:
- It reads `AGENTS.md` first — the rules file shapes its behaviour
- It states the plan before touching any code
- It adds `VenueFilter` to `src/types.ts`
- Filtering is in SQL (repository layer), not JS — because the ticket says so
- It runs `npm test` itself and only continues if they pass
- It pushes and opens a draft PR with the reviewer from the ticket

---

## Acceptance Criteria (what to verify live)

- `GET /venues?city=Hanoi` → only Hanoi venues
- `GET /venues?maxPrice=100` → only venues ≤ $100/night
- `GET /venues?city=Hanoi&maxPrice=120` → both filters combined
- `GET /venues` (no params) → all venues, unchanged
- `GET /venues?maxPrice=abc` → HTTP 400
