# Contributing to Project Intake Template

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Documentation Guidelines](#documentation-guidelines)
- [Getting Help](#getting-help)

## Code of Conduct

This project follows our [Code of Conduct](docs/guides/CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Git** - Version control
- **GitHub account** - For pull requests
- **Node.js 18+** - For running validation scripts
- **GitHub CLI** (optional but recommended) - For automation
- **Code editor** - VS Code, Vim, etc.

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/project-intake-template.git
   cd project-intake-template
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/razorvision/project-intake-template.git
   ```
4. **Install dependencies** (if any):
   ```bash
   npm install
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes** - Fix issues in documentation, scripts, or templates
- ✨ **New features** - Add new MCP servers, slash commands, or workflow enhancements
- 📚 **Documentation** - Improve guides, add examples, fix typos
- 🧪 **Examples** - Add sample projects or use cases
- 💡 **Ideas** - Suggest improvements via issues

### Finding Something to Work On

- Browse [open issues](https://github.com/razorvision/project-intake-template/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Check the [project board](https://github.com/razorvision/project-intake-template/projects) for planned work
- Propose new ideas by opening an issue first

## Development Workflow

### 1. Create a Branch

Always create a feature branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features or enhancements
- `bugfix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

See [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md) for complete guidelines.

### 2. Make Your Changes

- Follow the [Coding Standards](docs/guides/CODING_STANDARDS.md)
- Keep changes focused and atomic
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 3. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git commit -m "feat: add new MCP server configuration"
git commit -m "fix: correct broken link in README"
git commit -m "docs: improve quick start instructions"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

## Pull Request Process

### Before Submitting

- [ ] Changes are focused on a single concern
- [ ] Code follows project coding standards
- [ ] Documentation is updated (if applicable)
- [ ] All validation scripts pass: `npm run health-check`
- [ ] Commit messages follow conventional format
- [ ] Branch is up to date with `main`

### Submitting a Pull Request

1. **Push your branch** to your fork
2. **Open a pull request** on GitHub
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (e.g., "Fixes #123")
5. **Request review** from maintainers

### PR Title Format

Use the same format as commit messages:

```
feat: add PostgreSQL MCP server documentation
fix: correct setup script for Windows
docs: improve MCP security guidelines
```

### Review Process

- Maintainers will review your PR within 1-3 business days
- Address any requested changes promptly
- Keep the conversation focused and respectful
- Once approved, a maintainer will merge your PR

### After Merging

- Delete your feature branch (locally and on GitHub)
- Update your local main branch:
  ```bash
  git checkout main
  git pull upstream main
  ```

## Coding Standards

### Documentation Files

- Use GitHub-flavored Markdown
- Keep lines under 120 characters
- Use clear, concise language
- Include code examples where helpful
- Add table of contents for files >200 lines
- Follow the [Documentation Guidelines](docs/guides/DOCUMENTATION_GUIDELINES.md)

### Scripts

- Use Node.js for cross-platform scripts
- Include error handling and validation
- Add clear comments explaining logic
- Test on Windows, Mac, and Linux (if possible)

### Configuration Files

- Use JSON for configuration (with comments explaining options)
- Provide `.example` or `.template` versions
- Document all required and optional fields
- Include sensible defaults

### Templates

- Use clear placeholder syntax: `{{VARIABLE_NAME}}`
- Document what each placeholder should be replaced with
- Include examples of completed templates
- Keep templates minimal and focused

## Documentation Guidelines

### Writing Style

- **Be concise** - Get to the point quickly
- **Be specific** - Use concrete examples
- **Be helpful** - Anticipate questions
- **Be accurate** - Test all instructions
- **Be consistent** - Follow existing patterns

### File Organization

```
docs/
├── getting-started/    # Onboarding and setup
├── guides/            # Development practices
├── workflows/         # Process documentation
├── security/          # Security policies
└── integrations/      # Tool integration guides
```

### Examples to Include

- Command-line examples with expected output
- Configuration file examples
- Before/after comparisons for improvements
- Screenshots (when helpful)

## Testing Changes

### For Documentation Changes

1. Read through your changes for clarity
2. Test any commands or code examples
3. Check for broken links: `npm run check-links` (if available)
4. Preview Markdown rendering

### For Script Changes

1. Test on your platform
2. Verify error handling works
3. Check cross-platform compatibility
4. Run validation: `npm run validate-config`

### For Template Changes

1. Test the template with a real project
2. Verify all placeholders are documented
3. Ensure generated output is correct

## Reporting Issues

### Bug Reports

When reporting bugs, include:

- **Description** - Clear description of the issue
- **Steps to reproduce** - Exact steps to recreate
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Environment** - OS, Node version, tool versions
- **Screenshots** - If applicable

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

### Feature Requests

When requesting features, include:

- **Problem statement** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches you've thought about
- **Additional context** - Examples, mockups, etc.

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

## Getting Help

### Questions and Support

- **Documentation questions:** Check the [docs/](docs/) directory
- **Setup issues:** See [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)
- **General questions:** Open a [discussion](https://github.com/razorvision/project-intake-template/discussions)
- **Bugs or issues:** Open an [issue](https://github.com/razorvision/project-intake-template/issues)

### Communication

- Be respectful and constructive
- Provide context and details
- Search existing issues before creating new ones
- Use appropriate labels and templates

## Recognition

Contributors will be:

- Listed in release notes for their contributions
- Mentioned in commit messages
- Recognized in project documentation

Thank you for contributing to making this project better! 🎉

---

**Questions?** Open an issue or start a discussion. We're here to help!
