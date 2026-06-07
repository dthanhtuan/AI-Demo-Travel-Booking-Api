# Demo Scenarios — Presenter Guide

This folder is for the **human presenter**. The AI reads files in the project root (`.ai/`, `AGENTS.md`, `CLAUDE.md`).

## The Four Scenarios

| # | Scenario | Ticket | Time |
|---|----------|--------|------|
| 1 | [Single Dev — New Feature](scenario-1-new-feature.md) | SCRUM-101 | ~5 min |
| 2 | [Single Dev — Bug Fix](scenario-2-bug-fix.md) | SCRUM-102 | ~3 min |
| 3 | [Team — Claude + Gemini in Parallel](scenario-3-team-parallel.md) | SCRUM-201 | ~8 min |
| 4 | [Handoff — Mid-Feature Developer Switch](scenario-4-handoff.md) | SCRUM-201 | ~5 min |

## Before You Start

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run migrate
npm test          # all tests should pass before any demo
```

### Optional — Jira MCP (for live ticket fetching in Scenario 1)

`.claude/settings.json` is **git-ignored** (credentials stay local). A template is
committed at `.claude/settings.example.json`. Copy it and fill in your credentials:

```bash
cp .claude/settings.example.json .claude/settings.json
# then edit .claude/settings.json with your real values
```

Generate a token at: `id.atlassian.com` → Security → API tokens

Without this, Scenario 1 still works using the pre-written ticket in `.ai/tickets/`.

## What the Audience Should See

- The AI reads a structured ticket and acts — no hand-holding prompts.
- The `.ai/` folder is the coordination layer: tickets go in, context and decisions come out.
- `AGENTS.md` shapes how the AI behaves (commit style, test-first, etc.) without you saying it.
- Scenarios 3 and 4 show that two different models can collaborate without stepping on each other.
