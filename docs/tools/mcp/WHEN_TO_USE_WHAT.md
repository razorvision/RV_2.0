# MCP Servers: When to Use What

This guide helps you choose the right MCP server for your task. Each server excels at specific use cases—using the right tool makes your workflow significantly faster.

## Quick Decision Matrix

| Task | Use This | Alternative | Why |
|------|----------|-------------|-----|
| **Test login flow** | Playwright | Manual testing | Automated, repeatable, screenshot proof |
| **Take UI screenshot** | Playwright | Browser dev tools | Integrated into workflow, version controlled |
| **Look up React hooks docs** | Context7 | Google search | Current, accurate API docs |
| **Create GitHub issue** | GitHub MCP or `gh` CLI | Web interface | Faster, scriptable, integrated |
| **Search web for recent news** | Brave Search | Manual Google | Current info beyond Claude's knowledge |
| **Query local database** | SQLite MCP | DB client | Integrated analysis, no context switching |
| **Query production DB** | PostgreSQL MCP | psql/DB client | Analysis + code changes in one session |
| **Update Jira ticket** | Atlassian MCP | Web interface | Faster, linked to commits |
| **Read files outside project** | Filesystem MCP | Manual file access | Automated access to configs, logs |

---

## Detailed Decision Trees

### 1. Browser & UI Tasks

```
Need to interact with a browser?
│
├─ Taking a screenshot of UI changes?
│  └─→ Playwright MCP
│     Example: "Take a screenshot of the dashboard after my changes"
│
├─ Testing a user flow (login, checkout, etc.)?
│  └─→ Playwright MCP
│     Example: "Test the checkout flow and verify the confirmation page"
│
├─ Debugging visual issues?
│  └─→ Playwright MCP
│     Example: "Navigate to /profile and show me what the layout looks like"
│
└─ Automated E2E testing?
   └─→ Playwright Test Suite (not MCP)
      Use: `npx playwright test`
```

**When NOT to use Playwright MCP:**
- Writing formal E2E tests → Use Playwright test runner
- Simple visual checks → Open browser manually
- Long-running monitoring → Use dedicated monitoring tools

---

### 2. Documentation & Learning

```
Need documentation or code examples?
│
├─ Looking up library/framework docs?
│  └─→ Context7 MCP
│     Example: "Show me Next.js App Router documentation"
│
├─ Finding code examples?
│  └─→ Context7 MCP
│     Example: "Give me Prisma transaction examples"
│
├─ Checking API syntax?
│  └─→ Context7 MCP
│     Example: "What's the signature for React.useEffect?"
│
├─ Recent news or trends?
│  └─→ Brave Search MCP
│     Example: "Search for React 19 release notes"
│
└─ Internal team documentation?
   └─→ Filesystem MCP (if docs stored externally)
      Example: "Read ~/team-docs/api-guidelines.md"
```

**When NOT to use Context7:**
- Your own project code → Use Read/Grep tools
- Internal proprietary docs → Use Filesystem MCP
- Very recent announcements → Use Brave Search

---

### 3. Version Control & GitHub

```
Need to interact with GitHub?
│
├─ Creating/viewing issues?
│  ├─→ GitHub MCP (programmatic)
│  │  Example: "Create an issue for this bug with label 'high-priority'"
│  └─→ gh CLI (quick terminal)
│     Example: `gh issue create --title "Bug: Login timeout"`
│
├─ Managing pull requests?
│  ├─→ GitHub MCP (detailed operations)
│  │  Example: "Get all PRs with label 'bug' and show their status"
│  └─→ gh CLI (interactive)
│     Example: `gh pr create --fill`
│
├─ Searching code across repos?
│  └─→ GitHub MCP
│     Example: "Search for authentication code in all our repos"
│
└─ Repo administration (create repo, manage settings)?
   └─→ GitHub MCP
      Example: "Create a new repository 'my-project' with MIT license"
```

**When to use gh CLI vs. GitHub MCP:**

| Use gh CLI | Use GitHub MCP |
|------------|----------------|
| Interactive workflows | Programmatic automation |
| Quick one-off commands | Complex multi-step operations |
| Human-readable output | Data analysis and aggregation |
| PR reviews with web UI | Bulk issue management |

---

### 4. Database Operations

```
Need to query or modify a database?
│
├─ Local SQLite file?
│  └─→ SQLite MCP
│     Example: "Query the users table and show me the last 10 entries"
│
├─ Production PostgreSQL?
│  └─→ PostgreSQL MCP
│     Example: "Show me all orders from the last 24 hours"
│
├─ Need to analyze query performance?
│  └─→ PostgreSQL MCP
│     Example: "Explain the query plan for this slow query"
│
├─ Database migrations?
│  └─→ Prisma CLI (not MCP)
│     Use: `npx prisma migrate dev`
│
└─ Schema inspection?
   ├─→ SQLite/PostgreSQL MCP (quick look)
   └─→ Prisma Studio (visual exploration)
      Use: `npx prisma studio`
```

**When NOT to use database MCP:**
- Large data exports → Use database-specific tools
- Complex migrations → Use migration tools (Prisma, Flyway)
- Production writes → Be cautious, prefer read-only tokens

---

### 5. Web Search & Research

```
Need information from the web?
│
├─ Recent news or events?
│  └─→ Brave Search MCP
│     Example: "Search for the latest Node.js LTS release"
│
├─ Current best practices?
│  └─→ Brave Search MCP
│     Example: "Find recent discussions about Next.js performance"
│
├─ Library-specific docs?
│  └─→ Context7 MCP (more accurate)
│     Example: "Show me Prisma schema documentation"
│
└─ Your project's README or docs?
   └─→ Read tool (no MCP needed)
      Example: "Read docs/API.md"
```

**When NOT to use Brave Search:**
- Well-known facts → Claude already knows
- Internal company info → Use Filesystem MCP
- Official documentation → Use Context7 MCP

---

### 6. Project Management (Jira)

```
Need to work with Jira?
│
├─ Creating tickets?
│  └─→ Atlassian MCP
│     Example: "Create a Jira ticket in project PROJ for this bug"
│
├─ Updating ticket status?
│  └─→ Atlassian MCP
│     Example: "Update PROJ-123 to 'In Progress'"
│
├─ Sprint planning/queries?
│  └─→ Atlassian MCP
│     Example: "Show me all issues in the current sprint"
│
└─ Linking commits to issues?
   ├─→ Commit message convention (automatic)
   │  Example: `git commit -m "fix: resolve timeout [PROJ-123]"`
   └─→ Atlassian MCP (manual update)
      Example: "Add a comment to PROJ-123 with the fix details"
```

**When NOT to use Atlassian MCP:**
- Complex Jira workflows → Use web interface
- Bulk operations → Use Jira REST API directly
- Reporting → Use Jira dashboards

---

### 7. File System Access

```
Need to access files outside the project?
│
├─ Reading config files (~/.zshrc, ~/.gitconfig)?
│  └─→ Filesystem MCP
│     Example: "Read my ~/.gitconfig"
│
├─ Accessing shared team resources?
│  └─→ Filesystem MCP
│     Example: "Read ~/team/coding-standards.md"
│
├─ Checking logs?
│  └─→ Filesystem MCP
│     Example: "Read /var/log/nginx/error.log"
│
└─ Project files?
   └─→ Read tool (no MCP needed)
      Example: "Read src/index.ts"
```

**Security note:** Filesystem MCP can access any file your user can read. Use with caution and review requests.

---

## Combining Multiple Servers

Many tasks benefit from using multiple MCP servers together.

### Example 1: Full Feature Implementation

```
1. Research: Context7 MCP
   "Show me best practices for implementing rate limiting"

2. Code: Built-in tools
   "Implement rate limiting middleware in src/middleware/rateLimit.ts"

3. Test: Playwright MCP
   "Test the rate limiting by making multiple rapid requests"

4. Document: Built-in tools
   "Update docs/API.md to document rate limiting"

5. Track: GitHub MCP
   "Create a PR for the rate limiting feature"
```

### Example 2: Bug Investigation

```
1. Reproduce: Playwright MCP
   "Navigate to /login and try to reproduce the timeout issue"

2. Investigate: Built-in tools
   "Read src/auth/session.ts and identify the timeout logic"

3. Research: Brave Search MCP
   "Search for common JWT timeout issues"

4. Check Database: PostgreSQL MCP
   "Query the sessions table for recent timeouts"

5. Fix & Track: GitHub MCP
   "Create an issue for this bug and reference the findings"
```

### Example 3: Documentation Update

```
1. Check Current Docs: Read tool
   "Read docs/AUTHENTICATION.md"

2. Get Latest Info: Context7 MCP
   "Fetch the latest NextAuth.js documentation"

3. Update: Built-in tools
   "Update docs/AUTHENTICATION.md with current best practices"

4. Verify: Playwright MCP
   "Test the authentication flow to ensure docs are accurate"

5. Commit: Built-in tools
   "Create a commit for the documentation update"
```

---

## Performance Considerations

### Fast Operations
- **Read/Edit tools** (built-in) - Instant
- **Grep/Glob** (built-in) - Very fast
- **Context7 MCP** - Fast (cached docs)
- **GitHub MCP** - Fast (API calls)

### Moderate Operations
- **SQLite MCP** - Fast for small DBs, slower for large
- **Filesystem MCP** - Depends on file size
- **Brave Search MCP** - Depends on network

### Slower Operations
- **Playwright MCP** - Requires browser startup (5-10s first time)
- **PostgreSQL MCP** - Depends on query complexity and network

**Tip:** For time-sensitive tasks, prefer built-in tools over MCP when possible.

---

## Cost Considerations (for Context7)

Context7 has usage limits on free tiers:

| Tier | Requests/month | Best for |
|------|----------------|----------|
| Free | Limited | Occasional lookups |
| Pro | Higher limits | Regular development |

**Save requests:**
- Cache documentation locally when possible
- Use Claude's existing knowledge for common questions
- Only fetch docs when you need current/specific information

---

## Common Mistakes

### ❌ Using Playwright for everything

**Wrong:**
```
"Use Playwright to check if my code has syntax errors"
```

**Right:**
```
"Run the linter to check for syntax errors"
```

**Why:** Playwright is for browser automation. Use built-in tools for code analysis.

---

### ❌ Using Brave Search for well-known facts

**Wrong:**
```
"Search the web for JavaScript array methods"
```

**Right:**
```
"What are the common JavaScript array methods?"
```

**Why:** Claude already knows this. Save search quota for truly current information.

---

### ❌ Using GitHub MCP for simple git operations

**Wrong:**
```
"Use GitHub MCP to commit my changes"
```

**Right:**
```
"Create a commit with message 'fix: resolve timeout issue'"
```

**Why:** Git operations don't need GitHub API. Use built-in tools.

---

### ❌ Querying production databases unnecessarily

**Wrong:**
```
"Use PostgreSQL MCP to query the production users table"
```

**Right:**
```
"Use SQLite MCP to query my local dev database"
```

**Why:** Safer to test locally. Only query production for debugging or analysis.

---

## Decision Checklist

Before choosing an MCP server, ask:

1. ☑️ **Is this task possible with built-in tools?**
   - If yes, prefer built-in (faster, no setup)

2. ☑️ **Which MCP server is purpose-built for this?**
   - Match task to server specialty (see matrix above)

3. ☑️ **Do I need real-time/current data?**
   - If no, use Claude's knowledge or cached docs

4. ☑️ **Is this a one-time task or repeated workflow?**
   - One-time: Manual might be faster
   - Repeated: MCP automation pays off

5. ☑️ **Do I have the server configured?**
   - If not, [set it up](SETUP.md) first

---

## Next Steps

- **Not sure which server you need?** → [MCP Overview](OVERVIEW.md)
- **Ready to set up servers?** → [Quick Start](QUICKSTART.md) or [Complete Setup](SETUP.md)
- **Want to see examples?** → [Servers Guide](SERVERS_GUIDE.md)
- **Having issues?** → [Troubleshooting](TROUBLESHOOTING.md)

---

**Last Updated:** 2024-12-11
