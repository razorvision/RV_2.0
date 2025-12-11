# Git Commands Cheat Sheet

Quick reference for common git operations. All commands assume you're in a git repository.

## Daily Workflow

### Checking Status

```bash
git status                    # Show working tree status
git status -s                 # Short format
git log --oneline -10         # Last 10 commits, one line each
git log --graph --all         # Visual commit graph
git diff                      # Show unstaged changes
git diff --staged             # Show staged changes
git diff main...HEAD          # Changes since branching from main
```

### Creating Branches

```bash
# Feature branch
git checkout -b feature/user-dashboard

# Bug fix branch
git checkout -b fix/login-timeout

# Hotfix branch
git checkout -b hotfix/security-patch

# Switch to existing branch
git checkout main
git switch main              # Newer syntax
```

### Staging & Committing

```bash
# Stage files
git add .                    # Stage all changes
git add src/                 # Stage directory
git add *.ts                 # Stage by pattern
git add -p                   # Interactive staging

# Commit
git commit -m "feat: add user dashboard"
git commit -m "fix: resolve login timeout"
git commit --amend           # Amend last commit
git commit --amend --no-edit # Amend without changing message

# Common commit types
git commit -m "feat: add new feature"
git commit -m "fix: fix bug"
git commit -m "docs: update documentation"
git commit -m "refactor: refactor code"
git commit -m "test: add tests"
git commit -m "chore: update dependencies"
```

### Pushing Changes

```bash
# Push to remote
git push                     # Push current branch
git push -u origin feature/name  # Push and set upstream
git push --force-with-lease  # Force push safely (after rebase)

# NEVER use --force on main/master
git push --force main        # ❌ DANGEROUS - Don't do this
```

### Pulling Changes

```bash
# Pull latest changes
git pull                     # Fetch and merge
git pull --rebase            # Fetch and rebase
git pull origin main         # Pull from specific branch

# Fetch without merging
git fetch                    # Fetch from all remotes
git fetch origin             # Fetch from origin
git fetch --prune            # Fetch and remove deleted remote branches
```

---

## Branch Management

### Listing Branches

```bash
git branch                   # List local branches
git branch -a                # List all branches (local + remote)
git branch -r                # List remote branches
git branch -v                # Show last commit on each branch
git branch --merged          # Show merged branches
git branch --no-merged       # Show unmerged branches
```

### Deleting Branches

```bash
# Delete local branch
git branch -d feature/done   # Safe delete (only if merged)
git branch -D feature/bad    # Force delete

# Delete remote branch
git push origin --delete feature/done
git push origin :feature/done  # Older syntax
```

### Renaming Branches

```bash
# Rename current branch
git branch -m new-name

# Rename another branch
git branch -m old-name new-name
```

---

## Undoing Changes

### Unstage Files

```bash
git reset HEAD file.ts       # Unstage specific file
git reset HEAD .             # Unstage all files
git restore --staged file.ts # Newer syntax
```

### Discard Changes

```bash
# Discard unstaged changes
git restore file.ts          # Discard specific file
git restore .                # Discard all changes
git checkout -- file.ts      # Older syntax

# Discard all local changes and commits
git reset --hard origin/main # ⚠️ DESTRUCTIVE - resets to remote
```

### Undo Commits

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1      # ⚠️ DESTRUCTIVE

# Undo last N commits
git reset --soft HEAD~3      # Undo last 3, keep changes
git reset --hard HEAD~3      # Undo last 3, discard changes

# Revert a commit (creates new commit)
git revert abc123            # Revert specific commit
git revert HEAD              # Revert last commit
```

---

## Merging & Rebasing

### Merging

```bash
# Merge branch into current branch
git merge feature/branch

# Merge with no fast-forward
git merge --no-ff feature/branch

# Abort merge
git merge --abort

# Continue after resolving conflicts
git merge --continue
```

### Rebasing

```bash
# Rebase onto main
git rebase main

# Interactive rebase (squash, edit, reorder commits)
git rebase -i HEAD~3         # Last 3 commits
git rebase -i main           # All commits since main

# Continue/skip/abort rebase
git rebase --continue
git rebase --skip
git rebase --abort
```

### Handling Merge Conflicts

```bash
# See conflicted files
git status

# After resolving conflicts
git add resolved-file.ts
git commit                   # (for merge)
git rebase --continue        # (for rebase)

# Use theirs/ours
git checkout --theirs file.ts  # Keep their version
git checkout --ours file.ts    # Keep our version
```

---

## Stashing

### Save & Restore Work

```bash
# Stash changes
git stash                    # Stash with auto-generated message
git stash push -m "WIP: feature" # Stash with message
git stash -u                 # Include untracked files

# List stashes
git stash list

# Apply stash
git stash apply              # Apply latest stash, keep in list
git stash apply stash@{2}    # Apply specific stash
git stash pop                # Apply and remove latest stash
git stash pop stash@{2}      # Apply and remove specific stash

# Delete stashes
git stash drop stash@{1}     # Delete specific stash
git stash clear              # Delete all stashes
```

---

## Viewing History

### Log Commands

```bash
# Basic log
git log                      # Full log
git log --oneline            # One line per commit
git log -10                  # Last 10 commits
git log --since="2 weeks ago"

# Graphical log
git log --graph --oneline --all
git log --graph --decorate --oneline

# Filter by author
git log --author="John"

# Filter by file
git log -- path/to/file.ts

# Search commit messages
git log --grep="fix"

# Show diff in log
git log -p                   # Show patch/diff for each commit
git log -p -2                # Show diff for last 2 commits
```

### Viewing Commits

```bash
# Show commit details
git show abc123              # Show specific commit
git show HEAD                # Show latest commit
git show HEAD~2              # Show 2 commits ago

# Show file at specific commit
git show abc123:src/file.ts
```

### Blame (Find who changed lines)

```bash
git blame file.ts            # Show who changed each line
git blame -L 10,20 file.ts   # Blame lines 10-20
```

---

## Tagging

### Creating Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 abc123 -m "Tag old commit"
```

### Listing & Viewing Tags

```bash
git tag                      # List all tags
git tag -l "v1.0.*"          # List matching pattern
git show v1.0.0              # Show tag details
```

### Pushing Tags

```bash
git push origin v1.0.0       # Push specific tag
git push origin --tags       # Push all tags
```

### Deleting Tags

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
git push origin :refs/tags/v1.0.0  # Older syntax
```

---

## Remote Management

### Viewing Remotes

```bash
git remote                   # List remotes
git remote -v                # List remotes with URLs
git remote show origin       # Show remote details
```

### Adding/Removing Remotes

```bash
# Add remote
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Remove remote
git remote remove origin
```

### Syncing with Upstream

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch from upstream
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Or rebase
git rebase upstream/main
```

---

## Advanced Operations

### Cherry-Picking

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing
git cherry-pick -n abc123
```

### Searching Code

```bash
# Search in working directory
git grep "function login"

# Search in specific commit
git grep "function login" abc123

# Search with line numbers
git grep -n "function login"
```

### Cleaning

```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove ignored files too
git clean -fxd
```

### Reflog (Recovery)

```bash
# View reflog
git reflog

# Recover lost commit
git reset --hard abc123

# Recover deleted branch
git checkout -b recovered-branch abc123
```

---

## Configuration

### User Settings

```bash
# Set name and email
git config --global user.name "John Doe"
git config --global user.email "john@example.com"

# Set editor
git config --global core.editor "code --wait"

# View config
git config --list
git config user.name
```

### Aliases

```bash
# Create aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'

# Use aliases
git st                       # = git status
git co main                  # = git checkout main
git visual                   # = git log --graph --oneline --all
```

---

## GitHub CLI Integration

When using `gh` CLI alongside git:

```bash
# Create PR after pushing
git push -u origin feature/name
gh pr create --fill

# View PR checks
gh pr checks

# Merge PR
gh pr merge --squash

# Create issue
gh issue create --title "Bug: Login timeout"

# View issues
gh issue list
```

---

## Common Workflows

### Feature Branch Workflow

```bash
# Start feature
git checkout main
git pull
git checkout -b feature/user-dashboard

# Work on feature
git add .
git commit -m "feat: add user dashboard component"

# Push and create PR
git push -u origin feature/user-dashboard
gh pr create --fill

# After review, merge via GitHub
# Then cleanup
git checkout main
git pull
git branch -d feature/user-dashboard
```

### Hotfix Workflow

```bash
# Create hotfix from main
git checkout main
git pull
git checkout -b hotfix/security-patch

# Fix and test
git add .
git commit -m "fix: patch security vulnerability"

# Push and create PR
git push -u origin hotfix/security-patch
gh pr create --title "Hotfix: Security patch" --label hotfix

# Fast-track merge
gh pr merge --squash

# Cleanup
git checkout main
git pull
git branch -d hotfix/security-patch
```

### Sync Fork with Upstream

```bash
# One-time setup
git remote add upstream https://github.com/original/repo.git

# Regular sync
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Troubleshooting

### "Detached HEAD" State

```bash
# You're in detached HEAD - create a branch to save work
git checkout -b temp-branch

# Or discard and return to branch
git checkout main
```

### Merge Conflicts

```bash
# See conflicted files
git status

# After editing conflicts, mark as resolved
git add resolved-file.ts

# Continue merge/rebase
git merge --continue         # For merge
git rebase --continue        # For rebase

# Or abort
git merge --abort
git rebase --abort
```

### Accidentally Committed to Main

```bash
# Move commit to new branch
git branch feature/new-branch
git reset --hard HEAD~1
git checkout feature/new-branch
```

### Pushed Wrong Commit

```bash
# Revert (safe - creates new commit)
git revert HEAD
git push

# Force push (DANGEROUS - only if no one else pulled)
git reset --hard HEAD~1
git push --force-with-lease
```

---

## Security Best Practices

```bash
# Never commit secrets
# Use .gitignore for sensitive files
echo ".env" >> .gitignore
echo "*.key" >> .gitignore

# Check for leaked secrets
git log -p | grep -i "password\|secret\|api_key"

# Remove sensitive file from history (complex)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| **Status** | `git status` |
| **Diff** | `git diff` |
| **Stage** | `git add .` |
| **Commit** | `git commit -m "message"` |
| **Push** | `git push` |
| **Pull** | `git pull` |
| **Branch** | `git checkout -b branch-name` |
| **Merge** | `git merge branch-name` |
| **Stash** | `git stash` |
| **Log** | `git log --oneline` |
| **Undo** | `git reset --soft HEAD~1` |

---

**See also:**
- [GitHub CLI Cheat Sheet](../github-cli/COMMON_WORKFLOWS.md)
- [Branch Strategy Guide](../../../guides/team/BRANCH_STRATEGY.md)
- [Common Tasks](../../../COMMON_TASKS.md)

**Last Updated:** 2024-12-11
