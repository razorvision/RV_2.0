# Reference Documentation

Quick-access reference materials for common lookups. Unlike guides (which teach concepts), reference docs are designed for fast lookups when you know what you're looking for.

## Available References

| Document | Description | Use When... |
|----------|-------------|-------------|
| [Environment Variables](ENV_VARIABLES.md) | All env vars with descriptions and sources | Setting up `.env.local` or debugging config |

## Quick Commands

### Git

```bash
# Create feature branch
git checkout -b feature/my-feature

# Conventional commit
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feature/my-feature && gh pr create
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Lint and fix
npm run lint -- --fix

# Type check
npm run typecheck
```

### Database (Prisma)

```bash
# Push schema changes
npx prisma db push

# Generate client
npx prisma generate

# Open database GUI
npx prisma studio

# Create migration
npx prisma migrate dev --name description
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Rebuild and start
docker-compose up --build

# Stop all
docker-compose down
```

### Claude Code

```bash
# Start Claude Code
claude

# Check MCP servers
/mcp

# Available slash commands
/review-security    # Security audit
/review-code        # Code quality review
/create-component   # Generate React component
/add-test          # Generate tests
```

### GitHub CLI

```bash
# List issues
gh issue list

# Create issue
gh issue create

# List PRs
gh pr list

# Create PR
gh pr create

# View PR checks
gh pr checks
```

## Keyboard Shortcuts

### VS Code

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick open file |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+\`` | Toggle terminal |
| `Ctrl+B` | Toggle sidebar |
| `F12` | Go to definition |
| `Shift+F12` | Find all references |
| `Ctrl+Shift+F` | Search in files |

### Claude Code (Terminal)

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit Claude Code |
| `↑` / `↓` | Navigate history |
| `Tab` | Autocomplete |

## Common Patterns

### API Response Format

```typescript
// Success
{ data: T, error: null }

// Error
{ data: null, error: { code: string, message: string } }
```

### Component File Structure

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook (optional)
└── index.ts              # Re-export
```

### Branch Naming

```
feature/   - New features
fix/       - Bug fixes
hotfix/    - Critical production fixes
docs/      - Documentation only
refactor/  - Code refactoring
test/      - Test additions
chore/     - Maintenance tasks
```

## Links

- [Setup Checklist](../../SETUP_CHECKLIST.md) - Dev environment setup
- [Common Tasks](../COMMON_TASKS.md) - Day-to-day workflows
- [Coding Standards](../guides/development/CODING_STANDARDS.md) - Code quality guidelines
