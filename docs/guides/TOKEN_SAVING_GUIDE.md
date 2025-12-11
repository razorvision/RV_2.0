# Token Saving Guide for Claude Code

This guide documents strategies to minimize token usage and maximize the value of your Claude Code sessions.

## Token Usage Tracking

Use [ccusage](https://github.com/ryoppippi/ccusage) to monitor your Claude Code token consumption:

```bash
# Install
npm install -g ccusage

# View usage summary
ccusage

# View detailed breakdown
ccusage --detail
```

## The Real Token Killers

MCP tool definitions are a one-time cost (~5,000 tokens for 3 MCPs). The real token consumers are:

### 1. Large File Reads (2,000-50,000+ tokens each)

**Problem:** Reading entire files when only a section is needed.

**Solutions:**

- Use `offset` and `limit` parameters when reading large files
- Use Grep to find specific lines before reading
- Ask Claude to read only the relevant function/section
- Avoid reading generated files (node_modules, .next, dist, etc.)

**Example - Instead of:**

> "Read the entire utils.ts file"

**Say:**

> "Find the `formatDate` function in utils.ts and read just that function"

### 2. Repeated Context (10,000-50,000+ tokens)

**Problem:** Re-reading the same files multiple times in a session.

**Solutions:**

- Reference previously read content: "Using the file we read earlier..."
- Use `/compact` to summarize long conversations
- Start new sessions for unrelated tasks
- Use `#` memory commands to store key context

### 3. Verbose Command Output (1,000-10,000+ tokens)

**Problem:** Long bash outputs, full stack traces, build logs.

**Solutions:**

- Pipe to `head` or `tail`: `npm test 2>&1 | head -50`
- Use `--quiet` or `--silent` flags when available
- Filter output: `npm run build 2>&1 | grep -i error`
- For tests, run specific test files instead of full suite

### 4. Conversation Length (accumulates over time)

**Problem:** History grows with every message, compounding token usage.

**Solutions:**

- Use `/compact` regularly (every 15-20 exchanges)
- Start fresh sessions for new tasks
- Be concise in your prompts
- Use `/clear` to reset when switching contexts

## MCP Optimization

### Minimal MCP Setup (Recommended)

Keep only essential MCPs enabled:

- **playwright** - Browser automation for E2E testing
- **context7** - Library documentation lookup
- **github** - PR/issue management

### Disable Unused MCPs

```bash
# Remove from user config
claude mcp remove <server-name> -s user

# Remove from project config
claude mcp remove <server-name> -s project
```

### Token Cost by MCP (approximate)

| MCP        | Tools | Token Cost |
| ---------- | ----- | ---------- |
| playwright | ~50   | ~2,000     |
| github     | ~30   | ~1,500     |
| context7   | ~5    | ~300       |
| atlassian  | ~40   | ~2,000     |
| firecrawl  | ~5    | ~400       |

## Prompt Engineering for Token Efficiency

### Be Specific

❌ "Fix the bug in the authentication"
✅ "Fix the null pointer in `auth.ts:validateToken()` when token is expired"

### Provide Context Upfront

❌ Multiple back-and-forth messages to clarify requirements
✅ Single detailed prompt with all requirements, constraints, and examples

### Reference Previous Work

❌ "Read that file again"
✅ "Using the `UserService` class we discussed earlier..."

### Batch Related Tasks

❌ Separate sessions for each small change
✅ Group related changes: "Update all date formatting to use ISO 8601"

## Session Management

### When to Start Fresh

- Switching to unrelated task
- After major refactoring
- When context feels cluttered
- After 30+ exchanges

### When to Continue

- Multi-step implementations
- Debugging the same issue
- Related follow-up changes

## Quick Reference Commands

```bash
# Compact conversation history
/compact

# Clear conversation (keeps CLAUDE.md)
/clear

# Check current context size
/context

# View token usage
/usage
```

## Custom Usage Tracking Commands

Add these custom commands to your `.claude/commands/` directory (user or project level) for quick token usage monitoring.

### `/usage` - Daily Summary (7 days)

**File:** `.claude/commands/usage.md`

```markdown
---
description: Show Claude Code token usage (daily summary)
---

Run this command and report the results:

\`\`\`bash
npx ccusage daily --since $(date -d '7 days ago' +%Y%m%d 2>/dev/null || powershell -Command "(Get-Date).AddDays(-7).ToString('yyyyMMdd')") --breakdown --order desc
\`\`\`

Summarize:

- Total cost for the past week
- Daily breakdown with costs
- Which models were used most
- Any concerning trends (high usage days)
```

### `/usage-today` - Today's Breakdown

**File:** `.claude/commands/usage-today.md`

```markdown
---
description: Show today's token usage with breakdown
---

Run this command and report the results:

\`\`\`bash
npx ccusage daily --since $(date +%Y%m%d 2>/dev/null || powershell -Command "(Get-Date).ToString('yyyyMMdd')") --breakdown --instances
\`\`\`

Report:

- Total tokens and cost for today
- Breakdown by model (Opus vs Sonnet vs Haiku)
- Breakdown by project/instance
- Remaining budget estimate if applicable
```

### `/usage-session` - Session Analysis

**File:** `.claude/commands/usage-session.md`

```markdown
---
description: Show token usage for recent sessions
---

Run this command and report the results:

\`\`\`bash
npx ccusage session --order desc --breakdown
\`\`\`

Summarize:

- The most expensive recent sessions
- Which projects are consuming the most tokens
- Average session cost
- Recommendations if any sessions seem unusually expensive
```

### `/usage-weekly` - Weekly Trends

**File:** `.claude/commands/usage-weekly.md`

```markdown
---
description: Show weekly token usage summary
---

Run this command and report the results:

\`\`\`bash
npx ccusage weekly --breakdown --order desc
\`\`\`

Summarize:

- Total cost per week
- Week-over-week trend (increasing/decreasing)
- Model usage breakdown
- Recommendations for reducing costs if trending up
```

### Installation

To install these commands:

```bash
# Create commands directory (if needed)
mkdir -p ~/.claude/commands

# Create each file with the content above
# Or copy from a project that has them:
cp .claude/commands/usage*.md ~/.claude/commands/
```

**Note:** Commands in `~/.claude/commands/` are available globally. Commands in `.claude/commands/` (project directory) are project-specific.

## Cost-Aware Workflows

### For Bug Fixes

1. Grep for error message first
2. Read only affected file sections
3. Make targeted edits
4. Run specific test, not full suite

### For New Features

1. Plan in one message (use thinking mode)
2. Implement in batches
3. Compact between major milestones

### For Code Review

1. Use `gh pr diff` instead of reading all files
2. Focus on changed lines only
3. Review in chunks if PR is large

## Environment Variables

```bash
# Reduce bash output verbosity
BASH_DEFAULT_TIMEOUT_MS=30000

# Disable non-essential traffic
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

## Summary

| Strategy                         | Token Savings   |
| -------------------------------- | --------------- |
| Read file sections vs full files | 50-90%          |
| Use /compact regularly           | 30-50%          |
| Filter command output            | 20-40%          |
| Minimal MCP setup                | ~10,000/session |
| Specific prompts                 | 10-30%          |

The biggest wins come from **reading less** and **compacting often**.
