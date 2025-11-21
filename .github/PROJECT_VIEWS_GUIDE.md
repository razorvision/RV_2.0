# GitHub Project Views Setup Guide

> Essential project views for managing SafeQuote.io effectively

## Quick Access
**Project Board**: https://github.com/orgs/razorvision/projects/16

---

## Recommended Views

### 1. 📋 Kanban Board (Primary View)
**Purpose**: Daily workflow management - see work in progress at a glance

**Setup**:
1. Go to your [project board](https://github.com/orgs/razorvision/projects/16)
2. Click "+ New view" → "Board"
3. Name it: "Kanban Board"
4. Configure columns:

**Columns**:
- **Backlog** - Not yet prioritized
  - Filter: `no:status` or `status:"Backlog"`
- **Ready** - Prioritized and ready to start
  - Filter: `status:"Ready"`
- **In Progress** - Currently being worked on
  - Filter: `status:"In Progress"`
- **In Review** - PRs open, awaiting review
  - Filter: `status:"In Review"`
- **Done** - Completed this sprint
  - Filter: `status:"Done"`

**Grouping**: By Status
**Sorting**: By Priority (High → Low)

---

### 2. 🎯 Phase 1 Sprint View
**Purpose**: Track Phase 1: MVP Launch progress

**Setup**:
1. Click "+ New view" → "Board"
2. Name it: "Phase 1: MVP Launch"
3. Add filter: `milestone:"Phase 1: MVP Launch"`

**Columns**: Same as Kanban (Backlog → Done)
**Additional Filters**:
- Show only: `milestone:"Phase 1: MVP Launch"`
- Exclude: Closed issues (or include based on preference)

**Why Helpful**: Focus only on MVP work, ignore Phase 2/3 noise

---

### 3. 📊 Priority Matrix
**Purpose**: See what's urgent vs important at a glance

**Setup**:
1. Click "+ New view" → "Table"
2. Name it: "Priority Matrix"
3. Configure columns:
   - Title
   - Status
   - Priority (label)
   - Phase (label)
   - Assignees
   - Milestone
   - Updated

**Grouping**: By Priority label
**Sorting**: By Updated (Most recent first)

**Filters**:
- State: Open only
- Exclude: Epics (#1, #2, #3)

**Why Helpful**: Quickly identify high-priority items across all phases

---

### 4. 🚀 This Week View
**Purpose**: What's being worked on this week

**Setup**:
1. Click "+ New view" → "Board"
2. Name it: "This Week"
3. Configure:

**Filters**:
- Status: `In Progress` OR `In Review`
- Updated: Last 7 days

**Columns**:
- In Progress
- In Review
- Done This Week

**Why Helpful**: Perfect for daily standups and weekly status

---

### 5. 👥 By Assignee View
**Purpose**: See who's working on what

**Setup**:
1. Click "+ New view" → "Board"
2. Name it: "By Team Member"
3. Configure:

**Grouping**: By Assignees
**Columns**: Status-based (Backlog → Done)
**Filter**: Open issues only

**Why Helpful**: Track team workload and balance assignments

---

### 6. 🏷️ Client-Facing Features
**Purpose**: Track user-visible work for client demos

**Setup**:
1. Click "+ New view" → "Table"
2. Name it: "Client Visible"
3. Configure:

**Filters**:
- Label: `client: visible`
- State: Open

**Columns**:
- Title
- Status
- Priority
- Milestone
- Linked PRs

**Sorting**: By Priority → Milestone

**Why Helpful**: Prepare for client demos, know what users will see

---

### 7. 📈 Roadmap View
**Purpose**: High-level overview of all phases

**Setup**:
1. Click "+ New view" → "Roadmap"
2. Name it: "Product Roadmap"
3. Configure:

**Grouping**: By Milestone
**Date field**: Milestone due date
**Show**: All issues across all milestones

**Timeline**: Show quarters (Q4 2025, Q1 2026, Q2 2026)

**Why Helpful**: Big picture view for stakeholders, planning

---

### 8. 🐛 Bugs & Issues View
**Purpose**: Track bugs separately from features

**Setup**:
1. Click "+ New view" → "Table"
2. Name it: "Bugs & Issues"
3. Configure:

**Filters**:
- Label: `type: bug`
- State: Open

**Columns**:
- Title
- Priority
- Status
- Assignees
- Created date
- Labels

**Sorting**: By Priority (High first)

**Why Helpful**: Ensure bugs don't get lost in feature work

---

## Quick Setup Workflow

### Step-by-Step to Create Kanban Board:

1. **Go to project**: https://github.com/orgs/razorvision/projects/16

2. **Create new view**:
   - Click "+ New view" (top right)
   - Select "Board"
   - Name: "Kanban Board"

3. **Set up columns**:
   - Click "..." on column header → "Rename" for each column
   - Columns: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`

4. **Configure Status field**:
   - Click "..." menu → "Settings"
   - Ensure "Status" field exists with your column names
   - If not, create custom "Status" single-select field

5. **Add grouping**:
   - Click "Group" button (top bar)
   - Select "Status"

6. **Add sorting**:
   - In each column, click "..." → "Sort"
   - Sort by: Priority (descending)

7. **Save layout**:
   - GitHub auto-saves, but verify columns appear correctly

---

## Automation Recommendations

Set up workflow automation (Project Settings → Workflows):

### Auto-add to Project
- **Trigger**: Item added to project
- **Action**: Set status to "Backlog"

### Auto-progress
- **Trigger**: Pull request opened
- **Action**: Move to "In Review"

### Auto-complete
- **Trigger**: Pull request merged
- **Action**: Move to "Done"

### Auto-close
- **Trigger**: Issue closed
- **Action**: Set status to "Done"

---

## View Usage Guide

### Daily Workflow
1. **Start with**: Kanban Board
2. **Check**: This Week view
3. **Triage**: Priority Matrix

### Weekly Planning
1. **Review**: Phase 1 Sprint View
2. **Plan**: Backlog column in Kanban
3. **Assign**: By Assignee view

### Client Demos
1. **Prepare**: Client-Facing Features
2. **Present**: Roadmap View
3. **Show**: Completed items in Done column

### Sprint Planning
1. **Overview**: Roadmap View
2. **Details**: Phase-specific view
3. **Assign**: By Assignee view

---

## Pro Tips

### 1. Use Draft Issues
Create quick tasks without leaving the board:
- Click "+ Add item" in any column
- Type title → Enter
- Add details later

### 2. Keyboard Shortcuts
- `?` - Show all shortcuts
- `c` - Create new item
- `e` - Edit item
- `/` - Focus search

### 3. Filters
Combine filters for powerful views:
```
is:open label:"priority: high" milestone:"Phase 1: MVP Launch"
```

### 4. Custom Fields
Add useful fields:
- **Story Points** (number)
- **Sprint** (text)
- **Epic** (text to link to epic issues)
- **Due Date** (date)

### 5. Insights
View project insights:
- Burndown charts
- Velocity tracking
- Cycle time analysis

---

## Commands to Quickly Add Items

### Add issue to project board
```bash
# Add by issue number
gh project item-add 16 --owner razorvision --url https://github.com/razorvision/safequote.io-React-Only/issues/7

# View all items in project
gh project item-list 16 --owner razorvision --format json
```

### Update item status
Items update automatically when you:
- Open a PR → Moves to "In Review"
- Merge PR → Moves to "Done"
- Close issue → Moves to "Done"

---

## View Comparison

| View | Best For | Update Frequency |
|------|----------|------------------|
| **Kanban Board** | Daily workflow | Real-time |
| **Phase 1 Sprint** | Sprint focus | Daily |
| **Priority Matrix** | Triage | Daily |
| **This Week** | Standups | Daily |
| **By Assignee** | Team balance | Daily |
| **Client Visible** | Demos | Before client meetings |
| **Roadmap** | Planning | Weekly |
| **Bugs & Issues** | Quality tracking | As needed |

---

## Mobile Access

GitHub Projects work on mobile:
- iOS: GitHub Mobile app
- Android: GitHub Mobile app
- Web: Mobile browser at github.com

**Recommended mobile views**:
- Kanban Board (swipe columns)
- This Week (quick overview)

---

## Sharing Views

### With Stakeholders
1. **Public URL**: Share project URL (if public)
2. **Screenshots**: Export view as image
3. **Reports**: Use Insights tab for charts

### With Team
1. **Pin important views**: Star them for quick access
2. **Set default view**: Make Kanban your default
3. **Save custom filters**: Bookmark filtered URLs

---

## Next Steps

1. ✅ Create Kanban Board (primary view)
2. ✅ Set up Phase 1 Sprint View
3. ✅ Configure Priority Matrix
4. ✅ Enable project automation
5. ✅ Pin your favorite views

---

## Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Project Views Guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project)
- [Project Automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)

---

**Your Project**: https://github.com/orgs/razorvision/projects/16
**Last Updated**: November 17, 2025
