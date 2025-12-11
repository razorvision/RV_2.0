# Lesson 1: Setup and Configuration

**Time:** 20 minutes
**Goal:** Get Claude Code installed and configured for your project

---

## What You'll Learn

By the end of this lesson, you'll:
- ✅ Have Claude Code installed and running
- ✅ Understand permissions and how to configure them
- ✅ Create a CLAUDE.md file for your project
- ✅ Have essential MCP servers set up

---

## Step 1: Install Claude Code (5 min)

### Download and Install

1. **Visit** [claude.com/code](https://code.claude.com)
2. **Download** the installer for your platform:
   - Windows: `.exe` installer
   - macOS: `.dmg` installer
   - Linux: `.deb` or `.AppImage`
3. **Follow** the installation wizard

### Verify Installation

```bash
# Open terminal and run
claude --version
```

You should see the version number. If not, restart your terminal.

---

## Step 2: Start Claude Code (2 min)

### Navigate to Your Project

```bash
cd /path/to/your/project
claude
```

**What happens:**
- Claude Code starts in interactive mode
- It reads your project context
- You'll see the Claude Code prompt: `>`

### Your First Interaction

Try this:
```
"Show me the project structure"
```

Claude will list your project's files and directories.

---

## Step 3: Configure Permissions (5 min)

### Understanding Permissions

Claude Code needs permission to:
- **Read** files
- **Edit** files
- **Write** new files
- **Run** commands (git, npm, etc.)

You control what Claude can do.

### Recommended Permission Setup

**Option 1: Interactive (Easiest)**

As you work, Claude will ask for permissions:
```
Claude wants to read src/index.ts
[Allow Once] [Allow Always] [Deny]
```

Click **"Allow Always"** for trusted operations.

**Option 2: Configure Settings File**

Create `.claude/settings.json` in your project:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Grep",
      "Glob",
      "Bash(git:*)",
      "Bash(npm:*)"
    ],
    "ask": ["Write", "Bash"],
    "deny": []
  }
}
```

**What this does:**
- ✅ Read, Edit, Search: Allowed automatically
- ✅ Git and npm commands: Allowed automatically
- ❓ Writing new files: Claude asks first
- ❓ Other bash commands: Claude asks first

### Try It Out

```bash
# In Claude Code, check your permissions
/permissions
```

---

## Step 4: Create CLAUDE.md (5 min)

### What is CLAUDE.md?

`CLAUDE.md` is a file in your project root that tells Claude about your project. Think of it as a README for AI.

### Create Your CLAUDE.md

**Ask Claude to help:**
```
"Create a CLAUDE.md file for this project based on the package.json and project structure"
```

**Or create it manually:**

```markdown
# Your Project Name

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- Tailwind CSS

## Key Commands
- `npm run dev` - Start dev server on port 3000
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run lint` - Lint code

## Code Style
- TypeScript for all new files
- Follow existing patterns
- Write tests for new features
- Use conventional commit messages

## Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation

## Important Notes
- Always run tests before committing
- Database changes require migrations
- Environment variables go in .env
```

### Why This Matters

Claude reads this file automatically and uses it to:
- Understand your tech stack
- Follow your code style
- Use correct commands
- Respect your conventions

---

## Step 5: Set Up Essential MCP Servers (3 min)

### What are MCP Servers?

MCP servers extend Claude's capabilities:
- **Playwright** - Browser automation
- **Context7** - Documentation lookup
- **GitHub** - Issue/PR management

### Quick Install

```bash
# Install three essential servers
npm install -g @modelcontextprotocol/server-playwright
npm install -g @modelcontextprotocol/server-context7
npm install -g @modelcontextprotocol/server-github
```

### Configure (Basic)

Add to `~/.claude/settings.json` (or VS Code settings):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-context7"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Note:** Full MCP setup is optional for now. See [MCP Quick Start](../../tools/mcp/QUICKSTART.md) for complete instructions.

---

## ✅ Checkpoint: Test Your Setup

Before moving to the next lesson, verify:

1. **Claude Code runs:**
   ```bash
   claude --version
   ```

2. **You're in your project:**
   ```bash
   cd your-project
   claude
   ```

3. **Permissions work:**
   ```
   /permissions
   ```
   You should see your allowed tools.

4. **CLAUDE.md exists:**
   ```
   "Read the CLAUDE.md file"
   ```
   Claude should read and summarize it.

5. **Basic interaction works:**
   ```
   "List all TypeScript files in the src directory"
   ```
   Claude should find and list them.

---

## 📝 Practice Exercise

**Task:** Configure Claude Code for a sample project.

1. **Create a test project:**
   ```bash
   mkdir claude-test
   cd claude-test
   npm init -y
   echo "console.log('Hello Claude')" > index.js
   ```

2. **Start Claude Code:**
   ```bash
   claude
   ```

3. **Create CLAUDE.md:**
   ```
   "Create a simple CLAUDE.md for this project"
   ```

4. **Test permissions:**
   ```
   "Read index.js and explain what it does"
   ```

5. **Run a command:**
   ```
   "Run this file with node"
   ```

**Expected result:** Claude reads the file, explains it, and runs it successfully.

---

## 🚫 Common Issues

### "Command not found: claude"

**Fix:** Restart your terminal or add Claude to your PATH.

### "Permission denied"

**Fix:**
```bash
/permissions add Read
/permissions add "Bash(node:*)"
```

### "CLAUDE.md not found"

**Fix:** Verify file is in project root:
```bash
ls -la | grep CLAUDE.md
```

---

## 🎯 What's Next?

**Lesson 2: [Your First Task](02-first-task.md)**

In the next lesson, you'll:
- Navigate a real codebase
- Make your first code changes
- Run tests
- Create a commit

**Time to complete Lesson 2:** 30 minutes

---

## 📚 Additional Resources

- [Claude Code Getting Started](../../tools/claude-code/GETTING_STARTED.md)
- [Permissions Guide](../../tools/claude-code/GETTING_STARTED.md#permissions---control-what-claude-can-do)
- [MCP Setup](../../tools/mcp/QUICKSTART.md)

---

**Lesson 1 Complete!** 🎉

You now have Claude Code configured and ready to use. Continue to Lesson 2 to start building with AI assistance.

**Last Updated:** 2024-12-11
