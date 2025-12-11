---
title: Project Intake Checklist
parent: Guides
---
# Project Intake Checklist

A comprehensive checklist for setting up new projects from scratch. Use this as a guide when onboarding to a new codebase or initializing a fresh project.

## Phase 1: Repository Setup

### Initial Creation
- [ ] Create repository from template (if using RV 2.0 template)
- [ ] Clone repository locally
- [ ] Verify `.gitignore` covers your tech stack
- [ ] Set up branch protection rules (see [Repo Setup Guide](./REPO_SETUP_GUIDE.md))

### Repository Configuration
- [ ] Update `README.md` with project-specific information
- [ ] Configure `CLAUDE.md` for project-specific instructions
- [ ] Set up GitHub labels for issues/PRs
- [ ] Create GitHub Project board for task tracking
- [ ] Configure PR template (`.github/pull_request_template.md`)
- [ ] Configure issue templates (`.github/ISSUE_TEMPLATE/`)

## Phase 2: Development Environment

### Local Setup
- [ ] Install required Node.js version (check `.nvmrc` or `package.json`)
- [ ] Run `npm install` to install dependencies
- [ ] Copy `.env.example` to `.env.local` and configure
- [ ] Verify dev server starts successfully

### IDE Configuration
- [ ] Install recommended VS Code extensions
- [ ] Configure Claude Code (see [Dev Environment Setup](./DEV_ENVIRONMENT_SETUP.md))
- [ ] Set up MCP servers if needed
- [ ] Verify linting and formatting work

## Phase 3: Infrastructure

### Database Setup
- [ ] Provision database (Neon, PlanetScale, local PostgreSQL, etc.)
- [ ] Configure `DATABASE_URL` in environment
- [ ] Run initial migrations: `npx prisma db push` or `npx prisma migrate dev`
- [ ] Seed database if applicable: `npx prisma db seed`
- [ ] Verify database connection works

### Authentication Setup
- [ ] Choose auth provider (NextAuth, Clerk, Auth0, etc.)
- [ ] Configure OAuth apps (GitHub, Google, etc.)
- [ ] Set auth-related environment variables
- [ ] Test login/logout flow
- [ ] See [Auth Implementation Guide](../frameworks/AUTH_IMPLEMENTATION_GUIDE.md) for details

### Hosting Setup
- [ ] Connect repository to hosting platform (Vercel, Netlify, etc.)
- [ ] Configure environment variables in hosting dashboard
- [ ] Set up preview deployments for PRs
- [ ] Configure production domain
- [ ] Verify deployment pipeline works

## Phase 4: CI/CD

### GitHub Actions
- [ ] Set up lint workflow
- [ ] Set up test workflow
- [ ] Set up build verification workflow
- [ ] Configure required status checks for PRs
- [ ] Add any secrets needed by workflows

### Quality Gates
- [ ] Configure ESLint rules
- [ ] Configure Prettier formatting
- [ ] Set up pre-commit hooks (Husky + lint-staged)
- [ ] Configure test coverage thresholds

## Phase 5: Documentation

### Project Documentation
- [ ] Document architecture decisions
- [ ] Create API documentation (if applicable)
- [ ] Document deployment process
- [ ] Add troubleshooting guide

### Team Onboarding
- [ ] Create getting started guide
- [ ] Document common workflows
- [ ] List key contacts/resources

## Phase 6: Verification

### Smoke Tests
- [ ] App loads in browser
- [ ] Authentication works end-to-end
- [ ] Database operations work
- [ ] Key features function correctly

### CI Verification
- [ ] Create test PR to verify CI runs
- [ ] Verify all checks pass
- [ ] Test merge process

---

## Quick Start Template

Copy this for quick project setup notes:

```markdown
## Project: [NAME]

### URLs
- Repo: 
- Staging: 
- Production: 
- Project Board: 

### Key Credentials Needed
- [ ] Database URL
- [ ] Auth provider secrets
- [ ] API keys: 

### First-Time Setup Commands
```bash
git clone [REPO_URL]
cd [PROJECT]
npm install
cp .env.example .env.local
# Configure .env.local
npx prisma db push
npm run dev
```

### Notes
[Any project-specific gotchas or setup notes]
```

---

## Related Guides

- [Dev Environment Setup](./DEV_ENVIRONMENT_SETUP.md) - IDE and tool configuration
- [Repo Setup Guide](./REPO_SETUP_GUIDE.md) - GitHub configuration details
- [Auth Implementation Guide](../frameworks/AUTH_IMPLEMENTATION_GUIDE.md) - Authentication setup
- [MCP Servers Guide](../integrations/MCP_SERVERS_GUIDE.md) - AI tooling setup
