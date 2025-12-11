---
title: Repository Structure
---
# Repository Structure

Complete directory structure of the RV 2.0 repository.

## Full Directory Tree

```
RV_2.0/
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
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore rules
├── .mcp.json                  # MCP server configuration
├── .pre-commit-config.yaml    # Pre-commit hooks configuration
├── .secrets.baseline          # Secret detection baseline
└── package.json               # NPM configuration
```

## Key Directories

### `.claude/`
Claude Code configuration including custom slash commands and MCP server settings.

### `.github/`
GitHub-specific files including issue/PR templates, workflows, and project management guides.

### `.project-intake/`
Automated system for onboarding existing codebases (not needed for new projects).

### `testing-template-packet/`
Complete Django/Docker testing infrastructure template.

### `docs/`
All documentation organized by category (getting-started, guides, workflows, security, integrations).

### `scripts/`
Automation scripts for setup and maintenance tasks.

## Configuration Files

- `.mcp.json` - MCP server configuration (16 pre-configured servers)
- `.pre-commit-config.yaml` - Git pre-commit hooks configuration
- `.gitignore` - Standard Git ignore patterns
- `package.json` - Node.js scripts and metadata

## Essential Files

- `README.md` - Main documentation and entry point
- `QUICKSTART.md` - Quick reference for common workflows
- `CONTRIBUTING.md` - How to contribute to this project
- `LICENSE` - MIT License terms

---

**Last Updated:** 2025-11-22
