# Project Intake System

A reusable, automated project setup system that configures new repositories with best practices, documentation, workflows, and quality standards in **30-45 minutes** instead of **7-10 hours**.

## 🎯 What This System Does

When you copy this folder into a new project and run it with Claude Code, it automatically:

1. **Analyzes the codebase** - Tech stack, structure, dependencies, features
2. **Sets up Git workflows** - Pre-commit hooks, branch conventions, commit standards
3. **Generates documentation** - README, workflow guides, contributing guidelines
4. **Configures dev environment** - GitHub CLI, Playwright, formatters, auto-approvals
5. **Creates project board** - GitHub Kanban board with automation
6. **Documents quality standards** - Coding conventions, security, architecture

## ⚡ Quick Start

### 1. Copy to New Project

**Windows (PowerShell):**
```powershell
# Copy the entire .project-intake/ folder to your new project
Copy-Item -Recurse .project-intake\ \path\to\new-project\
cd \path\to\new-project\
```

**Mac/Linux/Git Bash:**
```bash
# Copy the entire .project-intake/ folder to your new project
cp -r .project-intake/ /path/to/new-project/
cd /path/to/new-project/
```

### 2. Configure

**Windows (PowerShell):**
```powershell
# Copy the config template
Copy-Item .project-intake\config.template.json .project-intake\config.json

# Edit config.json with your project details
# Required fields: projectName, githubOwner, githubRepo

# Validate your configuration
powershell .project-intake\scripts\validate-config.ps1
# OR: node .project-intake/scripts/validate-config.cjs
```

**Mac/Linux/Git Bash:**
```bash
# Copy the config template
cp .project-intake/config.template.json .project-intake/config.json

# Edit config.json with your project details
# Required fields: projectName, githubOwner, githubRepo

# Validate your configuration
node .project-intake/scripts/validate-config.cjs
# OR: bash .project-intake/scripts/validate-config.sh
```

### 3. Run with Claude Code

Open Claude Code and say:

```
Please execute the project intake system in .project-intake/
```

Claude will automatically run through all 6 steps and provide a completion report.

### 4. Generate Documentation from Templates (Optional)

After Claude completes the intake, generate customized documentation files:

```bash
# This processes templates and replaces {{placeholders}} with your config values
node .project-intake/scripts/process-templates.cjs
```

This will create:
- `WORKFLOW_GUIDE.md` - Customized with your project name and repo
- `TEAM_MEETING_CHECKLIST.md` - Customized with your project details
- `README.md` - Only if it doesn't already exist (won't overwrite)

All files will use values from your `config.json`.

## 🏥 Check Project Health

At any time, run the health check to see your project setup status:

```bash
node .project-intake/scripts/health-check.cjs
```

This will show:
- ✅ Completed steps (all checks passed)
- ⚠️ Partial steps (some checks passed)
- ❌ Incomplete steps (checks failed)

Each step shows detailed status of individual checks, helping you identify what's missing or needs attention.

## 📁 What's Included

### Guide Files
- `00-ORCHESTRATOR.md` - Master instructions for Claude
- `01-initial-analysis.md` - Codebase exploration
- `02-git-setup.md` - Git hooks and workflows
- `03-documentation.md` - README and guides
- `04-dev-environment.md` - Tools and config
- `05-github-integration.md` - Project board setup
- `06-quality-standards.md` - Coding standards

### Templates
- `pre-commit` - Git hook to block main commits
- `.prettierrc` - Code formatting config
- `.env.example` - Environment variables template
- `README.template.md` - README structure
- `WORKFLOW_GUIDE.template.md` - Git workflow guide
- `TEAM_MEETING_CHECKLIST.template.md` - Onboarding checklist
- `issue-template.md` - GitHub issue format
- `pr-template.md` - Pull request template
- `pre-commit.bat` - Windows batch version of pre-commit hook

### Scripts
- `setup-hooks.sh` - Install git hooks (Unix/Mac/Git Bash)
- `setup-hooks.ps1` - Install git hooks (Windows PowerShell)
- `detect-platform.sh` - Detect OS and provide guidance
- `validate-config.cjs` - Validate config.json (Node.js, all platforms)
- `validate-config.sh` - Validate config.json (Bash)
- `validate-config.ps1` - Validate config.json (PowerShell)
- `process-templates.cjs` - Replace {{placeholders}} in templates with config values
- `health-check.cjs` - Validate project setup and show intake completion status

### Configuration
- `config.template.json` - Project configuration template

## 💻 Platform Compatibility

| Platform | Status | Notes |
|----------|--------|-------|
| **Windows** | ✅ Supported | Use PowerShell scripts (`.ps1`) or Git Bash |
| **macOS** | ✅ Supported | Use bash scripts (`.sh`) |
| **Linux** | ✅ Supported | Use bash scripts (`.sh`) |

### Platform-Specific Setup

**Windows Users:**
- **Option 1 (Recommended):** Use PowerShell for native Windows support
- **Option 2:** Use Git Bash for Unix-like experience
- Pre-commit hook works in both PowerShell and Git Bash
- Some GitHub CLI commands may require adjustments

**macOS Users:**
- All bash scripts work natively
- May need to install Xcode Command Line Tools: `xcode-select --install`
- GitHub CLI available via Homebrew: `brew install gh`

**Linux Users:**
- All bash scripts work natively
- GitHub CLI installation varies by distribution
- Use your package manager to install dependencies

## 🎓 Based on MedNexus Best Practices

This system captures lessons learned from building the MedNexus medical-legal coordination platform:

- Pre-commit hooks for branch protection
- GitHub CLI workflows and automation
- Semantic versioning and conventional commits
- Comprehensive documentation standards
- Claude Code automation patterns
- Security best practices
- Quality standards and code review checklists

## ⏱️ Time Savings

| Task | Manual | Automated | Savings |
|------|---------|-----------|---------|
| Codebase exploration | 2-3 hours | 10 min | 85% |
| README generation | 1-2 hours | 5 min | 95% |
| Git workflow setup | 1 hour | 5 min | 90% |
| Documentation | 2-3 hours | 15 min | 90% |
| Project board | 30 min | 5 min | 80% |
| Quality standards | 1 hour | 10 min | 80% |
| **Total** | **7-10 hours** | **50 min** | **85-90%** |

## 🔧 Configuration Options

Edit `config.json` to customize:

```json
{
  "projectName": "YourProject",
  "githubOwner": "your-username",
  "githubRepo": "your-repo",
  "createProjectBoard": true,
  "installGitHooks": true,
  "setupDatabase": true,
  "databaseType": "postgresql",
  "frontendFramework": "react",
  "packageManager": "pnpm"
}
```

See `config.template.json` for all available options and field descriptions.

**Need an example?** Check out `config.example.json` to see a fully filled-out configuration for a realistic project.

## 📝 Manual Execution (Without Claude)

If you prefer to run steps manually:

1. **Step 1:** Follow `01-initial-analysis.md` to explore codebase
2. **Step 2:** Run `scripts/setup-hooks.sh` to install git hooks
3. **Step 3:** Use `templates/README.template.md` to create README
4. **Step 4:** Install GitHub CLI and Playwright as needed
5. **Step 5:** Create project board via `gh project create`
6. **Step 6:** Document coding standards from codebase analysis

## 🎯 Success Criteria

After running, you should have:

✅ Complete understanding of codebase
✅ Accurate, comprehensive README
✅ Git workflow with pre-commit hooks
✅ Team documentation and guides
✅ Development environment configured
✅ GitHub project board with automation
✅ Quality standards documented
✅ 85-90% time savings on setup

## 🔄 Updating This System

To add new learnings from future projects:

1. Update relevant guide files (01-06)
2. Add new templates if needed
3. Update orchestrator if workflow changes
4. Test on a new project
5. Document in version control

## ❓ Frequently Asked Questions

### General Questions

**Q: How long does the intake system take to run?**
A: Typically 30-45 minutes with Claude Code automation. Manual execution takes 7-10 hours.

**Q: Can I use this on an existing project?**
A: Yes! The system works for both new and existing projects. For existing projects, it will enhance documentation and add missing setup steps without breaking existing code.

**Q: Do I need to know how to code to use this?**
A: No coding knowledge required. Claude Code handles all technical steps automatically. You just need to fill out `config.json` with your project details.

**Q: What if I don't have Claude Code?**
A: You can run steps manually following the guide files (01-06.md). See the "Manual Execution" section above.

### Setup Questions

**Q: Why does the validator say my config is invalid?**
A: Check that:
- All required fields are filled (projectName, githubOwner, githubRepo)
- Field types are correct (strings for text, booleans for true/false)
- No extra commas at end of objects
- Run `node .project-intake/scripts/validate-config.cjs` for detailed errors

**Q: Can I skip steps I don't need?**
A: Yes. Set boolean flags in config.json to false:
- `createProjectBoard: false` - Skip GitHub project board
- `installGitHooks: false` - Skip pre-commit hooks
- `setupDatabase: false` - Skip database configuration

**Q: The pre-commit hook blocks my commits. How do I bypass it?**
A: For emergencies only: `git commit --no-verify`
Normal workflow: Create a feature branch instead of committing to main

### Platform Questions

**Q: Does this work on Windows?**
A: Yes! Use PowerShell scripts (`.ps1`) or Git Bash for Unix-like experience. All major features supported.
- Git Bash: Use the standard `pre-commit` hook (Bash script)
- Native Windows CMD: Use `pre-commit.bat` if needed (manual installation)

**Q: I'm on Mac but don't have Homebrew. Will this work?**
A: Yes, but you'll need to install tools manually:
- GitHub CLI: Download from https://cli.github.com/
- Node.js: Download from https://nodejs.org/

**Q: What's the difference between the .sh, .ps1, and .cjs versions of scripts?**
A:
- `.sh` - Bash scripts for Mac/Linux/Git Bash
- `.ps1` - PowerShell scripts for Windows
- `.cjs` - Node.js scripts that work on all platforms

### Troubleshooting

**Q: "command not found: gh" error**
A: GitHub CLI is not installed. Install it:
- Mac: `brew install gh`
- Windows: Download from https://cli.github.com/
- Linux: Follow instructions at https://github.com/cli/cli#installation

**Q: Template processor creates files with {{placeholders}} still in them**
A: Some placeholders don't have values in your config.json. Add the missing fields or edit the generated files manually.

**Q: Health check shows failures but I completed the steps**
A: Health check looks for specific files and patterns. Review the detailed checks to see what's missing. Some failures are OK if you intentionally skipped steps.

**Q: The system created files I don't need. Can I delete them?**
A: Yes! After setup, you can:
- Keep what you need
- Delete what you don't
- Customize templates before running processor

**Q: Can I customize the templates?**
A: Absolutely! Edit files in `.project-intake/templates/` before running the intake system. Add your own placeholders or modify structure.

### Project Board Questions

**Q: Project board creation failed. What should I check?**
A:
- Verify `gh auth status` shows you're authenticated
- Check you have permission to create boards in the org/repo
- Ensure `projectBoardName` in config.json is unique
- Try creating manually: `gh project create --owner [owner] --title "[name]"`

**Q: Can I use existing project board instead of creating new one?**
A: Yes. Skip board creation (`createProjectBoard: false`) and link manually via GitHub UI.

### Configuration Questions

**Q: What's the difference between projectName and githubRepo?**
A:
- `projectName` - Display name (can have spaces, e.g., "My Awesome Project")
- `githubRepo` - GitHub repository name (no spaces, e.g., "my-awesome-project")

**Q: Do I need to fill out all fields in config.json?**
A: No. Only these are required:
- `projectName`
- `githubOwner`
- `githubRepo`

All others are optional and have sensible defaults.

**Q: Can I change config.json after running the intake?**
A: Yes, but you'll need to re-run affected steps. Better to get it right first time.

### Error Messages

**Q: "Not in a git repository" error**
A: Run `git init` in your project folder first.

**Q: "Node.js version too old" error**
A: Upgrade to Node.js 18+:
- Use nvm: `nvm install 18 && nvm use 18`
- Or download from https://nodejs.org/

**Q: "Permission denied" when running scripts**
A: Make scripts executable: `chmod +x .project-intake/scripts/*.sh`

### Advanced Usage

**Q: Can I add my own custom scripts?**
A: Yes! Add them to `.project-intake/scripts/` and reference in guide files.

**Q: How do I contribute improvements back?**
A: Fork the MedNexus repo, make changes to `.project-intake/`, and submit a PR.

**Q: Can I use this for non-JavaScript projects?**
A: Partially. The git workflow, documentation, and project board setup work for any language. Some steps (package.json, npm scripts) are JavaScript-specific.

## 📞 Support

If you encounter issues not covered in FAQ:
- Verify `config.json` is properly filled out
- Check you're in a git repository
- Ensure GitHub CLI is authenticated
- Review individual guide files for troubleshooting
- Check the health dashboard: `node .project-intake/scripts/health-check.cjs`

## 📄 Version

**Version:** 1.0.0
**Created:** 2025-01-14
**Source:** MedNexus Medical-Legal Coordination Platform
**Maintained by:** Andrew Tucker + Claude Code

---

**Ready to save 85-90% of your project setup time?** 🚀

Copy this folder to your next project and let Claude Code handle the setup!
