# Jira MCP Skill

Use the `jira` MCP server to read and interact with Jira tickets directly.
The server is configured in `.claude/settings.json` for this project.

## When to use this skill

- User asks to "read", "fetch", "pull", or "load" a Jira ticket
- Session start: load the assigned ticket from `.ai/tickets/` OR fetch it live from Jira
- User references a ticket ID (e.g. SCRUM-101, PROJ-42)

## Available Jira Tools

### Reading tickets

| Tool                 | What it does                                                                                            |
|----------------------|---------------------------------------------------------------------------------------------------------|
| `read_jira_issue`    | Fetch a single ticket by ID — returns title, description, status, assignee, labels, acceptance criteria |
| `search_jira_issues` | JQL search — use to find tickets by project, sprint, status, assignee                                   |
| `list_jira_projects` | List all accessible Jira projects                                                                       |

### Current user & assignments

| Tool | What it does |
|---|---|
| `get_jira_current_user` | Who the authenticated user is |
| `get_my_unresolved_issues` | All open tickets assigned to me |
| `get_my_current_sprint_issues` | My tickets in the active sprint |

### Boards & sprints

| Tool | What it does |
|---|---|
| `list_agile_boards` | List all Scrum/Kanban boards |
| `list_sprints_for_board` | Sprints for a given board ID |
| `get_sprint_details` | Details of a specific sprint |

### Writing (use with caution)

| Tool | What it does |
|---|---|
| `create_jira_issue` | Create a new ticket |
| `add_jira_comment` | Add a comment to a ticket |

## Common usage patterns

### Load a specific ticket
```
Use read_jira_issue with issue_key: "SCRUM-101"
```

### Search for tickets in a project
```
Use search_jira_issues with jql: "project = SCRUM AND sprint in openSprints()"
```

### Session start — fetch ticket before coding
When starting work on a ticket, call `read_jira_issue` to get the full description
and acceptance criteria, then save the relevant content to `.ai/tickets/TICKET-ID.md`.

## Notes

- Requires `ATLASSIAN_API_TOKEN`, `ATLASSIAN_EMAIL`, `ATLASSIAN_DOMAIN` in `.claude/settings.json`
- Read-only tools (`read_jira_issue`, `search_jira_issues`) are safe to call freely
- Write tools (`create_jira_issue`, `add_jira_comment`) require explicit user instruction
