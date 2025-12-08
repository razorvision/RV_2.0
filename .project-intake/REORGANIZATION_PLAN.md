# Documentation Reorganization Plan

**Repository:** razorvision/project-intake-template
**Date:** 2025-12-08
**Purpose:** Improve navigation and discoverability for new team members

---

## Executive Summary

After deep analysis of 100+ markdown files across 35 directories, the documentation is **comprehensive but hard to navigate**. The primary issue is that a new developer has too many paths with unclear sequencing, leading to confusion about where to start and what order to follow.

### Key Problems

1. **No clear "Which path am I?" decision tree** - New project vs existing project vs testing-only
2. **Auth docs scattered** - 4 files covering authentication with no clear entry point
3. **Dev environment setup duplicated** - Same instructions in 4+ places
4. **MCP documentation fragmented** - 3 setup guides + 1 troubleshooting guide, no clear sequence
5. **No "Day 2" guidance** - Lots of setup docs, but nothing for "now what do I do?"
6. **Orphaned content** - `.mcp-templates/` and some scripts not linked from anywhere

### Proposed Solution

Create **navigation hubs** that route developers to the right content based on their situation, and add **task-based quick references** for common workflows.

---

## Implementation Plan

### Priority 1: Navigation Decision Tree in README.md

**Goal:** Help developers identify their path within 30 seconds

**Changes to `README.md`:**

Replace the current "Choose Your Path" section with a visual decision tree:

```markdown
## Which Path Are You?

```
┌─────────────────────────────────────────────────────────────┐
│                    START HERE                                │
│                                                              │
│  What are you trying to do?                                  │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ NEW      │        │ EXISTING │        │ SPECIFIC │
   │ PROJECT  │        │ PROJECT  │        │ FEATURE  │
   └──────────┘        └──────────┘        └──────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   5-Min Quick          Project              See Feature
   Start below          Intake               Guides below
         │              System
         │                    │
         ▼                    ▼
   QUICKSTART.md      .project-intake/
```

### Feature Guides (Pick what you need)

| I want to... | Go to... | Time |
|--------------|----------|------|
| Set up testing infrastructure | [Testing Template](testing-template-packet/START-HERE.md) | 30 min |
| Configure Claude Code + MCP | [Claude Setup](.claude/README.md) → [MCP Setup](docs/integrations/MCP_SETUP.md) | 15 min |
| Add authentication | [Auth Implementation](docs/frameworks/AUTH_IMPLEMENTATION_GUIDE.md) | 1-2 hrs |
| Set up dev environment | [Dev Environment](docs/guides/DEV_ENVIRONMENT_SETUP.md) | 20 min |
| Understand coding standards | [Coding Standards](docs/guides/development/CODING_STANDARDS.md) | 15 min |
```

**Files to modify:**
- `README.md` (lines 15-31)

---

### Priority 2: Create `docs/COMMON_TASKS.md`

**Goal:** Bridge the gap between "setup complete" and "now what?"

**New file: `docs/COMMON_TASKS.md`**

```markdown
# Common Development Tasks

Quick reference for everyday development activities. Bookmark this page!

## Code Changes

| Task | Guide | Key Command |
|------|-------|-------------|
| Fix a bug | [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) | Create issue first |
| Add a feature | [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) | Research → Document → Implement |
| Refactor code | [Code Quality Policy](guides/CODE_QUALITY_POLICY.md) | Keep PRs < 500 lines |

## Git Workflow

| Task | Guide | Key Command |
|------|-------|-------------|
| Create feature branch | [Branch Strategy](guides/team/BRANCH_STRATEGY.md) | `git checkout -b feature/name` |
| Submit PR | [Code Review](guides/team/CODE_REVIEW_GUIDELINES.md) | `gh pr create` |
| Review someone's PR | [Code Review](guides/team/CODE_REVIEW_GUIDELINES.md) | Use PR checklist |

## Testing

| Task | Guide | Key Command |
|------|-------|-------------|
| Run all tests | [Testing Guide](guides/development/TESTING_GUIDE.md) | `npm test` |
| Run specific test | [Testing Guide](guides/development/TESTING_GUIDE.md) | `npm test -- path/to/test` |
| Django/Docker tests | [Testing Template](../testing-template-packet/START-HERE.md) | `/test` in Claude Code |

## API Development

| Task | Guide | Key Command |
|------|-------|-------------|
| Add new endpoint | [API Patterns](guides/development/API_PATTERNS.md) | Follow REST conventions |
| Add validation | [API Patterns](guides/development/API_PATTERNS.md) | Use Zod schemas |
| Handle errors | [Error Handling](guides/development/ERROR_HANDLING.md) | Consistent error responses |

## Database

| Task | Guide | Key Command |
|------|-------|-------------|
| Add a field | [Prisma Patterns](frameworks/PRISMA_PATTERNS.md) | Edit schema → `npx prisma db push` |
| Create migration | [Database Patterns](frameworks/DATABASE_PATTERNS.md) | `npx prisma migrate dev` |
| View data | [Dev Environment](guides/DEV_ENVIRONMENT_SETUP.md) | `npx prisma studio` |

## Authentication

| Task | Guide | Key Command |
|------|-------|-------------|
| Set up auth from scratch | [Auth Implementation](frameworks/AUTH_IMPLEMENTATION_GUIDE.md) | Follow step-by-step |
| Add new provider | [NextAuth Patterns](frameworks/NEXTAUTH_PATTERNS.md) | Add to providers array |
| Debug auth issues | [NextAuth Patterns](frameworks/NEXTAUTH_PATTERNS.md) | Check NEXTAUTH_URL |

## Deployment

| Task | Guide | Key Command |
|------|-------|-------------|
| Deploy to staging | [Deployment Guide](guides/infrastructure/DEPLOYMENT_GUIDE.md) | Push to staging branch |
| Deploy to production | [Deployment Guide](guides/infrastructure/DEPLOYMENT_GUIDE.md) | Merge to main |
| Handle incident | [Incident Response](guides/infrastructure/INCIDENT_RESPONSE.md) | Follow runbook |

## Claude Code

| Task | Guide | Key Command |
|------|-------|-------------|
| Use a slash command | [Commands README](../.claude/commands/README.md) | `/command-name` |
| Add MCP server | [MCP Setup](integrations/MCP_SETUP.md) | Edit `.mcp.json` |
| Debug MCP issues | [MCP Troubleshooting](integrations/MCP_TROUBLESHOOTING.md) | `claude mcp list` |

## New to the Project?

1. **Day 1:** Complete [Onboarding Checklist](guides/team/ONBOARDING_CHECKLIST.md)
2. **Day 2-3:** Read [Coding Standards](guides/development/CODING_STANDARDS.md) and [Branch Strategy](guides/team/BRANCH_STRATEGY.md)
3. **Week 1:** Pick up a `good first issue` and follow [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md)
```

**Files to create:**
- `docs/COMMON_TASKS.md`

**Files to modify:**
- `docs/README.md` - Add link at top
- `QUICKSTART.md` - Add link in "What's Next?" section

---

### Priority 3: Consolidate Dev Environment Setup

**Goal:** Single source of truth for dev environment, others link to it

**Problem:** Dev setup instructions are in:
- `docs/guides/DEV_ENVIRONMENT_SETUP.md` (primary)
- `docs/getting-started/POST_TEMPLATE_CHECKLIST.md` (Phase 5)
- `.claude/README.md` (Claude-specific)
- `docs/integrations/MCP_SETUP.md` (MCP-specific)

**Solution:** Keep `DEV_ENVIRONMENT_SETUP.md` as the hub, update others to link to it

**Changes to `docs/getting-started/POST_TEMPLATE_CHECKLIST.md`:**

In Phase 5 (Development Tools), replace duplicated instructions with:

```markdown
## Phase 5: Development Tools (10-15 minutes)

For complete setup instructions, see [DEV_ENVIRONMENT_SETUP.md](../guides/DEV_ENVIRONMENT_SETUP.md).

### Quick Checklist
- [ ] VS Code extensions installed
- [ ] Claude Code installed and configured
- [ ] MCP servers approved
- [ ] GitHub CLI authenticated

[Full setup guide →](../guides/DEV_ENVIRONMENT_SETUP.md)
```

**Changes to `.claude/README.md`:**

Add at top of "Claude Code Setup" section:

```markdown
> **Full Setup Guide:** See [DEV_ENVIRONMENT_SETUP.md](../docs/guides/DEV_ENVIRONMENT_SETUP.md) for complete instructions including VS Code, Git, and other tools.
```

**Files to modify:**
- `docs/getting-started/POST_TEMPLATE_CHECKLIST.md` (lines 235-290)
- `.claude/README.md` (add reference)

---

### Priority 4: Add MCP Reading Order

**Goal:** Clear sequence for MCP documentation

**Problem:** MCP has 4 docs with no clear reading order:
- `MCP_SETUP.md` - 900+ lines, comprehensive but overwhelming
- `MCP_SERVERS_GUIDE.md` - Shorter, more focused
- `MCP_TROUBLESHOOTING.md` - Problem-focused
- `MCP_SECURITY.md` - Security considerations

**Solution:** Update `docs/integrations/README.md` (create if needed) with reading order

**New/Updated file: `docs/integrations/README.md`**

```markdown
# Integrations

Guides for setting up external tools and services with this project.

## MCP (Model Context Protocol)

MCP servers extend Claude Code's capabilities. **Read in this order:**

| Step | Guide | When to Read |
|------|-------|--------------|
| 1 | [MCP Servers Guide](MCP_SERVERS_GUIDE.md) | **Start here** - Quick setup for common servers |
| 2 | [MCP Setup](MCP_SETUP.md) | Deep dive into all 16 servers, configuration details |
| 3 | [MCP Security](../security/MCP_SECURITY.md) | Before adding sensitive servers (GitHub, Slack, etc.) |
| 4 | [MCP Troubleshooting](MCP_TROUBLESHOOTING.md) | When something isn't working |

### Quick Start (5 minutes)

1. Start Claude Code in your project: `claude`
2. Approve MCP servers when prompted
3. Verify: `claude mcp list`

**That's it!** Most servers work without additional configuration.

### Need API Keys?

These servers require environment variables:

| Server | Variable | Get It From |
|--------|----------|-------------|
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | [GitHub Settings](https://github.com/settings/tokens) |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_TEAM_ID` | [Slack API](https://api.slack.com/apps) |
| Brave Search | `BRAVE_API_KEY` | [Brave API](https://brave.com/search/api/) |
| PostgreSQL | `POSTGRES_CONNECTION_STRING` | Your database |

## Custom MCP Servers

Need to create your own MCP server? See [.mcp-templates/](../../.mcp-templates/) for Node.js and Python templates.
```

**Files to create/modify:**
- `docs/integrations/README.md` (create or update)
- `docs/README.md` - Update integrations section to mention reading order

---

### Priority 5: Cross-link Testing Documentation

**Goal:** Connect Django testing template with general testing guide

**Problem:**
- `testing-template-packet/` is great for Django/Docker
- `docs/guides/development/TESTING_GUIDE.md` is general
- No cross-references between them

**Solution:** Add mutual links

**Changes to `docs/guides/development/TESTING_GUIDE.md`:**

Add section at top:

```markdown
## Framework-Specific Testing

This guide covers general testing patterns. For framework-specific setups:

| Framework | Guide |
|-----------|-------|
| Django + Docker | [Testing Template Packet](../../../testing-template-packet/START-HERE.md) |
| Next.js | See E2E testing section below |
| API routes | See integration testing section below |
```

**Changes to `testing-template-packet/README.md`:**

Add section:

```markdown
## General Testing Resources

This template is for Django/Docker projects. For general testing concepts and patterns that apply to any project, see:

- [Testing Guide](../docs/guides/development/TESTING_GUIDE.md) - Unit, integration, and E2E testing patterns
- [Code Quality Policy](../docs/guides/CODE_QUALITY_POLICY.md) - Test coverage requirements
```

**Files to modify:**
- `docs/guides/development/TESTING_GUIDE.md` (add framework section)
- `testing-template-packet/README.md` (add general resources section)
- `testing-template-packet/START-HERE.md` (add link to general guide)

---

### Priority 6: Link Orphaned Content

**Goal:** Make `.mcp-templates/` discoverable

**Problem:** `.mcp-templates/` has Node.js and Python MCP server templates but isn't linked from anywhere meaningful.

**Solution:** Add links from MCP documentation

**Changes to `docs/integrations/MCP_SERVERS_GUIDE.md`:**

Add at end of "Creating Custom MCP Servers" section:

```markdown
### Templates

We provide starter templates for creating custom MCP servers:

- **Node.js:** [.mcp-templates/nodejs/](.mcp-templates/nodejs/)
- **Python:** [.mcp-templates/python/](.mcp-templates/python/)

These include:
- Project structure
- Basic server setup
- Example tools
- Build configuration
```

**Files to modify:**
- `docs/integrations/MCP_SERVERS_GUIDE.md`
- `docs/integrations/MCP_SETUP.md` (add reference)

---

## Summary of Changes

### Files to Create
1. `docs/COMMON_TASKS.md` - Task-based quick reference
2. `docs/integrations/README.md` - MCP reading order hub

### Files to Modify
1. `README.md` - Add decision tree navigation
2. `QUICKSTART.md` - Link to COMMON_TASKS.md
3. `docs/README.md` - Add COMMON_TASKS.md link, update integrations section
4. `docs/getting-started/POST_TEMPLATE_CHECKLIST.md` - Consolidate Phase 5 to link
5. `.claude/README.md` - Add link to full dev setup
6. `docs/guides/development/TESTING_GUIDE.md` - Add framework-specific section
7. `testing-template-packet/README.md` - Add general resources section
8. `testing-template-packet/START-HERE.md` - Add general guide link
9. `docs/integrations/MCP_SERVERS_GUIDE.md` - Add templates link
10. `docs/integrations/MCP_SETUP.md` - Add templates reference

### No Changes Needed
- `.project-intake/` - Works well, separate entry point
- `docs/frameworks/` - Good organization
- `docs/security/` - Appropriate scope
- `.github/` - Proper templates and workflows

---

## Implementation Order

1. **Priority 1: README.md decision tree** (highest impact)
2. **Priority 2: Create COMMON_TASKS.md** (bridges setup to development)
3. **Priority 3: Consolidate dev setup** (reduces duplication)
4. **Priority 4: MCP reading order** (clarifies 4 confusing docs)
5. **Priority 5: Cross-link testing** (connects two isolated areas)
6. **Priority 6: Link orphaned content** (completes discoverability)

---

## Approval Request

Do you want me to proceed with implementing these changes? I'll create a branch `docs/reorganize-navigation` and make all modifications, then create a PR for review.

Estimated time: 30-45 minutes
