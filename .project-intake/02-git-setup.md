# Step 2: Git Setup & Workflow Configuration

## 🎯 Goal

Configure git workflows, install pre-commit hooks, establish branch naming conventions, and set commit message standards to ensure code quality and prevent accidents.

## 📋 Instructions for Claude Code

### Phase 1: Pre-Commit Hook Installation

Install pre-commit hooks for code quality, security, and workflow enforcement.

#### 1. Install Basic Hook (Prevents Direct Commits to Main)

**Automated Setup:**

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1
```

**Mac/Linux/Git Bash:**
```bash
bash .project-intake/scripts/setup-hooks.sh
```

#### 2. Install Pre-Commit Framework (Recommended)

For comprehensive code quality checks, install the pre-commit framework:

**Node.js projects:**
```bash
npm install -D pre-commit
npx pre-commit install
npx pre-commit install --hook-type commit-msg
npx pre-commit run --all-files  # Initial run
```

**Python projects:**
```bash
pip install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
pre-commit run --all-files  # Initial run
```

**What this includes:**
- ESLint and Prettier (code formatting)
- TypeScript type checking
- Secret detection (prevent credential leaks)
- Security scanning (Bandit for Python)
- Commit message validation (Conventional Commits)
- Markdown, Docker, and shell script linting
- Large file detection
- Merge conflict detection

See [.pre-commit-hooks-README.md](../.pre-commit-hooks-README.md) for complete documentation.

**Option B: Manual Installation**

**Windows (PowerShell):**
```powershell
# Create hooks directory if needed
if (-not (Test-Path ".git\hooks")) {
    New-Item -ItemType Directory -Path ".git\hooks" -Force
}

# Copy pre-commit hook
Copy-Item ".project-intake\templates\pre-commit" ".git\hooks\pre-commit" -Force
```

**Mac/Linux/Git Bash:**
```bash
# Create hooks directory if needed
mkdir -p .git/hooks

# Copy and make executable
cp .project-intake/templates/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

#### 3. Test the Hook

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

#### 4. Document Hook for Team

Add to README.md or CONTRIBUTING.md:

```markdown
## Important: Pre-Commit Hook

This project has a pre-commit hook that **blocks direct commits to `main`**.

All changes must go through the feature branch workflow:
1. Create feature branch
2. Make changes
3. Push and create PR
4. Merge via GitHub

If you try to commit directly to `main`, you'll see:
```
❌ ERROR: Direct commits to 'main' branch are not allowed!
```

**Emergency bypass (not recommended):**
```bash
git commit --no-verify
```
```

### Phase 2: Branch Naming Conventions

Establish and document branch naming standards.

#### Branch Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/add-user-auth` |
| `bugfix/` | Bug fixes | `bugfix/fix-login-error` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `docs/` | Documentation only | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/simplify-api` |
| `test/` | Test additions | `test/add-unit-tests` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

#### Naming Rules

1. **Use lowercase** - `feature/user-auth` not `Feature/User-Auth`
2. **Use hyphens** - `feature/add-user-auth` not `feature/add_user_auth`
3. **Be descriptive** - `feature/user-authentication` not `feature/stuff`
4. **Keep it concise** - Max ~40 characters
5. **No spaces** - Use hyphens instead

#### Examples

✅ **Good:**
- `feature/add-dark-mode`
- `bugfix/fix-navbar-collapse`
- `hotfix/critical-security-patch`
- `docs/api-documentation`

❌ **Bad:**
- `my-branch` (no prefix)
- `Feature/Add Dark Mode` (capitals, spaces)
- `feature/add_dark_mode` (underscores)
- `feature/implement-comprehensive-user-authentication-system-with-oauth` (too long)

### Phase 3: Commit Message Standards

Implement conventional commit message format.

#### Format

```
<type>: <short summary>

[optional body]

[optional footer]
```

#### Types

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

#### Rules

1. **Use imperative mood** - "Add feature" not "Added feature" or "Adds feature"
2. **No period at end** - `feat: Add feature` not `feat: Add feature.`
3. **Capitalize first letter** - `feat: Add feature` not `feat: add feature`
4. **Keep summary under 72 chars** - For git log readability
5. **Explain "what" and "why"** - Not "how" (that's in the code)

#### Short Format (Simple Changes)

```bash
git commit -m "feat: Add dark mode toggle"
git commit -m "fix: Resolve navigation menu bug"
git commit -m "docs: Update installation instructions"
```

#### Extended Format (Complex Changes)

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

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

#### Examples

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

### Phase 4: Git Workflow Documentation

Create a quick reference guide for the team.

#### Standard Workflow

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

#### Common Commands Reference

```bash
# Check current status
git status

# View commit history
git log --oneline -10

# Create new branch
git checkout -b feature/branch-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Push changes
git push origin feature/branch-name

# Amend last commit (before push)
git commit --amend

# Discard local changes
git restore <file>
git restore --staged <file>  # Unstage

# View diff
git diff                      # Unstaged changes
git diff --staged             # Staged changes

# Stash changes temporarily
git stash
git stash pop
git stash list
```

### Phase 5: .gitignore Best Practices

Verify .gitignore has essential exclusions:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/
out/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/

# Temp files
*.tmp
.cache/
.temp/
```

Add project-specific entries as needed.

## 📊 Output Checklist

After completing this step, verify:

- ✅ Basic pre-commit hook installed at `.git/hooks/pre-commit`
- ✅ Pre-commit framework installed (optional but recommended)
- ✅ Pre-commit hooks tested and confirmed working
- ✅ Hooks documented in README or CONTRIBUTING
- ✅ Branch naming conventions documented
- ✅ Commit message standards documented
- ✅ Git workflow guide created
- ✅ Common commands reference added
- ✅ .gitignore reviewed and updated if needed
- ✅ Pre-commit configuration (`.pre-commit-config.yaml`) reviewed
- ✅ Secret detection baseline (`.secrets.baseline`) created

## 🔒 Security Considerations

1. **Never commit secrets**
   - Check .gitignore for `.env`, credentials, keys
   - Use environment variables for sensitive data
   - Review commits before pushing

2. **Verify .gitignore**
   - Test with `git status` after adding secrets
   - Use `git check-ignore -v <file>` to verify exclusion

3. **Pre-commit hooks**
   - Can add linting, formatting, secret scanning
   - Keep hooks fast (<5 seconds)
   - Document bypass procedure for emergencies

## 🔄 Next Step

Once git setup is complete, proceed to:
**03-documentation.md** - Generate comprehensive project documentation

---

**Estimated Time:** 5-10 minutes
**Tools Used:** Bash, Write
**Output:** Git hooks installed, workflow documented
