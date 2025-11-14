# Git & GitHub Workflow Guide

A comprehensive guide to version control, commits, pull requests, and best practices for the {{projectName}} project.

---

## Table of Contents

1. [Understanding Git & GitHub](#understanding-git--github)
2. [Key Concepts](#key-concepts)
3. [Version Control Best Practices](#version-control-best-practices)
4. [Current vs Better Workflow](#current-vs-better-workflow)
5. [Step-by-Step Workflow](#step-by-step-workflow)
6. [Common Commands](#common-commands)
7. [Troubleshooting](#troubleshooting)

---

## Understanding Git & GitHub

### What is Version Control?

Version control is like **"Track Changes" in Microsoft Word, but for code**. It lets you:
- Save snapshots of your work at different points in time
- See what changed and when
- Go back to previous versions if something breaks
- Work with others without overwriting each other's work

### Git vs GitHub

- **Git** - The version control system (software on your computer)
- **GitHub** - A website that hosts Git repositories and adds collaboration features

**Analogy:** Git is like a photo camera, GitHub is like Instagram (a place to share and view photos).

---

## Key Concepts

### 1. Repository (Repo)

**What it is:** A folder that Git is tracking

**Contains:**
- All your code files
- Complete history of all changes
- Branch information
- Configuration files

**Your repository:** `{{githubRepo}}`

### 2. Commit

**What it is:** A snapshot of your project at a specific moment in time

**Real-world analogy:** Like saving a video game at a checkpoint. You can always come back to this exact point.

**A commit contains:**
- The changes you made (what files changed, what was added/removed)
- A message describing what you did
- Who made the change and when
- A unique ID (like `4a0f7a9`)

**Example commit:**
```
Commit ID: 4a0f7a9
Author: Andrew Tucker <andrew.tucker@razorvision.net>
Date: Nov 11, 2025
Message: "Refactor color system to sage green and add automated workflow"

Changes:
- Modified: client/global.css
- Modified: client/components/Header.tsx
- Modified: tailwind.config.ts
- Added: README.md
```

**Good commit messages:**
- ✅ "Add sage green color system to replace orange"
- ✅ "Fix login button alignment on mobile"
- ✅ "Update README with workflow documentation"
- ❌ "Changes"
- ❌ "Fixed stuff"
- ❌ "WIP" (work in progress)

### 3. Branch

**What it is:** A separate timeline of your project

**Real-world analogy:** Like parallel universes in a movie. You can experiment in one branch without affecting the main version.

**Visualization:**
```
main branch:    A---B---C---D  (stable, working code)
                     \
feature branch:       E---F    (experimenting with new feature)
```

**Common branch types:**
- `main` (or `master`) - The stable, production-ready code
- `feature/new-button` - Working on a new button
- `bugfix/login-error` - Fixing a login bug
- `hotfix/urgent-fix` - Emergency fix for production
- `docs/update-readme` - Documentation updates

**Branch naming conventions:**
```
feature/issue-4-sage-green
bugfix/header-alignment
hotfix/security-patch
docs/workflow-guide
```

### 4. Pull Request (PR)

**What it is:** A request to merge your changes from one branch into another

**Real-world analogy:** Like submitting homework for review. You're saying "I've finished this work, please review it and if it looks good, add it to the main project."

**The Pull Request workflow:**
```
1. Create branch → 2. Make changes → 3. Commit changes
                                            ↓
                                    4. Push to GitHub
                                            ↓
                                    5. Create Pull Request
                                            ↓
                                    6. Code Review
                                            ↓
                              7. Approve/Request Changes
                                            ↓
                                    8. Merge to main
```

**Why use Pull Requests?**
- **Code review** - Team can review changes before merging
- **Discussion** - Comment on specific lines of code
- **Automated tests** - CI/CD can run automatically
- **Quality control** - Catch bugs before they reach production
- **Documentation** - PR description explains what and why
- **Audit trail** - Clear history of who approved what

**Pull Request components:**
- **Title:** "Replace orange with sage green throughout site (#4)"
- **Description:** Detailed explanation of changes
- **Linked Issues:** Automatically closes #4 when merged
- **Reviewers:** Team members assigned to review
- **Labels:** bug, enhancement, documentation
- **Checks:** Automated tests that must pass
- **Comments:** Discussion and feedback

---

## Version Control Best Practices

### Semantic Versioning (SemVer)

Version numbers follow the pattern: **MAJOR.MINOR.PATCH**

```
v1.2.3
 │ │ └─── PATCH: Bug fixes, no new features (1.2.3 → 1.2.4)
 │ └───── MINOR: New features, backward compatible (1.2.3 → 1.3.0)
 └─────── MAJOR: Breaking changes, not backward compatible (1.2.3 → 2.0.0)
```

**Examples:**

**PATCH versions (1.0.0 → 1.0.1):**
- Fixed typo in README
- Fixed button alignment bug
- Corrected color contrast issue

**MINOR versions (1.0.0 → 1.1.0):**
- Added sage green color system
- Added automated screenshot feature
- Added new API endpoint
- Existing features still work the same way

**MAJOR versions (1.0.0 → 2.0.0):**
- Redesigned entire UI (old components removed)
- Changed API response format (breaks existing integrations)
- Removed deprecated features
- Requires code changes for users to upgrade

**Version timeline example:**
```
v1.0.0 - Initial release (Oct 2024)
v1.0.1 - Fixed header bug (Oct 2024)
v1.1.0 - Added sage green colors (Nov 2024)
v1.2.0 - Added automated workflows (Nov 2024)
v2.0.0 - Major redesign (Future)
```

### Branching Strategies

#### Feature Branch Workflow (Recommended)

**How it works:**
1. `main` branch always has working, production-ready code
2. Create a new branch for each feature or fix
3. Work on your branch without affecting main
4. Create Pull Request when ready
5. Review, test, approve
6. Merge into main
7. Delete feature branch

**Visual example:**
```
main (v1.0.0)
 │
 ├─── feature/sage-green-colors
 │     │
 │     ├─── commit: "Update CSS variables to sage green"
 │     ├─── commit: "Update all component classes"
 │     ├─── commit: "Add screenshots to issue"
 │     └─── (Pull Request #10)
 │              ↓
 │         (Code Review)
 │              ↓
 │          (Approved)
 │              ↓
 └────────── (Merged) → main (v1.1.0)
```

#### Git Flow (For larger projects)

```
main (production)
 ├── develop (integration branch)
 │    ├── feature/user-auth
 │    ├── feature/dashboard
 │    └── feature/reports
 │
 └── hotfix/security-patch (emergency fixes)
```

**When to use:**
- Large teams
- Complex release cycles
- Multiple versions in production

### Commit Best Practices

#### Write Good Commit Messages

**Format:**
```
<type>: <short summary> (50 chars or less)

<detailed description of what and why>

Fixes #123
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting (no logic change)
- `refactor:` Code restructuring (no behavior change)
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**

**Good commit messages:**
```
feat: Add sage green color system throughout application

Replace orange brand color with sage green across all components.
Updated CSS variables, Tailwind config, and 13+ component instances.
Variable renamed from --orange to --sage-green for maintainability.

Fixes #4
```

```
fix: Correct header alignment on mobile devices

The sign-up button was overlapping the menu icon on screens
below 768px width. Adjusted flex spacing and button padding.

Fixes #12
```

```
docs: Add comprehensive workflow guide

Created WORKFLOW_GUIDE.md covering Git basics, branching strategy,
versioning, and pull request workflow for team reference.
```

**Bad commit messages:**
```
❌ "fixed stuff"
❌ "updates"
❌ "WIP"
❌ "asdfasdf"
❌ "final version"
❌ "final version 2"
```

#### Commit Frequency

**How often to commit:**
- ✅ After completing a logical unit of work
- ✅ Before switching tasks
- ✅ Before taking a break
- ✅ When tests pass
- ❌ Too frequently (every saved file)
- ❌ Too infrequently (entire feature at once)

**Good commit structure:**
```
commit 1: "Add sage-green CSS variable"
commit 2: "Update Tailwind config for sage-green"
commit 3: "Update Header component to use sage-green"
commit 4: "Update all Index page components"
commit 5: "Add automated screenshot to issue"
```

**Bad commit structure:**
```
commit 1: "Changed everything for sage green feature" (too big)
commit 2: "Fixed typo" (could be squashed with commit 1)
```

---

## Current vs Better Workflow

### Current Workflow (Direct to Main)

**What happens now:**
```
Issue Created → Changes Made → Commit → Push to main
```

**Visualization:**
```
main: A --- B --- C --- D
           (all changes go directly here)
```

**Problems:**
- ❌ No review before changes go live
- ❌ Hard to test changes in isolation
- ❌ If something breaks, it breaks main immediately
- ❌ Difficult to revert specific features
- ❌ No discussion about changes
- ❌ Can't run automated tests before merge

### Better Workflow (Feature Branches + Pull Requests)

**Improved process:**
```
Issue Created → Create Branch → Make Changes → Commit → Push Branch
                                                              ↓
                                                    Create Pull Request
                                                              ↓
                                                         Code Review
                                                              ↓
                                                    Automated Tests Run
                                                              ↓
                                                            Approve
                                                              ↓
                                                         Merge to main
                                                              ↓
                                                          Tag Version
```

**Visualization:**
```
main:           A ------------------------ G (v1.1.0)
                 \                        /
feature/sage:     B --- C --- D --- E ---F
                  │     │     │     │
                  │     │     │     └── Screenshots added
                  │     │     └──────── Components updated
                  │     └────────────── Tailwind updated
                  └──────────────────── CSS variables updated

                  Pull Request #10: Review & Discussion
```

**Benefits:**
- ✅ Changes reviewed before merging to main
- ✅ Can test without affecting main
- ✅ Clear history of what changed when
- ✅ Issues automatically linked
- ✅ Easy to revert if needed
- ✅ Parallel work on multiple features
- ✅ Automated quality checks

---

## Step-by-Step Workflow

### Complete Workflow for New Feature

#### Step 1: Start From Clean Main Branch

```bash
# Make sure you're on main
git checkout main

# Get the latest changes from GitHub
git pull origin main

# Verify you're up to date
git status
# Should say: "Your branch is up to date with 'origin/main'"
```

#### Step 2: Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/issue-4-sage-green

# Verify you're on the new branch
git branch
# Should show: * feature/issue-4-sage-green (with asterisk)
```

**Branch naming tips:**
- Use descriptive names
- Include issue number if applicable
- Use hyphens, not spaces
- Keep it concise but clear

#### Step 3: Make Changes

Edit your files as needed. In this example, we changed:
- `client/global.css` - Updated color variables
- `client/components/Header.tsx` - Updated button classes
- `tailwind.config.ts` - Updated color mapping
- etc.

#### Step 4: Check What Changed

```bash
# See which files changed
git status

# See the actual changes
git diff

# See changes in a specific file
git diff client/global.css
```

#### Step 5: Stage Changes

```bash
# Stage specific files
git add client/global.css
git add client/components/Header.tsx

# OR stage all changed files
git add .

# Check what's staged
git status
```

#### Step 6: Commit Changes

```bash
# Commit with a good message
git commit -m "feat: Replace orange with sage green color system

Updated CSS variables from --orange to --sage-green across the
application. Modified Tailwind config and updated all component
classes (13+ instances across 4 files).

Fixes #4"
```

#### Step 7: Push Branch to GitHub

```bash
# First time pushing this branch
git push -u origin feature/issue-4-sage-green

# Subsequent pushes on same branch
git push
```

#### Step 8: Create Pull Request

**Option A: Using GitHub CLI**
```bash
gh pr create --title "Replace orange with sage green throughout site (#4)" \
  --body "## Summary
Implements sage green color system to replace orange.

## Changes
- Updated CSS variables in global.css
- Modified Tailwind configuration
- Updated all component classes (13+ instances)
- Added automated screenshot

## Testing
- ✅ Verified HMR updates
- ✅ No console errors
- ✅ All components display correctly
- ✅ Screenshot added to issue

## Related Issues
Fixes #4

## Screenshots
![Sage Green UI](screenshot-url)
"
```

**Option B: Using GitHub Website**
1. Go to your repository on GitHub
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your branch
5. Fill in title and description
6. Click "Create pull request"

#### Step 9: Add to Project Board

```bash
# Find your project
gh project list --owner {{githubOwner}}

# Add PR to project
gh project item-add 2 --owner {{githubOwner}} --url <pr-url>
```

#### Step 10: Code Review Process

**As the author:**
- Respond to comments
- Make requested changes
- Push additional commits to same branch
- Request re-review when ready

**As a reviewer:**
- Read the code changes
- Check for bugs or issues
- Suggest improvements
- Approve or request changes

#### Step 11: Merge Pull Request

**After approval:**
```bash
# Merge the PR (various options)
gh pr merge 123 --squash  # Squash all commits into one
gh pr merge 123 --merge   # Keep all commits
gh pr merge 123 --rebase  # Rebase and merge

# Most common: squash merge
gh pr merge 123 --squash --delete-branch
```

#### Step 12: Tag New Version

```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Create version tag
git tag -a v1.1.0 -m "Release v1.1.0: Sage green color system

New Features:
- Sage green color system replacing orange
- Automated screenshot workflow
- GitHub Project integration

Fixes:
- Color consistency across components
"

# Push tag to GitHub
git push origin v1.1.0

# Create GitHub release
gh release create v1.1.0 --title "v1.1.0: Sage Green Color System" --notes "New sage green color system and automated workflows"
```

#### Step 13: Clean Up

```bash
# Delete local feature branch (if not already deleted)
git branch -d feature/issue-4-sage-green

# If branch was already deleted remotely
git fetch --prune
```

---

## Common Commands

### Basic Commands

**Check status:**
```bash
git status                    # See what's changed
git log                       # See commit history
git log --oneline            # Compact commit history
git branch                    # List branches
git branch -a                # List all branches (including remote)
```

**Branch operations:**
```bash
git checkout main            # Switch to main branch
git checkout -b feature/new  # Create and switch to new branch
git branch -d feature/old    # Delete branch (safe)
git branch -D feature/old    # Force delete branch
```

**Stage and commit:**
```bash
git add file.txt             # Stage specific file
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git commit --amend           # Edit last commit
```

**Sync with remote:**
```bash
git pull                     # Get latest changes
git pull origin main         # Pull from specific branch
git push                     # Push changes
git push -u origin branch    # Push new branch
git fetch                    # Download changes (don't merge)
```

### GitHub CLI Commands

**Issues:**
```bash
gh issue list                           # List issues
gh issue view 4                         # View issue #4
gh issue create --title "Title"         # Create issue
gh issue comment 4 --body "Comment"     # Comment on issue
gh issue close 4                        # Close issue
```

**Pull Requests:**
```bash
gh pr list                              # List PRs
gh pr view 10                           # View PR #10
gh pr create                            # Create PR (interactive)
gh pr review 10 --approve               # Approve PR
gh pr merge 10                          # Merge PR
gh pr close 10                          # Close PR
```

**Projects:**
```bash
gh project list --owner username        # List projects
gh project item-add 2 --url <url>       # Add item to project
gh project item-list 2                  # List project items
```

### Advanced Commands

**Viewing history:**
```bash
git log --graph --oneline --all         # Visual branch history
git log --author="Andrew"               # Commits by author
git log --since="2 weeks ago"           # Recent commits
git log --grep="sage green"             # Search commit messages
git show 4a0f7a9                        # Show specific commit
```

**Comparing changes:**
```bash
git diff                                # Unstaged changes
git diff --staged                       # Staged changes
git diff main..feature-branch           # Compare branches
git diff HEAD~1                         # Compare with previous commit
```

**Undoing changes:**
```bash
git restore file.txt                    # Discard unstaged changes
git restore --staged file.txt           # Unstage file
git reset HEAD~1                        # Undo last commit (keep changes)
git reset --hard HEAD~1                 # Undo last commit (discard changes)
git revert 4a0f7a9                      # Create new commit that undoes old one
```

**Stashing:**
```bash
git stash                               # Save changes temporarily
git stash list                          # List stashed changes
git stash pop                           # Apply and remove latest stash
git stash apply                         # Apply stash (keep it)
```

---

## Troubleshooting

### Common Issues and Solutions

#### "Your branch is behind 'origin/main'"

**Problem:** Your local branch is outdated

**Solution:**
```bash
git pull origin main
```

#### "Merge conflict"

**Problem:** Two people changed the same lines

**Solution:**
```bash
# 1. Open the conflicted file
# Look for markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# 2. Edit the file to resolve
# 3. Remove the markers
# 4. Stage and commit
git add conflicted-file.txt
git commit -m "Resolve merge conflict"
```

#### "Permission denied (publickey)"

**Problem:** Git can't authenticate with GitHub

**Solution:**
```bash
# Check your SSH key
ssh -T git@github.com

# Or use HTTPS instead of SSH
git remote set-url origin https://github.com/username/repo.git
```

#### "Detached HEAD state"

**Problem:** You're not on any branch

**Solution:**
```bash
# Create a new branch from current state
git checkout -b recovery-branch

# Or discard and go back to main
git checkout main
```

#### "Nothing to commit, working tree clean"

**Problem:** No changes to commit (or changes not staged)

**Solution:**
```bash
# Check status
git status

# If changes exist but not staged
git add .
```

#### Accidentally committed to main

**Problem:** Made commits directly to main instead of feature branch

**Solution:**
```bash
# 1. Create branch from current state
git branch feature/accidental-commits

# 2. Reset main to before your commits
git reset --hard origin/main

# 3. Switch to your new branch
git checkout feature/accidental-commits

# 4. Now create PR as normal
```

#### Need to undo last commit

**Keep changes:**
```bash
git reset HEAD~1
```

**Discard changes:**
```bash
git reset --hard HEAD~1
```

**Undo but keep in history (safest):**
```bash
git revert HEAD
```

---

## Claude Code Integration

### Automated Workflow with Version Control

#### Updated Workflow

**1. Issue Creation**
```bash
# Claude Code creates issue
gh issue create --title "Add user authentication" --body "..."
```

**2. Branch Creation**
```bash
# Claude Code creates feature branch
git checkout -b feature/issue-15-user-auth
```

**3. Implementation & Commits**
```bash
# Claude Code makes incremental commits
git commit -m "feat: Add login form component"
git commit -m "feat: Add authentication API endpoint"
git commit -m "test: Add auth tests"
git commit -m "docs: Update API documentation"
```

**4. Testing & Screenshots**
```bash
# Run automated tests
pnpm test

# Capture screenshot
node screenshot-automation.js
```

**5. Pull Request Creation**
```bash
# Create PR with comprehensive details
gh pr create --title "Add user authentication (#15)" \
  --body "Complete description..."
```

**6. Project Management**
```bash
# Add to project board
gh project item-add 2 --url <pr-url>

# Set status to "In Review"
gh project item-edit --field-id STATUS --text "In Review"
```

**7. Merge & Version Tag**
```bash
# After approval, merge
gh pr merge 15 --squash --delete-branch

# Tag version
git tag -a v1.3.0 -m "Release v1.3.0: User authentication"
git push origin v1.3.0
```

### Version Control Best Practices for Claude Code Workflow

#### Branch Strategy
- **Feature branches:** `feature/issue-X-description`
- **Bug fixes:** `bugfix/issue-X-description`
- **Documentation:** `docs/description`

#### Commit Strategy
- Multiple small commits during implementation
- Descriptive messages explaining what and why
- Link to issue numbers

#### Pull Request Strategy
- One PR per issue
- Comprehensive description with:
  - Summary of changes
  - Testing results
  - Screenshots (if UI)
  - Links to related issues
- Automated tests must pass
- Project board updated automatically

#### Versioning Strategy
- **Patch (1.0.x):** Bug fixes, typos
- **Minor (1.x.0):** New features, no breaking changes
- **Major (x.0.0):** Breaking changes, major refactors

---

## Quick Reference

### Daily Workflow Cheat Sheet

**Starting new work:**
```bash
git checkout main
git pull origin main
git checkout -b feature/my-new-feature
```

**Saving work:**
```bash
git add .
git commit -m "feat: Description of change"
git push
```

**Creating PR:**
```bash
gh pr create --title "Title" --body "Description"
```

**After PR merged:**
```bash
git checkout main
git pull origin main
git branch -d feature/my-new-feature
```

### Emergency Fixes

**Need to fix production now:**
```bash
git checkout main
git checkout -b hotfix/critical-bug
# Make fix
git commit -m "hotfix: Fix critical bug"
gh pr create --title "HOTFIX: Critical bug"
# Fast-track review and merge
git tag -a v1.0.1 -m "Hotfix: Critical bug"
```

---

## Additional Resources

### Learning More

**Official Documentation:**
- Git: https://git-scm.com/doc
- GitHub: https://docs.github.com
- GitHub CLI: https://cli.github.com/manual

**Interactive Learning:**
- Learn Git Branching: https://learngitbranching.js.org
- GitHub Skills: https://skills.github.com

**Books:**
- Pro Git (free): https://git-scm.com/book/en/v2

### Your Project Resources

- **Repository:** https://github.com/{{githubOwner}}/{{githubRepo}}
- **Project Board:** "{{githubOwner}}'s {{projectBoardName}}"
- **Workflow Documentation:** See project documentation

---

## Summary

**Key Takeaways:**

1. **Commits** = Snapshots of your code at a point in time
2. **Branches** = Separate timelines for working on features
3. **Pull Requests** = Request to merge changes + code review
4. **Versions** = Tagged releases (v1.2.3 = MAJOR.MINOR.PATCH)

**Best Practices:**
- Always work in feature branches
- Write descriptive commit messages
- Create Pull Requests for review
- Link issues to PRs
- Tag releases with version numbers
- Keep main branch stable

**Benefits:**
- Code review before merging
- Easy to revert changes
- Clear history
- Parallel development
- Automated testing
- Professional workflow

---

*Last Updated: November 11, 2025*
*For: {{projectName}} Project*
