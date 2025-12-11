---
title: Code Review Guidelines
parent: Team
grand_parent: Guides
---
# Code Review Guidelines

Standards and best practices for conducting effective code reviews that improve code quality and foster team collaboration.

## Table of Contents

- [Review Philosophy](#review-philosophy)
- [Reviewer Responsibilities](#reviewer-responsibilities)
- [Author Responsibilities](#author-responsibilities)
- [What to Review](#what-to-review)
- [Feedback Patterns](#feedback-patterns)
- [Approval Process](#approval-process)
- [Common Scenarios](#common-scenarios)

## Review Philosophy

### Goals of Code Review

1. **Catch bugs** - Find issues before they reach production
2. **Improve code quality** - Maintain consistent standards
3. **Share knowledge** - Spread understanding across the team
4. **Ensure maintainability** - Code should be clear to future readers

### Guiding Principles

- **Be constructive** - Focus on the code, not the person
- **Be specific** - Provide actionable feedback
- **Be timely** - Review within 24 hours when possible
- **Be humble** - You might be wrong, stay open to discussion
- **Be thorough** - Don't rubber-stamp reviews

## Reviewer Responsibilities

### Before Reviewing

1. **Understand the context** - Read the PR description, linked issues
2. **Allocate time** - Block time for thorough review
3. **Check CI status** - Don't review if tests are failing

### During Review

1. **Read the full diff** - Don't skim, read everything
2. **Test locally if needed** - For complex changes, pull and run
3. **Check against requirements** - Does it solve the stated problem?
4. **Consider edge cases** - What happens with unexpected input?
5. **Review tests** - Are tests adequate and meaningful?

### Response Time Expectations

| PR Size | Expected Review Time |
|---------|---------------------|
| Small (< 100 lines) | Same day |
| Medium (100-400 lines) | 24 hours |
| Large (400+ lines) | 48 hours |

## Author Responsibilities

### Before Submitting

- [ ] Self-review your own changes
- [ ] Tests pass locally
- [ ] Lint/format checks pass
- [ ] PR description is complete
- [ ] PR is appropriately sized (< 400 lines ideal)
- [ ] Relevant documentation updated

### PR Description Template

```markdown
## Summary
[Brief description of changes]

## Changes
- [Change 1]
- [Change 2]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed

## Screenshots (if UI changes)
[Before/After screenshots]

## Related Issues
Closes #123
```

### Responding to Feedback

- **Respond to all comments** - Even if just "Done"
- **Ask for clarification** - If feedback is unclear
- **Explain your reasoning** - If you disagree, explain why
- **Don't take it personally** - Reviews are about code quality
- **Push follow-up commits** - Don't force-push unless asked

## What to Review

### Must Check

| Category | What to Look For |
|----------|------------------|
| **Correctness** | Does it work? Handle edge cases? |
| **Security** | Input validation? Auth checks? No secrets? |
| **Tests** | Adequate coverage? Meaningful assertions? |
| **Performance** | N+1 queries? Memory leaks? Unnecessary re-renders? |
| **Error Handling** | Errors caught? User-friendly messages? |

### Should Check

| Category | What to Look For |
|----------|------------------|
| **Readability** | Clear naming? Appropriate comments? |
| **Consistency** | Follows project patterns? |
| **Maintainability** | Easy to modify? No code duplication? |
| **Dependencies** | New dependencies justified? |

### Don't Nitpick

- Formatting issues (let the linter handle it)
- Minor style preferences not in the style guide
- Hypothetical future problems

## Feedback Patterns

### Comment Types

Use prefixes to clarify intent:

| Prefix | Meaning | Blocks Approval? |
|--------|---------|------------------|
| `[blocking]` | Must fix before merge | Yes |
| `[suggestion]` | Would improve but optional | No |
| `[question]` | Need clarification | Depends |
| `[nit]` | Very minor, optional | No |
| `[praise]` | Something done well | No |

### Examples

**Good Feedback:**
```
[blocking] This query will cause an N+1 problem. Consider using `include`:

prisma.user.findMany({
  include: { posts: true }
})
```

```
[suggestion] This could be simplified using array destructuring:

const [first, ...rest] = items;
```

```
[question] Why did we choose to use localStorage here instead of
cookies? Cookies would persist across tabs.
```

```
[nit] Typo: "recieve" → "receive"
```

```
[praise] Nice use of the builder pattern here, makes the
configuration much more readable.
```

**Bad Feedback:**
```
❌ "This is wrong"
❌ "I would have done it differently"
❌ "Why?"
❌ "..." (comment with no explanation)
```

### Constructive Criticism Framework

1. **Observation** - What you see
2. **Impact** - Why it matters
3. **Suggestion** - How to improve

Example:
```
[blocking] This function has 8 parameters (observation), which makes
it hard to use correctly and easy to pass arguments in wrong order
(impact). Consider using an options object instead (suggestion):

function createUser(options: CreateUserOptions) { ... }
```

## Approval Process

### Approval Requirements

| Change Type | Required Approvals | Who Can Approve |
|-------------|-------------------|-----------------|
| Standard feature | 1 | Any team member |
| Critical path (auth, payments) | 2 | Senior + any member |
| Infrastructure changes | 2 | DevOps + senior |
| Security-related | 2 | Security champion + senior |

### Approval Meanings

- **Approve**: Code is good to merge
- **Request Changes**: Must address feedback before merge
- **Comment**: Feedback provided, no strong opinion

### When to Request Changes

- Security vulnerabilities
- Bugs that would affect users
- Missing tests for critical paths
- Breaking API changes without migration plan
- Performance issues that would impact production

### When to Approve with Comments

- Minor improvements suggested
- Style preferences
- Documentation could be better
- Edge cases that can be addressed later

## Common Scenarios

### Large PRs

**If reviewing a large PR:**
1. Ask author if it can be split
2. Review in multiple sessions if needed
3. Focus on architecture first, details second

**If submitting a large PR:**
1. Consider splitting into smaller PRs
2. Provide extra context in description
3. Use draft PR for early feedback
4. Offer to walk through changes with reviewer

### Disagreements

1. **Discuss, don't argue** - Understand the other perspective
2. **Reference standards** - Point to docs/style guide
3. **Escalate if stuck** - Get a third opinion
4. **Timebox discussions** - Don't block on minor issues

### Urgent Fixes

For production hotfixes:
1. Get minimum one approval
2. Author can self-merge after approval
3. Document in PR that it was urgent
4. Schedule follow-up review if needed

### New Team Members

When reviewing PRs from new team members:
- Be extra thorough but kind
- Explain the "why" behind feedback
- Point to relevant documentation
- Offer to pair if complex

When new members review your code:
- Explain context they might not have
- Encourage questions
- Thank them for their review

## Review Checklist

Use this checklist for thorough reviews:

### Functionality
- [ ] Code does what the PR description says
- [ ] Edge cases handled
- [ ] No obvious bugs

### Security
- [ ] Input validated
- [ ] Authentication/authorization correct
- [ ] No sensitive data exposed
- [ ] No SQL injection, XSS, etc.

### Code Quality
- [ ] Readable and well-named
- [ ] No unnecessary complexity
- [ ] Follows project patterns
- [ ] DRY (no code duplication)

### Testing
- [ ] Tests cover new code
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases tested

### Performance
- [ ] No N+1 queries
- [ ] No unnecessary API calls
- [ ] No memory leaks
- [ ] Appropriate caching

### Documentation
- [ ] Complex logic explained
- [ ] API changes documented
- [ ] README updated if needed

## Related Resources

- [Coding Standards](../development/CODING_STANDARDS.md)
- [Testing Guide](../development/TESTING_GUIDE.md)
- [Branch Strategy](BRANCH_STRATEGY.md)
