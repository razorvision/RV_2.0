# Development Guides

Day-to-day coding standards, patterns, and best practices for building quality software.

## Guides

| Guide | Description |
|-------|-------------|
| [Coding Standards](CODING_STANDARDS.md) | Code style, formatting, and naming conventions |
| [Testing Guide](TESTING_GUIDE.md) | Unit, integration, and E2E testing patterns |
| [API Patterns](API_PATTERNS.md) | REST conventions, validation, and error handling |
| [State Management](STATE_MANAGEMENT.md) | React state, Context, and external stores |
| [Error Handling](ERROR_HANDLING.md) | Error boundaries, async errors, and logging |
| [Feature Flags](FEATURE_FLAGS.md) | Safe rollouts, A/B testing, kill switches |
| [Technical Debt](TECHNICAL_DEBT.md) | Identifying, tracking, and paying down debt |

## Quick Reference

### Before Writing Code
1. Review [Coding Standards](CODING_STANDARDS.md) for style expectations
2. Check [API Patterns](API_PATTERNS.md) if building endpoints
3. Plan your [State Management](STATE_MANAGEMENT.md) approach

### While Writing Code
1. Follow [Error Handling](ERROR_HANDLING.md) patterns
2. Write tests per [Testing Guide](TESTING_GUIDE.md)
3. Use [Feature Flags](FEATURE_FLAGS.md) for risky changes
4. Run linters before committing

### Before Submitting PR
1. All tests passing
2. No lint errors
3. Error handling in place
4. Types are complete
5. Document any [Technical Debt](TECHNICAL_DEBT.md) introduced
