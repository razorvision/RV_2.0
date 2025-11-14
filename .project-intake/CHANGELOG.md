# Changelog

All notable changes to the Project Intake System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-14

### Added - Initial Release

#### Core System
- **00-ORCHESTRATOR.md** - Master orchestration file with step-by-step instructions for Claude Code
- **6 Guide Files** - Comprehensive guides for each intake step (01-06.md)
- **Template System** - Reusable templates with {{placeholder}} variable replacement
- **Health Check Dashboard** - Visual validation of project setup completeness
- **Cross-Platform Support** - Scripts for Windows (PowerShell), Mac/Linux (Bash), and all platforms (Node.js)

#### Prerequisites & Validation
- **Node.js Version Check** - Validates Node.js 18+ requirement (`check-node-version.cjs`)
- **Config Validators** - Three implementations for cross-platform validation
  - `validate-config.cjs` - Node.js (all platforms)
  - `validate-config.sh` - Bash with jq support and graceful degradation
  - `validate-config.ps1` - PowerShell for Windows
- **Conditional Validation** - Context-aware validation (e.g., projectBoardName required when createProjectBoard is true)
- **Git Repository Check** - Explicit validation before starting intake

#### Templates
- **WORKFLOW_GUIDE.template.md** - Comprehensive git workflow guide with placeholders
- **TEAM_MEETING_CHECKLIST.template.md** - Onboarding and coordination checklist
- **README.template.md** - Complete README structure with all placeholders
- **pre-commit** - Git hook preventing main branch commits + secret scanning
- **pre-commit.bat** - Windows batch version of pre-commit hook
- **.prettierrc** - Code formatting configuration
- **.env.example** - Environment variables template
- **issue-template.md** - GitHub issue template
- **pr-template.md** - Pull request template

#### Scripts & Automation
- **process-templates.cjs** - Processes 7 template files with placeholder replacement
  - Creates .github directory automatically when needed
  - Skips existing files to prevent overwrites
  - Handles WORKFLOW_GUIDE, TEAM_MEETING_CHECKLIST, README, issue/PR templates, configs
- **health-check.cjs** - Validates all 7 intake steps with detailed status
  - Shows ✅ Complete, ⚠️ Partial, ❌ Incomplete per step
  - Provides actionable recommendations
  - Calculates completion percentage
- **setup-hooks.sh** - Installs git hooks with comprehensive error handling
- **setup-hooks.ps1** - PowerShell version for Windows
- **detect-platform.sh** - Platform detection guidance

#### Security Features
- **Secret Scanning** - Pre-commit hook checks for:
  - .env files
  - API keys, tokens, passwords
  - Private keys and certificates
  - AWS credentials
  - Database URLs with credentials
  - Common secret patterns (10+ patterns)
- **Error Prevention** - All scripts include proper error handling and validation

#### Documentation
- **Comprehensive README** - 380+ lines covering:
  - Quick start for all platforms
  - Platform compatibility matrix
  - Configuration options
  - FAQ section (25+ questions covering general, setup, platform, troubleshooting)
  - Manual execution instructions
  - Time savings metrics
- **Platform-Specific Instructions** - Separate guides for Windows/Mac/Linux
- **Config Examples** - Both template and fully filled example

#### Time Savings
- **85-90% reduction** in project setup time
- **7-10 hours → 30-45 minutes** with automation

### Changed
- None (initial release)

### Deprecated
- None (initial release)

### Removed
- None (initial release)

### Fixed
- None (initial release)

### Security
- Implemented secret scanning in pre-commit hook
- Added validation for GitHub owner/repo formats
- Environment file protection

---

## [Unreleased]

### Planned
- Platform-aware pre-commit hook installation (detect OS and install correct version)
- Rollback/cleanup scripts for failed installations
- Video walkthrough/tutorial
- Performance metrics tracking
- Integration with additional CI/CD platforms
- Support for more language ecosystems (Python, Go, Rust)
- Advanced secret detection with git-secrets integration

---

## Version History

- **1.0.0** (2025-01-14) - Initial release with full feature set

## How to Update

When updating the Project Intake System:

1. **Read this CHANGELOG** to understand what changed
2. **Back up your config.json** if you have local customizations
3. **Copy new files** from updated .project-intake/ folder
4. **Merge your config** back into config.template.json structure
5. **Test on a test project** before using on production repos
6. **Report issues** via GitHub issues

## Contributing

Found a bug or have a feature request? 

1. Check existing issues on GitHub
2. Create detailed issue with:
   - Your platform (Windows/Mac/Linux)
   - Node.js version (`node --version`)
   - Error messages or unexpected behavior
   - Steps to reproduce
3. Submit PRs to improve the system

---

**Maintained by:** Andrew Tucker + Claude Code  
**Source Project:** MedNexus Medical-Legal Coordination Platform  
**License:** MIT (or as specified in main project)
