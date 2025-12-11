# Getting Started with Claude Code

Welcome! This guide will get you productive with Claude Code in 30 minutes. By the end, you'll know how to use Claude Code effectively for daily development tasks.

## What is Claude Code?

Claude Code is an AI-powered CLI tool that helps you write, edit, and understand code. Think of it as a pair programmer that:
- Reads and edits files
- Runs commands (git, npm, etc.)
- Searches codebases
- Understands project context
- Uses specialized tools through MCP servers

---

## Quick Start (5 minutes)

### 1. Install Claude Code

Download from [claude.com/code](https://code.claude.com) and follow installation instructions.

### 2. Start in Your Project

```bash
cd your-project
claude
```

You'll see the Claude Code prompt. Type your first request!

### 3. Your First Task

Try this simple request:

```
"Read the package.json and tell me what this project does"
```

Claude will read the file and explain the project's purpose based on dependencies and scripts.

---

## The Essential Pattern: Explore → Plan → Code → Commit

This 4-step workflow works for **80% of development tasks**. Master this first.

### Step 1: Explore 🔍

**Gather context before making changes.**

```
"Read src/auth/login.ts and explain how authentication works"
"Show me the current project structure"
"What testing framework are we using?"
"Find all files that use the User model"
```

**Why it matters:** Claude needs context to make good decisions. Always explore first.

### Step 2: Plan 📋

**Think through the implementation before coding.**

```
"Plan how to add two-factor authentication to the login flow"
"What files would we need to modify to add dark mode?"
"Think through the steps needed to implement rate limiting"
```

**Pro tip:** Use "think" for extended analysis:
```
"Think deeply about the best approach for real-time notifications"
```

Claude will create a detailed plan. Review it before proceeding!

### Step 3: Code ⚙️

**Implement the solution.**

```
"Implement the two-factor authentication feature following your plan"
"Add dark mode support as we discussed"
"Create the rate limiting middleware"
```

**Why this works:** With a plan in place, implementation is faster and more focused.

### Step 4: Commit ✅

**Review and save your work.**

```
"Review the changes we made and create a commit"
"Create a PR for the 2FA feature"
```

Claude will write clear commit messages following your project's conventions.

---

## Complete Example Walkthrough

Let's add a feature using this pattern:

```markdown
You: "Read src/pages/dashboard.tsx and show me how it's structured"
Claude: [Reads file and explains component structure]

You: "Plan how to add a user statistics widget to this dashboard"
Claude: [Creates detailed plan with:
  - Component structure
  - Data fetching approach
  - Styling considerations
  - Testing strategy]

You: "Looks good! Implement the statistics widget following your plan"
Claude: [Creates UserStats.tsx, updates dashboard, adds tests]

You: "Run the tests to make sure everything works"
Claude: [Runs npm test, shows results]

You: "Create a commit for this feature"
Claude: [Creates commit with message: "feat: Add user statistics widget to dashboard"]
```

**Time saved:** ~30 minutes vs. doing it manually

---

## Core Commands You'll Use Daily

### File Operations

```
"Read src/components/Button.tsx"
"Edit line 42 to change the button color to blue"
"Create a new file src/utils/formatDate.ts with a date formatting utility"
```

### Code Search

```
"Find all files that import React"
"Show me where the login function is defined"
"Search for TODO comments in the codebase"
```

### Git Operations

```
"Create a new branch feature/user-stats"
"Show me the git diff"
"Commit these changes with message: 'fix: resolve auth timeout'"
"Create a PR for this feature"
```

### Testing

```
"Run the test suite"
"Run only tests in src/auth/__tests__"
"Create unit tests for src/utils/formatDate.ts"
```

### Building & Running

```
"Install dependencies"
"Start the development server"
"Build the project"
"Run the linter"
```

---

## Configuration Basics

### CLAUDE.md - Project Context

Create a `CLAUDE.md` file in your project root to give Claude context about your project.

**Minimal example:**

```markdown
# My Project

Tech stack: Next.js 14, TypeScript, Prisma, PostgreSQL

Key commands:
- `npm run dev` - Start dev server on port 3000
- `npm test` - Run test suite
- `npm run build` - Build for production

Code style:
- Use TypeScript for all new files
- Follow existing patterns in the codebase
- Write tests for new features

Branch naming: `feature/`, `fix/`, `docs/`
```

**Location options:**
- `./CLAUDE.md` (project root) ← **Recommended**
- `~/.claude/CLAUDE.md` (your home directory) - personal preferences

### Permissions - Control What Claude Can Do

Claude asks permission before using tools. Configure permissions in `.claude/settings.json`:

**Balanced permissions (recommended):**

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Grep",
      "Glob",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(gh:*)"
    ],
    "ask": ["Write", "Bash"]
  }
}
```

**What this does:**
- ✅ Claude can read, edit, search files without asking
- ✅ Claude can run git, npm, gh commands without asking
- ❓ Claude asks before writing new files
- ❓ Claude asks before running other bash commands

**View/modify permissions:**

```bash
/permissions                    # Show current permissions
/permissions add Edit           # Allow Edit tool
/permissions add "Bash(git:*)"  # Allow git commands
/permissions remove Write       # Require asking for Write
```

---

## MCP Servers - Extend Claude's Capabilities

MCP (Model Context Protocol) servers give Claude access to external tools and services.

**Popular servers you'll want:**

| Server | What it does | Common uses |
|--------|--------------|-------------|
| **Playwright** | Browser automation | UI testing, visual verification |
| **Context7** | Fetch documentation | Look up library docs |
| **GitHub** | GitHub API access | Manage issues, PRs |
| **SQLite** | Database queries | Query local databases |
| **Brave Search** | Web search | Find up-to-date information |

**Setup:** See [MCP Quick Start](../mcp/QUICKSTART.md) for 5-minute setup.

**Using MCP servers:**

Once configured, Claude automatically uses them when relevant:

```
"Use Playwright to test the login flow and take a screenshot"
→ Claude navigates browser, fills form, takes screenshot

"Look up the latest Next.js App Router documentation"
→ Claude fetches docs from Context7

"Create a GitHub issue for this bug"
→ Claude creates issue using GitHub MCP
```

---

## Slash Commands - Reusable Workflows

Slash commands are shortcuts for common tasks. They're stored in `.claude/commands/`.

**Try these built-in commands:**

```
/help           # Show available commands
/mcp            # View MCP server status
/permissions    # Manage tool permissions
/clear          # Clear conversation history
```

**Create custom commands:**

File: `.claude/commands/new-feature.md`

```markdown
---
description: Create a new feature with tests
---

Create a feature for: $ARGUMENTS

Steps:
1. Create feature branch
2. Create feature file with boilerplate
3. Create test file
4. Create GitHub issue for tracking
```

**Use it:**

```
/new-feature user-profile-editing
```

See [Slash Commands Guide](SLASH_COMMANDS.md) for more examples.

---

## Common Workflows

### 1. Fix a Bug

```
"Help me debug: Users can't log in after password reset"
→ "Read the password reset logic in src/auth/reset.ts"
→ "Check the git history for recent changes to this file"
→ "I see the issue. Implement a fix with tests"
→ "Run the tests to verify the fix"
→ "Create a commit and PR"
```

### 2. Add a Feature

```
"Plan how to add email verification to user registration"
→ [Review plan]
→ "Implement the email verification feature"
→ "Create integration tests for the email flow"
→ "Update documentation to mention email verification"
→ "Create a commit and PR"
```

### 3. Refactor Code

```
"Read src/lib/validation.ts and identify improvements"
→ "Plan how to refactor this to use Zod for validation"
→ "Implement the refactor while preserving all functionality"
→ "Run tests to ensure nothing broke"
→ "Create a commit: 'refactor: migrate validation to Zod'"
```

### 4. Visual Development (UI)

```
"Create a user profile card component"
→ "Start the dev server so I can see it"
→ [Make adjustments] "The padding is too tight, increase it"
→ "Make the avatar larger and add a shadow"
→ "Take a screenshot using Playwright so I can verify it looks good"
→ "Looks great! Create a commit"
```

### 5. Test-Driven Development

```
"Create unit tests for a user registration function covering:
- Email validation
- Password strength
- Duplicate email prevention"
→ "Run the tests and confirm they fail"
→ "Commit the tests"
→ "Now implement the registration function to make tests pass"
→ "Run tests again and verify they all pass"
→ "Commit the implementation"
```

---

## Effective Prompting Tips

### ✅ Be Specific

❌ "Fix the bug"
✅ "Fix the login timeout bug in src/auth/session.ts that occurs after 5 minutes"

❌ "Improve the code"
✅ "Refactor src/lib/validation.ts to use Zod for better type safety"

### ✅ Provide Context

**Good prompt structure:**

```
Context: [What you're working on]
Goal: [What you want to achieve]
Constraints: [Any requirements or limitations]

Request: [Specific action]
```

**Example:**

```
Context: Building a blog with Next.js
Goal: Add pagination to the posts list
Constraints: Must support URL query params for page number

Request: Implement pagination for src/app/blog/page.tsx
```

### ✅ Break Down Complex Tasks

❌ "Build a complete authentication system"

✅ Break it down:

```
"Step 1: Create user registration with email/password"
→ "Step 2: Add login with JWT tokens"
→ "Step 3: Implement password reset flow"
→ "Step 4: Add email verification"
```

### ✅ Ask for Explanations

Learn while building:

```
"Implement this feature AND explain your design decisions"
"Why did you choose this approach?"
"What are the trade-offs?"
```

---

## Troubleshooting

### Claude isn't seeing my CLAUDE.md file

**Fix:**
1. Verify `CLAUDE.md` exists in project root
2. Restart Claude Code in the correct directory:
   ```bash
   cd /path/to/your/project
   claude
   ```

### Permission denied errors

**Fix:**
```
/permissions                     # Check current permissions
/permissions add Edit            # Add missing tool
```

Or edit `.claude/settings.json` to add tools to the `allow` list.

### MCP server not working

**Fix:**
```
/mcp                            # Check server status
```

If a server shows as offline, see [MCP Troubleshooting](../mcp/TROUBLESHOOTING.md).

### Commands failing

**Check:**
- Are you in a git repository? (`git status`)
- Does Claude have permission? (add `"Bash(git:*)"` to permissions)
- Is the tool installed? (`which npm`, `which gh`)

---

## Next Steps

Now that you understand the basics:

1. **Configure your project**
   - Create `CLAUDE.md` with project context
   - Set up permissions in `.claude/settings.json`

2. **Install MCP servers** (optional but powerful)
   - Follow [MCP Quick Start](../mcp/QUICKSTART.md)
   - Install Playwright, Context7, GitHub servers

3. **Learn advanced workflows**
   - [Claude Code Workflows](WORKFLOWS.md) - Deep dive into patterns
   - [Tips & Tricks](TIPS_AND_TRICKS.md) - Power user techniques
   - [Slash Commands](SLASH_COMMANDS.md) - Create custom commands

4. **Explore project-specific docs**
   - [Testing Guide](../../guides/development/TESTING_GUIDE.md)
   - [Code Review Guidelines](../../guides/team/CODE_REVIEW.md)
   - [Common Tasks](../../COMMON_TASKS.md) - Quick command reference

---

## Quick Reference Card

Print this out or keep it handy:

```
DAILY COMMANDS:
  Explore:  "Read src/path/file.ts"
           "Show me the project structure"
           "Find all files that import X"

  Code:     "Create/Edit/Update file.ts"
           "Implement [feature]"
           "Refactor [file] to use [pattern]"

  Test:     "Run tests"
           "Create tests for [file]"
           "Run only [specific test]"

  Git:      "Create branch feature/name"
           "Show git diff"
           "Commit with message: 'type: description'"
           "Create a PR"

PATTERN: Explore → Plan → Code → Commit

PERMISSIONS: /permissions, /permissions add [tool]
MCP STATUS: /mcp
HELP: /help
```

---

## Get Help

- **General help:** `/help` command in Claude Code
- **MCP issues:** [MCP Troubleshooting](../mcp/TROUBLESHOOTING.md)
- **Team questions:** Ask in team chat or review [CLAUDE.md](../../../CLAUDE.md)
- **Report bugs:** [GitHub Issues](https://github.com/anthropics/claude-code/issues)

---

**Ready to dive deeper?** Continue to [Claude Code Workflows](WORKFLOWS.md) for advanced patterns and best practices.

**Last Updated:** 2024-12-11
