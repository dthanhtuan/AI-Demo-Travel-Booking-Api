# Scenario 1 — Single Dev: New Feature
### (also the Automation Workflow demo)

**Ticket:** SCRUM-5 — Filter venues by city and max price
**Branch:** `feat/SCRUM-5-venue-filter`

---

## The Story

A developer picks up a ticket from the board. Instead of reading the ticket and
manually implementing it, they hand it directly to the AI agent with one prompt.
The agent reads the ticket, plans, implements, tests, and opens a PR — autonomously.

This is the **automation demo**: one prompt → working code → draft PR with reviewer tagged.

---

## What to Show

### Step 1 — Load the ticket

**Option A — Pre-written ticket (simple demo)**
The ticket file `SCRUM-5.md` is already in `.ai/tickets/`. Point this out:
> "The team writes structured tickets in `.ai/tickets/`. That's the only input the agent needs."

**Option B — Pull live from Jira (advanced demo)**
Skip the pre-written file and have the agent fetch it directly. Requires the Jira MCP
configured in `.claude/settings.json` (see `.claude/skills/jira.md`).

Use this prompt instead:
```
Fetch ticket SCRUM-5 from Jira using the jira MCP, save the content to
.ai/tickets/SCRUM-5.md, then implement it on branch feat/SCRUM-5-venue-filter,
run tests, and open a draft PR.
```

> **Talking point for Option B:** "The agent connects to Jira, pulls the ticket spec,
> saves it as the team's single source of truth, and starts coding — no copy-paste,
> no manual handoff."

### Step 2 — Give the automation prompt (Option A — copy-paste this exactly)

```
Read .ai/tickets/SCRUM-5.md. Implement the ticket on branch feat/SCRUM-5-venue-filter,
run tests, then open a draft PR with the full required description and assign the reviewer
from the ticket file.
```

### Step 3 — Watch the agent work
Point out to the audience as it happens:
- It reads `AGENTS.md` first (the rules file shapes its behavior)
- It reads the ticket and states the plan before touching code
- It adds `VenueFilter` to `src/types.ts` and locks it in `.ai/DECISIONS.md`
- Filtering is in SQL (repository layer), not JS — because the ticket says so
- It runs `npm test` itself; it doesn't ask you to

---

## Files the Agent Will Touch

| File | What changes |
|------|-------------|
| `src/types.ts` | Adds `VenueFilter` interface |
| `src/venue/venue.repository.ts` | Filtered SQL query |
| `src/venue/venue.service.ts` | Passes filter options through |
| `src/venue/venue.controller.ts` | Parses + validates query params |
| `tests/venue.service.test.ts` | New unit tests |
| `.ai/DECISIONS.md` | Records the new interface |

---

## Acceptance Criteria (what to verify live)

- `GET /venues?city=Hanoi` → only Hanoi venues
- `GET /venues?maxPrice=100` → only venues ≤ $100/night
- `GET /venues?city=Hanoi&maxPrice=120` → both filters combined
- `GET /venues` (no params) → all venues, unchanged
- `GET /venues?maxPrice=abc` → HTTP 400

---

## Talking Points

- **The ticket is the spec.** No Slack messages, no verbal instructions — the agent works from the written ticket alone.
- **`AGENTS.md` is the style guide.** It enforces commit discipline, test-first thinking, and PR format without you repeating it every session.
- **SQL filter, not JS filter.** The constraint is in the ticket; the agent respected it.
- **Jira MCP closes the loop.** With Option B, there is no manual step at all — the agent reads from Jira, codes, and opens the PR. The developer just reviews.
