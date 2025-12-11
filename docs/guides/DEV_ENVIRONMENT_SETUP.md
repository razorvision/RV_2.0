---
title: Development Environment Setup
parent: Guides
---
# Development Environment Setup

Guide for setting up your local development environment with all the tools needed for effective development.

## Prerequisites

- **Node.js** (v18+ recommended) - Use [nvm](https://github.com/nvm-sh/nvm) for version management
- **Git** - Version control
- **VS Code** - Recommended IDE (or your preferred editor)

## VS Code Setup

### Recommended Extensions

Install these extensions for the best development experience:

```
# Essential
dbaeumer.vscode-eslint          # ESLint integration
esbenp.prettier-vscode          # Prettier formatting
bradlc.vscode-tailwindcss       # Tailwind CSS IntelliSense
Prisma.prisma                   # Prisma syntax highlighting

# Productivity
eamodio.gitlens                 # Git history and blame
GitHub.copilot                  # AI code completion (optional)
Christian-Kohler.path-intellisense  # Path autocomplete

# Testing
Orta.vscode-jest                # Jest integration (if using Jest)
ms-playwright.playwright        # Playwright test runner
```

### VS Code Settings

Recommended workspace settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Claude Code Setup

### Installation

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Configuration

1. **API Key**: Set your Anthropic API key:
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

2. **Project Setup**: Claude Code automatically reads `CLAUDE.md` from the project root for project-specific instructions.

3. **Start Claude Code**:
   ```bash
   cd your-project
   claude
   ```

### Key Commands

- `/help` - Show available commands
- `/clear` - Clear conversation context
- `/compact` - Summarize and compact conversation history
- `Ctrl+C` - Cancel current operation
- `Ctrl+D` - Exit Claude Code

## MCP Server Setup

MCP (Model Context Protocol) servers extend Claude's capabilities. See [MCP Servers Guide](../integrations/MCP_SERVERS_GUIDE.md) for detailed setup.

### Quick Setup

Create `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    }
  }
}
```

## Git Configuration

### Basic Setup

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Recommended defaults
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global fetch.prune true
```

### SSH Key Setup (for GitHub)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings > SSH Keys > New SSH Key
```

### GitHub CLI

```bash
# Install (macOS)
brew install gh

# Install (Windows)
winget install GitHub.cli

# Authenticate
gh auth login
```

## Node.js Environment

### Using nvm

```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
npm --version
```

### Project Setup

```bash
# Clone and enter project
git clone <repo-url>
cd <project>

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## Database Tools

### Prisma Studio

Built-in database GUI:

```bash
npx prisma studio
```

### Database Clients

- **TablePlus** - Clean GUI for multiple databases
- **pgAdmin** - PostgreSQL-specific
- **DBeaver** - Universal database tool

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process on port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /F /PID <PID>  # Windows
```

**Node modules issues:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

**Prisma schema out of sync:**
```bash
# Reset client
npx prisma generate

# Push schema changes
npx prisma db push
```

**Next.js cache issues:**
```bash
# Clear cache and regenerate
rm -rf .next && npx prisma generate
npm run dev
```

---

## Related Guides

- [Project Intake Checklist](./PROJECT_INTAKE_CHECKLIST.md) - Full project setup
- [MCP Servers Guide](../integrations/MCP_SERVERS_GUIDE.md) - AI tooling setup
- [Repo Setup Guide](./REPO_SETUP_GUIDE.md) - GitHub configuration
