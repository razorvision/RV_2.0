---
title: Repository & GitHub Project Setup Guide
parent: Guides
---
# Repository & GitHub Project Setup Guide

Comprehensive guide for configuring GitHub repositories and project boards for effective team collaboration.

## Repository Configuration

### Branch Protection Rules

Protect your main branch to ensure code quality:

1. Go to **Settings > Branches > Add rule**
2. Branch name pattern: `main` (or `master`)
3. Enable these protections:

```
[x] Require a pull request before merging
    [x] Require approvals (1 minimum)
    [x] Dismiss stale pull request approvals when new commits are pushed
    
[x] Require status checks to pass before merging
    [x] Require branches to be up to date before merging
    Select checks: lint, test, build (as applicable)
    
[x] Require conversation resolution before merging

[ ] Require signed commits (optional, for high-security projects)

[x] Do not allow bypassing the above settings
```

### Branch Naming Convention

Use descriptive prefixes for all branches:

| Prefix | Purpose | Example |
|--------|---------|--------|
| `feature/` | New features | `feature/user-dashboard` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `bugfix/` | Bug fixes (alternative) | `bugfix/null-pointer` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `docs/` | Documentation only | `docs/api-reference` |
| `refactor/` | Code refactoring | `refactor/auth-module` |
| `test/` | Test additions | `test/e2e-coverage` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

**Important:** Use full prefixes (e.g., `feature/`) not abbreviations (e.g., `feat/`).

## Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Summary

<!-- Brief description of changes -->

## Changes

- 
- 
- 

## Related Issues

<!-- Link issues on separate lines for auto-close -->
Closes #

## Test Plan

- [ ] 
- [ ] 

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Checklist

- [ ] Tests pass locally
- [ ] Lint passes
- [ ] Self-reviewed code
- [ ] Updated documentation (if needed)
```

## Issue Templates

Create `.github/ISSUE_TEMPLATE/` directory with these templates:

### Bug Report (`bug_report.md`)

```markdown
---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: bug
assignees: ''
---

## Description

<!-- Clear description of the bug -->

## Steps to Reproduce

1. 
2. 
3. 

## Expected Behavior

<!-- What should happen -->

## Actual Behavior

<!-- What actually happens -->

## Environment

- Browser: 
- OS: 
- Version: 

## Screenshots

<!-- If applicable -->

## Additional Context

<!-- Any other relevant information -->
```

### Feature Request (`feature_request.md`)

```markdown
---
name: Feature Request
about: Suggest a new feature or enhancement
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Problem Statement

<!-- What problem does this solve? -->

## Proposed Solution

<!-- How should this work? -->

## Alternatives Considered

<!-- Other approaches you've thought about -->

## Additional Context

<!-- Mockups, examples, or other relevant information -->
```

## GitHub Labels

Set up consistent labels for organization:

### Type Labels
```bash
gh label create "bug" --color "d73a4a" --description "Something isn't working"
gh label create "enhancement" --color "a2eeef" --description "New feature or request"
gh label create "documentation" --color "0075ca" --description "Documentation improvements"
gh label create "refactor" --color "d4c5f9" --description "Code refactoring"
gh label create "test" --color "bfd4f2" --description "Test-related changes"
```

### Priority Labels
```bash
gh label create "priority: critical" --color "b60205" --description "Must be fixed ASAP"
gh label create "priority: high" --color "d93f0b" --description "Important, address soon"
gh label create "priority: medium" --color "fbca04" --description "Should be addressed"
gh label create "priority: low" --color "0e8a16" --description "Nice to have"
```

### Status Labels
```bash
gh label create "blocked" --color "000000" --description "Blocked by external dependency"
gh label create "needs review" --color "7057ff" --description "Ready for review"
gh label create "in progress" --color "1d76db" --description "Currently being worked on"
gh label create "wontfix" --color "ffffff" --description "Will not be addressed"
```

## GitHub Project Board

### Creating a Project

1. Go to **Organization > Projects > New project**
2. Choose **Board** view (Kanban-style)
3. Name it appropriately (e.g., "Project Name - Sprint Board")

### Recommended Columns

| Column | Purpose |
|--------|--------|
| **Backlog** | Unprioritized items |
| **To Do** | Prioritized for current sprint |
| **In Progress** | Actively being worked on |
| **In Review** | PR submitted, awaiting review |
| **Done** | Completed and merged |

### Automation Rules

Set up these automations:

- **Issue opened** → Add to Backlog
- **PR opened** → Add to In Review
- **PR merged** → Move to Done
- **Issue closed** → Move to Done

### Custom Fields (Optional)

- **Estimate**: Size estimate (S, M, L, XL)
- **Sprint**: Sprint number or name
- **Epic**: Parent epic for grouping

## Secrets and Environment Variables

### Repository Secrets

Go to **Settings > Secrets and variables > Actions**:

```
DATABASE_URL          # Production database connection
NEXTAUTH_SECRET       # Auth secret for production
GITHUB_TOKEN          # Auto-provided for Actions
```

### Environment Secrets

Create environments for staging/production:

1. **Settings > Environments > New environment**
2. Name: `production` or `staging`
3. Add environment-specific secrets
4. Optionally add deployment protection rules

## Repository Settings

### General Settings

- **Features:**
  - [x] Issues
  - [x] Projects
  - [ ] Wiki (disable if using docs/)
  - [x] Discussions (optional)

- **Pull Requests:**
  - [x] Allow squash merging (recommended default)
  - [ ] Allow merge commits (disable for clean history)
  - [x] Allow rebase merging
  - [x] Automatically delete head branches

### Collaborators & Teams

1. **Settings > Collaborators and teams**
2. Add team with appropriate role:
   - **Admin**: Full access
   - **Maintain**: Manage without destructive actions
   - **Write**: Push and manage issues/PRs
   - **Triage**: Manage issues without write access
   - **Read**: View only

## GitHub Actions Setup

### Basic CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

---

## Related Guides

- [Project Intake Checklist](./PROJECT_INTAKE_CHECKLIST.md) - Full project setup
- [Code Quality Policy](./CODE_QUALITY_POLICY.md) - PR and commit standards
- [CI Monitoring Guide](../workflows/CI_MONITORING_GUIDE.md) - Monitoring CI status
