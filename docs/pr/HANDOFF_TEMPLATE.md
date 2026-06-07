# Handoff — <TICKET-ID>

> Instructions for the agent writing this handoff:
> - Replace every `<PLACEHOLDER>` with real values.
> - Be specific: name the exact file and method, not just the feature.
> - Delete these instruction lines before committing.
> - Commit message: `chore: handoff notes for <TICKET-ID>`

---

**Date:** <YYYY-MM-DD>
**Developer / Model:** <e.g. Claude — HTTP layer>
**Branch:** `<feat/SCRUM-xxx-short-name>`

---

## What Is Done

List completed work. One bullet per file or function. Be specific.

- `src/<entity>/<file>.ts` — `<methodName>()` implemented and working.
- `tests/<file>.test.ts` — unit tests for <case1>, <case2> passing.

## In Progress

The exact item you were working on when you stopped. Name the file and method.

- `src/<entity>/<file>.ts` — `<methodName>()` scaffolded; <what specifically remains>.

## Not Started

Remaining acceptance criteria from the ticket (copy from the ticket's checklist).

- [ ] <criterion from ticket>
- [ ] <criterion from ticket>
- [ ] Run full test suite (`npm test`)
- [ ] Open Draft PR and assign reviewer from ticket

## Decisions Made

Any choices made during this session that the next developer should know about.
If a shared interface was agreed upon, note it here — it should also be in the ticket file.

- <decision or "none">

## Notes

Anything that would surprise the next developer: gotchas, blocked paths, context
not obvious from the code.

- <note or "none">
