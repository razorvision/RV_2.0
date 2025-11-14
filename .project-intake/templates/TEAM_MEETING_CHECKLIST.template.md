# Developer Team Meeting Checklist
## Complete Workflow: From Builder.io to Production

**Meeting Date:** [Insert Date]
**Attendees:** [Insert Names]
**Project Example:** {{projectName}} Medical-Legal Platform
**Duration:** 60-90 minutes

---

## Table of Contents
1. [Download Code from Host Site](#1-download-code-from-host-site) ⭐ **START HERE**
2. [Create Git Repository & Initial Commit](#2-create-git-repository--initial-commit)
3. [Codebase Exploration & README Generation](#3-codebase-exploration--readme-generation)
4. [Development Tools Setup](#4-development-tools-setup)
5. [Branching Strategy](#5-branching-strategy)
6. [Create GitHub Project Board](#6-create-github-project-board)
7. [Feature Development Workflow](#7-feature-development-workflow)
8. [Code Review Process](#8-code-review-process)
9. [Version Control & Tagging](#9-version-control--tagging)
10. [Documentation Standards](#10-documentation-standards)
11. [Best Practices & Lessons Learned](#11-best-practices--lessons-learned)

---

## 1. Download Code from Host Site

⭐ **START HERE - The very first step in your workflow**

### Download from Builder.io (or other host)

**Steps:**
- [ ] Log into builder.io account
- [ ] Navigate to project (e.g., "Medical Provider Test Project")
- [ ] Click "Download Code" or export functionality
- [ ] Extract downloaded ZIP file to local directory

**Notes:**
- Builder.io generates a full-stack React + Vite application
- Comes with pre-configured UI components (shadcn/ui)
- Includes Tailwind CSS, React Router, TypeScript
- Check `package.json` for all dependencies

**Example from {{projectName}}:**
```
Initial tech stack:
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS with custom design tokens
- shadcn/ui component library
- React Router v6
- React Query for data fetching
```

**Discussion Points:**
- What starter templates or platforms is your team using?
- Are there any pre-configured settings we should standardize?

---

## 2. Create Git Repository & Initial Commit

### Create GitHub Repository

- [ ] Go to GitHub and click "New Repository"
- [ ] Name: `{{githubRepo}}` (your project repository name)
- [ ] Set visibility: Public or Private
- [ ] Do NOT initialize with README (we have code already)
- [ ] Create repository

### Initialize Local Git

```bash
cd /path/to/downloaded/code
git init
git add .
git commit -m "Initial commit from builder.io"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

**Notes:**
- First commit should be the clean builder.io export
- Use `main` as default branch (not `master`)
- Ensure `.gitignore` includes `node_modules/`, `.env`, etc.

**Verification:**
- [ ] Repository exists on GitHub
- [ ] All files pushed successfully
- [ ] `.gitignore` configured correctly
- [ ] README visible (if included)

---

## 3. Codebase Exploration & README Generation

### Use Claude Code to Explore the Codebase

**Why This Matters:**
Before creating branches and workflows, understand what you're working with:
- Technology stack and dependencies
- Project structure and architecture
- Existing features and components
- Design system and styling approach
- Configuration and build setup

### Exploration Process

**Ask Claude Code:**
```
I've just committed the initial code from builder.io to git.
Please explore this codebase systematically and tell me:

1. What is the tech stack? (Frontend, build tool, styling, routing, etc.)
2. What is the project structure?
3. What are the key dependencies and their purposes?
4. What pages/features currently exist?
5. How is the design system configured? (colors, typography, etc.)
6. What configuration files are present and what do they do?

Use Glob and Read tools to explore thoroughly.
```

**Expected Analysis:**
- [ ] Tech stack identified (React, Vite, Tailwind, etc.)
- [ ] Folder structure mapped
- [ ] Key files and their purposes documented
- [ ] Design system tokens extracted
- [ ] Dependencies explained
- [ ] Configuration files reviewed

### Generate README

**Ask Claude Code:**
```
Based on your exploration, please generate a comprehensive README.md that includes:

- Project title and description
- Tech stack overview
- Features list
- Prerequisites (Node.js version, package manager)
- Installation instructions
- Development commands (dev, build, test)
- Project structure diagram
- Key dependencies explanation
- Configuration files overview
- Contributing guidelines
- License information

Make it accurate and helpful for new developers joining the project.
```

### Commit README

```bash
git add README.md
git commit -m "docs: Add comprehensive README with project overview and setup instructions"
git push origin main
```

**Detailed Guide:**
See **[CODEBASE_EXPLORATION_GUIDE.md](CODEBASE_EXPLORATION_GUIDE.md)** for:
- Step-by-step exploration process
- Example prompts and expected outputs
- Complete README template
- Best practices for codebase analysis
- Real example from {{projectName}} project

**Time Estimate:** 15-20 minutes

**Discussion Points:**
- Should this be required for all new projects?
- Who maintains the README going forward?
- Should we create templates for common project types?

---

## 4. Development Tools Setup

### GitHub CLI Installation

**Why:** Automates issue creation, PR management, project board updates

**Installation (Windows):**
```bash
winget install --id GitHub.cli
gh auth login
gh auth refresh -s project
```

**Common Commands:**
```bash
gh issue create --title "Title" --body "Description"
gh issue view 123
gh issue comment 123 --body "Comment text"
gh pr create --title "Title" --body "Body"
gh pr view 13
gh pr merge 13 --squash --delete-branch
gh project item-add 2 --owner username --url [issue-url]
```

**Setup Checklist:**
- [ ] Install GitHub CLI on all dev machines
- [ ] Authenticate with `gh auth login`
- [ ] Grant project scope permissions
- [ ] Test issue creation

### Playwright for Screenshots (Optional)

**Why:** Automated visual documentation of UI changes

**Installation:**
```bash
pnpm add -D playwright
pnpm exec playwright install chromium
```

**Usage:**
```javascript
// Screenshot script
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');
  await page.screenshot({
    path: 'screenshot.png',
    fullPage: true
  });
  await browser.close();
})();
```

**Setup Checklist:**
- [ ] Install Playwright as dev dependency
- [ ] Install Chromium browser
- [ ] Create screenshot automation script
- [ ] Test screenshot capture

### Claude Code Integration (AI Pair Programming)

**What we used it for:**
- Creating GitHub issues with detailed specs
- Implementing features (Contact page, About page, Login system)
- Writing code reviews
- Updating project boards automatically
- Generating commit messages and PR descriptions

**Capabilities Demonstrated:**
- ✅ Full-stack feature implementation
- ✅ Automated issue/PR creation via GitHub CLI
- ✅ Code review as "second developer"
- ✅ Semantic commit messages
- ✅ Project board management
- ✅ Documentation generation

**Discussion Points:**
- Is the team interested in AI-assisted development?
- What guardrails should we have for AI-generated code?
- Who reviews AI-generated PRs?

---

## 5. Branching Strategy

### Branch Naming Convention

**Adopted Strategy:**
```
main                          ← Production-ready code
  └── feature/add-login-page  ← Feature branches
  └── feature/add-contact-page
  └── feature/add-about-page
  └── bugfix/fix-header-nav   ← Bug fixes
  └── hotfix/security-patch   ← Emergency fixes
```

**Branch Naming Rules:**
- [ ] `feature/` - New features (e.g., `feature/add-about-page`)
- [ ] `bugfix/` - Bug fixes (e.g., `bugfix/fix-navigation`)
- [ ] `hotfix/` - Critical production fixes
- [ ] Use lowercase and hyphens, no spaces
- [ ] Keep names descriptive but concise

### Workflow Rules

**Main Branch Protection:**
- [ ] No direct commits to `main`
- [ ] All changes via Pull Requests
- [ ] Require code review before merge
- [ ] Require status checks to pass

**Feature Branch Workflow:**
1. Always branch from latest `main`
2. Create feature branch
3. Make changes
4. Push branch
5. Create Pull Request
6. Code review
7. Merge with squash
8. Delete feature branch
9. Tag version if needed

**Commands:**
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/new-feature-name

# Push feature
git add .
git commit -m "feat: Description"
git push -u origin feature/new-feature-name

# After merge
git checkout main
git pull origin main
git branch -d feature/new-feature-name
```

**Discussion Points:**
- Should we require branch protection rules?
- How many reviewers should approve PRs?
- What status checks should be required (tests, linting)?

---

## 6. Create GitHub Project Board

### GitHub Projects Setup

**Create Project Board:**
- [ ] Go to repository → Projects → New Project
- [ ] Choose "Board" layout
- [ ] Name: "Medical Example" (or your project name)

**Configure Columns:**
1. **Backlog** - New issues not yet prioritized
2. **Ready** - Prioritized and ready to work
3. **In Progress** - Actively being developed
4. **In Review** - PR created, awaiting review
5. **Done** - Merged and completed

### Automated Status Updates

**Get Project IDs:**
```bash
gh project list --owner username
gh project field-list 2 --owner username --format json
gh project item-list 2 --owner username --format json
```

**Add Issue to Project:**
```bash
gh project item-add 2 --owner username --url [issue-url]
```

**Update Status:**
```bash
gh project item-edit \
  --project-id [PROJECT-ID] \
  --id [ITEM-ID] \
  --field-id [STATUS-FIELD-ID] \
  --single-select-option-id [STATUS-OPTION-ID]
```

**Best Practices:**
- [ ] Update status when starting work
- [ ] Add comments to issues regularly
- [ ] Link PRs to issues
- [ ] Close issues when PRs merge
- [ ] Keep project board current

**Discussion Points:**
- Should project board updates be automated?
- Who is responsible for keeping the board current?
- What columns/statuses do we need?

---

## 7. Feature Development Workflow

### Complete Feature Lifecycle

**Example: Adding the About Page (Issue #12)**

#### Step 1: Create GitHub Issue

```bash
gh issue create --title "Implement About page" --body "..."
```

**Issue Template Should Include:**
- [ ] **Description:** What feature are we building?
- [ ] **Requirements:** Detailed specifications
- [ ] **Design Specs:** Colors, typography, layout
- [ ] **Acceptance Criteria:** Checkboxes for completion
- [ ] **Testing Checklist:** What to test
- [ ] **Branch Name:** Suggested branch name
- [ ] **Type:** Feature, bug fix, etc.
- [ ] **Priority:** High, medium, low

**Real Example from {{projectName}}:**
```markdown
## Description
Create a professional About page that tells {{projectName}}'s story...

## Requirements
### Page Structure (6 Sections)
1. Hero Section - Mission statement
2. Our Story - Company founding narrative
3. Mission & Values - 3-column grid
...

## Acceptance Criteria
- [ ] About page created at `/about` route
- [ ] All 6 sections implemented
- [ ] Design matches {{projectName}} branding
...
```

#### Step 2: Add Issue to Project Board

```bash
gh project item-add 2 --owner username --url [issue-url]
gh project item-edit --project-id [ID] --id [ITEM-ID] --field-id [FIELD] --single-select-option-id [STATUS]
```

**Project Board Columns:**
- Backlog
- Ready
- In Progress
- In Review
- Done

#### Step 3: Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/add-about-page
```

**Naming Convention:**
- Match the feature described in the issue
- Use lowercase and hyphens
- Be descriptive but concise

#### Step 4: Implement Feature

**{{projectName}} Examples:**

**Contact Page (Issue #10):**
- Created `client/pages/Contact.tsx` (405 lines)
- Added contact form with validation (React Hook Form + Zod)
- Added contact info sidebar
- Updated `App.tsx` with route
- Updated `Header.tsx` navigation link

**About Page (Issue #12):**
- Created `client/pages/About.tsx` (300 lines)
- Implemented 6 sections (Hero, Story, Values, Stats, Differentiators, CTA)
- Updated `App.tsx`, `Header.tsx`, `Footer.tsx`
- Used {{projectName}} design system (navy, sage-green, teal)

**Login System (Issue #8):**
- Created 6 new files (auth types, context, hooks, components)
- Modified 2 existing files (App.tsx, Header.tsx)
- Implemented mock authentication
- Protected routes with auth check
- Dashboard page for logged-in users

**Best Practices:**
- [ ] Follow existing code patterns
- [ ] Use TypeScript types consistently
- [ ] Match design system (colors, typography, spacing)
- [ ] Keep components modular and reusable
- [ ] Add JSDoc comments to new components

#### Step 5: Test Locally

**Dev Server Check:**
```bash
pnpm dev  # Should be running on localhost:8080
```

**Verify:**
- [ ] No compilation errors
- [ ] HMR (Hot Module Replacement) working
- [ ] No console errors
- [ ] Feature renders correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Navigation links work
- [ ] Forms validate correctly (if applicable)
- [ ] All acceptance criteria met

#### Step 6: Commit Changes

**Semantic Commit Messages:**

Format: `type: description`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or tooling changes

**Examples from {{projectName}}:**
```bash
git commit -m "feat: Add login page with mock authentication"
git commit -m "feat: Add contact page with contact form"
git commit -m "feat: Add About page with company story and mission"
git commit -m "docs: Add JSDoc documentation to Footer component"
git commit -m "fix: Update sage-green color across all components"
```

**Extended Commit Format:**
```bash
git commit -m "$(cat <<'EOF'
feat: Add About page with company story and mission

## Implementation
- Created client/pages/About.tsx (300 lines)
- Updated navigation links in Header and Footer
- Added /about route to App.tsx

## Features
- 6 sections: Hero, Story, Values, Stats, Differentiators, CTA
- Responsive design with {{projectName}} branding
- Card hover effects and gradient backgrounds

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Commit Checklist:**
- [ ] Use semantic commit type
- [ ] Write clear, concise description
- [ ] Reference issue number if applicable
- [ ] Add extended description for complex changes
- [ ] Stage only relevant files

#### Step 7: Push Branch

```bash
git push -u origin feature/add-about-page
```

**Verify:**
- [ ] Branch appears on GitHub
- [ ] All commits pushed
- [ ] No merge conflicts with main

#### Step 8: Update Issue with Progress

```bash
gh issue comment 12 --body "$(cat <<'EOF'
## ✅ Implementation Complete

### Files Created:
1. client/pages/About.tsx - Complete About page

### Files Modified:
2. client/App.tsx - Added /about route
3. client/components/Header.tsx - Updated link
...
EOF
)"
```

**Progress Update Should Include:**
- What was implemented
- Which files were created/modified
- Key features added
- Testing status
- Next steps (ready for PR)

---

## 8. Code Review Process

### Create Pull Request

```bash
gh pr create --title "feat: Add About page" --body "..." --base main
```

**PR Description Template:**

```markdown
## Summary
[Brief description of what this PR does]

## Changes
- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## New Files (X files created)
1. path/to/file.tsx - Description

## Modified Files (X files updated)
2. path/to/file.tsx - What changed

## Technical Implementation
[Details about how it works]

## Testing Completed
✅ Test 1
✅ Test 2
✅ Test 3

## Screenshots
[If applicable]

## Related Issue
Closes #123

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] No console errors
...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**PR Creation Checklist:**
- [ ] Clear title with semantic prefix
- [ ] Comprehensive description
- [ ] Link to related issue
- [ ] Testing results documented
- [ ] Screenshots for UI changes
- [ ] Checklist completed

### Code Review Standards

**What to Review:**

1. **Code Quality:**
   - [ ] Follows project style guidelines
   - [ ] TypeScript types properly defined
   - [ ] No `any` types (unless absolutely necessary)
   - [ ] Clean, readable code
   - [ ] Proper error handling
   - [ ] No console.log statements left in

2. **Functionality:**
   - [ ] Feature works as described
   - [ ] All acceptance criteria met
   - [ ] No breaking changes
   - [ ] Backward compatible

3. **Design:**
   - [ ] Matches design system
   - [ ] Responsive design works
   - [ ] Accessibility considerations
   - [ ] UI/UX follows patterns

4. **Testing:**
   - [ ] Feature tested locally
   - [ ] No console errors
   - [ ] Edge cases considered
   - [ ] Performance acceptable

5. **Documentation:**
   - [ ] JSDoc comments for complex functions
   - [ ] README updated if needed
   - [ ] Inline comments for complex logic

**Review Comment Format:**

```markdown
## Code Review - APPROVED ✅

### Summary
[Overall assessment]

### What I Reviewed:
1. **Code Quality** ✅
   - Clean component structure
   - Proper TypeScript types

2. **Functionality** ✅
   - All features working
   - Acceptance criteria met

3. **Design** ✅
   - Matches {{projectName}} branding
   - Responsive design works

### Testing Performed:
✅ Feature test 1
✅ Feature test 2

### Recommendation:
**APPROVE AND MERGE**

### Stats:
- Files Changed: 4
- Lines Added: 301
- No Breaking Changes: ✅
```

**Real Example from {{projectName}}:**
PR #13 (About Page) received thorough review covering:
- Component architecture
- Content implementation
- Design system compliance
- Responsive design
- Navigation updates
- Icon implementation
- Interactive elements
- Code quality
- Content quality
- Routing integration

**Review Process:**
- [ ] Reviewer checks out branch locally
- [ ] Runs dev server and tests feature
- [ ] Reviews code changes on GitHub
- [ ] Leaves detailed review comment
- [ ] Approves or requests changes
- [ ] Merge only after approval

**Discussion Points:**
- How many approvals required before merge?
- Can developers merge their own PRs?
- What's the timeline for reviews?

---

## 9. Version Control & Tagging

### Semantic Versioning

**Format:** `vMAJOR.MINOR.PATCH`

**Rules:**
- **MAJOR** (v2.0.0) - Breaking changes, incompatible API changes
- **MINOR** (v1.3.0) - New features, backward compatible
- **PATCH** (v1.2.1) - Bug fixes, backward compatible

**{{projectName}} Version History:**
```
v1.0.0 - Initial release (builder.io export)
v1.0.1 - PATCH: Footer documentation added
v1.1.0 - MINOR: Login page feature
v1.2.0 - MINOR: Contact page feature
v1.3.0 - MINOR: About page feature
```

### Merge and Tag Process

**After PR Approval:**

```bash
# Merge PR (squash commits into single commit)
gh pr merge 13 --squash --delete-branch

# Switch to main and pull
git checkout main
git pull origin main

# Tag version
git tag v1.3.0

# Push tag
git push origin v1.3.0
```

**Tagging Checklist:**
- [ ] PR merged successfully
- [ ] On main branch
- [ ] Latest changes pulled
- [ ] Version number follows semantic versioning
- [ ] Tag created locally
- [ ] Tag pushed to GitHub

**Version Decision Guide:**

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| New feature | MINOR | v1.2.0 → v1.3.0 |
| Bug fix | PATCH | v1.2.0 → v1.2.1 |
| Breaking change | MAJOR | v1.2.0 → v2.0.0 |
| Documentation only | PATCH | v1.2.0 → v1.2.1 |
| Refactoring (no new features) | PATCH | v1.2.0 → v1.2.1 |

**Discussion Points:**
- When do we create releases vs. just tags?
- Should we generate changelogs automatically?
- Do we need pre-release versions (beta, rc)?

---

## 10. Documentation Standards

### README.md Structure

**Essential Sections:**
```markdown
# Project Name

Brief description of what the project does.

## Tech Stack
- Frontend: React 18, TypeScript, Vite
- Styling: Tailwind CSS, shadcn/ui
- Routing: React Router v6
- Forms: React Hook Form, Zod
- State: React Context API
- Icons: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation
\`\`\`bash
git clone [repo-url]
cd project-name
pnpm install
\`\`\`

### Development
\`\`\`bash
pnpm dev  # Runs on http://localhost:8080
\`\`\`

### Build
\`\`\`bash
pnpm build
\`\`\`

## Project Structure
\`\`\`
project/
├── client/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   └── App.tsx         # Main app component
├── shared/
│   └── types/          # Shared TypeScript types
└── server/             # Backend (if applicable)
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## Development Workflow
See [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)

## Contributing
1. Create feature branch
2. Make changes
3. Create PR
4. Code review
5. Merge

## License
[License Type]
```

### WORKFLOW_GUIDE.md (Detailed Process)

**Create separate guide for:**
- [ ] Branching strategy
- [ ] Commit message format
- [ ] PR process
- [ ] Code review standards
- [ ] Version tagging
- [ ] Project board usage

**Example from {{projectName}}:**
```markdown
# Development Workflow Guide

## 1. Starting a New Feature

### Step 1: Create Issue
\`\`\`bash
gh issue create --title "Title" --body "Body"
\`\`\`

### Step 2: Create Branch
\`\`\`bash
git checkout -b feature/feature-name
\`\`\`

[...detailed steps...]
```

### Component Documentation

**JSDoc Comments:**
```typescript
/**
 * Contact Page
 * Professional contact page with form and company information
 * Mock form submission with validation and toast notifications
 */
export function Contact() {
  // ...
}
```

**Inline Comments:**
- Explain "why", not "what"
- Comment complex logic
- Note any workarounds or hacks
- Reference related issues/PRs

---

## 11. Best Practices & Lessons Learned

### What Worked Well in {{projectName}} Project

#### 1. Comprehensive Issue Templates
**Why it worked:**
- Clear acceptance criteria prevented scope creep
- Detailed specs reduced back-and-forth questions
- Testing checklists ensured thorough validation

**Recommendation:**
- [ ] Create issue templates for features, bugs, and enhancements
- [ ] Include design specs in issues
- [ ] Use checkboxes for trackable progress

#### 2. Automated GitHub CLI Workflow
**Why it worked:**
- Faster issue creation and management
- Consistent PR descriptions
- Automated project board updates
- Eliminated manual context switching

**Recommendation:**
- [ ] Install GitHub CLI on all dev machines
- [ ] Create bash aliases for common commands
- [ ] Document CLI workflow in team guide

#### 3. Squash Merging
**Why it worked:**
- Clean, linear commit history
- Each merge = one logical change
- Easy to revert if needed
- Simplified release notes

**Recommendation:**
- [ ] Always use squash merge for PRs
- [ ] Write comprehensive squash commit messages
- [ ] Delete branches after merge

#### 4. Semantic Versioning
**Why it worked:**
- Clear communication of change impact
- Easy to track feature additions
- Predictable version numbers

**Recommendation:**
- [ ] Follow semantic versioning strictly
- [ ] Tag every merge to main
- [ ] Document version bumps in release notes

#### 5. Code Review as Second Developer
**Why it worked:**
- Caught design inconsistencies
- Validated acceptance criteria
- Ensured code quality
- Knowledge sharing

**Recommendation:**
- [ ] Require at least one approval
- [ ] Use review checklist
- [ ] Test locally before approving

### Common Pitfalls to Avoid

#### 1. ❌ Direct Commits to Main
**Problem:** Bypasses code review, breaks workflow
**Solution:** Enable branch protection rules

#### 2. ❌ Vague Commit Messages
**Problem:** Hard to understand changes later
**Solution:** Use semantic commit format with descriptions

#### 3. ❌ Large, Monolithic PRs
**Problem:** Difficult to review, high merge conflict risk
**Solution:** Break features into smaller, logical PRs

#### 4. ❌ Forgetting to Update Project Board
**Problem:** Loses visibility into progress
**Solution:** Automate status updates with GitHub CLI

#### 5. ❌ Inconsistent Design Patterns
**Problem:** Codebase becomes hard to maintain
**Solution:** Establish and document design system

#### 6. ❌ Skipping Local Testing
**Problem:** Broken code merged to main
**Solution:** Always test locally before pushing

#### 7. ❌ Not Cleaning Up Branches
**Problem:** Cluttered repository
**Solution:** Delete branches after merge (automatic with `--delete-branch`)

### Team Communication Guidelines

#### Daily Standup Updates
- What did I work on yesterday?
- What am I working on today?
- Any blockers?
- Link to PR/issue if applicable

#### PR Review Expectations
- Review within 24 hours
- Test locally when possible
- Provide constructive feedback
- Approve or request changes clearly

#### Issue Management
- Assign yourself when starting work
- Comment with progress updates
- Link related PRs
- Close when complete

---

## Meeting Action Items

### Immediate Next Steps

- [ ] **All Team Members:**
  - [ ] Install GitHub CLI: `winget install --id GitHub.cli`
  - [ ] Authenticate: `gh auth login`
  - [ ] Grant project permissions: `gh auth refresh -s project`
  - [ ] Clone {{projectName}} repo (if not already)
  - [ ] Review this checklist before next meeting

- [ ] **Team Lead:**
  - [ ] Enable branch protection on main
  - [ ] Create issue templates
  - [ ] Set up project board
  - [ ] Document team-specific workflows
  - [ ] Schedule follow-up meeting

- [ ] **DevOps:**
  - [ ] Configure CI/CD pipeline
  - [ ] Set up automated testing
  - [ ] Configure deployment workflow
  - [ ] Document deployment process

### First Week Goals

- [ ] Complete one feature using full workflow
- [ ] Create and review first PR
- [ ] Update README.md
- [ ] Create WORKFLOW_GUIDE.md
- [ ] Hold retrospective on process

---

## Reference Commands Cheat Sheet

### Git Workflow
```bash
# Start feature
git checkout main
git pull origin main
git checkout -b feature/name

# Commit changes
git add .
git commit -m "feat: description"

# Push branch
git push -u origin feature/name

# After merge
git checkout main
git pull origin main
git tag v1.x.x
git push origin v1.x.x
git branch -d feature/name
```

### GitHub CLI
```bash
# Issues
gh issue create --title "Title" --body "Body"
gh issue view 123
gh issue comment 123 --body "Comment"
gh issue close 123

# Pull Requests
gh pr create --title "Title" --body "Body" --base main
gh pr view 13
gh pr review 13 --approve --body "LGTM"
gh pr merge 13 --squash --delete-branch

# Projects
gh project list --owner username
gh project item-add 2 --owner username --url [url]
gh project item-edit --project-id [ID] --id [ITEM] --status "Status"
```

### NPM Scripts ({{projectName}})
```bash
pnpm install       # Install dependencies
pnpm dev           # Run dev server (localhost:8080)
pnpm build         # Production build
pnpm preview       # Preview production build
```

---

## Questions for Discussion

1. **Branching Strategy:**
   - Are we comfortable with feature branches off main?
   - Do we need a separate `develop` branch?
   - How do we handle hotfixes?

2. **Code Review:**
   - How many approvals required?
   - What's the expected review turnaround time?
   - Can authors merge their own PRs?

3. **Version Control:**
   - When do we tag versions?
   - Do we need release branches?
   - How do we handle breaking changes?

4. **Tools & Automation:**
   - Do we want to use GitHub CLI?
   - Should we automate project board updates?
   - Do we need automated screenshot capture?

5. **AI-Assisted Development:**
   - Are we open to using Claude Code or similar tools?
   - What guardrails should we have?
   - Who reviews AI-generated code?

6. **Documentation:**
   - What level of documentation is required?
   - Who maintains the README?
   - Do we need a separate docs site?

---

## Additional Resources

### {{projectName}} Project Examples
- **Issue #8:** Login page (6 new files, 2 modified)
- **Issue #10:** Contact page (1 new file, 2 modified)
- **Issue #12:** About page (1 new file, 3 modified)

### Git Resources
- [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### GitHub CLI Docs
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Projects CLI](https://cli.github.com/manual/gh_project)

---

**End of Checklist**

*This document should be reviewed and updated after each major project milestone or when workflow changes are proposed.*

**Last Updated:** [Date]
**Version:** 1.0.0
