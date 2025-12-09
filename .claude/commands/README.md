# Slash Commands Library

Custom slash commands for Claude Code to streamline common development tasks.

## Available Commands

### Project Setup

#### `/init-project`
Initialize a new project from templates
- Copies starter templates (Next.js, Prisma, Docker)
- Configures package.json with project name
- Sets up authentication
- Generates .env.example
- Interactive tech stack selection

#### `/init-database`
Set up database connection and Prisma ORM
- Supports Supabase, Neon, PlanetScale, local PostgreSQL, SQLite
- Installs Prisma dependencies
- Copies schema template with common models
- Configures connection for chosen provider
- Generates Prisma client

#### `/init-auth`
Set up authentication with your chosen provider
- Supports NextAuth.js, Clerk, Supabase Auth
- Creates auth configuration
- Sets up API routes
- Configures OAuth providers
- Creates sign-in page (optional)

#### `/generate-env`
Interactively create .env.local file
- Reads .env.example for required variables
- Generates secrets automatically
- Asks for values interactively
- Validates configuration
- Creates .env.local with proper formatting

#### `/check-setup`
Validate development environment
- Checks required files exist
- Validates environment variables
- Tests database connection
- Verifies dependencies installed
- Runs TypeScript check
- Generates summary report

---

### Code Review & Quality

#### `/review-security`
Perform comprehensive security review of the codebase
- Checks for hardcoded secrets and credentials
- Reviews input validation and SQL injection prevention
- Analyzes authentication and authorization
- Audits dependencies for vulnerabilities
- Reviews MCP configuration security
- Generates prioritized report with fixes

#### `/review-code`
Comprehensive code review following project standards
- Checks coding standards compliance
- Reviews TypeScript quality and type safety
- Identifies code duplication and performance issues
- Verifies error handling and testing
- Reviews accessibility compliance
- Provides actionable feedback

### Code Generation

#### `/create-component`
Create new React component following project standards
- Interactive prompts for component details
- Generates component with proper structure
- Creates test file automatically
- Updates exports
- Follows project conventions

#### `/create-api-route`
Create new API endpoint with full CRUD operations
- Generates Express route handlers
- Includes request validation (Zod)
- Adds authentication middleware
- Implements rate limiting
- Creates integration tests
- Follows REST conventions

#### `/add-test`
Generate tests for existing code
- Supports unit, integration, and e2e tests
- Uses project's test framework (Vitest/Jest/Playwright)
- Includes edge cases and error scenarios
- Tests accessibility
- Provides coverage metrics

### Code Improvement

#### `/refactor`
Refactor code following best practices
- Extracts functions to reduce complexity
- Eliminates code duplication
- Improves type safety
- Uses early returns and simplifies logic
- Maintains test coverage
- Generates metrics on improvements

#### `/optimize`
Analyze and optimize code for performance
- Frontend optimization (React, images, bundling)
- Backend optimization (queries, caching, async)
- Database optimization (N+1, indexes, pagination)
- Build optimization (tree shaking, code splitting)
- Provides before/after metrics

#### `/debug`
Systematic debugging assistance
- Reproduces issues
- Isolates problem area
- Adds debugging output
- Identifies common patterns (async, state, race conditions)
- Provides root cause analysis
- Suggests preventive measures

## Usage

### Basic Usage

Simply type the slash command in Claude Code:

```
/review-security
```

Claude will execute the command and follow the defined workflow.

### With Context

Reference files or directories:

```
/review-code src/components/UserDashboard.tsx
```

```
/optimize src/api/users.ts
```

### Interactive Mode

Most commands will ask follow-up questions:

```
/create-component

> What is the component name? UserProfile
> Component type? feature component
> Required props? user: User, onUpdate?: () => void
...
```

## Command Structure

Each command is a markdown file in `.claude/commands/` that defines:

1. **Instructions** - What Claude should do
2. **Workflow** - Step-by-step process
3. **Templates** - Code examples and patterns
4. **Output Format** - How to present results
5. **Confirmation** - What to ask user after completion

## Creating Custom Commands

### 1. Create Command File

Create `.claude/commands/your-command.md`:

```markdown
# Your Command Title

Brief description of what this command does.

## Instructions

1. Ask the user for:
   - Required input 1
   - Required input 2

2. Then perform:
   - Action 1
   - Action 2

## Template

\`\`\`typescript
// Code template
\`\`\`

## Output Format

\`\`\`markdown
# Report Title
[What to include]
\`\`\`

## Confirm with User

- Show results
- Ask follow-up questions
```

### 2. Test the Command

```
/your-command
```

### 3. Document It

Add your command to this README.

## Best Practices

### When Creating Commands

1. **Be specific** - Clear, actionable instructions
2. **Provide templates** - Show code examples
3. **Define output** - Specify format for results
4. **Ask questions** - Get user input for decisions
5. **Confirm completion** - Verify results with user

### When Using Commands

1. **Provide context** - Reference specific files
2. **Review outputs** - Don't blindly accept suggestions
3. **Run tests** - Verify changes work
4. **Commit incrementally** - Small, logical commits
5. **Document decisions** - Note why changes were made

## Command Categories

### 🚀 Project Setup
- `/init-project` - Initialize new project
- `/init-database` - Set up database
- `/init-auth` - Configure authentication
- `/generate-env` - Create environment file
- `/check-setup` - Validate configuration

### 🔍 Analysis
- `/review-security` - Security audit
- `/review-code` - Code quality review
- `/debug` - Troubleshooting

### 🏗️ Generation
- `/create-component` - New React component
- `/create-api-route` - New API endpoint
- `/add-test` - Test generation

### ⚡ Optimization
- `/refactor` - Code improvement
- `/optimize` - Performance tuning

## Examples

### Security Review Workflow

```bash
# 1. Run security review
/review-security

# 2. Review generated report
# Critical Issues: 2
# High Priority: 5
# Medium Priority: 8
# Low Priority: 3

# 3. Address issues by priority
# Fix critical issues first

# 4. Re-run to verify
/review-security
```

### Component Creation Workflow

```bash
# 1. Create component
/create-component

> Component name? ProductCard
> Type? UI component
> Props? product: Product, onAddToCart: (id: string) => void

# 2. Review generated files
# - src/components/ui/ProductCard.tsx
# - src/components/ui/ProductCard.test.tsx

# 3. Customize as needed
# 4. Run tests
npm test ProductCard
```

### Refactoring Workflow

```bash
# 1. Identify complex file
/review-code src/utils/processOrder.ts

# 2. Refactor based on findings
/refactor src/utils/processOrder.ts

# 3. Review changes
# - Complexity: 12 → 4
# - Functions: 1 → 4
# - Lines: 85 → 45

# 4. Verify tests pass
npm test
```

## Tips

### Get More Value

1. **Combine commands** - Review then refactor
2. **Be specific** - Reference exact files/functions
3. **Iterate** - Run commands multiple times
4. **Learn patterns** - Study generated code
5. **Customize** - Modify commands for your needs

### Common Workflows

**New Feature:**
1. `/create-component` - Generate component
2. `/create-api-route` - Create backend
3. `/add-test` - Add tests
4. `/review-code` - Review quality

**Bug Fix:**
1. `/debug` - Troubleshoot issue
2. Fix the bug
3. `/add-test` - Prevent regression
4. `/review-security` - Check for vulnerabilities

**Performance Issue:**
1. `/review-code` - Find inefficiencies
2. `/optimize` - Apply optimizations
3. `/add-test` - Verify functionality
4. Measure improvements

**Code Cleanup:**
1. `/review-code` - Identify issues
2. `/refactor` - Clean up code
3. `/add-test` - Ensure coverage
4. `/review-code` - Verify improvements

## Troubleshooting

### Command Not Found

Ensure file exists in `.claude/commands/` and has `.md` extension.

### Command Doesn't Work as Expected

1. Check command file format
2. Verify instructions are clear
3. Test with simple inputs first
4. Review Claude's interpretation

### Command Takes Too Long

1. Narrow scope (specific files)
2. Break into smaller commands
3. Provide more context upfront

## Contributing

To add new commands to this template:

1. Create command file in `.claude/commands/`
2. Follow existing command structure
3. Test thoroughly
4. Update this README
5. Commit with descriptive message

## Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [Slash Commands Guide](https://code.claude.com/docs/slash-commands)
- [Project Coding Standards](../CODING_STANDARDS.md)
- [Project Security Policy](../SECURITY.md)

---

**Commands Version:** 1.0.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
