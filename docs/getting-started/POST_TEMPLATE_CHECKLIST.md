# Post-Template Setup Checklist

After creating a new repository from this template, follow this checklist to customize it for your project. Complete each section in order for best results.

## 📋 Progress Tracker

- [ ] Phase 1: Repository Basics (5-10 minutes)
- [ ] Phase 2: Project Configuration (10-15 minutes)
- [ ] Phase 3: Git & Workflow Setup (5-10 minutes)
- [ ] Phase 4: GitHub Integration (15-20 minutes)
- [ ] Phase 5: Development Tools (10-15 minutes)
- [ ] Phase 6: Documentation Customization (15-20 minutes)
- [ ] Phase 7: Team Onboarding (5-10 minutes)
- [ ] Phase 8: Final Verification (5-10 minutes)

**Estimated Total Time:** 70-110 minutes (1-2 hours)

---

## Phase 1: Repository Basics

### 1.1 Update Repository Information

- [ ] **Repository name** - Choose a descriptive name
- [ ] **Repository description** - Add a brief description on GitHub
- [ ] **Topics/tags** - Add relevant topics (e.g., `react`, `typescript`, `web-app`)
- [ ] **Visibility** - Set to public or private as appropriate

### 1.2 Update README.md

Replace template content with your project information:

- [ ] Project name and description (lines 1-3)
- [ ] Key features section
- [ ] Tech stack details
- [ ] Prerequisites specific to your project
- [ ] Installation instructions
- [ ] Usage examples
- [ ] Remove or update "Generated from SafeQuote.io" footer (line 200-201)

### 1.3 License

- [ ] Choose appropriate license
- [ ] Update or create LICENSE file
- [ ] Update license section in README.md

### 1.4 Contact Information

- [ ] Update support email addresses
- [ ] Update author information
- [ ] Update contribution contact details

**Checkpoint:** Repository has your project name and basic info ✅

---

## Phase 2: Project Configuration

### 2.1 Configure Project Intake System

**If starting with existing code:**

- [ ] Copy `config.template.json` to `config.json`:
  ```bash
  cp .project-intake/config.template.json .project-intake/config.json
  ```

- [ ] Fill out `config.json` with your project details:
  - [ ] Project name and description
  - [ ] GitHub organization and repository
  - [ ] Package manager (npm, pnpm, or yarn)
  - [ ] Primary maintainer information
  - [ ] Tech stack details
  - [ ] Project board preferences

- [ ] Validate configuration:
  ```bash
  node .project-intake/scripts/validate-config.cjs
  ```

- [ ] Fix any validation errors before proceeding

**If starting from scratch (no existing code):**

- [ ] Skip config.json for now
- [ ] You can run the intake system later after writing initial code

### 2.2 Environment Variables

- [ ] Review `.env.example` (if exists)
- [ ] Create your own `.env.example` with required variables:
  ```env
  # Database
  DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

  # Authentication
  JWT_SECRET=your-secret-key-here

  # API Keys
  API_KEY=your-api-key
  ```

- [ ] Verify `.env` is in `.gitignore`
- [ ] Document all environment variables in README or separate file

### 2.3 Claude Code Configuration (Optional)

If using Claude Code for development:

- [ ] Copy CLAUDE.md template to project root:
  ```bash
  cp .project-intake/templates/CLAUDE.md ./CLAUDE.md
  ```

- [ ] Fill in template variables:
  - Replace `{{PROJECT_NAME}}` with your project name
  - Update `{{FRONTEND_FRAMEWORK}}`, `{{BACKEND_FRAMEWORK}}`, etc.
  - Customize tech stack section for your project
  - Update package manager commands
  - Adjust project structure to match your layout

- [ ] Commit CLAUDE.md to version control for team consistency

**Checkpoint:** Configuration files are ready ✅

---

## Phase 3: Git & Workflow Setup

### 3.1 Install Pre-Commit Hooks

**Mac/Linux/Git Bash:**
```bash
bash .project-intake/scripts/setup-hooks.sh
```

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1
```

- [ ] Hooks installed successfully
- [ ] Test the hook:
  ```bash
  git checkout main
  touch test.txt
  git add test.txt
  git commit -m "test"  # Should be blocked
  rm test.txt
  ```

### 3.2 Configure Branch Protection (GitHub Settings)

- [ ] Go to Settings → Branches → Add rule
- [ ] Branch name pattern: `main`
- [ ] Enable "Require pull request reviews before merging"
- [ ] Enable "Require status checks to pass before merging" (if you have CI)
- [ ] Enable "Require conversation resolution before merging"
- [ ] Enable "Include administrators" (recommended)
- [ ] Save protection rule

### 3.3 Review Git Workflow Documentation

- [ ] Read [BRANCH_STRATEGY.md](../guides/BRANCH_STRATEGY.md)
- [ ] Verify branch naming conventions work for your team
- [ ] Customize if needed (e.g., different prefixes)
- [ ] Ensure team understands commit message format

**Checkpoint:** Git workflow is configured and protected ✅

---

## Phase 4: GitHub Integration

### 4.1 Create Labels

**Using bash script:**
```bash
bash setup-labels.sh
```

**Or Windows batch:**
```cmd
setup-labels.bat
```

**Or manually via GitHub CLI:**
```bash
# See README.md for full list of label commands
gh label create "priority: high" --color "d73a4a"
# ... (run all label creation commands)
```

- [ ] All labels created successfully
- [ ] Verify labels visible in Issues → Labels

### 4.2 Set Up Project Board

Follow [PROJECT_VIEWS_GUIDE.md](../../.github/PROJECT_VIEWS_GUIDE.md):

- [ ] Create new Project (Projects → New project)
- [ ] Choose "Board" or "Table" view
- [ ] Add fields: Status, Priority, Assignee, Sprint, Effort
- [ ] Create views:
  - [ ] Kanban Board (default)
  - [ ] Current Sprint
  - [ ] By Priority
  - [ ] By Assignee
- [ ] Get Project ID: `gh project list --owner [OWNER]`
- [ ] Save Project ID for automation

### 4.3 Create Milestones

```bash
# Example milestones
gh api repos/:owner/:repo/milestones -f title="Phase 1: MVP" -f description="Initial release"
gh api repos/:owner/:repo/milestones -f title="Phase 2: Enhancements" -f description="Feature additions"
```

- [ ] Milestones created
- [ ] Milestones align with project plan

### 4.4 Enable GitHub Features

- [ ] Enable Issues (Settings → Features)
- [ ] Enable Projects (Settings → Features)
- [ ] Enable Discussions (optional)
- [ ] Enable Wiki (optional)
- [ ] Configure security alerts (Settings → Security)

**Checkpoint:** GitHub is fully configured ✅

---

## Phase 5: Development Tools

### 5.1 Install GitHub CLI

**Check if installed:**
```bash
gh --version
```

**Install if needed:**
- **Mac:** `brew install gh`
- **Windows:** `winget install GitHub.cli`
- **Linux:** See [GitHub CLI installation](https://github.com/cli/cli#installation)

- [ ] GitHub CLI installed
- [ ] Authenticated: `gh auth login`

### 5.2 Configure MCP Servers

Review [MCP_SETUP.md](../integrations/MCP_SETUP.md):

- [ ] Review `.mcp.json` configuration
- [ ] Install Playwright (if using):
  ```bash
  npx playwright install
  ```
- [ ] Test in Claude Code:
  ```bash
  claude
  # Approve MCP servers when prompted
  ```
- [ ] Add additional MCP servers as needed

### 5.3 Install Claude Code (Optional)

- [ ] Download from [claude.com/code](https://code.claude.com)
- [ ] Install for your platform
- [ ] Test basic commands
- [ ] Configure auto-approvals (optional)

### 5.4 Package Manager

- [ ] Verify Node.js installed: `node --version` (18+ required)
- [ ] Install/verify package manager:
  - **npm:** Comes with Node.js
  - **pnpm:** `npm install -g pnpm`
  - **yarn:** `npm install -g yarn`

### 5.5 Additional Tools (as needed)

- [ ] Docker (if using databases)
- [ ] PostgreSQL/MySQL (if applicable)
- [ ] Redis (if applicable)
- [ ] VS Code extensions (ESLint, Prettier, etc.)

**Checkpoint:** All development tools installed ✅

---

## Phase 6: Documentation Customization

### 6.1 Customize Coding Standards

Edit [CODING_STANDARDS.md](../guides/CODING_STANDARDS.md):

- [ ] Update tech stack specific sections
- [ ] Add project-specific patterns
- [ ] Modify security guidelines if needed
- [ ] Add examples from your codebase
- [ ] Update testing framework details

### 6.2 Customize Branch Strategy

Edit [BRANCH_STRATEGY.md](../guides/BRANCH_STRATEGY.md):

- [ ] Verify branch prefixes match your needs
- [ ] Update examples with your context
- [ ] Modify workflow if you use different process
- [ ] Update emergency procedures contact info

### 6.3 Customize Documentation Guidelines

Edit [DOCUMENTATION_GUIDELINES.md](../guides/DOCUMENTATION_GUIDELINES.md):

- [ ] Add project-specific documentation requirements
- [ ] Update examples with your tech stack
- [ ] Modify tone/style if needed for your team
- [ ] Add links to your documentation tools

### 6.4 Create Additional Documentation

Based on your project type:

- [ ] **API Documentation** - Document all endpoints
- [ ] **Architecture Guide** - Explain system design
- [ ] **Deployment Guide** - How to deploy
- [ ] **Troubleshooting Guide** - Common issues and solutions
- [ ] **Testing Guide** - How to write and run tests
- [ ] **Security Policy** - Security practices and reporting

### 6.5 Update Project Intake Guides

If you're keeping `.project-intake/`:

- [ ] Update examples in guide files with your project context
- [ ] Modify templates to match your needs
- [ ] Test the intake system if you have existing code

**Checkpoint:** Documentation is customized and complete ✅

---

## Phase 7: Team Onboarding

### 7.1 Create CONTRIBUTING.md

- [ ] Copy from template or create from scratch
- [ ] Include getting started steps
- [ ] Reference coding standards and branch strategy
- [ ] Explain PR process
- [ ] Add code review guidelines
- [ ] Include code of conduct (if open source)

### 7.2 Create Onboarding Checklist

Create a team onboarding document:

```markdown
# New Team Member Checklist

## Access
- [ ] GitHub repository access
- [ ] Project board access
- [ ] Required API keys/credentials

## Tools Setup
- [ ] Node.js 18+
- [ ] GitHub CLI
- [ ] Claude Code (optional)
- [ ] Code editor configured

## Documentation Review
- [ ] Read README.md
- [ ] Review CODING_STANDARDS.md
- [ ] Understand BRANCH_STRATEGY.md
- [ ] Review project architecture

## First Tasks
- [ ] Clone repository
- [ ] Run local development environment
- [ ] Pick up first good-first-issue
```

### 7.3 Prepare Team Announcement

- [ ] Draft message introducing new structure
- [ ] Schedule team walkthrough meeting
- [ ] Prepare demo of key workflows
- [ ] Share documentation links

### 7.4 Knowledge Transfer

- [ ] Schedule pairing sessions
- [ ] Record walkthrough video (optional)
- [ ] Create FAQ document
- [ ] Set up team chat channel for questions

**Checkpoint:** Team is ready to start using the new structure ✅

---

## Phase 8: Final Verification

### 8.1 Run Health Check

```bash
node .project-intake/scripts/health-check.cjs
```

Review the output:

- [ ] All required files present
- [ ] Git hooks installed
- [ ] Configuration valid
- [ ] Documentation complete
- [ ] No critical issues

### 8.2 Test Complete Workflow

Walk through a complete feature workflow:

- [ ] Create feature branch
- [ ] Make a small change
- [ ] Commit with proper message
- [ ] Push to remote
- [ ] Create PR via GitHub CLI
- [ ] Review PR checklist completion
- [ ] Merge PR
- [ ] Verify branch deleted
- [ ] Update local main

### 8.3 Verify GitHub Integration

- [ ] Create test issue from template
- [ ] Add to project board
- [ ] Move through workflow columns
- [ ] Close issue
- [ ] Verify status report can be generated

### 8.4 Test MCP Integration (if using Claude Code)

- [ ] Start Claude Code: `claude`
- [ ] Approve MCP servers
- [ ] Ask Claude to perform browser automation
- [ ] Verify Playwright works correctly

### 8.5 Security Check

- [ ] Verify `.env` is in `.gitignore`
- [ ] No secrets committed to repository
- [ ] Branch protection enabled
- [ ] Security alerts enabled
- [ ] Review dependency vulnerabilities: `npm audit`

### 8.6 Documentation Review

- [ ] All links in README work
- [ ] Installation instructions accurate
- [ ] All placeholders replaced
- [ ] No template-specific language remains
- [ ] "Last updated" dates current

**Checkpoint:** Everything verified and working ✅

---

## Phase 9: Cleanup (Optional)

### 9.1 Remove Template Files

Consider removing these files after setup:

- [ ] `TEMPLATE_USAGE.md` (this file's parent guide)
- [ ] `POST_TEMPLATE_CHECKLIST.md` (this file)
- [ ] `.project-intake/` (if intake system completed)
- [ ] Example status reports
- [ ] Template-specific documentation

### 9.2 Commit Initial Setup

```bash
git add .
git commit -m "chore: Complete template setup and customization"
git push origin main
```

### 9.3 Tag Release

```bash
git tag -a v0.1.0 -m "Initial setup from template"
git push origin v0.1.0
```

**Checkpoint:** Repository cleaned and ready for development ✅

---

## Quick Reference: Essential Commands

```bash
# Git workflow
git checkout main && git pull origin main
git checkout -b feature/my-feature
git commit -m "feat: Add feature"
git push -u origin feature/my-feature
gh pr create --title "feat: Add feature" --body "Description"

# Health check
node .project-intake/scripts/health-check.cjs

# Project board
gh project list --owner [OWNER]
gh project view [NUMBER] --owner [OWNER] --web

# Labels
bash setup-labels.sh  # or setup-labels.bat on Windows

# MCP status
claude mcp list
```

---

## Troubleshooting

### Config Validation Fails

**Error:** Missing required fields or invalid format

**Solution:**
```bash
node .project-intake/scripts/validate-config.cjs
# Read error messages and fix config.json accordingly
```

### Pre-commit Hook Not Working

**Error:** Can still commit to main directly

**Solution:**
```bash
# Reinstall hooks
bash .project-intake/scripts/setup-hooks.sh  # Mac/Linux
# Or
powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1  # Windows

# Verify hook exists
cat .git/hooks/pre-commit  # Mac/Linux
type .git\hooks\pre-commit  # Windows
```

### GitHub CLI Commands Fail

**Error:** `gh` command not found or authentication errors

**Solution:**
```bash
# Install GitHub CLI first
brew install gh  # Mac
winget install GitHub.cli  # Windows

# Authenticate
gh auth login

# Test
gh repo view
```

### MCP Server Won't Connect

**Error:** Playwright MCP server not responding

**Solution:**
```bash
# Verify npx available
npx --version

# Install Playwright browsers
npx playwright install

# Check Claude Code MCP configuration
claude mcp list

# Reset and re-approve if needed
claude mcp reset-project-choices
```

---

## Getting Help

- **Documentation issues:** Open an issue in this repository
- **Template questions:** Check [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)
- **Git workflow questions:** Review [BRANCH_STRATEGY.md](../guides/BRANCH_STRATEGY.md)
- **Coding questions:** Review [CODING_STANDARDS.md](../guides/CODING_STANDARDS.md)
- **MCP issues:** Check [MCP_SETUP.md](../integrations/MCP_SETUP.md)

---

## Completion Checklist

Before considering setup complete, verify:

✅ Repository has unique name and description
✅ All template placeholders replaced
✅ Configuration files customized
✅ Git hooks installed and tested
✅ GitHub labels, milestones, and project board created
✅ Development tools installed
✅ Documentation customized for your project
✅ Team onboarding materials prepared
✅ Health check passes
✅ Complete workflow tested end-to-end
✅ First commit pushed to repository

---

## Time Saved

**Manual Setup:** 7-10 hours
**Using This Template:** 1-2 hours
**Time Saved:** 85-90%

---

**Congratulations!** Your project is now set up with best practices and ready for development. 🎉

**Next Steps:**
1. Start building your first feature
2. Onboard your team
3. Begin tracking work on the project board
4. Maintain the documentation as you grow

---

**Checklist Version:** 1.0.0
**Last Updated:** 2025-11-21
