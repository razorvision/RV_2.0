# Project Intake Template Repository

A comprehensive template repository for quickly bootstrapping new projects with best practices, established workflows, automated tooling, and complete documentation infrastructure.

> **🎯 85-90% time savings** on project setup (7-10 hours → 1-2 hours)

## 🚀 Quick Start

### Use This Template

1. **Click "Use this template"** button above (green button)
2. **Create your new repository** with your project name
3. **Clone your new repository**:
   ```bash
   git clone https://github.com/your-username/your-new-repo.git
   cd your-new-repo
   ```
4. **Follow the [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)** for complete setup

**📖 New to templates?** Read [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) for detailed instructions.

## What's Included

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
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - TypeScript, React, security, testing best practices
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow, branch naming, commit conventions
- [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) - How to write and maintain documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick reference for common workflows

### 🤖 MCP Integration (Model Context Protocol)

**Automated Testing & Workflows:**
- [MCP_SETUP.md](MCP_SETUP.md) - Complete guide for setting up MCP servers with Claude Code
- [MCP_SECURITY.md](MCP_SECURITY.md) - Security best practices for MCP servers
- `.mcp.json` - Pre-configured MCP servers (Playwright, filesystem, git, memory)
- Enables subagent control for complex multi-step testing scenarios
- Screenshot capture and visual regression testing
- Multi-browser compatibility testing
- Network monitoring and performance analysis

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

**Scripts & Utilities:**
- `setup-labels.sh` / `setup-labels.bat` - Automated label creation
- `convert_drafts_to_issues_TEMPLATE.py` - Convert draft issues to GitHub issues
- `create_issue.sh` - Create GitHub issues via CLI
- `work-epic-issue.sh` - Workflow automation for epics
- Health check validation scripts
- Config validation utilities

### 🛡️ Git Workflow Protection

**Pre-Commit Hooks:**
- Blocks direct commits to `main` branch
- Enforces feature branch workflow
- Ensures code review process
- Cross-platform support (Mac/Linux/Windows)

## Repository Structure

```
project-intake-template/
├── .github/                    # GitHub configuration
│   ├── ISSUE_TEMPLATE/        # Issue templates
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
├── tools/                      # Automation utilities
├── CODING_STANDARDS.md        # Code quality guidelines
├── BRANCH_STRATEGY.md         # Git workflow guide
├── DOCUMENTATION_GUIDELINES.md # Documentation best practices
├── MCP_SETUP.md               # MCP server setup
├── MCP_SECURITY.md            # MCP security best practices
├── TEMPLATE_USAGE.md          # How to use this template
├── POST_TEMPLATE_CHECKLIST.md # Setup checklist
├── QUICKSTART.md              # Quick reference
├── .mcp.json                  # MCP server configuration
├── setup-labels.sh            # Label creation script (Unix)
└── setup-labels.bat           # Label creation script (Windows)
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

**Detailed instructions:** See [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)

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

### ✅ MCP Integration

- Pre-configured Playwright for browser automation
- Automated testing workflows
- Subagent control for complex scenarios
- Team collaboration setup

### ✅ Quality Assurance

- Code quality standards
- Security best practices (SQL injection, XSS, auth)
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
- Follow security guidelines in CODING_STANDARDS.md
- Use parameterized queries (prevent SQL injection)
- Sanitize HTML output (prevent XSS)

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
| Documentation | 2-3 hours | 15 min | 90% |
| Project board setup | 30 min | 5 min | 80% |
| Quality standards | 1 hour | 10 min | 80% |
| **Total** | **7-10 hours** | **50 min** | **85-90%** |

## Documentation

### Essential Guides
- [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) - How to use this template
- [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md) - Complete setup checklist
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - Code quality standards
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow
- [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) - Documentation standards
- [MCP_SETUP.md](MCP_SETUP.md) - MCP integration guide
- [MCP_SECURITY.md](MCP_SECURITY.md) - MCP security best practices
- [CLAUDE_CODE_WORKFLOWS.md](CLAUDE_CODE_WORKFLOWS.md) - Claude Code best practices and workflows

### Project Management
- [PROJECT_MANAGEMENT_GUIDE.md](.github/PROJECT_MANAGEMENT_GUIDE.md) - Complete PM guide
- [PROJECT_VIEWS_GUIDE.md](.github/PROJECT_VIEWS_GUIDE.md) - Project board setup
- [QUICKSTART.md](QUICKSTART.md) - Quick reference

## Support & Resources

### Getting Help

- **Template usage questions:** See [TEMPLATE_USAGE.md](TEMPLATE_USAGE.MD)
- **Setup issues:** Check [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)
- **Git workflow questions:** Review [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md)
- **Code standards questions:** Check [CODING_STANDARDS.md](CODING_STANDARDS.md)
- **MCP issues:** See [MCP_SETUP.md](MCP_SETUP.md) and [MCP_SECURITY.md](MCP_SECURITY.md)

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
2. **Follow [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)** for complete setup
3. **Read [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)** for detailed guidance
4. **Start building** with confidence in your foundation

**Questions?** Check the documentation or open an issue!
