# AGENTS.md — Universal Rules for All AI Agents

> This file is read by **every** AI model working on this project (Claude, Gemini,
> GPT-4o, Cursor, etc.). Model-specific files (`CLAUDE.md`, `GEMINI.md`) **extend**
> these rules — they never override them. If a model-specific file contradicts this
> file, this file wins.

## Project

Travel Booking API — a small Node + Express + TypeScript service backed by Postgres.
Three entities: **Venue**, **Customer**, **Booking**.

## Stack

- Runtime: Node 20, TypeScript (strict mode)
- Web: Express 4
- DB: Postgres 16, accessed with `pg` (no ORM — SQL is intentionally visible)
- Tests: Jest + ts-jest + supertest
- Local dev: Docker Compose (`app` + `db`)

## How to Run

```bash
cp .env.example .env
docker compose up            # starts Postgres + app, runs migrations, API on :3000
docker compose up -d db      # start only the DB (e.g. for running tests locally)
npm test                     # run the Jest suite (needs the DB running)
```

## Repository Layout

```
src/
  db.ts                 pg pool + query helper
  migrate.ts            runs migrations/*.sql in order
  types.ts              SHARED domain contract — see rule below
  venue/                venue.repository.ts | service.ts | controller.ts
  customer/             customer.repository.ts | service.ts | controller.ts
  booking/              booking.repository.ts | service.ts | controller.ts
  routes.ts             mounts all routers
  server.ts             express app + listen
migrations/             SQL migrations (numbered, run in order)
tests/                  Jest tests
.ai/                    shared AI context (see below)
```

## Layered Architecture (follow this pattern for every entity)

```
controller  ->  service  ->  repository  ->  db
(HTTP)          (rules)      (SQL)           (pg)
```

- **Controller**: parse/validate request shape, call service, map errors to HTTP codes. No SQL, no business logic.
- **Service**: business rules and validation. Throws `ValidationError` for bad input. No HTTP, no raw SQL.
- **Repository**: SQL only. Returns plain domain objects. No business rules.

## Coding Conventions

- TypeScript strict mode — no `any` unless unavoidable, and justify it in a comment.
- File naming: `entity.layer.ts` (e.g. `booking.service.ts`).
- One entity per folder under `src/`.
- Errors the user caused -> `ValidationError` -> HTTP 400. Missing resource -> HTTP 404.
- Keep functions small and named by intent.

## Forbidden Actions (NEVER do these)

- **Never** edit existing files in `migrations/`. Migrations are immutable once committed. Add a new numbered file instead.
- **Never** push directly to `main`. Always work on a `feat/TICKET-ID` branch and open a PR.
- **Never** commit `.env` or real secrets.
- **Never** `npm install` a new dependency without noting it in the PR description.

## The Shared Contract Rule (critical for parallel work)

`src/types.ts` is the **integration point** between layers and between developers.

For parallel tickets: the ticket file (`.ai/tickets/TICKET-ID.md`) defines the shared
interface and ownership split. Both developers read the ticket, agree on the contract,
then each builds their layer independently against it. Only one developer adds the
interface to `src/types.ts`.

## Bug Fix Rules

1. **Diagnose before touching code.** State the root cause — which file, which line, why it's wrong — before making any edit. Compare with a working equivalent in the codebase if one exists.
2. Write the regression test first (it must fail on the unfixed code).
3. Make the minimal change that fixes the root cause. Do not refactor surrounding code.
4. Run `npm test` and confirm the regression test now passes.

## Testing Rules

- Every new service function gets a unit test.
- Every bug fix gets a regression test that fails before the fix and passes after.
- Target: keep service-layer coverage above 85%.
- Tests must pass (`npm test`) before opening or updating a PR.

## Pull Request Rules

Every PR description must include:

1. **Summary** — what and why, current state (Draft / ready).
2. **What is done** — bulleted, with file references.
3. **What is NOT done** — if WIP.
4. **Test coverage** — what was added, current state.
5. **Files modified** — each with a one-line reason.
6. **API / interface changes** — anything touching `types.ts` or an endpoint shape.
7. **Open questions** — tag the right person.
8. **Reviewer** — taken from the ticket file.

## The `.ai/` Folder (shared team memory — tracked in git)

- `.ai/tickets/TICKET-ID.md` — one file per ticket. Contains the Jira ticket details,
  acceptance criteria, reviewer, shared interface contract for parallel features, and
  the handoff block when a developer stops mid-task.

**Rule:** Do NOT create any other files under `.ai/`. All ticket context, contracts, and
handoff notes belong inside the ticket file itself.

## Handoff Protocol

When stopping mid-task (end of session, handing off to another developer or model):

1. Copy `docs/pr/HANDOFF_TEMPLATE.md` and fill it in — every section, specific file and method names.
2. Append the completed handoff block to the ticket file (`.ai/tickets/TICKET-ID.md`) under a `## Handoff` heading.
3. Open a **Draft PR** on your branch.
4. Commit with message: `chore: handoff notes for <TICKET-ID>`.

When **picking up** a handoff: read the ticket file first — it contains both the spec and the handoff block. Confirm the state matches the branch, then continue.

## When Implementing a Ticket

Follow these steps whenever you are asked to implement a ticket (e.g. "Implement ticket SCRUM-5", "Implement SCRUM-5 and open a PR"):

1. **Fetch the ticket from Jira** using the `jira` MCP tool (`jira_get_issue` with the ticket ID).
   - If `.ai/tickets/<TICKET-ID>.md` already exists, read it instead — a parallel developer may have added a shared interface contract.
   - After fetching, save the ticket details to `.ai/tickets/<TICKET-ID>.md` so the team can reference it.
2. **Run `npm test`** to confirm the baseline before touching any code.
3. **State your plan** — which files you will touch and why — before making any edits.
4. **Implement** following the layered architecture and coding conventions in this file.
5. **Run `npm test`** again and confirm all tests pass.
6. **If asked to open a PR:**
   a. Push the branch: `git push -u origin <branch-name>`
   b. Create a draft PR:
      ```
      gh pr create \
        --title "[TICKET-ID] <ticket title>" \
        --body "<PR body following the Pull Request Rules below>" \
        --base main \
        --head <branch-name> \
        --draft
      ```
   c. Output the PR URL.
   - The reviewer is taken from the ticket (`- **Reviewer:**` field).

## Session Start Checklist (every model, every session)

1. Read this file (`AGENTS.md`).
2. Read your model-specific file (`CLAUDE.md` or `GEMINI.md`).
3. Run `npm test` to confirm the current state before changing anything.
