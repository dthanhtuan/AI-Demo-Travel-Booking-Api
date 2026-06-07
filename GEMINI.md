# GEMINI.md — Gemini-Specific Rules

> Extends `AGENTS.md`. Read `AGENTS.md` first — it always wins on conflicts.

## Session Start

1. Read `AGENTS.md`
2. Read the assigned ticket in `.ai/tickets/`
3. Run `npm test` before touching any code

## Working Style

- **Use your large context window deliberately.** Load the full `src/` tree when assessing cross-file impact (e.g. how a `types.ts` change ripples through repository → service → controller). But keep edits surgical — change only what the ticket requires.
- **Plan the diff per file** before editing when a task spans multiple files. State which files change and why.
- **Before changing `src/types.ts`** on a parallel ticket, confirm the interface is defined in the ticket file first.

## Tooling

- Run `npm test` to verify changes — do not report done without a passing suite.
- Follow the existing layered pattern exactly: match the structure of `venue/`, `customer/`, and `booking/` folders.

## Team Coordination (`.ai/` folder)

- `.ai/tickets/` — one file per ticket; contains the Jira details, acceptance criteria, reviewer, shared contract for parallel features, and the handoff block if one exists.

## Bug Fixes

Diagnose before touching code — state the root cause and the affected line(s) first. See the full protocol in `AGENTS.md`.

## Handoff

If stopping mid-task, follow the handoff protocol in `AGENTS.md`:
1. Fill in `docs/pr/HANDOFF_TEMPLATE.md` (copy it, don't edit the template itself).
2. Append the filled-in block to the ticket file under `## Handoff`.
3. Open a Draft PR, commit with `chore: handoff notes for <TICKET-ID>`.

## PR Descriptions

- Follow the PR format in `AGENTS.md` exactly.
- Reference the ticket file for any interface changes.
