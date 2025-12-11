---
title: Technical Debt Guide
parent: Development
grand_parent: Guides
---
# Technical Debt Guide

How to identify, document, prioritize, and address technical debt systematically.

## Table of Contents

- [What is Technical Debt](#what-is-technical-debt)
- [Identifying Debt](#identifying-debt)
- [Documenting Debt](#documenting-debt)
- [Prioritization](#prioritization)
- [Paying Down Debt](#paying-down-debt)
- [Preventing New Debt](#preventing-new-debt)

## What is Technical Debt

### Definition

Technical debt is the implied cost of future work caused by choosing a quick or limited solution now instead of a better approach that would take longer.

### Types of Technical Debt

| Type | Description | Example |
|------|-------------|---------|
| **Deliberate** | Conscious choice to ship faster | "We'll skip tests to hit the deadline" |
| **Accidental** | Unknown better approach at the time | Code written before team learned patterns |
| **Bit rot** | Degradation over time | Dependencies become outdated |
| **Design debt** | Architecture that doesn't scale | Monolith that needs to become microservices |

### Debt is Not Always Bad

Some debt is acceptable when:
- Time-to-market is critical
- You're validating a hypothesis
- The code may be thrown away
- The debt is small and isolated

Debt becomes problematic when:
- It slows down every new feature
- It causes production incidents
- It makes onboarding difficult
- It compounds (debt on top of debt)

## Identifying Debt

### Code Smells

Watch for these indicators:

```typescript
// 🔴 Long functions (> 50 lines)
function processOrder(order) {
  // 200 lines of code...
}

// 🔴 Deeply nested conditionals
if (user) {
  if (user.subscription) {
    if (user.subscription.active) {
      if (user.subscription.plan === 'premium') {
        // ...
      }
    }
  }
}

// 🔴 Magic numbers/strings
if (status === 3) { /* what is 3? */ }

// 🔴 Duplicated code
// Same logic in multiple places

// 🔴 TODO/FIXME comments
// TODO: This is a hack, fix later

// 🔴 Disabled tests
it.skip('should validate input', () => {});

// 🔴 Catch-all error handling
catch (error) {
  console.log(error); // swallowed!
}
```

### Architecture Smells

- Circular dependencies between modules
- God objects that do everything
- Tight coupling between unrelated features
- No clear separation of concerns
- Database queries scattered throughout code

### Process Smells

- "Don't touch that code, it's fragile"
- "Only [person] understands that module"
- Frequent production hotfixes to same area
- Features take longer and longer
- High bug rate in certain areas

### Measurement

Track metrics that indicate debt:

```typescript
// Things to measure:
- Time to implement similar features (trending up?)
- Bug rate by module
- Test coverage by module
- Build time trends
- Dependency age
- Cyclomatic complexity
```

## Documenting Debt

### GitHub Issues

Create issues for each piece of technical debt:

```markdown
## Title: [TECH-DEBT] Refactor user authentication flow

## Type
- [ ] Code quality
- [x] Architecture
- [ ] Dependencies
- [ ] Testing
- [ ] Documentation

## Description
The current auth flow was built quickly for MVP and has several issues:
- Session handling is duplicated across 5 files
- No refresh token support
- Rate limiting is inconsistent

## Impact
- **Development velocity:** Medium - Auth changes take 2x longer than expected
- **Reliability:** Low - No production issues yet
- **Security:** Medium - Missing rate limiting could enable brute force

## Proposed Solution
1. Centralize auth logic in `lib/auth/`
2. Implement refresh token rotation
3. Add consistent rate limiting middleware

## Effort Estimate
- **Size:** Large (1-2 weeks)
- **Risk:** Medium (touches critical path)

## References
- Original implementation: PR #123
- Related bug: #456
```

### Labels

Use consistent labels:

```
tech-debt           # All tech debt issues
debt:code-quality   # Refactoring, cleanup
debt:architecture   # Design changes
debt:dependencies   # Upgrades, replacements
debt:testing        # Missing or flaky tests
debt:documentation  # Missing or outdated docs
```

### Debt Register

Maintain a summary document or project board:

```markdown
# Technical Debt Register

Last updated: 2024-01-15

## Critical (Address ASAP)
| Issue | Impact | Effort | Owner |
|-------|--------|--------|-------|
| #123 - Auth refactor | High | Large | @alice |

## High Priority (This Quarter)
| Issue | Impact | Effort | Owner |
|-------|--------|--------|-------|
| #456 - DB query optimization | Medium | Medium | @bob |
| #789 - Update React 18 | Medium | Small | Unassigned |

## Backlog (When Possible)
| Issue | Impact | Effort | Owner |
|-------|--------|--------|-------|
| #101 - Component library cleanup | Low | Large | Unassigned |
```

## Prioritization

### Impact vs Effort Matrix

```
                    High Impact
                         │
    Quick Wins      │    DO FIRST
    (Do Soon)       │    (Schedule)
                    │
 ───────────────────┼───────────────────
                    │
    Maybe Later     │    Big Projects
    (Backlog)       │    (Plan Carefully)
                    │
                         Low Impact
         Low Effort          High Effort
```

### Scoring System

Rate each debt item:

**Impact (1-5):**
- 5: Blocks features, causes outages
- 4: Significantly slows development
- 3: Noticeable friction
- 2: Minor inconvenience
- 1: Cosmetic/nice-to-have

**Effort (1-5):**
- 1: Hours
- 2: Days
- 3: Week
- 4: 2-3 weeks
- 5: Month+

**Priority Score:** Impact × (6 - Effort)

Example:
```
Auth refactor:    Impact 4, Effort 4 → 4 × 2 = 8
DB optimization:  Impact 3, Effort 2 → 3 × 4 = 12  ← Do this first!
Component cleanup: Impact 2, Effort 4 → 2 × 2 = 4
```

### When to Address Debt

**Address immediately if:**
- Causing production issues
- Blocking critical feature work
- Security vulnerability
- Losing customers/money

**Schedule soon if:**
- Multiple developers hitting same pain point
- Area needs changes for upcoming feature
- Onboarding is significantly impacted

**Backlog if:**
- Isolated to rarely-touched code
- No upcoming work in that area
- Team has higher priorities

## Paying Down Debt

### Strategies

#### 1. The Boy Scout Rule
> "Leave the code better than you found it"

When touching code for a feature:
- Fix small issues you encounter
- Add missing tests
- Improve naming/documentation
- Refactor if scope is small

```typescript
// While implementing a feature, you notice:
function getData() { // bad name
  // ... code ...
}

// Fix it as part of your PR:
function fetchUserPreferences() {
  // ... same code ...
}
```

#### 2. Tech Debt Sprints
Dedicate time specifically to debt:
- One day per sprint
- One sprint per quarter
- "Cleanup week" after major release

#### 3. Embed in Features
Include debt work in feature estimates:

```markdown
## Feature: User Dashboard Redesign

Subtasks:
- [ ] Design implementation (3 days)
- [ ] API endpoints (2 days)
- [ ] **[DEBT] Refactor data fetching layer (1 day)**
- [ ] Testing (1 day)

Total: 7 days (includes 1 day debt paydown)
```

#### 4. Strangler Fig Pattern
For large refactors:
1. Build new implementation alongside old
2. Route new features to new code
3. Gradually migrate existing features
4. Remove old code when fully migrated

```typescript
// Phase 1: New code exists, old code still used
function getUser(id) {
  // Old implementation
}

function getUserV2(id) {
  // New implementation
}

// Phase 2: Feature flag switches traffic
function getUser(id) {
  if (featureFlags.newUserService) {
    return getUserV2(id);
  }
  return getUserLegacy(id);
}

// Phase 3: Remove old code after full migration
```

### Making the Case for Debt Work

When proposing debt work to stakeholders:

**Frame in business terms:**
- "This will reduce bug rate by X%"
- "Features in this area will ship 2x faster"
- "We'll avoid potential outage that could cost $X"
- "Developer productivity will increase"

**Provide evidence:**
- Time spent on workarounds
- Bug counts in affected areas
- Developer feedback
- Comparison to similar work

**Start small:**
- Propose a spike to assess scope
- Show results from small improvement
- Build trust with successful debt paydown

## Preventing New Debt

### Code Review

Check for debt introduction in PRs:

```markdown
## PR Review Checklist

- [ ] Does this introduce any TODOs or FIXMEs?
- [ ] Are there any "temporary" solutions?
- [ ] Is test coverage adequate?
- [ ] Does this follow established patterns?
- [ ] Are there any new dependencies? Are they justified?
```

### Definition of Done

Include quality criteria:

```markdown
## Definition of Done

- [ ] Code reviewed and approved
- [ ] Tests written and passing
- [ ] No new lint warnings
- [ ] Documentation updated
- [ ] **No TODO/FIXME without linked issue**
- [ ] **Follows established patterns**
```

### Architecture Decision Records

Document decisions to avoid re-introducing solved problems:

```markdown
# ADR-001: Use TanStack Query for Server State

## Status
Accepted

## Context
We needed a solution for server state management.

## Decision
Use TanStack Query instead of Redux for server state.

## Consequences
- Simpler code for data fetching
- Need to learn new library
- Existing Redux code will be migrated over time
```

### Dependency Policy

```markdown
## Dependency Guidelines

Before adding a dependency:
1. Check if existing deps solve the problem
2. Evaluate maintenance status (last update, open issues)
3. Consider bundle size impact
4. Document why it's needed

Quarterly:
- Review outdated dependencies
- Update patch/minor versions
- Plan major version upgrades
```

## Templates

### Tech Debt Issue Template

```markdown
---
name: Technical Debt
about: Document technical debt for tracking
labels: tech-debt
---

## Description
[Clear description of the debt]

## Type
- [ ] Code quality
- [ ] Architecture
- [ ] Dependencies
- [ ] Testing
- [ ] Documentation
- [ ] Performance

## Current State
[What exists now and why it's problematic]

## Desired State
[What it should look like]

## Impact
- Development velocity: [High/Medium/Low]
- Reliability: [High/Medium/Low]
- Security: [High/Medium/Low]

## Effort Estimate
- Size: [Small/Medium/Large]
- Risk: [High/Medium/Low]

## Related
- Created by: [PR/issue that introduced it]
- Affected areas: [files/modules]
```

## Related Resources

- [Code Review Guidelines](../team/CODE_REVIEW_GUIDELINES.md)
- [Coding Standards](CODING_STANDARDS.md)
- [Testing Guide](TESTING_GUIDE.md)
