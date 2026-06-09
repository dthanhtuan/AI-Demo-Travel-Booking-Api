# CLAUDE.md — Claude-Specific Rules

> Extends `AGENTS.md`. Read `AGENTS.md` first — it always wins on conflicts.

## Session Start

1. Read `AGENTS.md`
2. Follow the "When Implementing a Ticket" section in `AGENTS.md` for ticket fetch and PR steps.
3. Run `npm test` before touching any code

## Working Style

- **Plan before editing.** For any non-trivial task, state which files you will touch and why before making changes.
- **Smallest change first.** Satisfy the ticket's acceptance criteria — nothing more.
- **Before changing `src/types.ts`** on a parallel ticket, confirm the interface is defined in the ticket file first.
- Use sub-agents for independent lookups (e.g. researching a file while drafting a plan) to keep the main context clean.

## Tooling

- Run `npm test` yourself — do not ask the user to run it.
- After implementing, report test coverage and what changed.

## Bug Fixes

Diagnose before touching code — state the root cause and the affected line(s) first. See the full protocol in `AGENTS.md`.

## Handoff

If stopping mid-task, follow the handoff protocol in `AGENTS.md`:
1. Fill in `docs/pr/HANDOFF_TEMPLATE.md` (copy it, don't edit the template itself).
2. Append the filled-in block to the ticket file under `## Handoff`.
3. Open a Draft PR, commit with `chore: handoff notes for <TICKET-ID>`.

## PR Descriptions

- Keep the summary concise. Put technical detail in the ticket file, not the PR body.
- Follow the PR format in `AGENTS.md` exactly.
