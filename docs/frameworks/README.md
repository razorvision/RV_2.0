# Framework Guides

This directory contains framework-specific documentation, patterns, and gotchas for common tech stacks.

## Available Guides

| Guide | Framework | Description |
|-------|-----------|-------------|
| [NEXTJS_PATTERNS.md](NEXTJS_PATTERNS.md) | Next.js | App Router, caching, environment variables |
| [PRISMA_PATTERNS.md](PRISMA_PATTERNS.md) | Prisma | ORM patterns, migrations, connections |
| [NEXTAUTH_PATTERNS.md](NEXTAUTH_PATTERNS.md) | NextAuth.js | Authentication patterns, sessions, rate limiting |
| [AUTH_IMPLEMENTATION_GUIDE.md](AUTH_IMPLEMENTATION_GUIDE.md) | Auth | Step-by-step authentication implementation |
| [Database Patterns](DATABASE_PATTERNS.md) | Prisma | Transactions, soft deletes, audit trails |
| [Performance Guide](PERFORMANCE_GUIDE.md) | General | Core Web Vitals, Next.js optimization, caching |

## When to Use These Guides

### Starting a New Project

1. Review relevant guides for your tech stack
2. Copy patterns that apply to your project
3. Customize the [CLAUDE.md](../../CLAUDE.md) framework section
4. Follow [AUTH_IMPLEMENTATION_GUIDE.md](AUTH_IMPLEMENTATION_GUIDE.md) for auth setup

### Adding a New Framework

When introducing a new framework to an existing project:

1. Check if a guide exists here
2. Review the patterns before implementing
3. Update CLAUDE.md with framework-specific notes

### Deep Dives

- **Database Patterns** - When working with Prisma, designing schemas, or implementing data patterns like soft deletes or audit logging
- **Performance Guide** - When optimizing page load times, addressing Core Web Vitals, or implementing caching

### Troubleshooting

These guides include "Common Gotchas" sections that document:
- Known issues and workarounds
- Environment-specific problems
- Integration challenges

## Customizing for Your Project

These guides are **starting points**. Customize for your project:

1. **Copy relevant sections** to your project's CLAUDE.md
2. **Add project-specific details** (ports, URLs, configs)
3. **Remove irrelevant content** (frameworks you don't use)
4. **Add new learnings** as you discover them

## Contributing New Guides

When adding a new framework guide:

1. Use the existing guides as templates
2. Include these sections:
   - Overview / Quick Start
   - Common Patterns
   - Configuration
   - Common Gotchas
   - Commands Reference
   - Related Documentation
3. Add to the table above
4. Cross-reference from CLAUDE.md

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project guidelines (includes framework section)
- [Development Guides](../guides/development/) - General coding patterns
- [API Patterns](../guides/development/API_PATTERNS.md) - REST API conventions
- [MCP Setup](../integrations/MCP_SETUP.md) - Database server setup
- [Project Intake Checklist](../guides/PROJECT_INTAKE_CHECKLIST.md) - Full project setup
