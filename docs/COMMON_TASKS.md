# Common Development Tasks

Quick reference for everyday development activities. **Bookmark this page!**

---

## Code Changes

| Task | Guide | Key Action |
|------|-------|------------|
| Fix a bug | [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) | Research → Create issue → Get approval → Implement |
| Add a feature | [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) | Write-up → Issue → Approval → Code |
| Refactor code | [Code Quality Policy](guides/CODE_QUALITY_POLICY.md) | Keep PRs < 500 lines |
| Add TODO comment | [Code Quality Policy](guides/CODE_QUALITY_POLICY.md) | Create issue first: `// TODO #123: description` |

---

## Git Workflow

| Task | Guide | Command |
|------|-------|---------|
| Create feature branch | [Branch Strategy](guides/team/BRANCH_STRATEGY.md) | `git checkout -b feature/name` |
| Create fix branch | [Branch Strategy](guides/team/BRANCH_STRATEGY.md) | `git checkout -b fix/name` |
| Write commit message | [Code Quality Policy](guides/CODE_QUALITY_POLICY.md) | `feat:`, `fix:`, `docs:`, `refactor:` |
| Submit PR | [Code Review Guidelines](guides/team/CODE_REVIEW_GUIDELINES.md) | `gh pr create` |
| Review someone's PR | [Code Review Guidelines](guides/team/CODE_REVIEW_GUIDELINES.md) | Use reviewer checklist |

**Branch Prefixes:** `feature/`, `fix/`, `bugfix/`, `hotfix/`, `docs/`, `refactor/`, `test/`, `chore/`

---

## Testing

| Task | Guide | Command |
|------|-------|---------|
| Run all tests | [Testing Guide](guides/development/TESTING_GUIDE.md) | `npm test` |
| Run specific test file | [Testing Guide](guides/development/TESTING_GUIDE.md) | `npm test -- path/to/test` |
| Run E2E tests | [Testing Guide](guides/development/TESTING_GUIDE.md) | `npx playwright test` |
| Django/Docker tests | [Testing Template](../testing-template-packet/START-HERE.md) | `/test` in Claude Code |
| Skip flaky test | [Code Quality Policy](guides/CODE_QUALITY_POLICY.md) | `it.skip()` with issue reference |

---

## API Development

| Task | Guide | Notes |
|------|-------|-------|
| Add new endpoint | [API Patterns](guides/development/API_PATTERNS.md) | Follow REST conventions |
| Add validation | [API Patterns](guides/development/API_PATTERNS.md) | Use Zod schemas |
| Handle errors | [Error Handling](guides/development/ERROR_HANDLING.md) | Consistent error response format |
| Document endpoint | [API Patterns](guides/development/API_PATTERNS.md) | Include request/response examples |

---

## Database (Prisma)

| Task | Guide | Command |
|------|-------|---------|
| Add a field | [Prisma Patterns](frameworks/PRISMA_PATTERNS.md) | Edit schema → `npx prisma db push` |
| Create migration | [Database Patterns](frameworks/DATABASE_PATTERNS.md) | `npx prisma migrate dev --name description` |
| View data in GUI | [Dev Environment](guides/DEV_ENVIRONMENT_SETUP.md) | `npx prisma studio` |
| Reset database | [Prisma Patterns](frameworks/PRISMA_PATTERNS.md) | `npx prisma migrate reset` |
| Generate client | [Prisma Patterns](frameworks/PRISMA_PATTERNS.md) | `npx prisma generate` |

---

## Authentication

| Task | Guide | Notes |
|------|-------|-------|
| Set up auth from scratch | [Auth Implementation](frameworks/AUTH_IMPLEMENTATION_GUIDE.md) | Follow step-by-step guide |
| Add new OAuth provider | [NextAuth Patterns](frameworks/NEXTAUTH_PATTERNS.md) | Add to providers array |
| Debug auth issues | [NextAuth Patterns](frameworks/NEXTAUTH_PATTERNS.md) | Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET` |
| Protect a route | [NextAuth Patterns](frameworks/NEXTAUTH_PATTERNS.md) | Use `getServerSession()` |

---

## Deployment & Operations

| Task | Guide | Notes |
|------|-------|-------|
| Deploy to staging | [Deployment Guide](guides/infrastructure/DEPLOYMENT_GUIDE.md) | Push to staging branch |
| Deploy to production | [Deployment Guide](guides/infrastructure/DEPLOYMENT_GUIDE.md) | Merge to main |
| Handle production incident | [Incident Response](guides/infrastructure/INCIDENT_RESPONSE.md) | Follow runbook |
| Check error tracking | [Monitoring & Observability](guides/infrastructure/MONITORING_OBSERVABILITY.md) | Review Sentry dashboard |
| Manage environment vars | [Environment Management](guides/infrastructure/ENVIRONMENT_MANAGEMENT.md) | Update `.env` files |

---

## Claude Code

| Task | Guide | Command/Action |
|------|-------|----------------|
| List slash commands | [Commands README](../.claude/commands/README.md) | `/help` or check `.claude/commands/` |
| Run tests intelligently | [Testing Template](../testing-template-packet/START-HERE.md) | `/test` |
| Security review | [Commands README](../.claude/commands/README.md) | `/review-security` |
| Code review | [Commands README](../.claude/commands/README.md) | `/review-code` |
| Add MCP server | [MCP Setup](integrations/MCP_SETUP.md) | Edit `.mcp.json` |
| Debug MCP issues | [MCP Troubleshooting](integrations/MCP_TROUBLESHOOTING.md) | `claude mcp list` |
| Reset MCP approvals | [MCP Setup](integrations/MCP_SETUP.md) | `claude mcp reset-project-choices` |

---

## Feature Flags & Rollouts

| Task | Guide | Notes |
|------|-------|-------|
| Add feature flag | [Feature Flags](guides/development/FEATURE_FLAGS.md) | Environment var or database-backed |
| Gradual rollout | [Feature Flags](guides/development/FEATURE_FLAGS.md) | Percentage-based rollout |
| Kill switch | [Feature Flags](guides/development/FEATURE_FLAGS.md) | Quick disable without deploy |

---

## Technical Debt

| Task | Guide | Notes |
|------|-------|-------|
| Document tech debt | [Technical Debt](guides/development/TECHNICAL_DEBT.md) | Create issue with debt template |
| Prioritize debt | [Technical Debt](guides/development/TECHNICAL_DEBT.md) | Use impact vs effort matrix |
| Pay down debt | [Technical Debt](guides/development/TECHNICAL_DEBT.md) | Boy Scout Rule or dedicated sprints |

---

## New to the Project?

### Your First Week

| Day | Focus | Guide |
|-----|-------|-------|
| Day 1 | Environment setup | [Onboarding Checklist](guides/team/ONBOARDING_CHECKLIST.md) |
| Day 2 | Read coding standards | [Coding Standards](guides/development/CODING_STANDARDS.md) |
| Day 3 | Learn git workflow | [Branch Strategy](guides/team/BRANCH_STRATEGY.md) |
| Day 4-5 | Pick up first issue | [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) |
| Week 2+ | Build features! | This page for quick reference |

### Essential Reading (in order)

1. [Onboarding Checklist](guides/team/ONBOARDING_CHECKLIST.md) - Get set up
2. [Coding Standards](guides/development/CODING_STANDARDS.md) - Code conventions
3. [Branch Strategy](guides/team/BRANCH_STRATEGY.md) - Git workflow
4. [Change Request Workflow](workflows/CHANGE_REQUEST_WORKFLOW.md) - How to make changes
5. [Code Review Guidelines](guides/team/CODE_REVIEW_GUIDELINES.md) - PR process

---

## Quick Command Reference

### Git
```bash
# Start new feature
git checkout main && git pull
git checkout -b feature/my-feature

# Commit with conventional message
git commit -m "feat: add user profile page"

# Push and create PR
git push -u origin feature/my-feature
gh pr create
```

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

### Database
```bash
# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name add_user_avatar

# Open database GUI
npx prisma studio

# Regenerate client
npx prisma generate
```

### Claude Code
```bash
# Start Claude Code
claude

# Check MCP servers
claude mcp list

# Reset MCP approvals
claude mcp reset-project-choices
```

---

## Related Documentation

- [Full Documentation Index](README.md) - All documentation
- [QUICKSTART.md](../QUICKSTART.md) - Quick reference for daily workflows
- [CLAUDE.md](../CLAUDE.md) - Project-specific guidelines for Claude

---

**Last Updated:** 2025-12-08
