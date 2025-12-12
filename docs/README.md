# RV 2.0 Documentation

Comprehensive documentation organized to teach best practices and efficient tool usage.

---

## 👋 New Here? Start Here

**This documentation gives you everything you need to build high-quality software with best practices and powerful AI tools.**

### Which Path Are You?

```text
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
 │    NEW    │         │   USING   │         │  SPECIFIC │
 │   TO AI   │         │   TOOLS   │         │   ISSUE   │
 │   CODING  │         │           │         │           │
 └───────────┘         └───────────┘         └───────────┘
       │                      │                      │
       ▼                      ▼                      ▼
  Learning Paths        Common Tasks          Troubleshooting
  (Start here!)        (Quick reference)        (Debug it!)
       │                      │                      │
       ▼                      ▼                      ▼
  /learning-paths/      COMMON_TASKS.md       /troubleshooting/
```

### Quick Decision Guide

| I want to... | Go here | Time |
|-------------|---------|------|
| **Learn Claude Code from scratch** | [New to Claude Code Path](learning-paths/new-to-claude-code/) | 2 hours |
| **Look up a command quickly** | [Common Tasks](COMMON_TASKS.md) | 2 min |
| **Fix a bug or error** | [Troubleshooting Guide](troubleshooting/README.md) | 5-30 min |
| **Understand a tool (Git, MCP, etc.)** | [Tools Guide](tools/README.md) | 10-30 min |
| **Make a technical decision** | [Decision Trees](best-practices/DECISION_TREES.md) | 5 min |
| **See example code** | [Examples](examples/) | 5 min |
| **Learn testing/auth/APIs** | [Learning Paths](learning-paths/) | 2-4 hours |

---

## 📚 Documentation Structure

### 🚀 Getting Started
New to this project? Start here:
- **[Setup Checklist](../SETUP_CHECKLIST.md)** - Single source of truth for dev environment setup
- **[Common Tasks](COMMON_TASKS.md)** - Quick reference for everyday development (start here after setup!)
- [Getting Started with Claude Code](tools/claude-code/GETTING_STARTED.md) - 30-minute guide to AI-assisted development
- [TEMPLATE_USAGE.md](getting-started/TEMPLATE_USAGE.md) - How to use this template
- [POST_TEMPLATE_CHECKLIST.md](getting-started/POST_TEMPLATE_CHECKLIST.md) - Complete setup checklist

### 🔧 Tools Guide **[NEW]**

Learn to use development tools effectively:

- **[Tools Overview](tools/README.md)** - Complete guide to the development tool ecosystem
- **Claude Code:**
  - [Getting Started](tools/claude-code/GETTING_STARTED.md) - Start here!
  - [Workflows](tools/claude-code/WORKFLOWS.md) - Advanced patterns
  - [Tips & Tricks](tools/claude-code/TIPS_AND_TRICKS.md)
- **MCP (Model Context Protocol):**
  - [MCP Overview](tools/mcp/OVERVIEW.md) - Understand the ecosystem
  - [5-Minute Quick Start](tools/mcp/QUICKSTART.md)
  - [When to Use What](tools/mcp/WHEN_TO_USE_WHAT.md) - Decision guide
  - [Complete Setup](tools/mcp/SETUP.md)
- **Cheat Sheets:**
  - [Git Commands](tools/cheat-sheets/GIT_COMMANDS.md)
  - [NPM Scripts](tools/cheat-sheets/NPM_SCRIPTS.md)
  - [Prisma CLI](tools/cheat-sheets/PRISMA_CLI.md)

### 🚨 Troubleshooting **[NEW]**

When things go wrong:

- **[Troubleshooting Index](troubleshooting/README.md)** - Start here when stuck
- [Authentication Debugging](troubleshooting/AUTH_DEBUGGING.md)
- [Database Issues](troubleshooting/DATABASE_ISSUES.md)
- [Build Errors](troubleshooting/BUILD_ERRORS.md)
- [Deployment Failures](troubleshooting/DEPLOYMENT_FAILURES.md)
- **[FAQ](troubleshooting/FAQ.md)** - Frequently asked questions

### 📚 Learning Paths **[NEW]**

Progressive learning modules for skill building:

- **[Learning Paths Overview](learning-paths/README.md)** - Choose your path
- [New to Claude Code](learning-paths/new-to-claude-code/) - 2-hour guided introduction
- [Testing Fundamentals](learning-paths/testing-fundamentals/) - Master testing
- [Authentication Deep Dive](learning-paths/authentication-deep-dive/) - Auth patterns
- [API Design](learning-paths/api-design/) - Build better APIs
- [Scaling to Production](learning-paths/scaling-to-production/) - Production readiness

### 🎯 Best Practices **[NEW]**

Consolidated patterns and anti-patterns:

- **[Best Practices Overview](best-practices/README.md)** - Start here
- [Code Organization](best-practices/CODE_ORGANIZATION.md) - Structure and modularity
- [Database Design](best-practices/DATABASE_DESIGN.md) - Schema patterns
- [Performance](best-practices/PERFORMANCE.md) - Optimization strategies
- [Security Hardening](best-practices/SECURITY_HARDENING.md) - Secure by default
- **[Decision Trees](best-practices/DECISION_TREES.md)** - Visual decision guides
- [Error Handling](best-practices/ERROR_HANDLING.md) - Graceful failures
- [State Management](best-practices/STATE_MANAGEMENT.md) - React state patterns
- [API Design Patterns](best-practices/API_DESIGN_PATTERNS.md) - REST best practices

### 💡 Code Examples **[NEW]**

Copy-paste-ready code snippets:

- **[Examples Overview](examples/README.md)** - Browse all examples
- **Code Patterns:**
  - [Auth Implementation](examples/code-patterns/auth-implementation/)
  - [Database Operations](examples/code-patterns/database-operations/)
  - [API Endpoints](examples/code-patterns/api-endpoints/)
  - [Testing Examples](examples/code-patterns/testing-examples/)
- **Before/After:**
  - [Error Handling](examples/before-after/error-handling.md)
  - [Database Queries](examples/before-after/database-queries.md)
  - [Component Structure](examples/before-after/component-structure.md)
- **Templates:**
  - [API Route](examples/templates/api-route.md)
  - [React Component](examples/templates/react-component.md)
  - [Test Suite](examples/templates/test-suite.md)

### 📋 Reference

Quick-access reference documentation:

- **[Environment Variables](reference/ENV_VARIABLES.md)** - All env vars with descriptions

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
