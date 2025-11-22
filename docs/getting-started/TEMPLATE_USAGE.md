# Template Repository Usage Guide

This repository is a **template** designed to help you quickly set up new projects with best practices, established workflows, and comprehensive tooling already configured.

## What is a Template Repository?

A template repository is a special type of GitHub repository that serves as a starting point for new projects. Unlike forking, using a template creates a clean repository without the template's commit history, giving you a fresh start while retaining all the setup and structure.

## What's Included in This Template

### 📋 Project Management Infrastructure
- GitHub issue templates (bug reports, features, epics)
- Pull request templates
- Project board setup guides
- Weekly status report templates
- Complete project management workflows

### 📚 Documentation & Guidelines
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - TypeScript, React, security best practices
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow, branch naming, commit conventions
- [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) - How to document code and projects
- [MCP_SETUP.md](MCP_SETUP.md) - Model Context Protocol integration for Claude Code

### 🔧 Development Tools
- Pre-commit hooks to prevent direct commits to main
- MCP configuration for automated testing (Playwright)
- Label creation scripts
- GitHub CLI workflows
- Health check validation scripts

### 🎯 Project Intake System
- Automated codebase analysis
- Documentation generation
- Development environment setup
- Quality standards documentation
- Step-by-step project setup guides

## How to Use This Template

### Option 1: Using GitHub's Template Feature (Recommended)

1. **Navigate to this repository on GitHub**

2. **Click the "Use this template" button** (green button near the top)

3. **Create your new repository:**
   - Choose a repository name
   - Select public or private
   - Choose "Create repository from template"

4. **Clone your new repository:**
   ```bash
   git clone https://github.com/your-username/your-new-repo.git
   cd your-new-repo
   ```

5. **Follow the [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)** to customize for your project

### Option 2: Manual Copy

If you prefer to copy files manually:

1. **Create a new repository** on GitHub or locally with `git init`

2. **Download this template:**
   ```bash
   # Download as ZIP or clone
   git clone https://github.com/your-username/project-intake-template.git template-source
   ```

3. **Copy files to your new repository:**
   ```bash
   # Copy GitHub configuration
   cp -r template-source/.github your-new-repo/.github

   # Copy project intake system
   cp -r template-source/.project-intake your-new-repo/.project-intake

   # Copy documentation
   cp template-source/*.md your-new-repo/

   # Copy MCP configuration
   cp template-source/.mcp.json your-new-repo/.mcp.json

   # Copy tools
   cp -r template-source/tools your-new-repo/tools
   ```

4. **Remove the template source:**
   ```bash
   rm -rf template-source
   ```

5. **Follow the [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)** to customize

## What to Do After Creating from Template

### Immediate Actions (Required)

1. **Update Repository Information**
   - [ ] Replace project name in README.md
   - [ ] Update repository description
   - [ ] Add your own LICENSE file
   - [ ] Update contact information

2. **Configure Project Details**
   - [ ] Fill out `.project-intake/config.json` with your project details
   - [ ] Run config validation: `node .project-intake/scripts/validate-config.cjs`

3. **Set Up Git Workflow**
   - [ ] Install pre-commit hooks:
     - Mac/Linux/Git Bash: `bash .project-intake/scripts/setup-hooks.sh`
     - Windows PowerShell: `powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1`
   - [ ] Test the pre-commit hook by attempting a commit to main

4. **GitHub Setup**
   - [ ] Create labels: `bash setup-labels.sh` or `setup-labels.bat`
   - [ ] Set up GitHub Project board (follow [PROJECT_VIEWS_GUIDE.md](.github/PROJECT_VIEWS_GUIDE.md))
   - [ ] Enable GitHub Discussions (optional)

### Optional Enhancements

5. **Run Project Intake System** (if integrating with existing code)
   - [ ] Tell Claude Code: "Execute the project intake system"
   - [ ] Review generated documentation
   - [ ] Run health check: `node .project-intake/scripts/health-check.cjs`

6. **Configure MCP Servers**
   - [ ] Review `.mcp.json` configuration
   - [ ] Install Playwright: `npx playwright install`
   - [ ] Test MCP setup in Claude Code
   - [ ] Add additional MCP servers as needed

7. **Customize Documentation**
   - [ ] Update [CODING_STANDARDS.md](CODING_STANDARDS.md) for your tech stack
   - [ ] Modify [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) if using different workflow
   - [ ] Adapt [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) for your team

### Complete Checklist

See [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md) for a comprehensive step-by-step checklist.

## Key Features of This Template

### 1. Automated Project Setup

The `.project-intake` system automates:
- Codebase analysis and documentation
- Git workflow configuration
- Development environment setup
- GitHub integration
- Quality standards documentation

**Time savings: 85-90%** compared to manual setup (7-10 hours → 50 minutes)

### 2. Best Practice Guidelines

Pre-written, comprehensive guides for:
- **Coding Standards** - TypeScript, React, security practices
- **Branch Strategy** - Git workflow, commit conventions
- **Documentation** - How to write and maintain docs
- **Code Review** - Quality checklists and processes

### 3. GitHub Integration

Ready-to-use templates for:
- Bug reports and feature requests
- Epic planning
- Pull requests with checklists
- Weekly status reports
- Project board views

### 4. Development Tools

Pre-configured:
- **Pre-commit hooks** - Prevent accidental commits to main
- **MCP servers** - Playwright for automated testing
- **GitHub CLI workflows** - Automate common tasks
- **Label setup scripts** - Consistent labeling across projects

### 5. Quality Assurance

Built-in quality checks:
- Health check validation
- Config validation
- Pre-commit protection
- Code review checklists
- Security best practices

## Customization Guide

### What Should You Keep?

✅ **Keep these as-is:**
- Pre-commit hook system
- Branch naming conventions
- Commit message standards
- Issue and PR templates
- MCP configuration structure

✅ **Keep but customize:**
- README.md (replace with your project info)
- CODING_STANDARDS.md (adapt to your tech stack)
- .project-intake/config.json (fill with your details)

### What Can You Modify?

🔧 **Safe to modify:**
- Specific coding patterns in CODING_STANDARDS.md
- Additional branch prefixes in BRANCH_STRATEGY.md
- Documentation structure in DOCUMENTATION_GUIDELINES.md
- MCP servers in .mcp.json (add more as needed)
- Project board views and columns

### What Should You Remove?

🗑️ **Consider removing:**
- `.project-intake/` folder (after running intake system)
- Example status reports in `.github/status-reports/`
- This TEMPLATE_USAGE.md file (after setup complete)
- Template-specific text in README.md

## Project Types and Customization

### Web Application Projects

**Keep all defaults, add:**
- Environment-specific labels (`env: production`, `env: staging`)
- Deployment documentation
- API documentation templates
- Security scanning workflows

### Library/Package Projects

**Customize:**
- Add version labels (`v1.x`, `v2.x`)
- Include release process documentation
- Add breaking change labels
- Set up changelog automation
- Configure npm publishing workflow

### Mobile App Projects

**Customize:**
- Add platform labels (`platform: ios`, `platform: android`)
- Include device testing guidelines
- Add app store deployment guides
- Document native module patterns

### Full-Stack Projects

**Keep everything, add:**
- Backend-specific coding standards
- Database migration guidelines
- API versioning strategy
- Service architecture documentation

## Common Workflows After Setup

### Starting a New Feature

```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat: Add your feature"

# 4. Push and create PR
git push -u origin feature/your-feature-name
gh pr create --title "feat: Add your feature" --body "Description"
```

### Using Claude Code with MCP

```bash
# 1. Start Claude Code in your project
claude

# 2. The .mcp.json will be detected automatically
# 3. Approve the Playwright MCP server when prompted
# 4. Ask Claude to run automated tests or browser automation
```

### Running Project Health Check

```bash
# Check that everything is set up correctly
node .project-intake/scripts/health-check.cjs

# You'll see a dashboard with:
# ✅ Completed steps
# ⚠️ Partially complete steps
# ❌ Missing steps
```

## Team Onboarding

When new team members join:

1. **Share repository access**
2. **Point them to [QUICKSTART.md](QUICKSTART.md)** for setup
3. **Have them review:**
   - [CODING_STANDARDS.md](CODING_STANDARDS.md)
   - [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md)
   - [CONTRIBUTING.md](.github/pull_request_template.md)
4. **Install development tools:**
   - GitHub CLI
   - Node.js 18+
   - Claude Code (optional)
5. **Set up MCP servers** (if using Claude Code)
6. **Walk through project board** and current priorities

## Troubleshooting

### Template Not Showing "Use this template" Button

**Solution:** Repository must be public or you need admin access. Alternatively, use manual copy method.

### Pre-commit Hook Not Working

**Solution:**
```bash
# Reinstall hooks
bash .project-intake/scripts/setup-hooks.sh

# Test the hook
git checkout main
touch test.txt
git add test.txt
git commit -m "test"  # Should be blocked
```

### MCP Server Not Working

**Solution:**
```bash
# Verify npx is available
npx --version

# Install Playwright browsers
npx playwright install

# Check Claude Code MCP list
claude mcp list
```

### Config Validation Failing

**Solution:**
```bash
# Run validator to see specific errors
node .project-intake/scripts/validate-config.cjs

# Check config.json for:
# - Required fields filled in
# - Correct data types
# - Valid email addresses
# - Valid URLs
```

## Maintenance and Updates

### Keeping Template Updated

If you want to pull in updates from the original template:

```bash
# Add template as remote
git remote add template https://github.com/original-org/project-intake-template.git

# Fetch template changes
git fetch template

# Merge specific files (carefully)
git checkout template/main -- .github/ISSUE_TEMPLATE/
git commit -m "chore: Update issue templates from template"
```

### Sharing Improvements Back

If you make improvements that would benefit the template:

1. Fork the original template repository
2. Apply your improvements
3. Submit a pull request
4. Describe the enhancement and why it's valuable

## Support and Resources

### Documentation
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - Code quality guidelines
- [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md) - Git workflow
- [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) - How to document
- [MCP_SETUP.md](MCP_SETUP.md) - MCP integration guide
- [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md) - Setup checklist

### Getting Help
- Check documentation first
- Review existing issues
- Open a new issue with details
- Ask in team discussions

### Contributing to Template
- Report bugs or issues
- Suggest improvements
- Submit pull requests
- Share your customizations

## Success Criteria

After using this template, you should have:

✅ Clean repository with no template history
✅ Comprehensive documentation
✅ Git workflow with pre-commit hooks
✅ Branch protection and naming conventions
✅ GitHub issue and PR templates
✅ Project management infrastructure
✅ MCP integration for automated testing
✅ Quality standards and code review process
✅ Team onboarding materials
✅ 85-90% time savings on project setup

## Next Steps

1. **Complete [POST_TEMPLATE_CHECKLIST.md](POST_TEMPLATE_CHECKLIST.md)**
2. **Customize guidelines** for your specific needs
3. **Set up your GitHub Project board**
4. **Onboard your team** with the new structure
5. **Start building** with confidence in your foundation

---

**Questions?** Open an issue or check the documentation files.

**Improvements?** Submit a PR to help others!

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
