# Scenario 5 — Full Automation: Jira Ticket to AI Agent to PR to Auto-Fix

**Trigger:** Jira ticket state change and assignment to AI Agent
**Tool:** Aider (runs on GitHub Actions runner, reads `AGENTS.md`)

---

## The Story

A developer creates a Jira ticket, assigns it to the AI Agent `AND` moves it to *In Progress*.
From that point, no human types a single line of code. The system:
1. Sends the ticket payload to GitHub via web request
2. Spins up a runner, runs Aider, and opens a draft PR
3. When the engineer submits review comments, Aider reads them and pushes fixes — automatically

---

## Overall Architecture

| Stage                        | What happens                                                                   |
|------------------------------|--------------------------------------------------------------------------------|
| **1. Jira Ticket**           | Developer changes state and assigns to AI Agent                                |
| **2. Web Request**           | Jira sends ticket payload to GitHub API                                        |
| **3. Workflow 1: Create PR** | Runner starts Aider, reads `AGENTS.md`, opens draft PR                         |
| **4. Engineer Review**       | Engineer reads the diff and writes review comments tagged `/ai-agent`          |
| **5. Workflow 2: Fix PR**    | Engineer submits review, runner scrapes comments, Aider edits and pushes again |

---

## Prerequisites

### 1 — Anthropic API Key (used by Aider on the runner)

> **Claude Pro (claude.ai) does not include API access.** They are separate products with separate billing.

For this demo we use **Claude** via the Anthropic API:

1. Sign up at `console.anthropic.com` (separate from your claude.ai account)
2. Go to **API Keys > Create Key** and copy the value
3. Add it to GitHub: **repo > Settings > Secrets and variables > Actions > New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key

### 2 — GitHub Personal Access Token (used by Jira to call the GitHub API)

1. Go to **GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens**
2. Click **Generate new token**, scope it to **only this repository**, and set these **Repository permissions**:
   - **Contents** — Read and Write (push code, trigger `repository_dispatch`)
   - **Pull requests** — Read and Write (open PRs, read review comments)
3. Copy the token value
4. Add it to GitHub: **repo > Settings > Secrets and variables > Actions > New repository secret**
   - Name: `GH_PAT`
   - Value: your token
5. Also store it in Jira: **Project Settings > Automation > Secrets > Create secret**
   - Name: `GH_PAT`
   - Value: same token
6. Reference it in the Jira Automation rule as `{{secrets.GH_PAT}}`

> **Security note — demo vs production:**
>
> For this demo, the same `GH_PAT` is stored in both GitHub (for the runner) and Jira (for the webhook trigger). This is a convenience shortcut — **do not do this in production**. The Jira secret only needs permission to call `repository_dispatch`; the GitHub secret needs push and PR access. Sharing one token across both surfaces means a leaked Jira secret can push code. Before going to production, split into two separate tokens (or replace with a GitHub App).
>
> **We will revoke `GH_PAT` after the demo.**
>
> | Option                           | Best for          | Downside                                                                                                     |
> |----------------------------------|-------------------|--------------------------------------------------------------------------------------------------------------|
> | **Fine-grained PAT** (used here) | Demo, single repo | Scoped to one repo only — but shared across Jira and GitHub is a security risk                               |
> | **Classic PAT**                  | Quick setup       | Wide scope (`repo`) — avoid for shared or production use                                                     |
> | **GitHub App**                   | Teams, production | Best security and auto-rotation, but requires registering an app and handling token exchange in the workflow |

---

## Step 1 — Configure the Automation Rule on Jira Cloud

Navigate to **Project Settings > Automation > Create rule**.

- **WHEN (Trigger):** Issue transitions (status moves to *In Progress*) `AND` Issue assigned to a specific user
  > No dedicated AI Agent email yet? Use your personal Jira account as the assignee for now.
- **IF (Condition):** Issue fields condition — Labels — contains — `AI-Agent`
  > Add this label to any ticket you want the automation to trigger on.
- **THEN (Action):** Send web request

| Field                | Value                                                        |
|----------------------|--------------------------------------------------------------|
| URL                  | `https://api.github.com/repos/YOUR_ORG/YOUR_REPO/dispatches` |
| HTTP method          | `POST`                                                       |
| Web request body     | `Custom data`                                                |
| Content-type         | `application/json`                                           |
| Authorization header | `Bearer {{secrets.GH_PAT}}`                              |

**Custom data (payload):**
```json
{
  "event_type": "jira-ticket-assigned",
  "client_payload": {
    "ticket_id": "{{issue.key}}",
    "ticket_title": "{{issue.summary}}"
  }
}
```

> Only pass `ticket_id` and `ticket_title` — avoid embedding `{{issue.description}}` directly as descriptions break JSON parsing.
> `event_type` is required by the GitHub `repository_dispatch` API. `client_payload` is accessible in the workflow via `github.event.client_payload`.

---

## How the Trigger Flow Works

```
┌─────────────────────────────┐
│         JIRA CLOUD          │
│                             │
│  Ticket moves to            │
│  "In Progress" + assigned   │
│                             │
│  Automation Rule fires      │
│  "Send web request"         │
└────────────┬────────────────┘
             │
             │  POST https://api.github.com/repos/ORG/REPO/dispatches
             │  Authorization: Bearer {{secrets.GH_PAT}}
             │  Body: { event_type, client_payload: { ticket_id, ticket_title } }
             │
             ▼
┌─────────────────────────────┐
│        GITHUB API           │
│                             │
│  Validates the Bearer PAT   │
│  Accepts the request        │
│  Fires: repository_dispatch │
│  event_type: jira-ticket-   │
│            assigned         │
└────────────┬────────────────┘
             │
             │  Triggers workflow
             │
             ▼
┌─────────────────────────────┐
│      GITHUB ACTIONS         │
│                             │
│  ai-agent-create-pr.yml     │
│                             │
│  1. Extract ticket fields   │
│  2. Checkout code           │
│  3. Create branch           │
│  4. Run Aider (Claude)      │
│  5. Push + open draft PR    │
└─────────────────────────────┘
```

---

## GitHub Secrets Required

Add these in **repo > Settings > Secrets and variables > Actions > New repository secret** before setting up the workflows.

| Secret              | Where to add                    | Purpose                                                                              |
|---------------------|---------------------------------|--------------------------------------------------------------------------------------|
| `ANTHROPIC_API_KEY` | GitHub repo secrets             | Aider's model backend                                                                |
| `JIRA_BASE_URL`     | GitHub repo secrets             | e.g. `https://yourcompany.atlassian.net`                                             |
| `JIRA_USER_EMAIL`   | GitHub repo secrets             | Your Jira account email                                                              |
| `JIRA_API_TOKEN`    | GitHub repo secrets             | Jira API token (from `id.atlassian.com/manage-profile/security/api-tokens`)          |
| `GH_PAT`            | GitHub repo secrets             | Push code, create PRs, and call GitHub API from the runner                           |

---

## Step 2 — Workflow 1: Auto-Code and Create a PR

Create `.github/workflows/ai-agent-create-pr.yml` in the repository.

When Jira sends the web request, this workflow fires, runs Aider with the ticket details, and opens a draft PR.

```yaml
name: "AI Agent: Create PR from Jira"

on:
  repository_dispatch:
    types: [jira-ticket-assigned]

jobs:
  create_pull_request:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Jira fields from payload
        id: jira
        run: |
          echo "ticket_id=${{ github.event.client_payload.ticket_id }}" >> $GITHUB_OUTPUT
          echo "ticket_title=${{ github.event.client_payload.ticket_title }}" >> $GITHUB_OUTPUT

      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Git User
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Create New Branch
        run: git checkout -b feature/${{ steps.jira.outputs.ticket_id }}

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Cache pip packages
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-aider-${{ hashFiles('**/requirements*.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-aider-

      - name: Install Aider
        run: pip install aider-chat

      - name: Fetch full ticket from Jira
        id: ticket
        env:
          JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
          JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        run: |
          TICKET_ID="${{ steps.jira.outputs.ticket_id }}"
          curl -s \
            -u "${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}" \
            -H "Accept: application/json" \
            "${JIRA_BASE_URL}/rest/api/3/issue/${TICKET_ID}" \
            > ticket_raw.json

          # Extract description text from Atlassian Document Format
          jq -r '
            .fields.description.content[]?.content[]?.text // empty
          ' ticket_raw.json | tr '\n' ' ' > ticket_description.txt

      - name: Run Aider
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          DESCRIPTION=$(cat ticket_description.txt)
          aider --architect --yes --no-pretty \
            --model claude-sonnet-4-5 \
            --message "Ticket ID: ${{ steps.jira.outputs.ticket_id }}. \
            Title: ${{ steps.jira.outputs.ticket_title }}. \
            Description: ${DESCRIPTION}. \
            MANDATORY: Read AGENTS.md and follow all architecture, naming, and \
            testing conventions before modifying any file." \
            > aider.log 2>&1 || { cat aider.log; exit 1; }

          echo "=== Aider completed ==="
          tail -20 aider.log

      - name: Push Code and Create Pull Request
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git push origin feature/${{ steps.jira.outputs.ticket_id }}
          gh pr create \
            --title "[${{ steps.jira.outputs.ticket_id }}] ${{ steps.jira.outputs.ticket_title }}" \
            --body "PR generated automatically by AI Agent from Jira Ticket: ${{ steps.jira.outputs.ticket_id }}." \
            --base main \
            --head feature/${{ steps.jira.outputs.ticket_id }} \
            --draft
```

---

## Step 3 — Workflow 2: Auto-Read Reviews and Fix the PR

Create `.github/workflows/ai-agent-fix-pr.yml`.

This workflow handles both review patterns:
- **Batch submit** — reviewer drops many comments at once via *Start a review* then *Submit review*
- **Single comment** — reviewer replies on a single line or an outdated thread

```yaml
name: "AI Agent: Auto-Fix PR from Review Comments"

on:
  # Scenario A: Reviewer clicks "Submit Review" — batch of many comments at once
  pull_request_review:
    types: [submitted]

  # Scenario B: Reviewer drops a single comment or replies on an existing thread
  pull_request_review_comment:
    types: [created]

jobs:
  auto_fix_review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.ref }}
          fetch-depth: 0

      - name: Setup Git User
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Cache pip packages
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-aider-${{ hashFiles('**/requirements*.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-aider-

      - name: Install Aider
        run: pip install aider-chat

      - name: Extract Review Comments
        id: collect_feedback
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          if [ "${{ github.event_name }}" = "pull_request_review" ]; then
            # Batch: scrape all comments tied to this Review ID
            gh api repos/${{ github.repository }}/pulls/${{ github.event.pull_request.number }}/reviews/${{ github.event.review.id }}/comments \
              --jq '.[].body' > feedback.txt
          else
            # Single comment or reply
            echo "${{ github.event.comment.body }}" > feedback.txt
          fi
          cat feedback.txt

      - name: Check for AI Agent Mention
        id: check_mention
        run: |
          if grep -q "/ai-agent" feedback.txt; then
            echo "should_run=true" >> $GITHUB_OUTPUT
          else
            echo "should_run=false" >> $GITHUB_OUTPUT
          fi

      - name: Run Aider Fix
        if: steps.check_mention.outputs.should_run == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          ALL_FEEDBACK=$(cat feedback.txt)
          aider --architect --yes --no-pretty \
            --model claude-sonnet-4-5 \
            --message "A reviewer left feedback requesting code changes. \
            First read AGENTS.md at the workspace root to ensure changes align \
            with project standards. Then implement the following edits:

            === REQUESTED EDITS ===
            $ALL_FEEDBACK
            ======================" \
            > aider.log 2>&1 || { cat aider.log; exit 1; }

          echo "=== Aider completed ==="
          tail -20 aider.log

      - name: Push Updated Code
        if: steps.check_mention.outputs.should_run == 'true'
        run: |
          git push origin ${{ github.event.pull_request.head.ref }}
```

---

## How the Review Loop Works

1. PR is opened as **Draft** — engineer opens it, reads the diff
2. Engineer clicks **Start a review**, adds comments on specific lines, tags `/ai-agent` where a fix is needed
3. Engineer clicks **Submit Review** — Workflow 2 fires, Aider reads all comments in that batch, fixes code, pushes
4. GitHub updates the PR automatically — engineer refreshes and reviews the new diff
5. Repeat as many times as needed — each **Submit Review** triggers a fresh run scoped to only the new comments

---

