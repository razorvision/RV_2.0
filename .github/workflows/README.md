# GitHub Actions Workflows

Automated CI/CD workflows for continuous integration, security scanning, and releases.

## Workflows Overview

### 🔄 CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to these branches

**Jobs:**
1. **Lint & Format** - ESLint, Prettier, TypeScript checks
2. **Test** - Unit and integration tests (Node 18 & 20)
3. **Security Audit** - npm audit, TruffleHog secret scanning
4. **Build** - Production build with artifacts
5. **E2E Tests** - Playwright end-to-end tests
6. **Dependency Review** - Security analysis for PRs
7. **CI Success** - Required status check for branch protection

**Features:**
- Runs jobs in parallel for speed
- Uploads coverage to Codecov
- Caches dependencies
- Matrix testing across Node versions
- Artifact retention (7 days)

### 🔒 CodeQL Security Scan (`codeql.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests
- Weekly schedule (Monday 6:00 AM UTC)

**Features:**
- Scans JavaScript and TypeScript code
- Detects security vulnerabilities
- Identifies code quality issues
- Security and quality queries
- Results visible in Security tab

**Security Checks:**
- SQL injection
- XSS vulnerabilities
- Path traversal
- Command injection
- Hardcoded credentials
- And more...

### 📦 Dependency Update (`dependency-update.yml`)

**Triggers:**
- Weekly schedule (Monday 9:00 AM UTC)
- Manual workflow dispatch

**Process:**
1. Updates dependencies to latest minor versions
2. Runs tests to verify compatibility
3. Creates PR with changes
4. Auto-labels as `dependencies`

**Features:**
- Uses `npm-check-updates` for smart updates
- Respects semver ranges
- Includes test results in PR
- Provides review checklist
- Auto-deletes branch after merge

### ✅ PR Checks (`pr-checks.yml`)

**Triggers:**
- Pull request opened, synchronized, reopened, or edited

**Checks:**
1. **PR Title** - Validates conventional commit format
2. **PR Size** - Warns on large PRs (>500 lines)
3. **Merge Conflicts** - Detects conflicts with base branch
4. **TODO/FIXME** - Finds incomplete work
5. **Branch Name** - Validates naming conventions
6. **Sensitive Files** - Blocks .env files, warns on large files
7. **Auto Label** - Labels PR based on changed files

**Validation Rules:**
- PR titles must follow conventional commits (`feat:`, `fix:`, etc.)
- Branch names must use prefixes (`feature/`, `bugfix/`, etc.)
- No `.env` files allowed
- Large files trigger warnings

### 🚀 Release Workflow (`release.yml`)

**Triggers:**
- Tags pushed matching `v*.*.*` pattern (e.g., `v1.0.0`)

**Process:**
1. Runs tests and build
2. Generates changelog from commits
3. Creates GitHub Release
4. Uploads build artifacts
5. Publishes to npm (if configured)

**Features:**
- Automatic changelog generation
- Prerelease detection (versions with `-`)
- Artifact checksums
- npm publishing (optional)

## Setup Instructions

### 1. Enable Workflows

Workflows are automatically enabled when files exist in `.github/workflows/`.

### 2. Configure Branch Protection

**Settings → Branches → Add rule:**

```
Branch name pattern: main
☑ Require pull request reviews before merging
☑ Require status checks to pass before merging
  - CI Success
  - CodeQL
☑ Require conversation resolution before merging
☑ Include administrators
```

### 3. Add Secrets

**Settings → Secrets and variables → Actions:**

**Optional Secrets:**
- `CODECOV_TOKEN` - For code coverage uploads
- `NPM_TOKEN` - For npm package publishing

### 4. Enable Security Features

**Settings → Security:**
- ☑ Dependabot alerts
- ☑ Dependabot security updates
- ☑ CodeQL analysis
- ☑ Secret scanning

### 5. Configure Auto-Labeler

The `.github/labeler.yml` file defines label rules.

**Default Labels:**
- `type: documentation` - Markdown/docs changes
- `area: frontend` - Component/UI changes
- `area: backend` - Server/API changes
- `area: database` - Schema/migration changes
- `type: test` - Test file changes
- `type: config` - Configuration changes
- `dependencies` - Package updates
- `security` - Security-related changes
- `mcp` - MCP configuration
- `claude-code` - Claude Code related
- `github-actions` - Workflow changes
- `templates` - Template changes

Create these labels using:
```bash
bash setup-labels.sh
```

## Workflow Customization

### Modify Node Versions

Edit `ci.yml`:
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]  # Add/remove versions
```

### Change Test Commands

Update commands in workflow files:
```yaml
- name: Run tests
  run: npm test              # Change to your test command

- name: Run E2E tests
  run: npm run test:e2e      # Change to your e2e command
```

### Adjust Schedules

Use [crontab.guru](https://crontab.guru/) to customize:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

### Add Environment Variables

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

### Modify PR Size Threshold

Edit `pr-checks.yml`:
```yaml
if [ $TOTAL -gt 500 ]; then  # Change 500 to your threshold
```

## Common Tasks

### Run Workflow Manually

Some workflows support manual triggering:

1. Go to **Actions** tab
2. Select workflow (e.g., "Dependency Update")
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Skip CI for Commits

Add to commit message:
```bash
git commit -m "docs: Update README [skip ci]"
```

### View Workflow Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Click on job name
4. Expand steps to view logs

### Debug Workflow Failures

1. Check job logs for errors
2. Review step outputs
3. Verify secrets are configured
4. Check branch protection rules
5. Test commands locally

### Create Release

```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Release workflow automatically triggers
# Creates GitHub Release and publishes to npm
```

## Workflow Status Badges

Add badges to README.md:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![CodeQL](https://github.com/username/repo/workflows/CodeQL%20Security%20Scan/badge.svg)
```

## Best Practices

### For Developers

1. **Wait for CI** - Don't merge until all checks pass
2. **Review PR checks** - Address warnings and suggestions
3. **Keep PRs small** - Under 500 lines for easier review
4. **Use conventional commits** - Enables automatic changelog
5. **Test locally first** - Don't rely on CI to catch basic errors

### For Maintainers

1. **Review dependency PRs** - Check changelogs for breaking changes
2. **Monitor security scans** - Address CodeQL findings promptly
3. **Update workflows** - Keep actions up to date
4. **Rotate secrets** - Change tokens periodically
5. **Review workflow runs** - Check for patterns of failure

## Troubleshooting

### CI Fails on Fork PRs

**Issue:** Fork PRs can't access secrets

**Solution:**
```yaml
if: github.event.pull_request.head.repo.full_name == github.repository
```

### Workflow Not Triggering

**Check:**
- YAML syntax (use [yamllint.com](https://www.yamllint.com/))
- Trigger conditions match event
- Workflow file is in `.github/workflows/`
- Branch/tag name matches pattern

### CodeQL Fails

**Common causes:**
- Missing dependencies
- Build failures
- Timeout (increase with `timeout-minutes`)

**Fix:**
```yaml
timeout-minutes: 45  # Increase if needed
```

### Permission Errors

**Issue:** Job needs additional permissions

**Solution:**
```yaml
permissions:
  contents: write
  pull-requests: write
  security-events: write
```

## Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### Actions Used
- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
- [github/codeql-action](https://github.com/github/codeql-action)
- [codecov/codecov-action](https://github.com/codecov/codecov-action)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)

### Tools
- [act](https://github.com/nektos/act) - Run GitHub Actions locally
- [actionlint](https://github.com/rhysd/actionlint) - Lint workflow files
- [Crontab Guru](https://crontab.guru/) - Cron schedule expression editor

## Migration Guide

### From Travis CI

```yaml
# Travis CI
script:
  - npm test

# GitHub Actions
- name: Run tests
  run: npm test
```

### From Circle CI

```yaml
# Circle CI
- run: npm test

# GitHub Actions
- name: Run tests
  run: npm test
```

### From Jenkins

Jenkins pipelines map to workflows, stages map to jobs, and steps map to steps.

## Contributing

When adding new workflows:

1. Test thoroughly with `act` or in a fork
2. Document triggers and purpose
3. Add to this README
4. Follow existing naming conventions
5. Include timeout limits
6. Add appropriate permissions

---

**Workflows Version:** 1.0.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
