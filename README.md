# Project Intake Template

A **GitHub template repository** with an automated project setup system that configures new repositories with best practices, documentation, workflows, and quality standards in **30-45 minutes** instead of **7-10 hours**.

> **🎯 Use this template** to start new Node.js/TypeScript projects with professional setup included from day one.

## ✨ What You Get

When you create a new repository from this template, you automatically get:

- ✅ **Complete Project Intake System** - Automated setup workflow with Claude Code
- ✅ **Cross-Platform Scripts** - Windows (PowerShell), Mac/Linux (Bash), All (Node.js)
- ✅ **Git Workflow Tools** - Pre-commit hooks, secret scanning, branch protection
- ✅ **Documentation Templates** - README, workflow guides, onboarding checklists
- ✅ **Quality Standards** - Coding conventions, security practices, architecture docs
- ✅ **GitHub Integration** - Project board automation, issue/PR templates

## 🚀 Quick Start

### 1. Create New Repository from Template

Click the **"Use this template"** button at the top of this page, then:
- Choose repository name
- Select public/private
- Click "Create repository from template"

### 2. Clone Your New Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

### 3. Configure the Intake System

```bash
# Copy the configuration template
cp .project-intake/config.template.json .project-intake/config.json

# Edit config.json with your project details
# Required fields: projectName, githubOwner, githubRepo
```

### 4. Run the Intake System

Open Claude Code and say:

```
Please execute the project intake system in .project-intake/
```

Claude will automatically:
- Analyze your codebase structure
- Set up Git workflows with pre-commit hooks
- Generate comprehensive documentation
- Configure development environment
- Create GitHub project board (optional)
- Document quality standards

**Total time:** 30-45 minutes (automated) vs 7-10 hours (manual)

### 5. Verify Setup

```bash
# Run health check to validate everything
node .project-intake/scripts/health-check.cjs
```

## 📁 What's Included

### Project Intake System (`.project-intake/`)

**31 Files Total:**
- **7 Guide Files** - Step-by-step automation instructions for Claude Code
- **10 Templates** - Reusable files with `{{placeholder}}` replacement
- **8 Scripts** - Cross-platform validators, setup tools, health check
- **4 Documentation** - README, team walkthrough, changelog, examples
- **2 Configuration** - Template and filled example

### Key Features:

**📋 Automation Steps:**
1. Initial codebase analysis
2. Git workflow setup with hooks
3. Documentation generation
4. Development environment configuration
5. GitHub integration
6. Quality standards documentation

**🔒 Security Built-In:**
- Pre-commit hooks block direct main commits
- Secret scanning (10+ patterns)
- .env file protection
- Config validation

**🌐 Cross-Platform:**
- Windows PowerShell scripts (.ps1)
- Mac/Linux Bash scripts (.sh)
- Universal Node.js scripts (.cjs)

## ⏱️ Time Savings

| Task | Manual | Automated | Savings |
|------|--------|-----------|---------|
| Codebase exploration | 2-3 hours | 10 min | 85% |
| README generation | 1-2 hours | 5 min | 95% |
| Git workflow setup | 1 hour | 5 min | 90% |
| Documentation | 2-3 hours | 15 min | 90% |
| Project board | 30 min | 5 min | 80% |
| Quality standards | 1 hour | 10 min | 80% |
| **Total** | **7-10 hours** | **50 min** | **85-90%** |

## 📚 Documentation

### For Users:
- [`.project-intake/README.md`](.project-intake/README.md) - Complete usage guide (390+ lines, 25+ FAQ)
- [`.project-intake/TEAM_WALKTHROUGH.md`](.project-intake/TEAM_WALKTHROUGH.md) - Non-technical team guide
- [`.project-intake/config.example.json`](.project-intake/config.example.json) - Example configuration

### For Claude Code:
- [`.project-intake/00-ORCHESTRATOR.md`](.project-intake/00-ORCHESTRATOR.md) - Master automation instructions
- [`.project-intake/01-06-*.md`](.project-intake/) - Step-by-step execution guides

## 🎯 Use Cases

Perfect for:
- ✅ New Node.js/TypeScript projects
- ✅ React/Vue/Svelte applications
- ✅ Express/Fastify backend services
- ✅ Full-stack applications
- ✅ Team projects requiring consistency
- ✅ Client projects with professional standards

## 🔧 Configuration

The intake system is highly configurable via `.project-intake/config.json`:

```json
{
  "projectName": "Your Project",
  "githubOwner": "your-username",
  "githubRepo": "your-repo",
  "createProjectBoard": true,
  "installGitHooks": true,
  "setupDatabase": true,
  "packageManager": "pnpm",
  "frontendFramework": "react",
  "databaseType": "postgresql"
}
```

See [`.project-intake/config.template.json`](.project-intake/config.template.json) for all options.

## ❓ Common Questions

**Q: Do I need Claude Code?**
A: No, but it saves 85-90% of time. You can run steps manually using the guide files.

**Q: Does this work on Windows?**
A: Yes! Full Windows support with PowerShell scripts and Git Bash compatibility.

**Q: Can I customize the templates?**
A: Absolutely! Edit any file in `.project-intake/templates/` before running.

**Q: What if I don't need all the features?**
A: Set flags to `false` in config.json to skip steps (e.g., `createProjectBoard: false`).

**Q: How do I update the intake system later?**
A: Copy the updated `.project-intake/` folder from this template repo to your project.

See the [full FAQ](.project-intake/README.md#-frequently-asked-questions) for 25+ questions answered.

## 🔄 Workflow After Template Setup

```
1. Use template → New repo created with .project-intake/
2. Clone repo locally
3. Fill out .project-intake/config.json
4. Run: "Please execute the project intake system"
5. Start building your application
6. Delete .project-intake/ folder when done (optional)
```

## 📦 What to Do After Setup

After the intake system completes:

1. **Review generated files** - README, workflow guides, documentation
2. **Start building** - Add your application code
3. **Optional:** Delete `.project-intake/` folder if you won't update it
4. **Optional:** Keep `.project-intake/` for future improvements

## 🌟 Based On

This template captures best practices from the **MedNexus** medical-legal coordination platform:

- Pre-commit hooks and branch protection
- GitHub CLI workflows and automation
- Semantic versioning and conventional commits
- Comprehensive documentation standards
- Security best practices
- Quality standards and code review checklists

## 📄 Version

**Version:** 1.0.0
**Created:** 2025-01-14
**Maintained by:** Andrew Tucker + Claude Code
**Source:** [MedNexus Project](https://github.com/razorvision/Medical-Provider-Test-Project)

## 📞 Support

- **Documentation:** See [.project-intake/README.md](.project-intake/README.md)
- **Issues:** [GitHub Issues](https://github.com/razorvision/project-intake-template/issues)
- **Questions:** Check [FAQ](.project-intake/README.md#-frequently-asked-questions)

## 📜 License

This template is open source and available for use in your projects.

---

**Ready to save 85-90% of your project setup time?** 🚀

Click **"Use this template"** to get started!
