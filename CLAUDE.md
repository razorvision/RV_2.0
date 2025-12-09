# Project Development Guidelines

This file provides instructions and context for Claude Code when working on this project. These guidelines ensure consistent, high-quality development practices across the team.

## Table of Contents

- [Change Request Workflow](#change-request-workflow)
- [Development Standards](#development-standards)
- [MCP Tool Usage](#mcp-tool-usage)
- [Visual Development](#visual-development)
- [Code Quality Policy](#code-quality-policy)
- [CI/CD Monitoring](#cicd-monitoring)
- [Pre-Commit Checklist](#pre-commit-checklist)
- [Framework-Specific Notes](#framework-specific-notes)

---

## Change Request Workflow

**IMPORTANT:** For non-trivial changes (bug fixes, features, refactors), follow this workflow:

### The 5-Step Process

1. **Research Deeply**
   - Read relevant files and understand existing patterns
   - Identify all affected components
   - Consider edge cases and potential side effects

2. **Create a Write-up**
   - Root cause analysis (for bugs) or design approach (for features)
   - Proposed solution with specific files/functions to modify
   - Trade-offs or alternative approaches considered

3. **Create GitHub Issue**
   - File an issue with the write-up for tracking
   - Use appropriate labels and link to related issues

4. **Request Review**
   - Present the write-up to the user for approval
   - Wait for explicit approval before proceeding
   - Address any concerns or questions

5. **Implement with Approval**
   - Only after user approves, make the changes
   - Follow the approved approach
   - Test thoroughly before presenting results

### When to Skip This Workflow

- Trivial changes (typo fixes, minor formatting)
- Changes explicitly requested with clear specifications
- Emergency hotfixes (document afterward)

**See:** [docs/workflows/CHANGE_REQUEST_WORKFLOW.md](docs/workflows/CHANGE_REQUEST_WORKFLOW.md) for detailed guidance.

---

## Development Standards

### Branch Naming Convention

Use full prefixes (CI may enforce these):

- `feature/` - New features (NOT `feat/`)
- `fix/` or `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Maintenance tasks

**Example:** `feature/add-user-dashboard`

### Commit Message Format

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Guidelines

- Keep PRs under 500 lines when possible
- Split large features into logical chunks:
  - Backend/API changes first
  - Frontend components second
  - Tests can be separate or included
- One PR = one logical change
- Always fill out PR template sections

**Issue Linking:** Put each issue on its own line for auto-close:

```markdown
Closes #101
Closes #102
```

NOT: `Closes #101, #102` (comma-separated won't auto-close)

---

## MCP Tool Usage

### Global vs Project MCP Configuration

MCP servers are configured in two places:

1. **Global MCPs** (`~/.claude/settings.json` or VS Code global settings)
   - Loaded for all projects automatically
   - Include general-purpose tools: Playwright, GitHub, Brave Search, Context7, etc.
   - Configured once, available everywhere

2. **Project MCPs** (`.mcp.json` in project root)
   - Project-specific servers only
   - Example: project-specific database connections, custom tools
   - The `.mcp.json` in this template is primarily for **documentation/reference**
   - Actual MCP loading comes from global settings unless project-specific servers are needed

**Important:** If an MCP tool isn't available, check that it's configured in your global Claude settings, not just the project `.mcp.json`.

### Playwright Browser Automation

Use `mcp__playwright__*` tools for E2E testing, visual verification, and debugging.

**Key Tools:**
- `browser_navigate` - Go to URL
- `browser_snapshot` - Get accessibility tree (preferred for interaction)
- `browser_click`, `browser_type`, `browser_fill_form` - Interactions
- `browser_take_screenshot` - Visual capture
- `browser_tabs` with `action: 'list'` - List all open tabs
- `browser_close` - Close current page/session

### Session Management Best Practices

The Playwright MCP server uses a **persistent browser profile**, which can cause issues if sessions aren't closed properly.

**Always:**
1. Call `browser_close` when done with browser automation
2. Before starting new automation, try `browser_tabs` with `action: 'list'` to check session state
3. Reuse existing tabs instead of creating new ones

**If you get "Browser is already in use" error:**
1. Try `browser_close` first
2. If that fails, the user may need to manually close Chrome windows
3. As last resort on Windows: `Remove-Item -Recurse "$env:LOCALAPPDATA\ms-playwright\mcp-chrome-*" -Force`

**Tab Management:**
- Use `browser_tabs` with `action: 'select'` to switch tabs
- Close tabs you're done with using `action: 'close'`
- Don't call `browser_navigate` repeatedly - reuse existing tabs

### Screenshot Cleanup

Screenshots taken during debugging (stored in `.playwright-mcp/`) are temporary. Delete them when closing related issues or PRs.

### MCP Tools vs Test Runner

- **MCP Playwright tools:** Ad-hoc browser automation during development
- **Playwright test runner (`npx playwright test`):** Formal E2E test suite

These are separate systems. Use MCP for quick checks; use the test runner for CI/regression tests.

**See:** [docs/integrations/MCP_SETUP.md](docs/integrations/MCP_SETUP.md) for full MCP documentation.

---

## Visual Development

### Self-Evaluation Workflow

**IMPORTANT:** After making any visual/UI changes, always self-evaluate before presenting to the user:

1. **Take a screenshot** using `browser_take_screenshot`
2. **Critically assess** - Does it look good? Are there obvious issues?
3. **Iterate and fix** issues before showing the user
4. **Only present** the final result once satisfied it meets quality standards

### Visual Quality Checklist

- [ ] **Spacing and alignment** - Is it balanced and readable?
- [ ] **Font sizes** - Appropriate for the context?
- [ ] **Color contrast** - Is text readable against backgrounds?
- [ ] **Layout** - Does it work across different content lengths?
- [ ] **Responsive** - Works on different screen sizes?
- [ ] **Overall polish** - Would this look professional to end users?

Don't rely on the user to catch visual issues - proactively identify and fix them yourself.

**See:** [docs/workflows/VISUAL_DEVELOPMENT_WORKFLOW.md](docs/workflows/VISUAL_DEVELOPMENT_WORKFLOW.md) for detailed guidance.

---

## Code Quality Policy

### TODO/FIXME Standards

- **TODO comments** must reference a GitHub issue:
  ```typescript
  // TODO #123: Implement caching for this query
  ```
- **FIXME comments** indicate broken code and must be resolved before merging
- Use `it.skip()` for tests that need fixing, with a linked issue in the description

### PR Size Limits

- Target: Under 500 lines changed
- If larger, split into logical chunks
- Exception: Generated files, migrations, large refactors (document why)

### Test Requirements

- New features require test coverage
- Bug fixes should include regression tests
- Run full test suite before creating PR

**See:** [docs/guides/CODE_QUALITY_POLICY.md](docs/guides/CODE_QUALITY_POLICY.md) for complete policy.

---

## CI/CD Monitoring

### Checking PR Status

After creating a PR, monitor CI status using the GitHub check-runs API:

```bash
# Get check runs for a commit SHA
curl -s "https://api.github.com/repos/OWNER/REPO/commits/{SHA}/check-runs" \
  | jq -r '.check_runs[] | "\(.status) \(.conclusion // "pending") - \(.name)"'
```

**Important:** Use the check-runs API, NOT `mcp__github__get_pull_request_status` (legacy status API doesn't work with GitHub Actions).

### Monitoring Workflow

1. Get the PR's head commit SHA from `mcp__github__get_pull_request`
2. Query check-runs API
3. If any check has `status: "in_progress"` or `"queued"`, wait ~60 seconds and check again
4. When all checks complete, notify the user with:
   - Final status (success/failure)
   - Link to the PR
   - Which checks failed (if any)
5. If checks pass and PR is ready, ask if user wants to merge

**See:** [docs/workflows/CI_MONITORING_GUIDE.md](docs/workflows/CI_MONITORING_GUIDE.md) for detailed patterns.

---

## Pre-Commit Checklist

Before creating a commit or PR:

1. [ ] **Run tests** - `npm test` (all tests pass)
2. [ ] **Run linter** - `npm run lint` (no lint errors)
3. [ ] **Type check** - `npm run typecheck` (if applicable)
4. [ ] **Scan for TODO/FIXME** - Create issues if needed
5. [ ] **Check PR size** - Consider splitting if >500 lines
6. [ ] **Write commit message** - Clear, follows conventions
7. [ ] **Include tests** - Coverage for new functionality

---

## Framework-Specific Notes

> **Customize this section** for your project's tech stack.

### Example: Next.js Projects

**Port Management:**
- Always use port 3000 for dev server (required for auth callbacks)
- If port is in use, kill the process rather than using alternate ports

**Cache Clearing:**
```bash
rm -rf .next && npx prisma generate
```
Run this after pulling changes or when experiencing stale behavior.

### Example: Prisma Projects

**After schema changes:**
```bash
npx prisma db push     # Sync to database
npx prisma generate    # Regenerate client
```

### Example: NextAuth Projects

- JWT session strategy is preferred for stateless auth
- Rate limit auth routes (login: 5/15min, register: 3/hour)
- Always use HTTPS in production for secure cookies

**See:** [docs/frameworks/](docs/frameworks/) for detailed framework guides.

---

## Related Documentation

- [Change Request Workflow](docs/workflows/CHANGE_REQUEST_WORKFLOW.md)
- [Code Quality Policy](docs/guides/CODE_QUALITY_POLICY.md)
- [Visual Development Workflow](docs/workflows/VISUAL_DEVELOPMENT_WORKFLOW.md)
- [CI Monitoring Guide](docs/workflows/CI_MONITORING_GUIDE.md)
- [MCP Setup](docs/integrations/MCP_SETUP.md)
- [MCP Troubleshooting](docs/integrations/MCP_TROUBLESHOOTING.md)
- [Coding Standards](docs/guides/CODING_STANDARDS.md)
- [Branch Strategy](docs/guides/BRANCH_STRATEGY.md)

---

**Last Updated:** 2024-12-08
**Template Version:** 2.0.0
