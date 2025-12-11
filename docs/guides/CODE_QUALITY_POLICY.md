---
title: Code Quality Policy
parent: Guides
---
# Code Quality Policy

This document establishes code quality standards that help teams maintain clean, maintainable codebases at scale. These policies apply to all code contributions.

## Table of Contents

- [TODO/FIXME Policy](#todofixme-policy)
- [Pull Request Size Guidelines](#pull-request-size-guidelines)
- [Issue Linking Standards](#issue-linking-standards)
- [Commit Message Standards](#commit-message-standards)
- [Pre-Commit Checklist](#pre-commit-checklist)
- [Test Coverage Requirements](#test-coverage-requirements)
- [Code Review Standards](#code-review-standards)

---

## TODO/FIXME Policy

### Overview

TODO and FIXME comments are technical debt markers. Without tracking, they accumulate and are forgotten. This policy ensures all technical debt is visible and tracked.

### Rules

#### TODO Comments

**Must reference a GitHub issue:**

```typescript
// TODO #123: Implement caching for this query
const data = await fetchData();

// TODO #456: Add pagination when dataset grows
const allItems = await db.items.findMany();
```

**Not acceptable:**

```typescript
// TODO: Fix this later
// TODO: Add error handling
// TODO: Refactor
```

**Process:**
1. Before adding a TODO, create a GitHub issue
2. Reference the issue number in the comment
3. Include a brief description of what needs to be done

#### FIXME Comments

**Must be resolved before merging:**

FIXME indicates broken or problematic code. These should never be committed to the main branch.

```typescript
// FIXME: This causes a memory leak - DO NOT MERGE
const handler = setInterval(() => {}, 1000);
```

**During development:** Use FIXME as a reminder to fix before committing.

**If you can't fix it:** Convert to a TODO with an issue reference.

#### Skipped Tests

**Use `it.skip()` with issue reference:**

```typescript
// Skipping due to flaky behavior - see #789
it.skip('handles concurrent updates', async () => {
  // Test implementation
});
```

**Process:**
1. Create an issue for the skipped test
2. Add issue reference in comment above skip
3. Label the issue appropriately (`type: test`, `status: needs-attention`)

### Enforcement

- Pre-commit hooks scan for untracked TODO/FIXME
- Code review should flag violations
- CI can optionally fail on untracked comments

### Scanning for Issues

```bash
# Find all TODO comments without issue references
grep -rn "// TODO" --include="*.ts" --include="*.tsx" | grep -v "#[0-9]"

# Find all FIXME comments (should be zero in main)
grep -rn "// FIXME" --include="*.ts" --include="*.tsx"
```

---

## Pull Request Size Guidelines

### Target Size

**Aim for PRs under 500 lines changed.**

Smaller PRs are:
- Easier to review thoroughly
- Less likely to introduce bugs
- Faster to merge
- Easier to revert if needed

### Splitting Large Changes

When a feature exceeds 500 lines, split into logical PRs:

#### Strategy 1: Layer by Layer

1. **PR 1: Data Layer**
   - Database schema changes
   - ORM models
   - Migrations

2. **PR 2: API Layer**
   - API routes
   - Validation
   - Business logic

3. **PR 3: UI Layer**
   - Components
   - Pages
   - Styling

4. **PR 4: Tests** (or include with each layer)
   - Unit tests
   - Integration tests
   - E2E tests

#### Strategy 2: Feature Flags

For features that must ship atomically:

1. Implement behind a feature flag
2. Split into multiple PRs
3. Final PR enables the flag

#### Strategy 3: Incremental Enhancement

1. **PR 1: Basic version**
   - Minimal viable implementation
   - Core functionality only

2. **PR 2-N: Enhancements**
   - Error handling
   - Edge cases
   - Polish

### Exceptions

Larger PRs are acceptable for:

- **Generated files** (migrations, types from codegen)
- **Dependency updates** with lockfile changes
- **Large refactors** that can't be split safely
- **Initial project setup**

**Always document why** in the PR description when exceeding the limit.

### Measuring PR Size

```bash
# Check lines changed in current branch
git diff main --stat | tail -1

# Detailed breakdown
git diff main --numstat
```

---

## Issue Linking Standards

### Automatic Issue Closing

GitHub auto-closes issues when PRs merge, but only with correct formatting.

**Correct (each on its own line):**

```markdown
Closes #101
Closes #102
Fixes #103
```

**Incorrect (won't auto-close all):**

```markdown
Closes #101, #102, #103
Closes #101 and #102
Related to #101, #102
```

### Keywords That Close Issues

- `close`, `closes`, `closed`
- `fix`, `fixes`, `fixed`
- `resolve`, `resolves`, `resolved`

### PR Description Template

```markdown
## Summary
[Brief description of changes]

## Related Issues
Closes #123
Closes #124

## Changes
- [Change 1]
- [Change 2]

## Test Plan
- [How to test]
```

### Commit Message References

For traceability, reference issues in commit messages:

```bash
git commit -m "feat: add user authentication (#123)"
git commit -m "fix: resolve login timeout (#456)"
```

---

## Commit Message Standards

### Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|--------|
| `feat` | New feature | `feat: add dark mode toggle` |
| `fix` | Bug fix | `fix: resolve auth timeout` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting (no code change) | `style: fix indentation` |
| `refactor` | Code change (no new feature/fix) | `refactor: extract validation logic` |
| `test` | Add/update tests | `test: add auth integration tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize database queries` |
| `ci` | CI/CD changes | `ci: add e2e test workflow` |

### Scope (Optional)

Indicates the area of change:

```bash
feat(auth): add OAuth2 support
fix(api): handle null response
docs(readme): update installation steps
```

### Description Guidelines

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Keep under 72 characters

**Good:**
- `feat: add user profile page`
- `fix: prevent duplicate form submissions`
- `docs: clarify environment setup`

**Bad:**
- `Added user profile page.`
- `FEAT: Add user profile page`
- `feat: This commit adds a new user profile page to the application`

### Body (Optional)

Use for explaining *why*, not *what*:

```
fix: prevent race condition in data sync

The previous implementation could cause data loss when multiple
tabs were open. This fix uses a mutex to ensure only one sync
operation runs at a time.

Closes #789
```

---

## Pre-Commit Checklist

Before creating any commit:

### Automated Checks

```bash
# 1. Run tests
npm test

# 2. Run linter
npm run lint

# 3. Run type checker (if applicable)
npm run typecheck

# 4. Run formatter
npm run format
```

### Manual Checks

- [ ] **No untracked TODOs** - All TODOs reference issues
- [ ] **No FIXMEs** - All FIXMEs resolved or converted
- [ ] **Tests pass** - Full test suite green
- [ ] **Lint passes** - No warnings or errors
- [ ] **Types pass** - No TypeScript errors
- [ ] **PR size** - Under 500 lines (or documented exception)
- [ ] **Commit message** - Follows conventional commits
- [ ] **No secrets** - No API keys, passwords, or tokens
- [ ] **No debug code** - No console.logs, debuggers, etc.

### Pre-Commit Hooks

This template includes pre-commit hooks that automate many checks:

```bash
# Install hooks
npm run prepare

# Or manually
pre-commit install
```

See [pre-commit-hooks.md](../workflows/pre-commit-hooks.md) for configuration.

---

## Test Coverage Requirements

### Minimum Coverage

- **New features:** Must include tests
- **Bug fixes:** Must include regression test
- **Refactors:** Existing tests must pass (add if missing)

### What to Test

#### Must Test

- Business logic and calculations
- Data transformations
- API endpoints
- Authentication/authorization
- Error handling paths

#### Should Test

- Complex UI interactions
- Integration between components
- Edge cases

#### Optional

- Simple UI rendering (snapshot tests)
- Third-party library wrappers
- Generated code

### Test Quality

Tests should be:

- **Independent:** Don't rely on other tests
- **Deterministic:** Same result every time
- **Fast:** Unit tests < 100ms each
- **Clear:** Test name explains what's being tested

```typescript
// Good: Clear test names
describe('calculateTotal', () => {
  it('returns zero for empty cart', () => {});
  it('sums item prices correctly', () => {});
  it('applies discount when code is valid', () => {});
  it('throws error for negative quantities', () => {});
});

// Bad: Vague test names
describe('calculateTotal', () => {
  it('works', () => {});
  it('test 1', () => {});
  it('handles edge case', () => {});
});
```

---

## Code Review Standards

### Reviewer Checklist

When reviewing PRs, check:

#### Functionality
- [ ] Code does what the PR description says
- [ ] Edge cases handled
- [ ] Error handling appropriate
- [ ] No obvious bugs

#### Code Quality
- [ ] Follows project conventions
- [ ] DRY - no unnecessary duplication
- [ ] Clear naming
- [ ] Appropriate abstraction level

#### Security
- [ ] No secrets in code
- [ ] Input validation present
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities

#### Testing
- [ ] Tests included for new code
- [ ] Tests are meaningful
- [ ] Edge cases tested

#### Documentation
- [ ] Complex logic explained
- [ ] Public APIs documented
- [ ] README updated if needed

### Giving Feedback

**Be specific:**
```
❌ "This is confusing"
✅ "This function does three things. Consider splitting into separate functions for clarity."
```

**Explain why:**
```
❌ "Don't use any"
✅ "Using 'any' bypasses TypeScript's type checking. Consider using 'unknown' with type guards."
```

**Offer alternatives:**
```
❌ "This won't work"
✅ "This won't handle null values. Consider: `value ?? defaultValue`"
```

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project development guidelines
- [Change Request Workflow](../workflows/CHANGE_REQUEST_WORKFLOW.md) - Planning process
- [Coding Standards](CODING_STANDARDS.md) - Code style guidelines
- [Branch Strategy](BRANCH_STRATEGY.md) - Git workflow
- [Pre-Commit Hooks](../workflows/pre-commit-hooks.md) - Automated checks

---

**Last Updated:** 2024-12-08
**Maintained By:** Development Team
