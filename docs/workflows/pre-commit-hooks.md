# Pre-commit Hooks Guide

This project uses [pre-commit](https://pre-commit.com/) to automatically run code quality checks before each commit.

## What are Pre-commit Hooks?

Pre-commit hooks are scripts that run automatically before you commit code. They help:
- Catch bugs and issues early
- Enforce code quality standards
- Prevent committing secrets or sensitive data
- Ensure consistent formatting
- Validate commit messages

## Quick Start

### Installation

**Node.js/npm projects:**
```bash
npm install -D pre-commit
npx pre-commit install
```

**Python projects:**
```bash
pip install pre-commit
pre-commit install
```

**Install commit message hook:**
```bash
pre-commit install --hook-type commit-msg
```

### First Run

Run on all files to ensure everything passes:
```bash
npx pre-commit run --all-files  # Node.js
# or
pre-commit run --all-files      # Python
```

## Configured Hooks

### General File Checks
- **check-added-large-files** - Prevent files >500KB (excluding lock files)
- **check-case-conflict** - Detect case-sensitive filename conflicts
- **end-of-file-fixer** - Ensure files end with newline
- **check-merge-conflict** - Detect merge conflict markers
- **check-yaml/json/toml** - Validate file syntax
- **trailing-whitespace** - Remove trailing whitespace
- **detect-private-key** - Prevent committing private keys
- **no-commit-to-branch** - Prevent direct commits to main/master
- **mixed-line-ending** - Enforce LF line endings

### Security
- **detect-secrets** - Scan for hardcoded secrets/credentials
  - Baseline file: `.secrets.baseline`
  - Update baseline: `detect-secrets scan --baseline .secrets.baseline`

### TypeScript/JavaScript
- **ESLint** - Linting with auto-fix
  - Configured for TypeScript
  - Max warnings: 0 (fails on warnings)
- **Prettier** - Code formatting
  - Formats: JS, TS, JSON, YAML, MD, CSS, HTML
- **TypeScript Check** - Type checking (`tsc --noEmit`)
- **Run Tests** - Optional test execution (disabled by default)

### Python
- **Black** - Code formatting (line length: 100)
- **Ruff** - Fast linting with auto-fix
- **mypy** - Type checking (strict mode)
- **pydocstyle** - Docstring validation (Google convention)
- **Bandit** - Security issue detection

### Markdown
- **markdownlint** - Markdown linting with auto-fix

### Commit Messages
- **Conventional Commits** - Enforces commit message format
  - Format: `type(scope): subject`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Example: `feat(auth): add OAuth2 support`

### Docker & Shell
- **hadolint** - Dockerfile linting
- **shellcheck** - Shell script linting

### Development
- **check-todos** - Reports TODO/FIXME comments (warning only)

## Usage

### Normal Commit Flow

Hooks run automatically:
```bash
git add .
git commit -m "feat: add new feature"
# Hooks run automatically
```

### Skip Hooks (Emergency Only)

**⚠️ Warning:** Only skip hooks when absolutely necessary (e.g., urgent hotfix)

```bash
git commit --no-verify -m "fix: urgent hotfix"
```

### Run Specific Hook

```bash
npx pre-commit run <hook-id>
npx pre-commit run eslint          # Run ESLint only
npx pre-commit run prettier        # Run Prettier only
```

### Run on Specific Files

```bash
npx pre-commit run --files src/app.ts src/utils.ts
```

### Update Hooks

```bash
npx pre-commit autoupdate
```

## Customization

### Disable Specific Hooks

Edit `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        exclude: ^legacy/  # Skip legacy code
```

### Enable Test Hook

By default, tests don't run on every commit (too slow). To enable:

```yaml
- repo: local
  hooks:
    - id: run-tests
      always_run: true  # Change false to true
```

### Skip in CI

To skip specific hooks in CI:

```yaml
ci:
  skip: [run-tests, typescript-check]
```

## Troubleshooting

### Hook Fails Even After Fixing

Pre-commit caches file states. Force a fresh run:

```bash
rm -rf ~/.cache/pre-commit
npx pre-commit run --all-files
```

### TypeScript Errors in Hook

Ensure your `tsconfig.json` is correct:

```bash
npx tsc --noEmit
```

Fix any errors, then commit again.

### ESLint Fails

Check your ESLint configuration:

```bash
npx eslint . --fix
```

### Prettier Conflicts with ESLint

Install `eslint-config-prettier` to disable conflicting rules:

```bash
npm install -D eslint-config-prettier
```

Add to `.eslintrc.js`:
```javascript
module.exports = {
  extends: [
    // ... other configs
    'prettier' // Must be last
  ]
};
```

### Hook Too Slow

**Option 1:** Skip slow hooks for local commits:
```yaml
- id: run-tests
  always_run: false
```

**Option 2:** Run only on specific branches:
```yaml
- id: run-tests
  stages: [push]  # Only run on push, not commit
```

**Option 3:** Use `--no-verify` sparingly (not recommended)

### Secrets Detected (False Positive)

If `detect-secrets` flags a false positive:

```bash
# Generate baseline
detect-secrets scan --baseline .secrets.baseline

# Update baseline (after verifying false positives)
detect-secrets scan --baseline .secrets.baseline --update
```

**⚠️ Warning:** Never add real secrets to baseline. Use environment variables instead.

### Commit Message Validation Fails

Ensure your commit message follows Conventional Commits:

**❌ Invalid:**
```
Added new feature
```

**✅ Valid:**
```
feat: add user authentication
feat(api): add rate limiting to endpoints
fix: resolve memory leak in worker process
docs: update installation instructions
```

### Install Fails on Windows

Use PowerShell or Git Bash:

```powershell
# PowerShell
npm install -D pre-commit
npx pre-commit install
```

If issues persist, install Python version:
```bash
pip install pre-commit
pre-commit install
```

## Best Practices

### 1. Run Before Committing

Get in the habit of running checks manually:
```bash
npm run lint
npm test
npx pre-commit run --all-files
```

### 2. Fix Issues Incrementally

Don't skip hooks to bypass issues. Fix them:
```bash
# See what would run
git diff --cached --name-only

# Fix specific issues
npx prettier --write src/
npx eslint src/ --fix
```

### 3. Keep Hooks Fast

- Disable slow hooks for local commits
- Run comprehensive checks in CI
- Use `always_run: false` for expensive operations

### 4. Update Regularly

```bash
npx pre-commit autoupdate
npx pre-commit run --all-files  # Test updates
```

### 5. Team Alignment

Ensure all team members:
- Install hooks: `npx pre-commit install`
- Run initial check: `npx pre-commit run --all-files`
- Understand how to skip (for emergencies only)

### 6. CI Integration

Pre-commit.ci automatically:
- Runs hooks on PRs
- Auto-fixes issues
- Updates hook versions weekly

Enable at: https://pre-commit.ci

## IDE Integration

### VS Code

Install extensions:
- **ESLint** - `dbaeumer.vscode-eslint`
- **Prettier** - `esbenp.prettier-vscode`
- **markdownlint** - `DavidAnson.vscode-markdownlint`

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm / IntelliJ

1. **Settings** → **Tools** → **File Watchers**
2. Add watchers for Prettier and ESLint
3. Enable "Run on Save"

### Vim / Neovim

Use plugins:
- **ALE** - Async linting
- **coc.nvim** - LSP support
- **vim-prettier** - Prettier integration

## Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Pre-commit Hooks List](https://pre-commit.com/hooks.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Support

Issues with pre-commit hooks? Check:
1. This README (troubleshooting section)
2. [Pre-commit GitHub Issues](https://github.com/pre-commit/pre-commit/issues)
3. Project GitHub Discussions
4. Individual hook documentation (linked in `.pre-commit-config.yaml`)

---

**Last Updated:** 2025-11-21
**Pre-commit Version:** 3.x
