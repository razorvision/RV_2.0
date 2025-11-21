# SafeQuote.io Project Management Guide

> A comprehensive guide for managing the SafeQuote.io React project using GitHub's tools and workflows.

## Table of Contents
- [✅ Setup Complete](#-setup-complete)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Labels System](#labels-system)
- [Milestones & Planning](#milestones--planning)
- [Issue Management](#issue-management)
- [Pull Request Workflow](#pull-request-workflow)
- [Status Reporting](#status-reporting)
- [Client Communication](#client-communication)
- [Best Practices](#best-practices)

---

## ✅ Setup Complete

**Date Completed**: November 17, 2025
**Setup By**: Andrew Tucker (Product/Project Manager)

### 🚀 Feature Work Completed

- **PR #28 Merged**: Insurance Quote CTA now live on main
- **Issue #6 Closed**: "Add 'Get Insurance Quote' CTA After Rating" ✅
- **Insurance CTA** appears after safety ratings with compelling design and copy

### 📊 Project Management Infrastructure (All Merged!)

#### 1. Labels System (20 Labels Created)
Complete label taxonomy for organizing work:

**Priority Labels:**
- `priority: high` 🔴 - Critical, needs immediate attention
- `priority: medium` 🟡 - Important but not urgent
- `priority: low` 🟢 - Nice to have, low urgency

**Type Labels:**
- `type: feature` - New functionality
- `type: bug` - Something isn't working
- `enhancement` - Improvement to existing feature

**Status Labels:**
- `status: blocked` - Cannot proceed due to dependencies
- `status: needs-review` - Awaiting product/client feedback

**Phase Labels:**
- `phase: 1` - Phase 1: Initial Build
- `phase: 2` - Phase 2: Add Revenue
- `phase: 3` - Phase 3: Scale

**Client Labels:**
- `client: visible` - User-facing feature or change

#### 2. Issue & PR Templates
Standardized templates for consistency:
- ✅ **Feature Request Template** - With user stories & acceptance criteria
- ✅ **Bug Report Template** - With reproduction steps & environment
- ✅ **Epic Template** - For large bodies of work
- ✅ **Pull Request Template** - With testing checklist

**Location**: `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md`

#### 3. Milestones
Three-phase roadmap established:
- ✅ **Phase 1: MVP Launch** - Due December 31, 2025 (7/12 issues completed - 58%)
- ✅ **Phase 2: Revenue Features** - Due March 31, 2026
- ✅ **Phase 3: Scale & Growth** - Due June 30, 2026

#### 4. Status Reporting
Weekly reporting infrastructure:
- ✅ **Weekly Status Template** - Comprehensive format for consistent updates
- ✅ **First Status Report** - Nov 17, 2025 baseline report created
- ✅ **Status Reports Directory** - `.github/status-reports/` for archiving

#### 5. Documentation
Complete project documentation:
- ✅ **CHANGELOG.md** - Comprehensive version history (0.1.0 → 0.3.0)
- ✅ **PROJECT_MANAGEMENT_GUIDE.md** - Complete PM guide (this document)

#### 6. Client Communication
- ✅ **GitHub Discussions Enabled** - For announcements, demos, Q&A, and ideas

### 📈 Current Project Status

**Sprint**: Phase 1 - MVP Launch
**Progress**: 7/12 issues completed (58%)
**Due Date**: December 31, 2025

**Recent Wins:**
- Fixed critical F-150 safety ratings bug (Issue #16)
- Added insurance CTA feature (Issue #6)
- Established complete PM infrastructure
- Achieved 85% test coverage

**Total Changes in Setup**:
- 1,080+ lines of code and documentation
- 10 files created
- 9 documentation/template files
- 1 feature file (SafetyRatings.jsx)

### 🎯 You're Now Set Up As a PM!

#### Quick Reference Commands

**Daily Check-ins:**
```bash
# View project board
gh project view 16 --owner razorvision --web

# Check open pull requests
gh pr list

# Review items needing attention
gh issue list --label "status: needs-review"
```

**Weekly Status:**
```bash
# Create new status report
cp .github/WEEKLY_STATUS_TEMPLATE.md .github/status-reports/$(date +%Y-%m-%d)-weekly-status.md

# View completed work this week
gh pr list --state merged --json number,title,mergedAt --jq 'map(select(.mergedAt > "2025-11-10"))'
```

**Triage Issues:**
```bash
# Add labels and milestone to issue
gh issue edit <number> --add-label "priority: high,phase: 1" --milestone "Phase 1: MVP Launch"

# Check milestone progress
gh issue list --milestone "Phase 1: MVP Launch"
```

#### Essential Links
- 📋 [Project Board](https://github.com/orgs/razorvision/projects/16) - Kanban board
- 🎯 [Milestones](https://github.com/razorvision/safequote.io-React-Only/milestones) - Phase tracking
- 💬 [Discussions](https://github.com/razorvision/safequote.io-React-Only/discussions) - Team communication
- 📊 [First Status Report](https://github.com/razorvision/safequote.io-React-Only/blob/main/.github/status-reports/2025-11-17-weekly-status.md) - Nov 17 baseline
- 📝 [CHANGELOG](https://github.com/razorvision/safequote.io-React-Only/blob/main/CHANGELOG.md) - Version history

### 🚀 Next Steps

Now that setup is complete, here's your workflow:

1. **Daily** (5-10 minutes):
   - Check project board for blockers
   - Review open PRs
   - Respond to questions in issues/discussions

2. **Weekly** (30-45 minutes):
   - Create weekly status report (use template)
   - Post update to GitHub Discussions
   - Review and update milestone progress
   - Plan next week's priorities

3. **Sprint/Phase** (1-2 hours):
   - Review backlog and prioritize
   - Update milestone dates if needed
   - Demo completed features to stakeholders
   - Hold retrospective

---

## Quick Start

### Essential Commands
```bash
# View project board
gh project view 16 --owner razorvision --web

# View current milestone
gh issue list --milestone "Phase 1: MVP Launch"

# Create weekly status report
cp .github/WEEKLY_STATUS_TEMPLATE.md .github/status-reports/$(date +%Y-%m-%d)-weekly-status.md

# View recent activity
gh pr list --state merged --limit 10
gh issue list --state closed --limit 10
```

### Key Links
- **Project Board**: https://github.com/orgs/razorvision/projects/16
- **Milestones**: https://github.com/razorvision/safequote.io-React-Only/milestones
- **Issues**: https://github.com/razorvision/safequote.io-React-Only/issues
- **Discussions**: https://github.com/razorvision/safequote.io-React-Only/discussions

---

## Project Structure

### Repository Organization
```
safequote.io-React-Only/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Bug report template
│   │   ├── feature_request.md     # Feature request template
│   │   ├── epic.md                # Epic template
│   │   └── config.yml             # Template configuration
│   ├── pull_request_template.md   # PR template
│   ├── WEEKLY_STATUS_TEMPLATE.md  # Status report template
│   ├── status-reports/            # Weekly status reports
│   └── PROJECT_MANAGEMENT_GUIDE.md # This file
├── CHANGELOG.md                    # Version history
└── [source code directories]
```

---

## Labels System

### Priority Labels
Use to indicate urgency and importance:
- `priority: high` 🔴 - Critical, needs immediate attention
- `priority: medium` 🟡 - Important but not urgent
- `priority: low` 🟢 - Nice to have, low urgency

### Type Labels
Categorize the nature of work:
- `type: feature` - New functionality
- `type: bug` - Something isn't working
- `type: enhancement` - Improvement to existing feature
- `enhancement` - General improvements
- `documentation` - Docs updates

### Status Labels
Track current state:
- `status: blocked` - Cannot proceed due to dependencies
- `status: needs-review` - Awaiting product/client feedback
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

### Phase Labels
Organize by project phase:
- `phase: 1` - Phase 1: Initial Build
- `phase: 2` - Phase 2: Add Revenue
- `phase: 3` - Phase 3: Scale

### Client Labels
- `client: visible` - User-facing changes that affect customer experience

### Applying Labels
```bash
# Add labels to an issue
gh issue edit 7 --add-label "priority: high,type: feature,phase: 1"

# Add labels to a PR
gh pr edit 28 --add-label "client: visible,priority: high"

# List all labels
gh label list
```

---

## Milestones & Planning

### Current Milestones

#### Phase 1: MVP Launch
- **Due**: December 31, 2025
- **Goal**: Core features for initial launch
- **Key Features**: Safety ratings, vehicle search, insurance quotes
- [View Milestone](https://github.com/razorvision/safequote.io-React-Only/milestone/1)

#### Phase 2: Revenue Features
- **Due**: March 31, 2026
- **Goal**: Add monetization capabilities
- **Key Features**: Affiliate integrations, email capture, partnerships
- [View Milestone](https://github.com/razorvision/safequote.io-React-Only/milestone/2)

#### Phase 3: Scale & Growth
- **Due**: June 30, 2026
- **Goal**: Scale the platform
- **Key Features**: Blog/SEO, advanced comparisons, engagement tools
- [View Milestone](https://github.com/razorvision/safequote.io-React-Only/milestone/3)

### Managing Milestones
```bash
# Add issue to milestone
gh issue edit 7 --milestone "Phase 1: MVP Launch"

# View milestone progress
gh issue list --milestone "Phase 1: MVP Launch"

# View all milestones
gh api repos/razorvision/safequote.io-React-Only/milestones
```

---

## Issue Management

### Creating Issues

**Use Templates**: When creating issues via GitHub web interface, select appropriate template:
- **Feature Request**: For new features or functionality
- **Bug Report**: For bugs and issues
- **Epic**: For large bodies of work spanning multiple issues

**Via CLI**:
```bash
# Create feature issue
gh issue create --title "Feature Name" --body "Description" --label "type: feature,priority: medium,phase: 1"

# Create bug report
gh issue create --title "[BUG] Description" --body "Details" --label "type: bug,priority: high"
```

### Issue Best Practices

1. **Clear Titles**: Use descriptive titles that explain what needs to be done
   - ✅ Good: "Add insurance quote CTA after safety ratings"
   - ❌ Bad: "Update page"

2. **Acceptance Criteria**: Always include clear acceptance criteria
   ```markdown
   ## Acceptance Criteria
   - [ ] CTA button appears after rating is shown
   - [ ] Button styled consistently with design system
   - [ ] Button links to insurance quote flow
   ```

3. **Link Related Issues**: Connect related work
   ```markdown
   Related to #5
   Blocks #10
   Part of Epic #1
   ```

4. **Update Status**: Keep issues current with progress comments
   ```markdown
   Update: 70% complete. Working on button styling. Expected completion: Nov 20.
   ```

---

## Pull Request Workflow

### Creating PRs

1. **Always link to issues**: Use "Closes #X" or "Fixes #X"
2. **Use PR template**: Fill out all sections
3. **Add screenshots**: Visual changes need screenshots/GIFs
4. **Request reviews**: Tag team members explicitly

**Example PR Description**:
```markdown
## Description
Adds insurance quote CTA after safety ratings display

## Type of Change
- [x] New feature

## Related Issues
Closes #6

## Changes Made
- Added gradient CTA section below safety ratings
- Implemented click handler to navigate to insurance flow
- Added responsive styling

## Screenshots
[Add screenshot]

## Testing
- [x] Tested locally
- [x] No console errors
- [x] Mobile responsive

## Client-Facing Impact
- [x] This change is visible to end users
```

### PR Review Process

**As PM reviewing PRs**:
1. Check business requirements against issue acceptance criteria
2. Verify user-facing changes match design/mockups
3. Test functionality from user perspective
4. Don't review code quality (leave to technical reviewers)

**Commands**:
```bash
# List open PRs
gh pr list

# View PR details
gh pr view 28

# Check out PR locally for testing
gh pr checkout 28

# Approve PR
gh pr review 28 --approve --body "LGTM! Meets all acceptance criteria."

# Merge PR (after approval)
gh pr merge 28 --squash --delete-branch
```

---

## Status Reporting

### Weekly Status Reports

**Schedule**: Every Friday or Monday
**Template**: `.github/WEEKLY_STATUS_TEMPLATE.md`
**Location**: Save to `.github/status-reports/YYYY-MM-DD-weekly-status.md`

**Process**:
1. Copy template
   ```bash
   cp .github/WEEKLY_STATUS_TEMPLATE.md .github/status-reports/2025-11-24-weekly-status.md
   ```

2. Fill in sections:
   - Completed work (merged PRs, closed issues)
   - In-progress work (open PRs, active issues)
   - Next week's plan
   - Blockers and risks
   - Client decisions needed

3. Share with stakeholders via:
   - GitHub Discussions (post as "Announcement")
   - Email with link to report
   - Slack/Teams with summary

**Gathering Data**:
```bash
# Completed this week (adjust date)
gh pr list --state merged --json number,title,mergedAt --jq 'map(select(.mergedAt > "2025-11-17"))'
gh issue list --state closed --json number,title,closedAt --jq 'map(select(.closedAt > "2025-11-17"))'

# Currently open
gh pr list --state open
gh issue list --state open --milestone "Phase 1: MVP Launch"

# Milestone progress
gh issue list --milestone "Phase 1: MVP Launch" --json number,state
```

### Sprint Metrics

Track these metrics in each status report:
- **Velocity**: Issues completed per week
- **Burndown**: Issues remaining in milestone
- **Quality**: Test coverage, bugs opened vs closed
- **Cycle time**: Average time from issue open to close

---

## Client Communication

### GitHub Discussions

Use for:
- Weekly announcements
- Feature demos
- Q&A sessions
- Idea gathering

**Creating Discussions**:
1. Go to [Discussions tab](https://github.com/razorvision/safequote.io-React-Only/discussions)
2. Click "New discussion"
3. Choose category:
   - 📢 **Announcements**: Weekly updates, releases
   - 🎉 **Show and Tell**: Demo completed features
   - 💡 **Ideas**: Feature suggestions, brainstorming
   - ❓ **Q&A**: Questions and answers

**Example Weekly Update Post**:
```markdown
Title: Weekly Update - Week of Nov 17, 2025

Hi team! Here's our weekly progress update.

## This Week's Highlights
- ✅ Fixed critical F-150 safety ratings bug
- ✅ Added insurance quote CTA
- ✅ Established PM processes

## Demo
Check out the new insurance CTA: [staging link]

## Need Your Feedback
Please review the CTA placement and copy. Does it feel natural after seeing safety ratings?

Full report: [link to status report]
```

### Email Updates

For formal client communication:
- **Subject**: "SafeQuote.io Weekly Update - [Date]"
- **Body**: Summary with link to full GitHub status report
- **Attachments**: Screenshots of key features

---

## Best Practices

### For Product/Project Managers

#### Daily
- [ ] Check project board for blockers
- [ ] Review and respond to issue comments
- [ ] Approve or request changes on open PRs

#### Weekly
- [ ] Create and share weekly status report
- [ ] Update milestone progress
- [ ] Triage new issues (add labels, milestones, priorities)
- [ ] Plan next week's priorities

#### Sprint Start
- [ ] Review backlog
- [ ] Prioritize issues for sprint
- [ ] Set sprint goals
- [ ] Communicate expectations

#### Sprint End
- [ ] Demo completed features
- [ ] Gather feedback
- [ ] Close milestone or update dates
- [ ] Retrospective (what went well, what to improve)

### Issue Triage Checklist

When new issues are created:
1. [ ] Add appropriate labels (type, priority, phase)
2. [ ] Assign to milestone
3. [ ] Add acceptance criteria if missing
4. [ ] Link related issues
5. [ ] Assign to team member (if applicable)
6. [ ] Add to project board

### PR Merge Checklist

Before merging PRs:
1. [ ] All acceptance criteria met
2. [ ] Tests passing
3. [ ] No console errors
4. [ ] Reviewed by at least one person
5. [ ] Client approval (if client-visible)
6. [ ] CHANGELOG.md updated
7. [ ] Documentation updated (if needed)

---

## Automation Ideas

### GitHub Actions (Future Enhancement)

Consider automating:
- **Auto-labeling**: Label PRs based on files changed
- **Auto-milestone**: Add issues to current milestone
- **Status checks**: Ensure tests pass before merge
- **Release notes**: Auto-generate from merged PRs
- **Notifications**: Slack/email when PRs need review

### Project Board Automation

Enable in project settings:
- Add new issues to "Backlog" column
- Move to "In Progress" when PR opened
- Move to "Done" when PR merged
- Auto-close issues when linked PR merges

---

## Troubleshooting

### Common Issues

**Q: Issue not showing in milestone?**
A: Check if milestone is assigned: `gh issue edit <number> --milestone "Phase 1: MVP Launch"`

**Q: Can't find old status reports?**
A: Check `.github/status-reports/` directory or search Issues for "Weekly Update"

**Q: PR not closing issue?**
A: Ensure PR description includes "Closes #X" or "Fixes #X" (case-insensitive)

**Q: Labels not showing?**
A: Labels must be created first: `gh label create "name" --color "hex" --description "desc"`

---

## Resources

### GitHub Documentation
- [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)
- [GitHub Discussions](https://docs.github.com/en/discussions)

### Templates
- [Issue Templates](.github/ISSUE_TEMPLATE/)
- [PR Template](.github/pull_request_template.md)
- [Status Report Template](.github/WEEKLY_STATUS_TEMPLATE.md)

### Project Links
- [CHANGELOG](../CHANGELOG.md)
- [README](../README.md)
- [Project Board](https://github.com/orgs/razorvision/projects/16)

---

## Questions?

For questions about this guide or project management workflows:
- Open a [Discussion](https://github.com/razorvision/safequote.io-React-Only/discussions)
- Contact the PM team
- Refer to [GitHub Docs](https://docs.github.com)

---

**Last Updated**: November 17, 2025
**Maintained By**: Andrew Tucker (Product/Project Manager)
