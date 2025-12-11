---
title: Change Request Workflow
parent: Workflows
---
# Change Request Workflow

This document describes the structured workflow for handling non-trivial code changes. Following this process ensures alignment between developers and stakeholders before investing time in implementation.

## Table of Contents

- [Why This Workflow Matters](#why-this-workflow-matters)
- [The 5-Step Process](#the-5-step-process)
- [Write-up Template](#write-up-template)
- [When to Skip This Workflow](#when-to-skip-this-workflow)
- [Examples](#examples)
- [Common Pitfalls](#common-pitfalls)

---

## Why This Workflow Matters

### Problems This Solves

1. **Wasted Implementation Effort**
   - Without alignment, developers may implement solutions that don't match expectations
   - Rework is expensive and demoralizing

2. **Missed Edge Cases**
   - Research phase catches issues before they become bugs
   - Trade-offs are discussed upfront, not discovered in code review

3. **Poor Documentation**
   - Issues become a natural record of decisions
   - Future developers understand *why* choices were made

4. **Scope Creep**
   - Explicit approval creates clear boundaries
   - Changes to scope require new approval

### Benefits

- **Faster Reviews:** Reviewers already understand the approach
- **Better Quality:** Edge cases caught early
- **Clear History:** Decisions documented in issues
- **Team Alignment:** Everyone agrees before work begins

---

## The 5-Step Process

### Step 1: Research Deeply

Before proposing any solution, understand the problem thoroughly.

**Activities:**
- Read all relevant source files
- Understand existing patterns and conventions
- Identify all components that will be affected
- Consider edge cases and error scenarios
- Review related issues and past decisions

**Questions to Answer:**
- What is the root cause (for bugs) or core requirement (for features)?
- What existing code/patterns can we leverage?
- What are the potential side effects?
- Are there related issues or technical debt to consider?

**Output:** Mental model of the problem and potential solutions.

---

### Step 2: Create a Write-up

Document your findings and proposed approach.

**For Bug Fixes:**
- Root cause analysis
- How the bug manifests
- Proposed fix with specific files/functions
- How to verify the fix
- Regression risks

**For Features:**
- Design approach
- Components to create/modify
- Data model changes (if any)
- API changes (if any)
- Migration strategy (if applicable)

**For All Changes:**
- Trade-offs and alternatives considered
- Open questions or concerns
- Estimated scope/complexity

---

### Step 3: Create GitHub Issue

File an issue with your write-up for tracking and discussion.

**Issue Structure:**
```markdown
## Summary
[One paragraph describing the change]

## Analysis
[Your research findings]

## Proposed Approach
[Detailed implementation plan]

## Files to Modify
- `path/to/file1.ts` - [what changes]
- `path/to/file2.ts` - [what changes]

## Trade-offs
[Alternatives considered and why this approach was chosen]

## Open Questions
[Any uncertainties to discuss]

## Test Plan
[How to verify the change works]
```

**Labels to Apply:**
- Type: `type: bug`, `type: feature`, `type: refactor`
- Priority: `priority: high`, `priority: medium`, `priority: low`
- Status: `status: needs-review`

---

### Step 4: Request Review

Present the write-up and wait for explicit approval.

**What to Say:**
> "I've analyzed [the issue] and documented my proposed approach in #[issue-number]. Could you review the approach before I start implementation?"

**During Review:**
- Answer questions about the approach
- Discuss alternatives if raised
- Clarify any ambiguities
- Update the issue based on feedback

**Wait For:**
- Explicit approval ("looks good", "approved", "go ahead")
- Or requested changes to the approach

**Do NOT proceed without approval** for non-trivial changes.

---

### Step 5: Implement with Approval

Only after receiving approval, begin implementation.

**During Implementation:**
- Follow the approved approach
- Reference the issue in commits: `fix: resolve auth timeout (#123)`
- If you discover the approach needs to change, go back to Step 4
- Test thoroughly before presenting results

**After Implementation:**
- Create PR referencing the issue
- Summarize any deviations from the plan
- Request review

---

## Write-up Template

Copy this template for your issue write-ups:

```markdown
## Summary

[One sentence describing what this change accomplishes]

## Problem / Motivation

[Why is this change needed? What problem does it solve?]

## Analysis

### Current Behavior
[How does the system currently work?]

### Root Cause (for bugs)
[What is causing the issue?]

### Requirements (for features)
[What must this change accomplish?]

## Proposed Approach

### Overview
[High-level description of the solution]

### Implementation Details

1. **[Component/File 1]**
   - [Specific changes]

2. **[Component/File 2]**
   - [Specific changes]

### Files to Modify

| File | Changes |
|------|--------|
| `path/to/file.ts` | [Description] |

## Alternatives Considered

### Option A: [Name]
- **Pros:** [advantages]
- **Cons:** [disadvantages]
- **Why not:** [reason for rejection]

### Option B: [Name]
- [Same structure]

## Trade-offs

- [Trade-off 1 and why it's acceptable]
- [Trade-off 2 and why it's acceptable]

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

## Test Plan

1. [Test scenario 1]
2. [Test scenario 2]
3. [Regression tests to add]

## Risks

- [Potential risk 1 and mitigation]
- [Potential risk 2 and mitigation]
```

---

## When to Skip This Workflow

Not every change needs the full process. Skip for:

### Trivial Changes
- Typo fixes in documentation
- Minor formatting adjustments
- Updating dependencies (unless breaking)
- Adding missing imports

### Pre-Approved Work
- Changes explicitly requested with clear specifications
- Following up on approved approach with minor additions
- Implementing approved designs exactly as specified

### Emergency Situations
- Production hotfixes (document afterward)
- Security patches (document afterward)
- Critical bug fixes blocking users

**Rule of Thumb:** If you could explain the entire change in one sentence and there's no ambiguity, you can probably skip the formal write-up.

---

## Examples

### Example 1: Bug Fix Write-up

```markdown
## Summary

Fix authentication timeout causing users to be logged out after 5 minutes of inactivity.

## Problem

Users report being unexpectedly logged out while actively using the application.

## Analysis

### Root Cause
The JWT token refresh logic in `src/lib/auth.ts` only triggers on page navigation, not on API calls. Users making API calls without navigating don't get their tokens refreshed.

### Current Behavior
- Token expires after 15 minutes
- Refresh only happens on `router.push()` calls
- API calls with expired token fail silently

## Proposed Approach

1. Add token refresh logic to the API client (`src/lib/api.ts`)
2. Check token expiry before each API call
3. Refresh if within 5 minutes of expiry
4. Add error handling for refresh failures

### Files to Modify

| File | Changes |
|------|--------|
| `src/lib/api.ts` | Add token check before requests |
| `src/lib/auth.ts` | Export refresh function |
| `src/hooks/useAuth.ts` | Handle refresh errors |

## Test Plan

1. Set token expiry to 1 minute in dev
2. Make API calls without navigating
3. Verify token refreshes automatically
4. Test refresh failure scenario
```

### Example 2: Feature Write-up

```markdown
## Summary

Add dark mode toggle to application settings.

## Motivation

Users have requested dark mode for reduced eye strain during nighttime use.

## Proposed Approach

### Overview
Implement CSS custom properties for theming with a React context for state management. Theme preference persists to localStorage.

### Implementation Details

1. **Theme Context** (`src/contexts/ThemeContext.tsx`)
   - Create context with `theme` state and `toggleTheme` function
   - Initialize from localStorage or system preference
   - Persist changes to localStorage

2. **CSS Variables** (`src/app/globals.css`)
   - Define color variables for light/dark themes
   - Use `[data-theme="dark"]` selector on html element

3. **Toggle Component** (`src/components/ThemeToggle.tsx`)
   - Button with sun/moon icon
   - Uses ThemeContext

4. **Settings Integration** (`src/app/settings/page.tsx`)
   - Add toggle to settings page

## Alternatives Considered

### Tailwind Dark Mode Classes
- **Pros:** Built-in, well-documented
- **Cons:** Requires adding `dark:` variants everywhere
- **Why not:** More maintenance, harder to add new themes later

## Trade-offs

- Initial flash possible before JS hydrates (mitigated with script in head)
- Slightly more complex than Tailwind approach

## Test Plan

1. Toggle works and persists across page refreshes
2. System preference detected on first visit
3. All components render correctly in both themes
```

---

## Common Pitfalls

### 1. Skipping Research

**Problem:** Jumping to implementation without understanding the codebase.

**Result:** Solutions that don't fit existing patterns, unexpected side effects.

**Solution:** Always read related code first, even if you think you know the answer.

### 2. Vague Write-ups

**Problem:** Write-up says "fix the bug" without explaining how.

**Result:** Approval is meaningless because the approach isn't clear.

**Solution:** Be specific about files, functions, and logic changes.

### 3. Implementing Before Approval

**Problem:** Starting work while waiting for approval.

**Result:** Wasted effort if approach is rejected or modified.

**Solution:** Work on other tasks while waiting, or ask for expedited review.

### 4. Not Updating the Plan

**Problem:** Discovering issues during implementation but not communicating them.

**Result:** Final implementation doesn't match approved plan, causing confusion.

**Solution:** If the approach changes, update the issue and get re-approval for significant changes.

### 5. Over-Engineering Write-ups

**Problem:** Spending hours on write-up for a simple change.

**Result:** Process feels burdensome, team stops using it.

**Solution:** Scale the write-up to the change. Simple changes need simple write-ups.

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project development guidelines
- [Code Quality Policy](../guides/CODE_QUALITY_POLICY.md) - Code standards
- [Branch Strategy](../guides/BRANCH_STRATEGY.md) - Git workflow
- [Claude Code Workflows](CLAUDE_CODE_WORKFLOWS.md) - AI-assisted development

---

**Last Updated:** 2024-12-08
**Maintained By:** Development Team
