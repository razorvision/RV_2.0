# Claude Code Workflows & Best Practices

This guide documents effective workflows and usage patterns for Claude Code based on official Anthropic best practices and team learnings.

## Table of Contents

- [Getting Started](#getting-started)
- [Core Workflow Patterns](#core-workflow-patterns)
- [Configuration](#configuration)
- [Permissions Management](#permissions-management)
- [Slash Commands](#slash-commands)
- [Effective Prompting](#effective-prompting)
- [Testing Workflows](#testing-workflows)
- [Code Review Workflow](#code-review-workflow)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- **Claude Code installed** - Download from [claude.com/code](https://code.claude.com)
- **Node.js 18+** - Required for many MCP servers
- **GitHub CLI** - Recommended for GitHub automation
- **Project configured** - CLAUDE.md file in repository root

### First-Time Setup

1. **Start Claude Code** in your project directory:
   ```bash
   cd your-project
   claude
   ```

2. **Approve MCP servers** when prompted (if using `.mcp.json`)

3. **Configure permissions** using `/permissions` command or settings file

4. **Review project context** - Claude will read your CLAUDE.md file automatically

## Core Workflow Patterns

### 1. Explore-Plan-Code-Commit Pattern

This is the **recommended workflow** for most development tasks.

#### Phase 1: Explore
Request information without making changes:

```
"Read the authentication module and explain how it works"
"Show me the current project structure"
"What testing framework are we using?"
```

**Why:** Gather context before making changes. Claude Code has access to:
- File system (via Read tool)
- Git history
- Project documentation (CLAUDE.md)
- Code search (via Grep/Glob)

#### Phase 2: Plan
Ask Claude to create an implementation plan:

```
"Plan how to add user profile editing functionality"
"Think through the steps needed to implement dark mode"
"What files would we need to modify to add API rate limiting?"
```

**Use "think" for extended analysis:**
```
"Think deeply about the best approach for implementing real-time notifications"
```

**Why:** Planning before coding leads to better architecture decisions and catches edge cases early.

#### Phase 3: Code
Implement the solution:

```
"Implement the user profile editing functionality we discussed"
"Add dark mode support following the plan"
"Create the API rate limiting middleware"
```

**Why:** With a plan in place, implementation is faster and more focused.

#### Phase 4: Commit
Review and commit changes:

```
"Review the changes we made and create a commit"
"Create a PR for the profile editing feature"
```

**Why:** Structured commits with clear messages improve project history.

**Complete Example:**
```markdown
User: "Read src/auth/login.ts and explain the authentication flow"
Claude: [Reads file and explains]

User: "Plan how to add two-factor authentication to this flow"
Claude: [Creates detailed plan]

User: "Implement the 2FA feature following your plan"
Claude: [Writes code]

User: "Create a commit and PR for this feature"
Claude: [Creates commit and PR with proper formatting]
```

### 2. Test-Driven Development (TDD) Workflow

Write tests first, then implement features.

#### Step 1: Write Tests
```
"Create unit tests for a user registration function that:
- Validates email format
- Checks password strength
- Prevents duplicate emails
- Returns appropriate error messages"
```

#### Step 2: Confirm Failures
```
"Run the tests and confirm they fail"
```

#### Step 3: Commit Tests
```
"Commit the tests with message: 'test: Add user registration validation tests'"
```

#### Step 4: Implement Feature
```
"Now implement the user registration function to make these tests pass"
```

#### Step 5: Iterative Development
```
"Run the tests again"
[If failures] "Fix the failing tests"
[Repeat until all pass]
```

#### Step 6: Final Commit
```
"Commit the implementation with message: 'feat: Add user registration with validation'"
```

**Benefits:**
- Tests serve as specifications
- Confidence in implementation correctness
- Clear definition of "done"
- Regression prevention

### 3. Visual Iteration Workflow

For UI development with immediate visual feedback.

#### Step 1: Initial Implementation
```
"Create a user profile card component with:
- Avatar image
- Name and email
- Edit button
- Responsive design"
```

#### Step 2: Visual Review
Take a screenshot or run the app and describe what you see:

```
"The card looks good but the spacing is too tight.
Increase padding and add more space between elements"
```

#### Step 3: Iterative Refinement
```
"Make the avatar larger and circular"
"Add a subtle shadow to make it stand out"
"Ensure it works well in dark mode"
```

#### Step 4: Accessibility Check
```
"Review this component for accessibility issues"
"Add ARIA labels where needed"
```

**Best for:** UI components, styling adjustments, responsive design

### 4. Debugging Workflow

Systematic approach to fixing bugs.

#### Step 1: Reproduce
```
"Help me debug this issue: [describe the bug]
Here's what I'm seeing: [error message or behavior]
Steps to reproduce: [numbered steps]"
```

#### Step 2: Investigate
```
"Read the relevant files and identify potential causes"
"Check the git history for recent changes to this code"
"Search for similar issues in closed GitHub issues"
```

#### Step 3: Hypothesis
```
"Based on your investigation, what do you think is causing this?"
```

#### Step 4: Fix
```
"Implement a fix for the identified issue"
```

#### Step 5: Verify
```
"Add a test that would have caught this bug"
"Verify the fix resolves the issue"
```

#### Step 6: Document
```
"Add a comment explaining why this fix was necessary"
"Update documentation if this reveals a gotcha"
```

## Configuration

### CLAUDE.md File

Place a `CLAUDE.md` file in your repository root to provide project context.

**File locations (in priority order):**
1. `./CLAUDE.md` or `./.claude/CLAUDE.md` - Project root
2. Per-directory CLAUDE.md files - Directory-specific guidance
3. `~/.claude/CLAUDE.md` - User's home directory (personal preferences)

**What to include:**
- **Tech stack** - Frameworks, tools, versions
- **Project structure** - Key directories and their purposes
- **Commands** - Build, test, lint, deploy scripts
- **Code style** - Formatting rules, naming conventions
- **Repository etiquette** - Branch naming, commit format
- **Custom tools** - Project-specific scripts and utilities

**Example template:** See `.project-intake/templates/CLAUDE.md`

### Settings Files

**Project-scoped** (`.claude/settings.json`):
```json
{
  "permissions": {
    "allow": ["Read", "Edit", "Bash(git:*)", "Bash(npm:*)"],
    "deny": [],
    "ask": ["Write"]
  }
}
```

**User-scoped** (`~/.claude/settings.json`):
```json
{
  "permissions": {
    "allow": [
      "Bash",
      "Bash(*)",
      "Read",
      "Read(*)",
      "Edit",
      "Edit(*)",
      "Write",
      "Write(*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

**Local overrides** (`.claude/settings.local.json`):
- Not committed to git
- Machine-specific settings
- Highest priority in the configuration hierarchy

**Configuration hierarchy:** Local > Project > User

## Permissions Management

### Using /permissions Command

```bash
# View current permissions
/permissions

# Add tool to allowlist
/permissions add Edit

# Add specific command pattern
/permissions add "Bash(git:*)"

# Remove from allowlist
/permissions remove Write

# Add to denylist
/permissions deny "Bash(rm:*)"
```

### Recommended Permission Sets

**Minimal (safest):**
```json
{
  "allow": ["Read", "Grep", "Glob"],
  "ask": ["Edit", "Write", "Bash"]
}
```

**Standard (balanced):**
```json
{
  "allow": [
    "Read", "Edit", "Grep", "Glob",
    "Bash(git:*)", "Bash(npm:*)", "Bash(gh:*)"
  ],
  "ask": ["Write", "Bash"]
}
```

**Permissive (convenience):**
```json
{
  "allow": ["Bash(*)", "Read(*)", "Edit(*)", "Write(*)", "Grep(*)", "Glob(*)"],
  "deny": [],
  "ask": []
}
```

**For team collaboration:** Use project-scoped settings with explicit tool allowlists.

## Slash Commands

Slash commands are stored in `.claude/commands/` and provide reusable workflows.

### Directory Organization

```
.claude/commands/
├── setup/
│   ├── new-feature.md
│   └── new-component.md
├── review/
│   ├── security-audit.md
│   └── code-quality.md
├── git/
│   ├── sync-upstream.md
│   └── clean-branches.md
└── docs/
    └── update-readme.md
```

### Creating a Slash Command

**File:** `.claude/commands/setup/new-feature.md`

```markdown
---
description: Create a new feature with tests and documentation
---
# New Feature Setup

Create a complete feature structure for: $ARGUMENTS

Steps to execute:
1. Create feature branch: `git checkout -b feature/$ARGUMENTS`
2. Create feature directory with proper structure
3. Create test file with basic test structure
4. Update documentation to reference new feature
5. Create GitHub issue for tracking
6. Create initial commit with structure

Follow project conventions for:
- File naming (see CLAUDE.md)
- Component structure
- Test patterns
- Documentation format
```

### Using Slash Commands

```bash
# Basic usage
/setup:new-feature user-dashboard

# Namespaced commands
/review:security-audit
/git:sync-upstream
/docs:update-readme

# List available commands
/help
```

### Built-in Commands

- `/help` - Show available commands and usage
- `/mcp` - View MCP server status
- `/permissions` - Manage tool permissions
- `/clear` - Clear conversation history

## Effective Prompting

### Be Specific

❌ **Vague:** "Fix the bug"
✅ **Specific:** "Fix the login timeout bug that occurs after 5 minutes of inactivity. The issue is in src/auth/session.ts"

❌ **Vague:** "Improve the code"
✅ **Specific:** "Refactor the user validation logic in src/lib/validation.ts to use Zod for better type safety"

### Provide Context

**Good prompt structure:**
```
Context: [What you're working on]
Goal: [What you want to achieve]
Constraints: [Any limitations or requirements]
Current state: [Relevant code or errors]

Request: [Specific action]
```

**Example:**
```
Context: I'm building a user profile editing feature
Goal: Allow users to update their name, email, and avatar
Constraints:
- Must validate email format
- Must prevent duplicate emails
- Must handle image uploads
Current state: We have a User model and basic CRUD operations

Request: Implement the profile editing functionality with proper validation
```

### Break Down Complex Tasks

❌ **Too broad:** "Build a complete authentication system"

✅ **Broken down:**
```
Step 1: "Create user registration with email/password"
Step 2: "Add login functionality with JWT tokens"
Step 3: "Implement password reset flow"
Step 4: "Add email verification"
Step 5: "Create protected route middleware"
```

### Use Progressive Refinement

Start broad, then refine:

```
"Create a user dashboard component"
→ "Add a stats section showing user activity"
→ "Make the stats update in real-time"
→ "Add loading states for the real-time updates"
→ "Ensure it works on mobile devices"
```

### Request Explanations

Learn while building:

```
"Implement this feature AND explain your design decisions"
"Why did you choose this approach over alternatives?"
"What are the trade-offs of this implementation?"
```

## Testing Workflows

### Unit Testing

```
"Create unit tests for src/lib/formatDate.ts covering:
- Valid date inputs
- Invalid date inputs
- Edge cases (null, undefined, invalid formats)
- Timezone handling"
```

### Component Testing

```
"Create React Testing Library tests for src/components/Button.tsx:
- Renders with correct text
- Calls onClick when clicked
- Shows loading state correctly
- Handles disabled state
- Works with keyboard navigation"
```

### Integration Testing

```
"Create integration tests for the user registration API:
- Successful registration
- Duplicate email handling
- Invalid input validation
- Password requirements
- Email sending verification"
```

### E2E Testing with Playwright

```
"Use Playwright MCP to test the login flow:
1. Navigate to login page
2. Fill in email and password
3. Click submit button
4. Verify redirect to dashboard
5. Check that user data is displayed
6. Take screenshot for verification"
```

## Code Review Workflow

### Self-Review

Before requesting human review:

```
"Review the changes we just made for:
- Code quality and readability
- Potential bugs or edge cases
- Security vulnerabilities
- Performance issues
- Test coverage
- Documentation completeness"
```

### PR Description

```
"Generate a PR description for these changes including:
- Summary of what changed and why
- Testing instructions
- Screenshots (for UI changes)
- Breaking changes (if any)
- Related issues"
```

### Address Review Comments

```
"The reviewer suggested [feedback].
Implement their suggestion and explain the changes"
```

## Troubleshooting

### Claude Isn't Seeing Project Context

**Check:**
1. Is `CLAUDE.md` in the repository root?
2. Is Claude Code running in the correct directory?
3. Try restarting Claude Code

**Solution:**
```bash
cd /path/to/your/project
claude
```

### Permission Denials

**Check current permissions:**
```
/permissions
```

**Add missing tool:**
```
/permissions add Edit
```

**Or edit settings file:**
```bash
# Edit project settings
nano .claude/settings.json

# Edit user settings
nano ~/.claude/settings.json
```

### MCP Server Not Working

**Check server status:**
```
/mcp
```

**List configured servers:**
```bash
claude mcp list
```

**Reset approvals:**
```bash
claude mcp reset-project-choices
```

### Commands Not Working

**Check git status:**
```bash
git status
```

**Verify tool access:**
- Claude needs `Bash` permission for git commands
- Check `.claude/settings.json` for restrictions

**Common issues:**
- Not in a git repository → `git init`
- Permission denied → Add `"Bash(git:*)"` to permissions
- Command not found → Install required tool

## Best Practices

### Do's ✅

1. **Read before writing**
   - Always read files before editing them
   - Understand existing patterns before adding new code

2. **Plan complex changes**
   - Use the explore-plan-code pattern
   - Break large tasks into smaller steps

3. **Provide clear context**
   - Link to relevant files
   - Describe the current state
   - Explain the desired outcome

4. **Review changes**
   - Ask Claude to review before committing
   - Check for security issues
   - Verify test coverage

5. **Use project conventions**
   - Follow patterns in CLAUDE.md
   - Match existing code style
   - Use established naming conventions

6. **Commit frequently**
   - Small, focused commits
   - Clear commit messages
   - Logical grouping of changes

7. **Document decisions**
   - Add comments for complex logic
   - Update documentation when adding features
   - Explain non-obvious choices

### Don'ts ❌

1. **Don't skip exploration**
   - Don't code before understanding the context
   - Don't assume you know the codebase structure

2. **Don't make broad changes blindly**
   - Don't refactor without understanding impact
   - Don't change files you haven't read

3. **Don't ignore errors**
   - Don't proceed if tests are failing
   - Don't skip error handling
   - Don't commit broken code

4. **Don't overwrite existing patterns**
   - Don't introduce inconsistent style
   - Don't ignore established conventions
   - Don't duplicate existing functionality

5. **Don't commit secrets**
   - Don't add API keys, passwords, or tokens
   - Don't commit `.env` files
   - Don't hardcode sensitive data

6. **Don't skip testing**
   - Don't assume code works without testing
   - Don't merge without test coverage
   - Don't ignore edge cases

7. **Don't work on main branch**
   - Don't bypass pre-commit hooks
   - Don't commit directly to main
   - Don't skip code review

## Keyboard Shortcuts

(VS Code extension, if applicable)

- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + K, Ctrl/Cmd + C` - Ask Claude about selection
- `Ctrl/Cmd + K, Ctrl/Cmd + E` - Edit with Claude
- `Ctrl/Cmd + K, Ctrl/Cmd + T` - Generate tests

## Additional Resources

### Official Documentation
- [Claude Code Documentation](https://code.claude.com/docs)
- [Anthropic Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Model Context Protocol](https://modelcontextprotocol.io)

### Community Resources
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - 148+ slash commands
- [Claude Command Suite](https://github.com/qdhenry/Claude-Command-Suite) - Professional commands

### Related Documentation
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - Code quality guidelines
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow
- [MCP_SETUP.md](MCP_SETUP.md) - MCP server configuration
- [CLAUDE.md template](.project-intake/templates/CLAUDE.md) - Project context template

## Tips for Team Collaboration

### Sharing Context
- Commit `CLAUDE.md` to version control
- Use project-scoped permissions in `.claude/settings.json`
- Document team-specific slash commands
- Share effective prompts in team documentation

### Consistency
- Follow established patterns in CLAUDE.md
- Use the same slash commands across team
- Maintain consistent commit message format
- Review each other's Claude Code interactions

### Onboarding
- Point new members to CLAUDE.md first
- Share this workflow guide
- Demonstrate effective prompting techniques
- Pair program using Claude Code

## Feedback & Improvements

Found an issue or have suggestions?
- Open an issue in the repository
- Update this guide with learnings
- Share effective patterns with the team

---

**Last Updated:** 2025-11-21
**Based On:** [Anthropic Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
**Maintained By:** Development Team
