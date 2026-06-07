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
    SCRUM-101.md    new feature ticket (also the automation demo)
    SCRUM-102.md    bug fix ticket
    SCRUM-201.md    team parallel-feature ticket (Claude + Gemini)
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

## Demo Scenarios

This repo is the sample codebase for four AI-agent workflow scenarios:

| # | Guide       | Scenario                            | Ticket     |
|---|-------------|-------------------------------------|------------|
| 1 | Single Dev  | Implement a new feature             | SCRUM-101  |
| 2 | Single Dev  | Fix a bug on an existing project    | SCRUM-102  |
| 3 | Dev Team    | Claude + Gemini in parallel         | SCRUM-201  |
| 4 | Automation  | Jira ticket → AI → PR → reviewer    | SCRUM-101  |

See `.ai/tickets/` for the full spec of each scenario.

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
