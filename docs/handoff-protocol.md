# The Handoff Protocol

A handoff happens whenever a developer stops working on a feature mid-way and another
developer — potentially using a different AI model — needs to continue. Without a proper
handoff, the incoming developer and their model must re-discover everything from scratch,
wasting hours and risking inconsistent decisions.

The handoff protocol is a set of mandatory steps the outgoing developer must complete
before moving on. It takes approximately 10–15 minutes and saves hours for the incoming
developer.

---

## Scenario: Dev1 (Claude) hands off to Dev2 (Gemini)

Dev1 has been working on a feature using Claude Code. An urgent task arrives. Dev2 — who
uses Gemini — needs to continue without any interruption to the team's velocity.

---

### Step 1 — Dev1: Fill in the handoff template

Copy `docs/pr/HANDOFF_TEMPLATE.md` and fill in every section — not what you planned to
do, not what you started, but what is **actually done**, what is **in progress** (exact
file and method name), and what is **not started** (remaining acceptance criteria from
the ticket).

Append the completed block to the ticket file (`.ai/tickets/TICKET-ID.md`) under a
`## Handoff` heading. The ticket is now the single source of truth: spec, contract,
and current state all in one place.

---

### Step 2 — Dev1: Commit with passing tests

Never hand off with a failing test suite. If you cannot get tests to pass before
switching, document exactly which tests are failing and why in the handoff block —
but strive for green. Tests are the model-agnostic contract the next model can trust
without reading your conversation history.

Commit message: `chore: handoff notes for <TICKET-ID>`

---

### Step 3 — Dev1: Open a Draft PR

Push the WIP branch and open a Draft PR. Follow the PR format defined in `AGENTS.md`.

---

### Step 4 — Dev2: Start the new session correctly

Dev2 opens a new session with their model. The session must begin by loading the
project's shared context files **before touching any code**.

**Dev2 session start prompt:**

```
Load AGENTS.md and GEMINI.md. Then read .ai/tickets/<TICKET-ID>.md — pay attention
to the Handoff section at the bottom. Read the Draft PR description for the branch.
Then run the test suite and confirm its current state. Do not write any code until
you have confirmed your understanding of where this feature currently stands.
```

---

## Why this works across models

The handoff protocol is model-agnostic by design. Dev2 does not need access to Dev1's
conversation history, IDE, or tool setup. Everything required to continue is committed
to the repository:

| What Dev2 needs | Where it lives |
|---|---|
| Project rules and conventions | `AGENTS.md` + `GEMINI.md` |
| Ticket spec, acceptance criteria, and handoff notes | `.ai/tickets/<TICKET-ID>.md` |
| WIP code and test state | the feature branch |
| PR description | Draft PR on the branch |

---

## The Summarize-and-Restart Pattern

When a session grows long and the model starts losing coherence or forgetting earlier
decisions, use this pattern to reset without losing progress:

1. Ask the model: *"Summarize all decisions made, the current state of the feature,
   all files modified, and the next steps. Fill in `docs/pr/HANDOFF_TEMPLATE.md` with
   this information."*
2. Review the output, then append it to `.ai/tickets/TICKET-ID.md` under `## Handoff`.
3. Commit the update.
4. Open a fresh session with your model.
5. Load `AGENTS.md`, your model-specific file, and `.ai/tickets/TICKET-ID.md` as your
   starting context.
6. Continue with a full context budget and a clean, accurate state.

This pattern can be used proactively — not just when things go wrong. Long-running
features benefit from a mid-session restart every few hours of work.
