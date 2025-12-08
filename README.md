# Project Intake Template Repository

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![GitHub Issues](https://img.shields.io/github/issues/razorvision/project-intake-template.svg)](https://github.com/razorvision/project-intake-template/issues)
[![GitHub Stars](https://img.shields.io/github/stars/razorvision/project-intake-template.svg)](https://github.com/razorvision/project-intake-template/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A comprehensive template repository for quickly bootstrapping new projects with best practices, established workflows, automated tooling, and complete documentation infrastructure.

> **🎯 85-90% time savings** on project setup (7-10 hours → 1-2 hours)

---

## 👋 New Here? Start Here!

**This template gives you a complete project foundation with automated workflows, documentation, and best practices.**

### Which Path Are You?

```
┌─────────────────────────────────────────────────────────────────┐
│                        START HERE                               │
│                                                                 │
│  What are you trying to do?                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
 ┌───────────┐         ┌───────────┐         ┌───────────┐
 │    NEW    │         │ EXISTING  │         │  SPECIFIC │
 │  PROJECT  │         │  PROJECT  │         │  FEATURE  │
 └───────────┘         └───────────┘         └───────────┘
       │                      │                      │
       ▼                      ▼                      ▼
  5-Min Quick           Project Intake        See Feature
  Start below              System            Guides below
       │                      │
       ▼                      ▼
  QUICKSTART.md        .project-intake/
```

### Feature Guides (Pick What You Need)

| I want to... | Go to... | Time |
|--------------|----------|------|
| Set up testing (Django/Docker) | [Testing Template](testing-template-packet/START-HERE.md) | 30 min |
| Configure Claude Code + MCP | [Claude Setup](.claude/README.md) → [MCP Setup](docs/integrations/MCP_SETUP.md) | 15 min |
| Add authentication | [Auth Implementation](docs/frameworks/AUTH_IMPLEMENTATION_GUIDE.md) | 1-2 hrs |
| Set up dev environment | [Dev Environment](docs/guides/DEV_ENVIRONMENT_SETUP.md) | 20 min |
| Learn coding standards | [Coding Standards](docs/guides/development/CODING_STANDARDS.md) | 15 min |
| See common tasks | [Common Tasks](docs/COMMON_TASKS.md) | 5 min |

### Quick Links

| Path | Description |
|------|-------------|
| **🆕 [5-Minute Quick Start](#-5-minute-quick-start)** | Create new repo from this template |
| **📦 [Existing Project Setup](#-existing-project-setup)** | Add template to existing codebase |
| **📋 [Common Tasks](docs/COMMON_TASKS.md)** | Day-to-day development reference |
| **📖 [Full Documentation](docs/README.md)** | Complete documentation index |

### Prerequisites

**🔴 Required:**
- Git
- GitHub account

**🟡 Optional (but recommended):**
- Node.js 18+ (for validation scripts only)
- [GitHub CLI](https://cli.github.com/) (for automation)
- [Claude Code](https://code.claude.com) (for AI-assisted development)

---

## 🚀 5-Minute Quick Start

**For brand new projects:**

1. **Click "Use this template"** button at the top of this page
   - ✅ *You should see: "Create a new repository" page*

2. **Create your repository** with your project name
   - ✅ *You should see: Your new repository page*

3. **Clone and setup**:
   ```bash
   git clone https://github.com/your-username/your-new-repo.git
   cd your-new-repo
   bash scripts/setup-labels.sh  # Creates GitHub labels (Mac/Linux/Git Bash)
   # OR: scripts\setup-labels.bat  (Windows)
   ```
   - ✅ *You should see: "Created label: priority: high" (and 40+ more labels)*

4. **Done!** Start coding with best practices in place.

**✅ You now have:** GitHub labels, issue templates, PR templates, documentation structure, and workflow guides.

**🟡 Optional next steps:**
- See [QUICKSTART.md](QUICKSTART.md) for daily workflows (5 min read)
- See [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md) for deep customization (70-110 min, optional)

---

## 📦 Existing Project Setup

**Adding this template to existing code:**

1. **Copy template files** to your project:
   ```bash
   # Mac/Linux/Git Bash
   cp -r .github/ your-project/
   cp -r .claude/ your-project/
   cp -r docs/ your-project/

   # Windows PowerShell
   Copy-Item -Recurse .github, .claude, docs your-project/
   ```
   - ✅ *You should see: New `.github/`, `.claude/`, and `docs/` directories in your project*

2. **Run the Project Intake System**:
   - Copy `.project-intake/config.template.json` to `config.json`
   - Fill in your project details
   - In Claude Code, say: *"Execute the project intake system"*
   - ✅ *You should see: Generated README, setup documentation, and GitHub issues*

3. **Customize** for your tech stack using the generated documentation
   - ✅ *You should see: Documentation tailored to your codebase*

**Time investment:** 15-30 minutes for basic setup, 1-2 hours for full automation

---

## 📑 Table of Contents

- [What's Included](#whats-included)
  - [Testing Infrastructure](#-testing-infrastructure)
  - [Project Management Infrastructure](#-project-management-infrastructure)
  - [Development Guidelines](#-development-guidelines)
  - [Claude Code Integration](#-claude-code-integration)
  - [Project Intake System](#-project-intake-system)
  - [Automation Tools](#-automation-tools)
  - [Git Workflow Protection](#️-git-workflow-protection)
- [Repository Structure](#repository-structure)
- [Customization](#customization)
- [Best Practices](#best-practices)
- [Documentation](#documentation)
- [Support & Resources](#support--resources)
- [Contributing](#contributing)


## What's Included

### 🧪 Testing Infrastructure

**Django/Docker Testing Template** (`testing-template-packet/`)

Complete testing setup for Django projects with Docker containerization:

- **Auto-Discovery Testing** - Custom `/test` slash command that intelligently discovers and runs relevant tests
- **Comprehensive Documentation** - 8 files (~1,300 lines) covering setup, usage, and best practices
- **Docker Integration** - Windows/PowerShell compatible commands for containerized testing
- **Pytest Configuration** - Pre-configured markers (unit, integration, slow, playwright) and settings
- **Example Tests** - Real-world test patterns with mocks, fixtures, and assertions
- **Quick Reference** - One-page cheat sheet for common testing commands

**Key Files:**
- `README.md` - Testing setup overview and features
- `START-HERE.md` - Quick start guide with 8-step implementation
- `.claude/commands/test.md` - Custom slash command for auto-discovery
- `pytest.ini.example` - Pytest configuration template
- `QUICK-REFERENCE.md` - Command cheat sheet
- `SETUP-CHECKLIST.md` - Step-by-step setup guide
- `docs/TESTING.md` - Comprehensive testing documentation
- `tests/test_example.py` - Example test patterns

**Customization Required:**
- Update container name (default: `wiseloan-core-core-1`)
- Update test paths to match your project structure
- Adapt pytest markers for your testing needs

**Time Savings:** 1-2 hours of testing infrastructure setup → 15 minutes

### 📋 Project Management Infrastructure

**Issue & PR Templates** (`.github/ISSUE_TEMPLATE/`)
- Bug report template with reproduction steps
- Feature request template with acceptance criteria
- Epic template for large features
- Pull request template with comprehensive checklist

**Project Management Guides** (`.github/`)
- [PROJECT_MANAGEMENT_GUIDE.md](.github/PROJECT_MANAGEMENT_GUIDE.md) - Complete PM workflows, commands, and best practices
- [PROJECT_VIEWS_GUIDE.md](.github/PROJECT_VIEWS_GUIDE.md) - Step-by-step guide for GitHub Project board setup
- [WEEKLY_STATUS_TEMPLATE.md](.github/WEEKLY_STATUS_TEMPLATE.md) - Status report templates
- Example weekly status report

### 📚 Development Guidelines

**Core Standards & Practices:**
- [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) - TypeScript, React, security, testing best practices
- [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md) - Git workflow, branch naming, commit conventions
- [DOCUMENTATION_GUIDELINES.md](docs/guides/DOCUMENTATION_GUIDELINES.md) - How to write and maintain documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick reference for common workflows

### 🤖 Claude Code Integration

**MCP Servers (Model Context Protocol):**

16 pre-configured MCP servers are included. Most work without setup - just approve when prompted.

**🟢 Core Servers (No Setup Required):**
- **Filesystem** - File operations within your project
- **Git** - Git operations and repository management
- **Memory** - Persistent context across Claude sessions
- **Sequential Thinking** - Enhanced reasoning for complex problems

**🟡 Enhanced Servers (Minimal Setup):**
- **Playwright** - Browser automation (run: `npx playwright install`)
- **Puppeteer** - Alternative browser automation
- **Context7** - Documentation search
- **Everything** - System-wide file search (Windows)
- **SQLite** - Local database operations

**🔴 Advanced Servers (Require API Keys/Tokens):**
- **GitHub** - Requires: `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Slack** - Requires: `SLACK_BOT_TOKEN`, `SLACK_TEAM_ID`
- **Brave Search** - Requires: `BRAVE_API_KEY` (2K free/month)
- **PostgreSQL** - Requires: `POSTGRES_CONNECTION_STRING`
- **Docker** - Requires Docker Desktop running
- **Sentry** - Requires: Sentry account and DSN
- **AWS KB** - Requires: AWS credentials and knowledge base setup

**📚 Documentation:**
- [MCP_SETUP.md](docs/integrations/MCP_SETUP.md) - Complete setup guide
- [MCP_SECURITY.md](docs/security/MCP_SECURITY.md) - Security best practices
- `.mcp.json` - Configuration file

**Configuration (`.claude/`):**
- [Claude Config README](.claude/README.md) - Complete configuration guide
- `settings.json.template` - Project-scoped permissions template
- `settings.local.json` - Machine-specific settings (git-ignored)
- Permission management (allow, ask, deny)
- Custom instructions and MCP server configuration

**Slash Commands Library (`.claude/commands/`):**
- [Command Library README](.claude/commands/README.md) - Complete slash commands documentation
- `/review-security` - Comprehensive security audit
- `/review-code` - Code quality review
- `/create-component` - Generate React components
- `/create-api-route` - Create API endpoints
- `/add-test` - Generate test files
- `/refactor` - Code improvement and cleanup
- `/optimize` - Performance optimization
- `/debug` - Systematic troubleshooting

### 🎯 Project Intake System (`.project-intake/`)

**For Existing Codebases Only** - This is different from the template!

**When to use:**
- You have an existing project with code already written
- You want to add this template's structure to your existing repo
- You need automated documentation generation for legacy code

**What it does:**
1. Analyzes your existing codebase and tech stack
2. Generates customized README and documentation
3. Sets up Git hooks and branch strategy
4. Creates GitHub labels, issues, and project board
5. Documents your code quality standards

**Quick Start:**
1. Copy `.project-intake/config.template.json` to `config.json`
2. Fill in your project details
3. Tell Claude Code: *"Execute the project intake system"*
4. Review and refine the generated docs

**📖 [See the Existing Project Setup guide](#-existing-project-setup) above**

**⚠️ Note:** If you're starting a NEW project from this template, you don't need this system.

### 🔧 Automation Tools

**GitHub Actions Workflows (`.github/workflows/`):**
- [Workflows README](.github/workflows/README.md) - Complete workflows documentation
- `ci.yml` - Continuous integration (lint, test, build, e2e)
- `codeql.yml` - Security scanning and code analysis
- `dependency-update.yml` - Automated weekly dependency updates
- `pr-checks.yml` - Pull request validation (title, size, conflicts, TODOs)
- `release.yml` - Automated releases with changelog generation

**Scripts & Utilities:**
- `setup-labels.sh` / `setup-labels.bat` - Automated label creation
- `convert_drafts_to_issues_TEMPLATE.py` - Convert draft issues to GitHub issues
- `create_issue.sh` - Create GitHub issues via CLI
- `work-epic-issue.sh` - Workflow automation for epics
- Health check validation scripts
- Config validation utilities

### 🛡️ Git Workflow Protection

**Pre-Commit Hooks:**
- [Pre-commit Configuration](.pre-commit-config.yaml) - Comprehensive code quality checks
- [Pre-commit Hooks Guide](docs/workflows/pre-commit-hooks.md) - Setup and usage documentation
- **Automated Checks:**
  - ESLint and Prettier (formatting)
  - TypeScript type checking
  - Secret detection (prevent credential leaks)
  - Security scanning (Bandit for Python)
  - Commit message validation (Conventional Commits)
  - Markdown, Docker, and shell script linting
  - Large file detection
  - Merge conflict detection
- Blocks direct commits to `main` branch
- Cross-platform support (Mac/Linux/Windows)

## Repository Structure

**Key directories:**
- `.claude/` - Claude Code configuration and custom slash commands
- `.github/` - Issue templates, PR templates, GitHub Actions workflows
- `docs/` - Complete documentation (guides, security, workflows)
- `testing-template-packet/` - Django/Docker testing infrastructure
- `scripts/` - Automation scripts for setup and maintenance

**📖 [See complete directory structure](docs/REPOSITORY_STRUCTURE.md)**


## Customization

All templates and guidelines can be adapted to your needs:

- **For your tech stack:** Update [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) with your languages/frameworks
- **For your workflow:** Modify [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md) branch prefixes and conventions
- **For your project type:** Add custom labels (e.g., `platform: ios`, `env: production`)
- **For your tools:** Customize MCP servers in `.mcp.json` or add more slash commands to `.claude/commands/`

**💡 Tip:** Start with the defaults and customize as you go. The templates work well out-of-the-box.

## Best Practices

- **Security:** Never commit secrets · Use `.env` for config · Validate all input · See [SECURITY.md](docs/security/SECURITY.md)
- **Code Quality:** Follow [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) · Write tests · Keep functions focused
- **Git Workflow:** Use feature branches · Write clear commits · Keep PRs small · See [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md)
- **Project Management:** Use labels (priority/type/status) · See [PROJECT_MANAGEMENT_GUIDE.md](.github/PROJECT_MANAGEMENT_GUIDE.md)

## Documentation

### Essential Guides
- [TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md) - How to use this template
- [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md) - Complete setup checklist
- [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) - Code quality standards
- [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md) - Git workflow
- [DOCUMENTATION_GUIDELINES.md](docs/guides/DOCUMENTATION_GUIDELINES.md) - Documentation standards
- [SECURITY.md](docs/security/SECURITY.md) - Security policy and best practices
- [MCP_SETUP.md](docs/integrations/MCP_SETUP.md) - MCP integration guide
- [MCP_SECURITY.md](docs/security/MCP_SECURITY.md) - MCP security best practices
- [CLAUDE_CODE_WORKFLOWS.md](docs/workflows/CLAUDE_CODE_WORKFLOWS.md) - Claude Code best practices and workflows

### Project Management
- [PROJECT_MANAGEMENT_GUIDE.md](.github/PROJECT_MANAGEMENT_GUIDE.md) - Complete PM guide
- [PROJECT_VIEWS_GUIDE.md](.github/PROJECT_VIEWS_GUIDE.md) - Project board setup
- [QUICKSTART.md](QUICKSTART.md) - Quick reference

## Support & Resources

### Getting Help

- **Template usage questions:** See [TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md)
- **Setup issues:** Check [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)
- **Git workflow questions:** Review [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md)
- **Code standards questions:** Check [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md)
- **MCP issues:** See [MCP_SETUP.md](docs/integrations/MCP_SETUP.md) and [MCP_SECURITY.md](docs/security/MCP_SECURITY.md)

### External Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Issues Best Practices](https://docs.github.com/en/issues)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)

## Contributing

Improvements to this template are welcome! To contribute:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/improvement`
3. Make your changes
4. Test with a new project
5. Submit a pull request

## License

This template is provided as-is for use in any project. Customize as needed for your team's workflow.

## Credits

**Created by:** Andrew Tucker
**Powered by:** Claude Code
**Based on learnings from:** SafeQuote.io and MedNexus projects

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-21

---

## What's Next?

1. **Click "Use this template"** to create your new repository
2. **Follow [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)** for complete setup
3. **Read [TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md)** for detailed guidance
4. **Start building** with confidence in your foundation

**Questions?** Check the documentation or open an issue!
