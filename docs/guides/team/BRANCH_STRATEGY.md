# Branch Strategy & Git Workflow

This document outlines the git workflow, branch naming conventions, and commit message standards for this project.

## Table of Contents

- [Branch Protection](#branch-protection)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Standards](#commit-message-standards)
- [Git Workflow](#git-workflow)
- [Common Commands](#common-commands)
- [Pre-Commit Hooks](#pre-commit-hooks)

## Branch Protection

### Main Branch Protection

The `main` branch is protected by a pre-commit hook that **prevents direct commits**. This ensures:
- All changes go through code review
- Feature branches are properly tested
- No accidental commits to production code
- Clear history of changes via pull requests

If you try to commit directly to `main`, you'll see:
```
❌ ERROR: Direct commits to 'main' branch are not allowed!
```

**Emergency bypass (not recommended):**
```bash
git commit --no-verify
```

Use bypass only in critical situations and document why in the commit message.

## Branch Naming Conventions

### Branch Prefixes

Use these prefixes to categorize your work:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/add-user-auth` |
| `bugfix/` | Bug fixes | `bugfix/fix-login-error` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `docs/` | Documentation only | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/simplify-api` |
| `test/` | Test additions | `test/add-unit-tests` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

### Naming Rules

1. **Use lowercase** - `feature/user-auth` not `Feature/User-Auth`
2. **Use hyphens** - `feature/add-user-auth` not `feature/add_user_auth`
3. **Be descriptive** - `feature/user-authentication` not `feature/stuff`
4. **Keep it concise** - Max ~40 characters
5. **No spaces** - Use hyphens instead

### Examples

✅ **Good:**
- `feature/add-dark-mode`
- `bugfix/fix-navbar-collapse`
- `hotfix/critical-security-patch`
- `docs/api-documentation`
- `refactor/extract-auth-logic`
- `test/add-login-tests`

❌ **Bad:**
- `my-branch` (no prefix)
- `Feature/Add Dark Mode` (capitals, spaces)
- `feature/add_dark_mode` (underscores)
- `feature/implement-comprehensive-user-authentication-system-with-oauth` (too long)
- `feature/stuff` (not descriptive)
- `wip` (unclear)

## Commit Message Standards

We follow **Conventional Commits** format for clear, semantic version history.

### Format

```
<type>: <short summary>

[optional body]

[optional footer]
```

### Commit Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat:` | New feature | `feat: Add user registration` |
| `fix:` | Bug fix | `fix: Resolve login timeout issue` |
| `docs:` | Documentation | `docs: Update API documentation` |
| `style:` | Formatting (no logic change) | `style: Format with Prettier` |
| `refactor:` | Code restructuring | `refactor: Simplify auth logic` |
| `test:` | Add/update tests | `test: Add login component tests` |
| `chore:` | Maintenance | `chore: Update dependencies` |
| `perf:` | Performance improvement | `perf: Optimize image loading` |
| `ci:` | CI/CD changes | `ci: Add GitHub Actions workflow` |
| `build:` | Build system changes | `build: Update Vite config` |
| `revert:` | Revert previous commit | `revert: Revert "feat: Add feature"` |

### Commit Message Rules

1. **Use imperative mood** - "Add feature" not "Added feature" or "Adds feature"
2. **No period at end** - `feat: Add feature` not `feat: Add feature.`
3. **Capitalize first letter** - `feat: Add feature` not `feat: add feature`
4. **Keep summary under 72 chars** - For git log readability
5. **Explain "what" and "why"** - Not "how" (that's in the code)

### Short Format (Simple Changes)

```bash
git commit -m "feat: Add dark mode toggle"
git commit -m "fix: Resolve navigation menu bug"
git commit -m "docs: Update installation instructions"
```

### Extended Format (Complex Changes)

Use HEREDOC for multi-line commits:

```bash
git commit -m "$(cat <<'EOF'
feat: Add user authentication system

Implement JWT-based authentication with:
- User registration with email/password
- Login with bcrypt password hashing
- Protected routes with auth middleware
- Token refresh mechanism

Closes #42
EOF
)"
```

### Examples

✅ **Good Commits:**

```bash
feat: Add user dashboard with stats
fix: Resolve memory leak in data fetching
docs: Add API endpoint documentation
style: Format code with Prettier
refactor: Extract validation logic to utils
test: Add unit tests for auth service
chore: Update dependencies to latest versions
perf: Optimize image loading with lazy loading
```

❌ **Bad Commits:**

```bash
Update stuff                    # No type, vague
feat: added new feature.        # Wrong tense, has period
FIX: bug fix                    # Type should be lowercase
feat: implementing the comprehensive user authentication system with jwt # Too long
minor changes                   # No type, vague
WIP                             # Not descriptive
asdfasdf                        # Meaningless
```

## Git Workflow

### Standard Feature Development

```bash
# 1. Start on main, pull latest
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# [edit files]

# 4. Stage changes
git add .

# 5. Commit with conventional message
git commit -m "feat: Add my feature"

# 6. Push to remote
git push -u origin feature/my-feature

# 7. Create pull request (via GitHub CLI)
gh pr create --title "Add my feature" --body "Description" --base main

# 8. After approval, merge via PR
gh pr merge --squash --delete-branch

# 9. Update local main
git checkout main
git pull origin main
```

### Bug Fix Workflow

```bash
# 1. Create bugfix branch from main
git checkout main
git pull origin main
git checkout -b bugfix/fix-issue-name

# 2. Fix the bug
# [edit files]

# 3. Test the fix
npm test

# 4. Commit
git add .
git commit -m "fix: Resolve issue with component rendering"

# 5. Push and create PR
git push -u origin bugfix/fix-issue-name
gh pr create --title "Fix: Resolve component rendering issue" --body "Fixes #123"
```

### Hotfix Workflow (Production Issues)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Apply fix
# [edit files]

# 3. Test thoroughly
npm test
npm run build

# 4. Commit
git add .
git commit -m "hotfix: Resolve critical security vulnerability"

# 5. Fast-track PR
git push -u origin hotfix/critical-fix
gh pr create --title "HOTFIX: Critical security patch" --body "Urgent fix for CVE-XXXX"

# 6. After merge, tag release
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix: Security patch"
git push origin v1.0.1
```

## Common Commands

### Checking Status

```bash
# View current status
git status

# View commit history
git log --oneline -10

# View changes
git diff                      # Unstaged changes
git diff --staged             # Staged changes
```

### Branch Management

```bash
# Create new branch
git checkout -b feature/branch-name

# Switch branches
git checkout main

# List all branches
git branch -a

# Delete local branch
git branch -d feature/branch-name

# Delete remote branch
git push origin --delete feature/branch-name
```

### Syncing Changes

```bash
# Pull latest changes
git pull origin main

# Push changes
git push origin feature/branch-name

# Fetch without merging
git fetch origin
```

### Fixing Mistakes

```bash
# Amend last commit (before push)
git commit --amend

# Discard local changes
git restore <file>

# Unstage file
git restore --staged <file>

# Discard all local changes
git restore .
```

### Stashing Changes

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Clear all stashes
git stash clear
```

## Pre-Commit Hooks

### What They Do

Pre-commit hooks run automatically before each commit to:
- Block direct commits to `main` branch
- Run linting/formatting (if configured)
- Run tests (if configured)
- Check for secrets or sensitive data (if configured)

### Installing Hooks

Hooks are typically installed during project setup:

**Mac/Linux/Git Bash:**
```bash
bash .project-intake/scripts/setup-hooks.sh
```

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1
```

### Testing Hooks

```bash
# Try to commit on main (should fail)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"

# Should see error:
# ❌ ERROR: Direct commits to 'main' branch are not allowed!

# Clean up test
git restore --staged test.txt
rm test.txt
```

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hooks (not recommended)
git commit --no-verify -m "Emergency commit"
```

**Only use `--no-verify` in emergencies** and document why in the commit message and PR description.

## Pull Request Process

### Creating a PR

```bash
# Via GitHub CLI (recommended)
gh pr create \
  --title "feat: Add user dashboard" \
  --body "Implements user dashboard with stats and graphs. Closes #42" \
  --base main

# Via GitHub web interface
# 1. Push your branch
# 2. Go to repository on GitHub
# 3. Click "Pull requests" > "New pull request"
# 4. Select your branch
# 5. Fill in title and description
# 6. Click "Create pull request"
```

### PR Guidelines

**Title:** Use conventional commit format
```
feat: Add user dashboard with analytics
fix: Resolve login timeout on slow connections
docs: Update API documentation with examples
```

**Description should include:**
- What changed and why
- How to test the changes
- Screenshots (for UI changes)
- Related issues (Closes #123)
- Breaking changes (if any)

### Reviewing PRs

When reviewing:
- Check code quality and standards
- Test the changes locally
- Verify all tests pass
- Check for security issues
- Ensure documentation is updated
- Leave constructive feedback

## Best Practices

### Do's ✅

- **Pull before starting work** - Always get latest changes
- **Commit frequently** - Small, logical commits are easier to review
- **Write clear commit messages** - Future you will thank you
- **Test before pushing** - Run tests and build locally
- **Review your own PR** - Check the diff before requesting review
- **Keep branches short-lived** - Merge within a few days
- **Delete merged branches** - Keep repository clean

### Don'ts ❌

- **Don't commit directly to main** - Always use feature branches
- **Don't commit secrets** - Use environment variables
- **Don't commit generated files** - Build artifacts, logs, etc.
- **Don't force push to shared branches** - Rewrites history
- **Don't commit commented code** - Delete it, git remembers
- **Don't use vague commit messages** - "fix stuff" helps no one
- **Don't leave WIP branches** - Merge or delete old branches

## Troubleshooting

### Merge Conflicts

```bash
# Update your branch with main
git checkout feature/my-feature
git pull origin main

# Resolve conflicts in your editor
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "fix: Resolve merge conflicts with main"
git push
```

### Accidentally Committed to Main

```bash
# If you haven't pushed yet
git reset HEAD~1          # Undo commit, keep changes
git checkout -b feature/my-feature  # Create proper branch
git add .
git commit -m "feat: My feature"
git push -u origin feature/my-feature
```

### Need to Update Branch with Main

```bash
# Option 1: Merge (preserves all commits)
git checkout feature/my-feature
git merge main

# Option 2: Rebase (cleaner history, use with caution)
git checkout feature/my-feature
git rebase main
```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [GitHub CLI Manual](https://cli.github.com/manual/)

## Questions?

If you have questions about the git workflow:
- Check this document first
- Ask in team chat or meetings
- Open a discussion issue
- Consult with senior developers

---

**Last Updated:** 2025-11-21
**Maintained By:** Development Team
