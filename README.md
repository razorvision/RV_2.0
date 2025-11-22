# Project Intake Template Repository

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![GitHub Issues](https://img.shields.io/github/issues/razorvision/project-intake-template.svg)](https://github.com/razorvision/project-intake-template/issues)
[![GitHub Stars](https://img.shields.io/github/stars/razorvision/project-intake-template.svg)](https://github.com/razorvision/project-intake-template/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A comprehensive template repository for quickly bootstrapping new projects with best practices, established workflows, automated tooling, and complete documentation infrastructure.

> **🎯 85-90% time savings** on project setup (7-10 hours → 1-2 hours)

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [What's Included](#whats-included)
  - [Testing Infrastructure](#-testing-infrastructure)
  - [Project Management Infrastructure](#-project-management-infrastructure)
  - [Development Guidelines](#-development-guidelines)
  - [Claude Code Integration](#-claude-code-integration)
  - [Project Intake System](#-project-intake-system)
  - [Automation Tools](#-automation-tools)
  - [Git Workflow Protection](#️-git-workflow-protection)
- [Repository Structure](#repository-structure)
- [Usage Guide](#usage-guide)
- [Key Features](#key-features)
- [Installation & Setup](#installation--setup)
- [Customization](#customization)
- [Project Management Workflow](#project-management-workflow)
- [Best Practices](#best-practices)
- [Time Savings](#time-savings)
- [Documentation](#documentation)
- [Support & Resources](#support--resources)
- [Contributing](#contributing)

## 🚀 Quick Start

### Use This Template

1. **Click "Use this template"** button above (green button)
2. **Create your new repository** with your project name
3. **Clone your new repository**:
   ```bash
   git clone https://github.com/your-username/your-new-repo.git
   cd your-new-repo
   ```
4. **Follow the [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)** for complete setup

**📖 New to templates?** Read [TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md) for detailed instructions.

## ✨ Key Highlights

| Feature | What You Get | Time Saved |
|---------|-------------|------------|
| 🚀 **Pre-commit Hooks** | 20+ automated quality checks (ESLint, Prettier, TypeScript, security scanning) | ~2 hours |
| 🤖 **Claude Code Integration** | 8 custom slash commands + 16 pre-configured MCP servers | ~3 hours |
| ⚙️ **GitHub Actions** | Complete CI/CD pipeline (testing, security, releases, PR validation) | ~2 hours |
| 🧪 **Testing Infrastructure** | Django/Docker testing template with pytest, auto-discovery, custom commands | ~1-2 hours |
| 📋 **Project Management** | Issue/PR templates, labels, project board guides with automation | ~1 hour |
| 📚 **Documentation** | Comprehensive guides for coding standards, security, workflows | ~2-3 hours |
| 🔒 **Security** | Secret detection, CodeQL scanning, security checklists, best practices | ~1-2 hours |

**Total Time Savings: 12-15 hours → ~1 hour setup**

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
- [MCP_SETUP.md](docs/integrations/MCP_SETUP.md) - Complete guide for setting up 16 MCP servers
- [MCP_SECURITY.md](docs/security/MCP_SECURITY.md) - Security best practices for MCP servers
- `.mcp.json` - 16 pre-configured MCP servers across multiple categories:
  - **Browser Automation:** Playwright, Puppeteer for multi-browser testing
  - **Database Operations:** PostgreSQL, SQLite for Django projects
  - **Container Management:** Docker for testing workflow integration
  - **Web Research:** Brave Search, Context7 for documentation lookup
  - **File Operations:** Filesystem, Everything for project and system-wide search
  - **Team Collaboration:** Slack, GitHub for workflow automation
  - **Intelligence:** Memory, Sequential Thinking for enhanced reasoning
  - **Monitoring:** Sentry for error tracking (optional)
  - **Knowledge:** AWS KB for internal documentation (optional)

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

**Automated Setup for Existing Codebases:**

The Project Intake System automates the documentation and setup of existing projects:

- **01-initial-analysis.md** - Systematic codebase exploration
- **02-git-setup.md** - Git hooks, branch strategy, commit conventions
- **03-documentation.md** - Automated README and guide generation
- **04-dev-environment.md** - Tools installation and configuration
- **05-github-integration.md** - Project board and GitHub CLI setup
- **06-quality-standards.md** - Code quality and security documentation

**Features:**
- Codebase analysis and tech stack discovery
- Automated documentation generation
- Git workflow configuration with pre-commit hooks
- GitHub Project board creation
- Quality standards documentation
- Health check validation

**Time Savings:** 85-90% reduction in setup time

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

```
project-intake-template/
├── .claude/                    # Claude Code configuration
│   ├── README.md              # Configuration guide
│   ├── settings.json.template # Project permissions template
│   ├── settings.local.json    # Machine-specific settings (git-ignored)
│   └── commands/               # Slash command library
│       ├── README.md          # Commands documentation
│       ├── review-security.md # Security audit command
│       ├── review-code.md     # Code review command
│       ├── create-component.md# Component generation
│       ├── create-api-route.md# API endpoint generation
│       ├── add-test.md        # Test generation
│       ├── refactor.md        # Code refactoring
│       ├── optimize.md        # Performance optimization
│       └── debug.md           # Debugging assistance
├── .github/                    # GitHub configuration
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   ├── workflows/             # GitHub Actions
│   │   ├── README.md         # Workflows documentation
│   │   ├── ci.yml            # Continuous integration
│   │   ├── codeql.yml        # Security scanning
│   │   ├── dependency-update.yml # Dependency updates
│   │   ├── pr-checks.yml     # PR validation
│   │   └── release.yml       # Release automation
│   ├── labeler.yml           # Auto-label configuration
│   ├── PROJECT_MANAGEMENT_GUIDE.md
│   ├── PROJECT_VIEWS_GUIDE.md
│   └── pull_request_template.md
├── .project-intake/           # Automated project setup system
│   ├── 00-ORCHESTRATOR.md     # Master setup instructions
│   ├── 01-initial-analysis.md # Codebase exploration
│   ├── 02-git-setup.md        # Git workflow setup
│   ├── 03-documentation.md    # Documentation generation
│   ├── 04-dev-environment.md  # Dev tools setup
│   ├── 05-github-integration.md # GitHub automation
│   ├── 06-quality-standards.md # Quality documentation
│   ├── config.template.json   # Configuration template
│   ├── templates/             # Reusable file templates
│   └── scripts/               # Setup automation scripts
├── .mcp-templates/            # MCP server templates
│   ├── README.md             # Templates overview
│   ├── nodejs/               # Node.js/TypeScript template
│   └── python/               # Python template
├── testing-template-packet/   # Django/Docker testing template
│   ├── README.md             # Testing setup overview
│   ├── START-HERE.md         # Quick start guide
│   ├── SETUP-CHECKLIST.md    # Step-by-step setup
│   ├── QUICK-REFERENCE.md    # Command cheat sheet
│   ├── pytest.ini.example    # Pytest configuration
│   ├── .claude/commands/test.md # Custom test command
│   ├── docs/TESTING.md       # Comprehensive testing guide
│   └── tests/test_example.py # Example test patterns
├── docs/                       # Documentation
│   ├── README.md              # Documentation index
│   ├── getting-started/       # Onboarding & setup docs
│   │   ├── TEMPLATE_USAGE.md  # How to use template
│   │   └── POST_TEMPLATE_CHECKLIST.md # Setup checklist
│   ├── guides/                # Development guides
│   │   ├── CODING_STANDARDS.md # Code quality
│   │   ├── BRANCH_STRATEGY.md  # Git workflow
│   │   ├── DOCUMENTATION_GUIDELINES.md # How to document
│   │   ├── CODE_OF_CONDUCT.md  # Community guidelines
│   │   └── PYPROJECT_GUIDE.md  # Python config guide
│   ├── workflows/             # Workflow documentation
│   │   ├── CLAUDE_CODE_WORKFLOWS.md # Claude Code best practices
│   │   └── pre-commit-hooks.md # Pre-commit guide
│   ├── security/              # Security docs
│   │   ├── SECURITY.md        # Security policy
│   │   └── MCP_SECURITY.md    # MCP security
│   └── integrations/          # Integration guides
│       └── MCP_SETUP.md       # MCP setup
├── scripts/                    # Automation scripts
│   ├── README.md              # Scripts documentation
│   ├── setup-labels.sh        # Label creation (Unix)
│   ├── setup-labels.bat       # Label creation (Windows)
│   └── tools/                 # Automation utilities
│       ├── convert_drafts_to_issues_TEMPLATE.py
│       ├── create_issue.sh
│       └── work-epic-issue.sh
├── templates/                  # Standalone templates
│   ├── README.md              # Templates guide
│   └── pyproject.toml.template # Python config template
├── README.md                   # Main entry point
├── QUICKSTART.md              # Quick reference
├── .gitignore                 # Git ignore rules
├── .mcp.json                  # MCP server configuration
├── .pre-commit-config.yaml    # Pre-commit hooks configuration
├── .secrets.baseline          # Secret detection baseline
└── package.json               # NPM configuration
```

## Usage Guide

### For New Projects (No Existing Code)

1. Click "Use this template" button
2. Create your new repository
3. Clone the repository
4. Follow [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)
5. Start building your application

### For Existing Projects

1. Copy files from this template to your existing repository
2. Fill out `.project-intake/config.json`
3. Run the Project Intake System:
   - Tell Claude Code: "Execute the project intake system"
4. Review and customize generated documentation
5. Run health check: `node .project-intake/scripts/health-check.cjs`

**Detailed instructions:** See [TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md)

## Key Features

### ✅ Complete Documentation Infrastructure

- README templates with tech stack, setup, and usage
- Contributing guidelines
- Coding standards and security practices
- API documentation templates
- Architecture and design patterns

### ✅ GitHub Integration

- Pre-configured issue and PR templates
- Label system (priority, type, status, effort, phase)
- Project board setup guides
- Milestone templates
- Weekly status reporting

### ✅ Git Workflow Automation

- Pre-commit hooks (prevent direct commits to main)
- Branch naming conventions (feature/, bugfix/, hotfix/)
- Conventional commit messages
- Pull request workflows
- Code review checklists

### ✅ Claude Code Integration

- 16 pre-configured MCP servers across 9 categories
- Browser automation (Playwright, Puppeteer)
- Database operations (PostgreSQL, SQLite)
- Container management (Docker) - perfect for testing template
- Web research (Brave Search, Context7)
- Team collaboration (Slack, GitHub, Git)
- 8 custom slash commands for common development tasks
- Security review and code quality automation
- Component and API generation
- Automated testing workflows with Docker integration

### ✅ Quality Assurance

- Code quality standards
- Security policy and best practices (OWASP Top 10, input validation, auth)
- MCP server security guidelines
- Testing guidelines (unit, component, integration)
- Code review checklists
- Health check validation

## Installation & Setup

### Prerequisites

- **Node.js 18+** - Required for scripts and validation
- **Git** - Version control
- **GitHub CLI** - For GitHub automation (recommended)
- **Claude Code** - For MCP integration (optional)

### Quick Setup

```bash
# 1. Create from template (via GitHub)
# Click "Use this template" button

# 2. Clone your new repository
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo

# 3. Install pre-commit hooks
bash .project-intake/scripts/setup-hooks.sh  # Mac/Linux/Git Bash
# OR
powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1  # Windows

# 3a. Install pre-commit framework (optional but recommended)
npm install -D pre-commit      # Node.js projects
# OR
pip install pre-commit         # Python projects
npx pre-commit install         # Install git hooks
npx pre-commit run --all-files # Initial run

# 4. Create labels (requires GitHub CLI)
bash setup-labels.sh  # Mac/Linux
# OR
setup-labels.bat  # Windows

# 5. Follow the checklist
# See POST_TEMPLATE_CHECKLIST.md for complete setup
```

## Customization

### For Different Project Types

**Web Application:**
- Keep all features as-is
- Add environment labels (`env: production`, `env: staging`)
- Configure deployment workflows

**Library/Package:**
- Add version labels (`v1.x`, `v2.x`)
- Include release process documentation
- Configure npm publishing workflow

**Mobile App:**
- Add platform labels (`platform: ios`, `platform: android`)
- Include device testing guidelines
- Document app store deployment

### Adapting Guidelines

All guideline documents can be customized:

- **CODING_STANDARDS.md** - Update for your tech stack
- **BRANCH_STRATEGY.md** - Modify for your workflow
- **DOCUMENTATION_GUIDELINES.md** - Adjust tone and requirements
- **MCP_SETUP.md** - Add additional MCP servers

## Project Management Workflow

### Daily Workflow

```bash
# Open project board
gh project view [PROJECT_NUMBER] --owner [OWNER] --web

# Check for open PRs
gh pr list

# Check items needing review
gh issue list --label "status: needs-review"
```

### Weekly Workflow

1. Generate status report using `WEEKLY_STATUS_TEMPLATE.md`
2. Review and close completed issues
3. Triage new issues (add labels, milestones, estimates)
4. Update project board views
5. Plan next week's priorities

### Label System

**Comprehensive labeling includes:**
- **Priority:** high, medium, low
- **Type:** feature, bug, docs, refactor, test
- **Status:** blocked, in-progress, needs-review, ready
- **Effort:** small (<2h), medium (2-8h), large (>8h)
- **Phase:** 1 (MVP), 2 (Enhancements), 3 (Advanced)
- **Client Visibility:** visible, internal

## Best Practices

### Security

- Never commit secrets to version control
- Use `.env` files for local development
- Validate all user input
- Follow security guidelines in [SECURITY.md](docs/security/SECURITY.md) and [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md)
- Use parameterized queries (prevent SQL injection)
- Sanitize HTML output (prevent XSS)
- Review [MCP_SECURITY.md](docs/security/MCP_SECURITY.md) before using MCP servers

### Code Quality

- Follow TypeScript best practices
- Write meaningful tests
- Document complex logic
- Keep functions small and focused
- Use consistent naming conventions
- Review your own PRs before requesting review

### Git Workflow

- Always use feature branches
- Write clear commit messages
- Keep PRs focused and small
- Respond to review feedback promptly
- Delete branches after merging

## Time Savings

| Task | Manual | Automated | Savings |
|------|--------|-----------|---------|
| Codebase exploration | 2-3 hours | 10 min | 85% |
| README generation | 1-2 hours | 5 min | 95% |
| Git workflow setup | 1 hour | 5 min | 90% |
| Testing infrastructure | 1-2 hours | 15 min | 85% |
| Documentation | 2-3 hours | 15 min | 90% |
| Project board setup | 30 min | 5 min | 80% |
| Quality standards | 1 hour | 10 min | 80% |
| **Total** | **8-12 hours** | **65 min** | **85-90%** |

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
