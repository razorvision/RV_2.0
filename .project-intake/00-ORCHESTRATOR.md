# Project Intake Orchestrator

## 🎯 Purpose

This folder contains a **reusable project intake system** that automates the setup of new repositories with best practices, documentation, workflows, and quality standards learned from the MedNexus project.

## 📋 Instructions for Claude Code

When a user asks you to execute the project intake system, follow these steps in order:

### Step 0: Prerequisites Check

**CRITICAL: Run these checks BEFORE proceeding. STOP execution if any fail.**

1. **Check Node.js version:**
   ```bash
   node .project-intake/scripts/check-node-version.cjs
   ```
   - Requires Node.js 18 or higher
   - If check fails, user must upgrade Node.js before continuing

2. **Verify git repository exists:**
   ```bash
   git status
   ```
   - If this fails with "not a git repository", STOP and tell user to run `git init` first
   - Git must be initialized before intake system can run

3. **Check if `.project-intake/` folder exists:**
   - Verify folder is present in current directory
   - If missing, STOP - user needs to copy the intake folder first

4. **Confirm config.json exists and is filled out:**
   - Check if `.project-intake/config.json` exists
   - If not, tell user to copy from `config.template.json` and fill it out
   - STOP until config.json is created

5. **Validate config.json** - Run validator to check required fields and types:
   - **Node.js (all platforms):** `node .project-intake/scripts/validate-config.cjs`
   - **Bash (Mac/Linux/Git Bash):** `bash .project-intake/scripts/validate-config.sh`
   - **PowerShell (Windows):** `powershell .project-intake/scripts/validate-config.ps1`
   - Validator checks: required fields, correct types, field formats, helpful error messages
   - **STOP if validation fails** - user must fix config before proceeding

### Step 1: Initial Analysis (Execute 01-initial-analysis.md)
- Systematically explore the codebase using Glob and Read tools
- Identify tech stack (frontend framework, build tool, styling, routing, etc.)
- Map project structure (folders, key files, conventions)
- Analyze dependencies and their purposes
- Document existing features and pages
- Identify design system (colors, typography, etc.)
- List configuration files and their purposes

**Output:** Comprehensive codebase analysis document

### Step 2: Git Setup (Execute 02-git-setup.md)
- Install pre-commit hook that blocks direct commits to main branch
- Set up branch naming conventions (feature/, bugfix/, hotfix/)
- Configure commit message standards (feat:, fix:, docs:, etc.)
- Add `.gitignore` entries if needed
- Document git workflow for team

**Output:** Git hooks installed, workflow documented

### Step 3: Documentation (Execute 03-documentation.md)
- Generate or update README.md with codebase analysis findings
- Create WORKFLOW_GUIDE.md with git best practices
- Create CONTRIBUTING.md with contribution guidelines
- Add TEAM_MEETING_CHECKLIST.md for onboarding
- Document existing architecture and patterns
- **After documentation:** Run template processor to customize template files:
  - `node .project-intake/scripts/process-templates.cjs`
  - This replaces {{placeholders}} with config.json values
  - Generates WORKFLOW_GUIDE.md and TEAM_MEETING_CHECKLIST.md customized for this project

**Output:** Complete documentation suite with customized templates

### Step 4: Development Environment (Execute 04-dev-environment.md)
- Check for and install GitHub CLI if needed
- Check for and install Playwright if needed
- Detect package manager (pnpm/npm/yarn) or use config
- Create `.env.example` file from existing `.env`
- Set up Prettier/ESLint if not present
- Configure Claude Code settings (`.claude/settings.json`)
- Set up MCP servers for Claude Code integration
- Create custom slash commands for common tasks

**Output:** Development tools configured, Claude Code integrated

### Step 5: GitHub Integration (Execute 05-github-integration.md)
- Create GitHub Project Board using Kanban template (if config.createProjectBoard = true)
- Set up columns: Backlog, Ready, In Progress, In Review, Done
- Get project ID and field IDs for automation
- Create initial issues if requested by user
- Configure GitHub Actions workflows (CI, security, releases)
- Set up automated PR checks and labeling
- Document GitHub CLI workflows

**Output:** Project board created, automation configured, GitHub Actions deployed

### Step 6: Quality Standards (Execute 06-quality-standards.md)
- Document coding conventions found in codebase
- Create security best practices guide
- Document architecture patterns
- Add testing guidelines
- Create code review checklist

**Output:** Quality standards documented

### Step 7: Final Report & Health Check
Generate a comprehensive setup report with:
- Summary of actions taken
- List of files created/modified
- Configuration details
- Next steps for the team
- Quick reference commands

**Then run the health check to validate everything:**
```bash
node .project-intake/scripts/health-check.cjs
```

This provides a visual dashboard showing:
- ✅ Completed steps (all checks passed)
- ⚠️ Partial steps (some checks passed)
- ❌ Incomplete steps (need attention)
- Detailed status of each intake step
- Completion percentage and summary

**The health check validates:**
- Prerequisites (git, config.json)
- Initial analysis (README, tech stack documented)
- Git setup (pre-commit hooks, workflow guide)
- Documentation (all guide files present)
- Dev environment (GitHub CLI, tools, configs)
- GitHub integration (project board, templates)
- Quality standards (coding standards, security, architecture)

### Step 8: Cleanup Options
Ask the user:
1. **Keep `.project-intake/` folder** - For reference and future updates
2. **Remove `.project-intake/` folder** - Clean up after setup complete
3. **Commit `.project-intake/` to repo** - Share with team for consistency

## 🔄 Workflow

```
User downloads new repo
    ↓
User copies .project-intake/ folder into repo
    ↓
User fills out config.json (from config.template.json)
    ↓
User tells Claude: "Execute the project intake system"
    ↓
Claude reads this orchestrator
    ↓
Claude executes steps 1-7 automatically
    ↓
30-45 minutes later: Fully documented, configured project ✅
```

## 📁 What's in This Folder

- **00-ORCHESTRATOR.md** (this file) - Master instructions
- **01-initial-analysis.md** - Codebase exploration prompts
- **02-git-setup.md** - Git hooks, branch strategy, commit conventions, pre-commit framework
- **03-documentation.md** - README generation, workflow guides
- **04-dev-environment.md** - Tools installation, config setup, Claude Code configuration
- **05-github-integration.md** - Project board, GitHub CLI workflows, Actions
- **06-quality-standards.md** - Coding standards, security, architecture
- **config.template.json** - Configuration template (copy to config.json)
- **templates/** - Reusable file templates
  - `pre-commit` - Git hook script
  - `README.template.md` - README structure
  - `WORKFLOW_GUIDE.md` - Git workflow guide
  - `.prettierrc` - Code formatting config
  - `.env.example` - Environment variables template
  - `issue-template.md` - GitHub issue format
  - `pr-template.md` - Pull request format
  - `CLAUDE.md` - Claude Code integration guide
- **scripts/** - Setup automation scripts
  - `setup-hooks.sh` / `setup-hooks.ps1` - Install git hooks
  - `validate-config.cjs` - Validate config.json
  - `health-check.cjs` - Validate setup completion

## 🎓 What We Learned from MedNexus

This intake system captures best practices from building the MedNexus medical-legal coordination platform:

### Git & Version Control
- Pre-commit framework with comprehensive code quality checks
- Secret detection to prevent credential leaks
- Feature branch workflow with PR-based merges
- Semantic versioning for releases
- Conventional commit messages (enforced via hooks)
- GitHub CLI for automated workflows
- Automated PR validation and labeling

### Documentation
- Comprehensive README with tech stack, setup, and architecture
- Workflow guide for team onboarding
- Contributing guidelines with examples
- Meeting checklist for team coordination
- Clear documentation of design system

### Development Environment
- Consistent tooling (GitHub CLI, Playwright, Claude Code)
- Package manager standardization (pnpm)
- Environment variable templates
- Code formatting with Prettier and ESLint
- Path aliases for clean imports
- Claude Code integration with MCP servers
- Custom slash commands for common tasks
- Project-scoped permissions configuration

### GitHub Integration
- Project boards for visual task tracking
- Automated status updates via GitHub CLI
- Issue and PR templates with security checklists
- GraphQL queries for advanced automation
- GitHub Actions workflows (CI, CodeQL, dependency updates)
- Automated PR validation and labeling
- Community health files (CODE_OF_CONDUCT, SECURITY)

### Quality Standards
- TypeScript for type safety
- React best practices (hooks, contexts, custom hooks)
- Security practices (credential handling, input validation)
- Responsive design patterns
- Accessibility standards (WCAG AAA)
- Dark mode support with CSS variables

### Architecture Patterns
- Clear separation: client/, server/, shared/
- Component organization: pages/, components/, contexts/, hooks/
- Database: Drizzle ORM with migrations and seeds
- Authentication: JWT with bcrypt password hashing
- API: Express with CORS and security middleware

## ⏱️ Expected Time Savings

| Task | Manual Time | Automated Time | Savings |
|------|-------------|----------------|---------|
| Codebase exploration | 2-3 hours | 10 minutes | 85% |
| README generation | 1-2 hours | 5 minutes | 95% |
| Git workflow setup | 1 hour | 5 minutes | 90% |
| Documentation creation | 2-3 hours | 15 minutes | 90% |
| Project board setup | 30 minutes | 5 minutes | 80% |
| Quality standards doc | 1 hour | 10 minutes | 80% |
| **Total** | **7-10 hours** | **50 minutes** | **85-90%** |

## 🚀 Quick Start

1. **Copy this folder** into your new project's root directory
2. **Copy config.template.json** → **config.json**
3. **Fill out config.json** with your project details
4. **Open Claude Code** and say: "Please execute the project intake system in `.project-intake/`"
5. **Review the output** and make any adjustments
6. **Commit or remove** the `.project-intake/` folder as preferred

## 🎯 Success Criteria

After running this intake system, you should have:

✅ Comprehensive understanding of the codebase
✅ Complete, accurate README.md
✅ Git workflow with comprehensive pre-commit hooks
✅ Secret detection and security scanning
✅ Branch protection and naming conventions
✅ Conventional commit message enforcement
✅ Workflow guide for team members
✅ Contributing guidelines with CODE_OF_CONDUCT
✅ Development environment configured
✅ Claude Code integration with MCP servers
✅ Custom slash commands for common tasks
✅ GitHub project board with automation
✅ GitHub Actions workflows (CI, security, releases)
✅ Automated PR validation and labeling
✅ Quality standards documented
✅ Code review process with security checklists
✅ Security best practices in place
✅ Team onboarding checklist
✅ 85-90% time savings on project setup

## 📞 Support

If you encounter issues:
1. Check that `config.json` is properly filled out
2. Verify you're in a git repository
3. Ensure you have necessary permissions (GitHub, git)
4. Review individual guide files (01-06) for specific steps
5. Ask Claude to troubleshoot specific errors

## 🔄 Updates

To update this intake system with new learnings:
1. Modify the relevant guide file (01-06)
2. Update templates/ if needed
3. Update this orchestrator if workflow changes
4. Test on a new project
5. Document changes in version control

---

**Version:** 1.0.0
**Created:** 2025-01-14
**Based on:** MedNexus Medical-Legal Coordination Platform
**Maintained by:** Andrew Tucker + Claude Code
