# Documentation Index

Comprehensive documentation for the project-intake-template repository.

> **Looking for quick answers?** See [Common Tasks](COMMON_TASKS.md) for day-to-day development reference.

## 📚 Documentation Structure

### 🚀 Getting Started
New to this template? Start here:
- **[Setup Checklist](../SETUP_CHECKLIST.md)** - Single source of truth for dev environment setup
- **[Common Tasks](COMMON_TASKS.md)** - Quick reference for everyday development (start here after setup!)
- [TEMPLATE_USAGE.md](getting-started/TEMPLATE_USAGE.md) - How to use this template
- [POST_TEMPLATE_CHECKLIST.md](getting-started/POST_TEMPLATE_CHECKLIST.md) - Complete setup checklist
- [PROJECT_INTAKE_CHECKLIST.md](guides/PROJECT_INTAKE_CHECKLIST.md) - Full project setup checklist
- [DEV_ENVIRONMENT_SETUP.md](guides/DEV_ENVIRONMENT_SETUP.md) - IDE, Claude Code, and tooling setup

### 📋 Reference
Quick-access reference documentation:
- **[Environment Variables](reference/ENV_VARIABLES.md)** - All env vars with descriptions and where to get them

### 📖 Development Guides
Organized by category in [guides/](guides/):

**Development:**
- [Coding Standards](guides/development/CODING_STANDARDS.md) - Code quality guidelines
- [CODE_QUALITY_POLICY.md](guides/CODE_QUALITY_POLICY.md) - TODO/FIXME policy, PR standards
- [Testing Guide](guides/development/TESTING_GUIDE.md) - Unit, integration, and E2E testing
- [API Patterns](guides/development/API_PATTERNS.md) - REST conventions and validation
- [State Management](guides/development/STATE_MANAGEMENT.md) - React state strategies
- [Error Handling](guides/development/ERROR_HANDLING.md) - Error boundaries and logging
- [Feature Flags](guides/development/FEATURE_FLAGS.md) - Safe rollouts and A/B testing
- [Technical Debt](guides/development/TECHNICAL_DEBT.md) - Identifying and paying down debt

**Infrastructure:**
- [REPO_SETUP_GUIDE.md](guides/REPO_SETUP_GUIDE.md) - GitHub repository and project board setup
- [Database Setup](guides/infrastructure/DATABASE_SETUP.md) - PostgreSQL, MySQL, SQLite, MongoDB setup
- [Docker Guide](guides/infrastructure/DOCKER_GUIDE.md) - Containerization and Docker Compose
- [Deployment Guide](guides/infrastructure/DEPLOYMENT_GUIDE.md) - CI/CD and hosting setup
- [Incident Response](guides/infrastructure/INCIDENT_RESPONSE.md) - Production issue handling
- [Monitoring & Observability](guides/infrastructure/MONITORING_OBSERVABILITY.md) - Sentry and error tracking
- [Environment Management](guides/infrastructure/ENVIRONMENT_MANAGEMENT.md) - Env vars and secrets

**Team:**
- [Branch Strategy](guides/team/BRANCH_STRATEGY.md) - Git workflow guide
- [Code Review Guidelines](guides/team/CODE_REVIEW_GUIDELINES.md) - Review process and feedback
- [Documentation Guidelines](guides/team/DOCUMENTATION_GUIDELINES.md) - Documentation best practices
- [Code of Conduct](guides/team/CODE_OF_CONDUCT.md) - Community guidelines
- [Onboarding Checklist](guides/team/ONBOARDING_CHECKLIST.md) - New team member setup

**Special:**
- [PyProject Guide](guides/PYPROJECT_GUIDE.md) - Python project configuration

### 🔧 Framework Guides
Technology-specific patterns in [frameworks/](frameworks/):
- [Database Patterns](frameworks/DATABASE_PATTERNS.md) - Prisma, transactions, audit trails
- [Performance Guide](frameworks/PERFORMANCE_GUIDE.md) - Core Web Vitals, caching
- [NEXTJS_PATTERNS.md](frameworks/NEXTJS_PATTERNS.md) - Next.js App Router, caching, env vars
- [PRISMA_PATTERNS.md](frameworks/PRISMA_PATTERNS.md) - ORM patterns, migrations, connections
- [NEXTAUTH_PATTERNS.md](frameworks/NEXTAUTH_PATTERNS.md) - Authentication patterns and rate limiting
- [AUTH_IMPLEMENTATION_GUIDE.md](frameworks/AUTH_IMPLEMENTATION_GUIDE.md) - Step-by-step auth setup

### 🔄 Workflows
Development workflow documentation:
- [CLAUDE_CODE_WORKFLOWS.md](workflows/CLAUDE_CODE_WORKFLOWS.md) - Claude Code best practices
- [CHANGE_REQUEST_WORKFLOW.md](workflows/CHANGE_REQUEST_WORKFLOW.md) - Research-plan-approve-implement pattern
- [VISUAL_DEVELOPMENT_WORKFLOW.md](workflows/VISUAL_DEVELOPMENT_WORKFLOW.md) - UI quality control
- [CI_MONITORING_GUIDE.md](workflows/CI_MONITORING_GUIDE.md) - Automated PR status monitoring
- [pre-commit-hooks.md](workflows/pre-commit-hooks.md) - Pre-commit hooks guide

### 🔒 Security
Security policies and best practices:
- [SECURITY.md](security/SECURITY.md) - Security policy and reporting
- [MCP_SECURITY.md](security/MCP_SECURITY.md) - MCP server security guidelines

### 🔌 Integrations
Integration and setup guides:
- **[MCP Quick Start](integrations/MCP_QUICKSTART.md)** - 5-minute MCP setup guide
- [MCP_SETUP.md](integrations/MCP_SETUP.md) - Complete Model Context Protocol setup
- [MCP_SERVERS_GUIDE.md](integrations/MCP_SERVERS_GUIDE.md) - All 16 MCP servers documented
- [MCP_TROUBLESHOOTING.md](integrations/MCP_TROUBLESHOOTING.md) - MCP troubleshooting guide

## 🔍 Quick Links

**For New Projects:**
1. Read [PROJECT_INTAKE_CHECKLIST.md](guides/PROJECT_INTAKE_CHECKLIST.md)
2. Set up environment with [DEV_ENVIRONMENT_SETUP.md](guides/DEV_ENVIRONMENT_SETUP.md)
3. Configure repo with [REPO_SETUP_GUIDE.md](guides/REPO_SETUP_GUIDE.md)
4. Review [Coding Standards](guides/development/CODING_STANDARDS.md)

**For Contributors:**
1. Review [Code of Conduct](guides/team/CODE_OF_CONDUCT.md)
2. Follow [Branch Strategy](guides/team/BRANCH_STRATEGY.md)
3. Check [Code Review Guidelines](guides/team/CODE_REVIEW_GUIDELINES.md)
4. Understand [CHANGE_REQUEST_WORKFLOW.md](workflows/CHANGE_REQUEST_WORKFLOW.md)

**For Security:**
1. Read [SECURITY.md](security/SECURITY.md) for reporting issues
2. Review [MCP_SECURITY.md](security/MCP_SECURITY.md) for MCP best practices

**For Framework Setup:**
1. Review relevant guide in [frameworks/](frameworks/)
2. Follow [AUTH_IMPLEMENTATION_GUIDE.md](frameworks/AUTH_IMPLEMENTATION_GUIDE.md) for auth
3. Customize CLAUDE.md framework section for your stack

**For AI Tooling:**
1. Set up Claude Code with [DEV_ENVIRONMENT_SETUP.md](guides/DEV_ENVIRONMENT_SETUP.md)
2. Configure MCP servers with [MCP_SERVERS_GUIDE.md](integrations/MCP_SERVERS_GUIDE.md)
3. Troubleshoot issues with [MCP_TROUBLESHOOTING.md](integrations/MCP_TROUBLESHOOTING.md)

## 📂 Other Documentation

- **GitHub Integration:** See [.github/](../.github/) for issue templates, workflows, and project management
- **Claude Code:** See [.claude/](../.claude/) for slash commands and configuration
- **Project Intake:** See [.project-intake/](../.project-intake/) for automated setup system
- **Testing:** See [testing-template-packet/](../testing-template-packet/) for Django/Docker testing
- **Project Guidelines:** See [CLAUDE.md](../CLAUDE.md) for development standards

## 💡 Navigation Tips

- All documentation is organized by purpose (getting-started, guides, workflows, etc.)
- Each directory contains related documentation
- Cross-references use relative links
- Start with getting-started/ if you're new
- Framework-specific docs are in frameworks/

---

**Need help?** Check the main [README.md](../README.md) or open an issue!
