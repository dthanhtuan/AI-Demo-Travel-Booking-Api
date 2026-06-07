# Scenario 3 — Team: Claude + Gemini in Parallel

**Ticket:** SCRUM-7 — Booking cancellation
**Branches:** `feat/SCRUM-7-cancel-data` (Gemini) · `feat/SCRUM-7-cancel-http` (Claude)

---

## The Story

One feature, two AI models, zero conflicts. Before any code is written, the team locks
the shared contract in the ticket. Then Claude and Gemini each build their half
independently. When both branches are merged, they fit together cleanly — because they
never touched the same files.

---

## Setup — Show the Pre-Locked Contract

Before starting either agent session, open `.ai/tickets/SCRUM-7.md` and point to the
**Shared Contract** section:

> "The interface and status codes are agreed and written into the ticket. Both agents will
> build against this contract. Neither needs to wait for the other."

```ts
export interface CancelBookingResult {
  id: number;
  status: "cancelled";
  cancelled_at: string; // ISO timestamp
}
```

---

## What to Show

### Session A — Gemini builds the data layer

**Prompt for Gemini:**
```
Read AGENTS.md, GEMINI.md, and .ai/tickets/SCRUM-7.md.
You are Dev A. Build the data layer (tasks 1–3) for the cancellation
feature on branch feat/SCRUM-7-cancel-data. Run tests when done.
```

**Gemini will touch:**
| File | What changes |
|------|-------------|
| `migrations/002_add_cancelled_at.sql` | New migration (never edits 001) |
| `src/booking/booking.repository.ts` | Adds `cancel(id)` method |
| `src/booking/booking.service.ts` | Adds `cancelBooking(id)` with 404/409 rules |
| `src/types.ts` | Adds `CancelBookingResult` interface |
| `tests/booking.service.test.ts` | Unit tests: success, already-cancelled, not-found |

---

### Session B — Claude builds the HTTP layer

**Prompt for Claude:**
```
Read AGENTS.md, CLAUDE.md, and .ai/tickets/SCRUM-7.md.
You are Dev B. Build the HTTP layer (tasks 4–6) for the cancellation
feature on branch feat/SCRUM-7-cancel-http. Run tests when done.
```

**Claude will touch:**
| File | What changes |
|------|-------------|
| `src/booking/booking.controller.ts` | Adds `POST /:id/cancel` route |
| `tests/booking.controller.test.ts` | Supertest: cancel + double-cancel → 409 |

---

## The Merge — Why It's Clean

Show the audience:
- Gemini's branch touches: migration, repository, service, types, unit tests
- Claude's branch touches: controller, integration tests
- **Zero file overlap** → merge is automatic, no conflict resolution needed

---

## Talking Points

- **Contract first, code second.** The shared interface in the ticket is the handshake.
  Without it, both agents would invent their own response shapes and collide.
- **`AGENTS.md` is model-agnostic.** Claude and Gemini follow the same rules (commits,
  tests, layering) because the rules are written in plain English in the repo.
- **Different strengths, same repo.** Gemini's large context window is useful for
  reasoning about data layer ripple effects. Claude owns the HTTP mapping. Each plays
  to its strength.
