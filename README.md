# Travel Booking API

A sample REST API demonstrating **AI-agent team workflows** — how developers using
different AI models (Claude, Gemini, GPT-4o) can collaborate on the same project
without stepping on each other.

Built with: **Node 20 · TypeScript · Express 4 · Postgres 16 · Docker Compose · Jest**

---

## Quick Start

```bash
git clone <your-repo-url>
cd travel-booking-api
cp .env.example .env
docker compose up
```

The API starts on **http://localhost:3000** with seed data already loaded.

To run the test suite (DB must be running):

```bash
docker compose up -d db   # start only Postgres
npm install
npm test
```

---

## Endpoints

### Health
| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | /health   | Returns `{ status: "ok" }` |

### Venues
| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | /venues      | List all venues      |
| GET    | /venues/:id  | Get a venue by id    |

### Customers
| Method | Path            | Description             |
|--------|-----------------|-------------------------|
| GET    | /customers      | List all customers      |
| GET    | /customers/:id  | Get a customer by id    |

### Bookings
| Method | Path           | Description                              |
|--------|----------------|------------------------------------------|
| GET    | /bookings      | List all bookings                        |
| GET    | /bookings/:id  | Get a booking by id                      |
| POST   | /bookings      | Create a booking (see body below)        |

**POST /bookings body:**
```json
{
  "customer_id": 1,
  "venue_id": 2,
  "check_in": "2026-07-01",
  "check_out": "2026-07-05"
}
```

---

## Project Structure

```
AGENTS.md           universal rules for every AI model
CLAUDE.md           Claude-specific context (extends AGENTS.md)
GEMINI.md           Gemini-specific context (extends AGENTS.md)
.ai/
  tickets/
    SCRUM-5.md    new feature ticket (also the automation demo)
    SCRUM-6.md    bug fix ticket
    SCRUM-7.md    team parallel-feature ticket (Claude + Gemini)
src/
  db.ts             pg pool
  migrate.ts        migration runner
  types.ts          shared domain types (the team integration contract)
  venue/            controller · service · repository
  customer/         controller · service · repository
  booking/          controller · service · repository
  routes.ts
  server.ts
migrations/
  001_init.sql      schema + seed data
tests/
  setup.ts          runs migrations before tests
  booking.service.test.ts
docs/
  pr/
    HANDOFF_TEMPLATE.md   template for mid-task handoff notes
```

---

## Scenarios

| # | Scenario | Ticket | Guide |
|---|----------|--------|-------|
| 1a | Single Dev — New feature, auto PR | SCRUM-5 | `step_to_demo/scenario-1a-new-feature-auto-pr.md` |
| 1b | Single Dev — New feature, local only | SCRUM-5 | `step_to_demo/scenario-1b-new-feature-local.md` |
| 2 | Single Dev — Bug fix | SCRUM-6 | `step_to_demo/scenario-2-bug-fix.md` |
| 3 | Dev Team — Claude + Gemini in parallel | SCRUM-7 | `step_to_demo/scenario-3-team-parallel.md` |
| 4 | Handoff — Mid-feature developer switch | SCRUM-7 | `step_to_demo/scenario-4-handoff.md` |
| 5 | Full automation — Jira to AI to PR to review loop | SCRUM-8 | `step_to_demo/scenario-5-auto-pr-creation-from-jira-dashboard.md` |

See `.ai/tickets/` for the full spec of each ticket.

---

## Automate Ticket to Pull Request

Two ways to let the AI agent open a Pull Request without manual prompting.

### Auto from Local

The developer runs Claude Code locally and includes the PR instruction in the prompt.
No CI/CD setup needed — works out of the box with `gh` CLI.

```
Implement ticket SCRUM-5 and open a PR
```

Claude reads the ticket, creates the branch, implements, runs tests, pushes, and opens a draft PR.
See `step_to_demo/scenario-1a-new-feature-auto-pr.md` for the full walkthrough.

### Auto from Jira Dashboard via GitHub Workflow

The developer changes a ticket's state (or assigns it to the AI Agent) on the Jira board.
A webhook fires automatically — no local terminal involved.

| Stage | What happens |
|-------|-------------|
| 1. Jira ticket labeled `AI-Agent` and moved to *In Progress* | Jira Automation fires |
| 2. Webhook | Jira sends ticket payload to GitHub Actions |
| 3. GitHub Actions | Aider reads `AGENTS.md`, implements, opens draft PR |
| 4. Engineer submits review comments tagged `/ai-agent` | GitHub Actions fires again |
| 5. GitHub Actions | Aider reads the comments, fixes code, pushes again |

Requires two GitHub Actions workflows and a Jira Automation webhook rule.
See `step_to_demo/scenario-5-auto-pr-creation-from-jira-dashboard.md` for the full setup.

---

## The `.ai/` Protocol

The `.ai/` folder is **team infrastructure tracked in git** — not personal notes.

- `tickets/TICKET-ID.md` — one file per ticket. Contains the Jira details, acceptance
  criteria, reviewer, shared interface contract for parallel features, and the handoff
  block when a developer stops mid-task.

See `AGENTS.md` for the full protocol rules and `docs/handoff-protocol.md` for the
handoff workflow.

---

## Author

Tuan Dao — tuan.dao@trustifytechnology.com — Trustify Technology
