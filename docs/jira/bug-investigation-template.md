# Jira Template: Bug Investigation (Agent-assigned)

Use this template when filing a bug that will be picked up and investigated by an AI agent.

**Key rule:** Do NOT pre-fill the Root Cause section. Leave it blank — the agent fills it in after investigation as the first thing it does before touching code.

---

## Template

```
# <TICKET-ID>: <Short description of the symptom>

## Type
Bug

## Description
<1–3 sentences describing the observable problem from a user or client perspective.
What is happening? What should happen instead?>

## Steps to Reproduce
1. <Exact step>
2. <Exact step>
3. Observe: <actual result>
4. Expected: <expected result>

## Environment
- Endpoint / Component: <e.g. GET /venues/:id>
- Affected version / branch: <e.g. main as of 2026-06-07>

## Acceptance Criteria
- [ ] <Specific, verifiable outcome — not "it should work">
- [ ] <Edge case covered>
- [ ] Regression test added that fails before the fix and passes after.

## Affected Area (known)
<List files, services, or layers suspected — keep it broad if unsure.
Do NOT point to a specific line; that is the agent's job.>

## Constraints / Non-goals
- <What the fix must NOT change>
- <What is explicitly out of scope>

## Reviewer
@<github-handle>
```

---

## Example (filled in)

```
# SCRUM-6: GET /venues/:id returns 200 + null for missing venues

## Type
Bug

## Description
When a client requests a venue that does not exist, the API responds with
HTTP 200 and a body of null instead of a proper 404. This breaks clients
that rely on the status code to detect "not found".

## Steps to Reproduce
1. Start the API: docker compose up
2. curl -i http://localhost:3000/venues/999999
3. Observe: status 200 OK, body null
4. Expected: status 404 Not Found, body { "error": "Venue not found" }

## Environment
- Endpoint: GET /venues/:id
- Affected branch: main

## Acceptance Criteria
- [ ] GET /venues/:id for a missing id returns HTTP 404.
- [ ] Response body is { "error": "Venue not found" }.
- [ ] Valid id still returns 200 + venue object (no regression).
- [ ] Regression test added that fails before the fix and passes after.

## Affected Area (known)
- src/venue/ (controller, service, or repository — to be narrowed by agent)
- tests/

## Constraints / Non-goals
- Do not change the service or repository layer if the fix is in the controller.

## Reviewer
@backend-lead
```
