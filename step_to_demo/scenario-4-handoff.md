# Scenario 4 — Handoff: Mid-Feature Developer Switch

**Ticket:** SCRUM-7 (same feature as Scenario 3)
**Branch:** `feat/SCRUM-7-cancel-http` (Claude's branch, left mid-way)

---

## The Story

A developer starts implementing SCRUM-7 and gets pulled away mid-task. A second
developer (using a different model) picks up the work cold — in a brand new session,
with no shared memory. They rely entirely on the `.ai/` files to understand the state
and continue without losing context.

This demonstrates why the `.ai/` protocol exists: it makes the work **model-agnostic
and session-agnostic**.

---

## Setup

Run Scenario 3 (Session B — Claude) but **stop it halfway through** — after the
controller is scaffolded but before the integration tests are written. Then ask Claude
to produce a handoff note.

---

## What to Show

### Step 1 — Dev 1 (Claude) produces the handoff

**Prompt:**
```
I need to stop here. Update .ai/CONTEXT.md with exactly what is done, what is
in progress, and what still needs doing on this branch. Be specific about file
names and method names. Then commit the update.
```

Show the audience the updated `CONTEXT.md`:
> "This is the handoff document. It lives in the repo, not in someone's head or Slack."

---

### Step 2 — Dev 2 (Gemini) starts fresh

Open a **brand new session** (clear context). Give Gemini this prompt:

```
Read AGENTS.md, GEMINI.md, .ai/CONTEXT.md, .ai/DECISIONS.md, and
.ai/tickets/SCRUM-7.md. Summarize what has been done and what remains,
then continue the work on branch feat/SCRUM-7-cancel-http.
```

Watch Gemini:
1. Read the context files
2. Report back exactly what was done and what's left (without you telling it)
3. Continue from where Claude stopped

---

## What the Audience Should See

| Without `.ai/` protocol                 | With `.ai/` protocol           |
|-----------------------------------------|--------------------------------|
| Dev 2 starts from scratch               | Dev 2 picks up in minutes      |
| Needs a Slack thread or verbal briefing | All context is in the repo     |
| Tied to one model/tool                  | Any model reads the same files |
| Context lost when session ends          | Context is committed to git    |

---

## Talking Points

- **The handoff is just a commit.** No tickets updated manually, no Slack messages —
  the AI writes its own handoff note into the repo.
- **Any model can continue.** Gemini picks up Claude's branch because it reads the
  same `AGENTS.md` and `CONTEXT.md`. The work is in the files, not in the model.
- **This scales to human handoffs too.** A human developer joining the project follows
  the same session-start checklist in `AGENTS.md`.
