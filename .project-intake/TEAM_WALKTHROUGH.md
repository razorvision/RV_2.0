# Project Intake System - Team Walkthrough

## What Is This?

The `.project-intake/` folder contains an **automated project setup system** that configures new repositories with best practices, documentation, and workflows in **30-45 minutes** instead of **7-10 hours** of manual work.

Think of it as a "project setup wizard" that handles all the boring setup tasks automatically.

## Why Should We Use This?

### Time Savings
- **Manual setup:** 7-10 hours per project
- **With this system:** 30-45 minutes
- **Savings:** 85-90% of setup time

### Consistency
- Every project follows the same standards
- No more "how did we do this last time?"
- New team members get the same experience

### Quality
- Pre-commit hooks prevent mistakes
- Secret scanning protects credentials
- Documentation is always up-to-date

## What Does It Do?

The system automates **6 major setup tasks:**

### 1. Codebase Analysis
- Explores your code automatically
- Identifies tech stack (React, TypeScript, etc.)
- Maps project structure
- Documents dependencies

### 2. Git Workflow Setup
- Installs pre-commit hook that:
  - Blocks direct commits to `main` branch
  - Scans for secrets (API keys, passwords)
  - Enforces feature branch workflow
- Sets up branch naming conventions
- Configures commit message standards

### 3. Documentation Generation
- Creates comprehensive README
- Generates workflow guide with examples
- Builds team onboarding checklist
- Documents all your work automatically

### 4. Development Environment
- Sets up GitHub CLI
- Configures code formatting (Prettier)
- Creates `.env.example` template
- Validates tool installations

### 5. GitHub Integration
- Creates project board (optional)
- Sets up issue templates
- Creates PR templates
- Automates project tracking

### 6. Quality Standards
- Documents coding conventions
- Establishes security best practices
- Defines architecture patterns
- Creates code review checklists

## How Do We Use It?

### Step 1: Copy to New Project (30 seconds)
```bash
# Copy the entire .project-intake/ folder to your new project
cp -r .project-intake/ /path/to/new-project/
cd /path/to/new-project/
```

### Step 2: Configure (5 minutes)
```bash
# Copy the template
cp .project-intake/config.template.json .project-intake/config.json

# Edit config.json - only 3 fields required:
# - projectName: "TaskFlow"
# - githubOwner: "acme-corp"
# - githubRepo: "taskflow"
```

### Step 3: Validate (30 seconds)
```bash
# Check your configuration is correct
node .project-intake/scripts/validate-config.cjs
```

### Step 4: Run (30-45 minutes)
```bash
# Open Claude Code and say:
"Please execute the project intake system in .project-intake/"

# Claude will automatically run through all 6 steps
```

### Step 5: Verify (1 minute)
```bash
# Check everything worked
node .project-intake/scripts/health-check.cjs
```

**Total time:** ~45 minutes (mostly automated)

## What Files Are Important?

### For Users (You!)
- **README.md** - Start here, comprehensive instructions
- **config.template.json** - Copy this to config.json and fill it out
- **config.example.json** - See what a filled config looks like
- **CHANGELOG.md** - See what changed between versions

### For Claude Code (Automated)
- **00-ORCHESTRATOR.md** - Master instructions Claude follows
- **01-06 guide files** - Step-by-step instructions for each phase
- **scripts/** - Automation scripts (validators, health check, etc.)
- **templates/** - File templates with {{placeholders}}

You don't need to understand the guide files - Claude Code reads them automatically.

## Common Questions

**Q: Do I need to know how to code?**
No! Just fill out `config.json` with your project details. Claude Code handles everything else.

**Q: What if something goes wrong?**
Run the health check: `node .project-intake/scripts/health-check.cjs`
It shows exactly what's working and what needs attention.

**Q: Can I customize it for our team?**
Yes! Edit the templates in `.project-intake/templates/` before running.

**Q: Does this work on Windows?**
Yes! We have PowerShell versions of all scripts. Works on Windows, Mac, and Linux.

**Q: What if I don't have Claude Code?**
You can run steps manually following the guide files. Takes longer (7-10 hours) but still works.

## What Gets Created?

After running, your project will have:

✅ **README.md** - Complete project documentation
✅ **WORKFLOW_GUIDE.md** - Git workflow and best practices  
✅ **TEAM_MEETING_CHECKLIST.md** - Onboarding guide for new team members
✅ **Pre-commit hooks** - Prevent mistakes automatically
✅ **.env.example** - Environment variable template
✅ **GitHub project board** - Task tracking (optional)
✅ **Issue/PR templates** - Consistent format for GitHub
✅ **Quality standards** - Coding conventions documented

## Real-World Example

**Before (Manual Setup):**
1. Clone repo → 2 min
2. Figure out tech stack → 30 min
3. Write README → 2 hours
4. Set up git hooks → 1 hour
5. Configure tools → 1 hour
6. Create documentation → 3 hours
7. Set up project board → 30 min
**Total: ~8 hours**

**After (With This System):**
1. Clone repo → 2 min
2. Copy .project-intake → 30 sec
3. Fill config.json → 5 min
4. Run intake system → 30 min
5. Verify with health check → 1 min
**Total: ~40 minutes**

**Time saved per project: 7+ hours**

## Platform Support

| Platform | Supported | How to Use |
|----------|-----------|------------|
| **macOS** | ✅ Yes | Use Bash scripts (.sh) |
| **Linux** | ✅ Yes | Use Bash scripts (.sh) |
| **Windows** | ✅ Yes | Use PowerShell (.ps1) or Git Bash (.sh) |
| **All** | ✅ Yes | Use Node.js scripts (.cjs) |

## Security Features

The system includes built-in protection:

- **Secret scanning** - Prevents committing API keys, passwords, tokens
- **.env protection** - Blocks .env files from being committed
- **Branch protection** - Requires feature branches, no direct main commits
- **Input validation** - Checks all config values before use

## Team Best Practices

### For Project Leads
1. Fill out `config.json` with accurate project details
2. Review generated documentation before sharing
3. Customize templates if your team has specific needs

### For Developers
1. Follow the workflow in `WORKFLOW_GUIDE.md`
2. Use feature branches (never commit to `main`)
3. Run health check if you hit issues

### For New Team Members
1. Read `TEAM_MEETING_CHECKLIST.md` first
2. Follow setup instructions in `README.md`
3. Ask questions in team chat if stuck

## Maintenance

### Updating the System
When we improve the intake system:
1. Read `CHANGELOG.md` for what changed
2. Copy updated `.project-intake/` folder to projects
3. Re-run intake if needed

### Contributing Improvements
Found a way to make it better?
1. Update the relevant files in `.project-intake/`
2. Test on a new project
3. Share with team for review

## Getting Help

**Quick Help:**
- Check the FAQ in `README.md` (25+ questions answered)
- Run health check: `node .project-intake/scripts/health-check.cjs`

**Still Stuck?**
- Ask in team Slack/chat
- Check guide files for detailed instructions
- Contact the person who set this up

## Key Takeaways

1. **Saves time:** 7-10 hours → 30-45 minutes per project
2. **Easy to use:** Just fill out config.json and run
3. **Consistent:** Every project gets the same quality setup
4. **Safe:** Built-in secret scanning and validation
5. **Cross-platform:** Works on Windows, Mac, Linux

## Next Steps

**To use on your next project:**
1. Read the full `README.md` in `.project-intake/`
2. Copy the folder to your new project
3. Fill out `config.json`
4. Run the intake system
5. Check results with health check

**Questions?** Check `README.md` FAQ section or ask the team!

---

**Version:** 1.0.0  
**Created:** 2025-01-14  
**Based on:** MedNexus Project Best Practices  
**Maintained by:** Andrew Tucker + Claude Code

**Ready to save 7+ hours on your next project?** 🚀
