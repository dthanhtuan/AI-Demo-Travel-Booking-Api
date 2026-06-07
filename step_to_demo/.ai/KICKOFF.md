# KICKOFF.md — Handoff from Planning Session to Claude Code

> This document captures all decisions made in the planning conversation so that
> Claude Code can pick up exactly where we left off. Read this file first when
> opening a new Claude Code session in this repo.

## What This Repo Is

`travel-booking-api` is a **teaching/demo project** for AI-agent team workflows.
It is a small REST API (Node + Express + TypeScript + Postgres) with three entities:
**Venue**, **Customer**, **Booking**.

It exists to demonstrate four real scenarios across two guides:

| Guide          | Scenario                                             | Ticket     |
|----------------|------------------------------------------------------|------------|
| Single Dev     | Implement a new feature                              | SCRUM-101  |
| Single Dev     | Fix a bug on an existing project                     | SCRUM-102  |
| Dev Team       | Two devs (Claude + Gemini) working the same feature  | SCRUM-201  |
| Dev Team       | Handoff situation (mid-feature developer switch)     | n/a        |
| Automation     | Jira ticket → AI implements → PR → reviewer tagged   | SCRUM-101  |

---

## What Is Already Built (the baseline)

The full baseline codebase is committed. It includes:

- Working Express API on port 3000.
- Three entity modules following controller → service → repository → db layering.
- Postgres migrations in `migrations/001_init.sql` with seed data.
- Jest tests in `tests/booking.service.test.ts` covering booking business rules.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` — the AI context protocol files.
- `.ai/DECISIONS.md` — with the cancellation contract pre-locked for SCRUM-201.
- `.ai/CONTEXT.md` — current state snapshot.
- `.ai/tickets/SCRUM-101.md`, `SCRUM-102.md`, `SCRUM-201.md`.
- **Deliberate bug** in `src/venue/venue.controller.ts` GET /:id (for SCRUM-102).

To verify the baseline runs:

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run migrate
npm test          # all tests should pass
```

---

## What Needs to Be Built Next (in Claude Code)

### Priority 1 — Scenario demonstrations

Work each scenario as a separate git branch exactly as described in the ticket file.
The point is not just to implement the feature, but to **demonstrate the workflow** —
follow `AGENTS.md` session-start checklist, commit discipline, PR description format,
and handoff protocol exactly as documented.

#### SCRUM-101 — Single Dev: New Feature (also the Automation demo)
Branch: `feat/SCRUM-101-venue-filter`

- Read `.ai/tickets/SCRUM-101.md` for full spec.
- Filtering must happen in SQL (repository layer), not JS.
- Add `VenueFilter` interface to `src/types.ts` after locking in DECISIONS.md.
- Show the full automation workflow prompt at the start of the session:
  `"Read .ai/tickets/SCRUM-101.md. Implement the ticket on branch feat/SCRUM-101-venue-filter, run tests, then open a draft PR with the full required description and assign the reviewer from the ticket file."`

#### SCRUM-102 — Single Dev: Bug Fix
Branch: `feat/SCRUM-102-venue-404`

- Read `.ai/tickets/SCRUM-102.md`.
- Fix is controller-only (`src/venue/venue.controller.ts`).
- Must include a supertest regression test.
- Show the root-cause-before-fix workflow: diagnose first, then fix.

#### SCRUM-201 — Team: Claude + Gemini Parallel Feature
Branch per dev: `feat/SCRUM-201-cancel-data` (Gemini) and `feat/SCRUM-201-cancel-http` (Claude)

- Contract is already locked in `.ai/DECISIONS.md`.
- Show how to simulate the parallel workflow:
  1. Claude builds the HTTP layer on its branch.
  2. Gemini builds the data layer on its branch.
  3. Both branches merge cleanly because they touch different files.
- The migration for `cancelled_at` goes in `migrations/002_add_cancelled_at.sql`.

#### Handoff scenario
- Use SCRUM-201: simulate Dev1 (Claude) stopping mid-way.
- Dev1 runs the HANDOFF.md update prompt, commits, opens a Draft PR.
- Dev2 (Gemini) starts a fresh session, loads context files, confirms state, continues.
- This demonstrates the `.ai/` protocol in practice.

---

## Documents to Write After the Scenarios Are Built

Once the code is working and branches are merged, write two scenario guide documents:

### 1. `docs/single-dev-scenarios.md`
Walk through SCRUM-101 and SCRUM-102 step by step:
- Exact prompts used to start each session
- What the AI produced and why
- How AGENTS.md / CLAUDE.md shaped the output
- What the PRs looked like

### 2. `docs/team-scenarios.md`
Walk through SCRUM-201 and the handoff:
- How the contract was locked before coding started
- Dev A (Gemini) session — what it loaded, what it built
- Dev B (Claude) session — what it loaded, what it built
- The merge — why it was clean
- The handoff sub-scenario — HANDOFF.md produced by Dev1, session start by Dev2

### 3. `docs/automation-workflow.md`
Walk through the full Jira → PR automation:
- What a well-formed ticket (SCRUM-101.md) looks like and why each section matters
- The one-prompt automation: `"Read .ai/tickets/SCRUM-101.md and implement it"`
- How the reviewer tag from the ticket maps to the PR
- What the agent does autonomously vs. what still needs human review

---

## Conventions to Follow in Claude Code

- Always start a session by reading AGENTS.md and the relevant ticket.
- Always run `npm test` before starting and after finishing any change.
- Keep commits atomic — one logical change per commit.
- Never edit `migrations/001_init.sql` — add new numbered migration files.
- Update `.ai/CONTEXT.md` and `.ai/DECISIONS.md` as part of every meaningful commit.

---

## Open Questions (discuss with Tuan before building)

- Should the automation workflow use a real GitHub API call to open the PR and tag the
  reviewer, or is a local demo (branch + draft PR description printed to console)
  sufficient for the teaching scenario?
- For SCRUM-201, should the two branches be worked sequentially (simulate parallel by
  describing what each model would do) or actually opened as two real separate branches
  and merged?
