# Step 5: GitHub Integration & Project Board Setup

## 🎯 Goal

Set up GitHub project board with Kanban template, configure automation for issue/PR tracking, and establish GitHub CLI workflows for efficient project management.

## 📋 Instructions for Claude Code

### Phase 1: GitHub Project Board Creation

Create a new project board using the Kanban template.

#### 1. Check Config Settings

Read `config.json` to determine if project board should be created:

```json
{
  "createProjectBoard": true,
  "projectBoardName": "Project Name Development"
}
```

If `createProjectBoard` is false, skip this phase.

#### 2. List Existing Projects

```bash
gh project list --owner [githubOwner from config]
```

Check if a project with the same name already exists.

#### 3. Create New Project (if needed)

```bash
# Create project with Kanban template
gh project create --owner [githubOwner] --title "[projectBoardName]"
```

**Expected output:**
```
https://github.com/users/[owner]/projects/[number]
```

Extract the project number from the URL.

#### 4. Get Project ID

GitHub CLI uses both project numbers (visible in URL) and project IDs (internal GraphQL IDs).

**With error handling:**

```bash
# Get project ID using GraphQL (for user account)
echo "Fetching project ID..."

RESPONSE=$(gh api graphql -f query='
  query($owner: String!, $number: Int!) {
    user(login: $owner) {
      projectV2(number: $number) {
        id
        title
      }
    }
  }
' -f owner='[githubOwner]' -F number=[projectNumber] 2>&1)

# Check for errors
if [ $? -ne 0 ]; then
  echo "❌ GraphQL query failed. Trying organization..."

  # Try organization query
  RESPONSE=$(gh api graphql -f query='
    query($owner: String!, $number: Int!) {
      organization(login: $owner) {
        projectV2(number: $number) {
          id
          title
        }
      }
    }
  ' -f owner='[githubOwner]' -F number=[projectNumber] 2>&1)

  if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to fetch project ID"
    echo "$RESPONSE"
    echo ""
    echo "Troubleshooting:"
    echo "  - Verify project number is correct"
    echo "  - Check GitHub CLI has project permissions: gh auth status"
    echo "  - Verify owner name is correct"
    exit 1
  fi
fi

# Extract project ID
PROJECT_ID=$(echo "$RESPONSE" | jq -r '.data.user.projectV2.id // .data.organization.projectV2.id // empty')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: Could not extract project ID from response"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Project ID: $PROJECT_ID"
```

### Phase 2: Configure Project Board Columns

Set up standard Kanban columns: Backlog, Ready, In Progress, In Review, Done.

#### 1. Get Field IDs

Projects have fields (columns). Get the Status field ID:

**With error handling:**

```bash
echo "Fetching project fields..."

FIELDS_RESPONSE=$(gh api graphql -f query='
  query($projectId: ID!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        fields(first: 20) {
          nodes {
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  }
' -f projectId='[PROJECT_ID]' 2>&1)

# Check for errors
if [ $? -ne 0 ]; then
  echo "❌ Error: Failed to fetch project fields"
  echo "$FIELDS_RESPONSE"
  echo ""
  echo "Troubleshooting:"
  echo "  - Verify project ID is correct: $PROJECT_ID"
  echo "  - Check permissions with: gh auth status"
  exit 1
fi

# Verify response has data
if ! echo "$FIELDS_RESPONSE" | jq -e '.data.node.fields' > /dev/null 2>&1; then
  echo "❌ Error: Invalid response structure"
  echo "$FIELDS_RESPONSE"
  exit 1
fi

echo "✅ Project fields fetched successfully"
echo "$FIELDS_RESPONSE" | jq '.data.node.fields'
```

**Expected output:**
```json
{
  "id": "PVTSSF_lAHOBbFPz84BH4Oszg4gPMM",
  "name": "Status",
  "options": [
    {"id": "abc123", "name": "Backlog"},
    {"id": "def456", "name": "Ready"},
    {"id": "ghi789", "name": "In Progress"},
    {"id": "jkl012", "name": "In Review"},
    {"id": "mno345", "name": "Done"}
  ]
}
```

Save:
- Status field ID
- Option IDs for each status

#### 2. Document IDs in Config

Create `.project-intake/project-board-ids.json`:

```json
{
  "projectNumber": 2,
  "projectId": "PVT_kwHOBbFPz84BH4Os",
  "statusFieldId": "PVTSSF_lAHOBbFPz84BH4Oszg4gPMM",
  "statuses": {
    "backlog": "abc123",
    "ready": "def456",
    "in_progress": "ghi789",
    "in_review": "jkl012",
    "done": "mno345"
  }
}
```

### Phase 3: Issue and PR Templates

Create templates for consistent issue and PR creation.

#### 1. Create Issue Template

Create `.project-intake/templates/issue-template.md`:

```markdown
## Description
[Brief description of the feature/bug]

## Requirements
### [Section Name]
1. Requirement 1
2. Requirement 2
3. Requirement 3

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Considerations
- [Any technical notes]
- [Dependencies]
- [Potential challenges]

## Testing Checklist
- [ ] Unit tests added
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases covered

## Branch
`feature/issue-name`

## Type
[Feature / Bug Fix / Enhancement / Documentation]

## Priority
[High / Medium / Low]

## Estimated Effort
[Small / Medium / Large]
```

#### 2. Create PR Template

Create `.project-intake/templates/pr-template.md`:

```markdown
## Summary
[Brief description of changes]

## Changes
- ✅ Change 1
- ✅ Change 2
- ✅ Change 3

## Files Changed
### New Files ([X] files created)
1. `path/to/file` - Description

### Modified Files ([X] files updated)
2. `path/to/file` - What changed

## Technical Implementation
[Technical details, architecture decisions, patterns used]

## Testing Completed
✅ Test 1
✅ Test 2
✅ Test 3

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issue
Closes #[issue-number]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors

## Additional Notes
[Any additional context or notes for reviewers]

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Phase 4: Workflow Automation Scripts

Create helper scripts for common GitHub workflows.

#### 1. Create Issue Workflow Script

Document the full workflow in `GITHUB_WORKFLOWS.md`:

```markdown
# GitHub Workflows

## Creating an Issue

```bash
# Create issue
gh issue create \
  --title "Feature: Add user dashboard" \
  --body "$(cat .project-intake/templates/issue-template.md)" \
  --label "feature" \
  --assignee "@me"

# Get issue number from output
ISSUE_NUMBER=[number from output]
```

## Adding Issue to Project Board

```bash
# Add to project
gh project item-add [PROJECT_NUMBER] \
  --owner [GITHUB_OWNER] \
  --url https://github.com/[OWNER]/[REPO]/issues/${ISSUE_NUMBER}

# Get item ID
ITEM_ID=$(gh api graphql -f query='
  query($projectId: ID!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(last: 1) {
          nodes {
            id
          }
        }
      }
    }
  }
' -f projectId="[PROJECT_ID]" --jq '.data.node.items.nodes[0].id')
```

## Updating Issue Status

```bash
# Move to In Progress
gh project item-edit \
  --project-id [PROJECT_ID] \
  --id ${ITEM_ID} \
  --field-id [STATUS_FIELD_ID] \
  --single-select-option-id [IN_PROGRESS_OPTION_ID]
```

## Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/issue-${ISSUE_NUMBER}-brief-description

# Example: feature/issue-42-user-dashboard
```

## Making Changes and Committing

```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "feat: Add user dashboard

Implement user dashboard with:
- Overview stats
- Recent activity
- Quick actions

Closes #${ISSUE_NUMBER}"

# Push to remote
git push -u origin feature/issue-${ISSUE_NUMBER}-brief-description
```

## Creating a Pull Request

```bash
# Create PR linked to issue
gh pr create \
  --title "feat: Add user dashboard" \
  --body "$(cat .project-intake/templates/pr-template.md | sed 's/\[issue-number\]/'${ISSUE_NUMBER}'/g')" \
  --base main \
  --head feature/issue-${ISSUE_NUMBER}-brief-description

# Add PR to project (automatically added via issue link)
```

## Code Review Process

```bash
# View PR
gh pr view [PR_NUMBER]

# Add review comment
gh pr review [PR_NUMBER] --comment --body "Review comments here"

# Request changes
gh pr review [PR_NUMBER] --request-changes --body "Please address these issues"

# Approve PR
gh pr review [PR_NUMBER] --approve --body "LGTM! ✅"
```

## Merging PR

```bash
# Merge with squash (recommended)
gh pr merge [PR_NUMBER] --squash --delete-branch

# Auto-closes related issue if "Closes #X" in PR body
```

## Updating Project Status

```bash
# Update to Done (if not auto-updated)
gh project item-edit \
  --project-id [PROJECT_ID] \
  --id ${ITEM_ID} \
  --field-id [STATUS_FIELD_ID] \
  --single-select-option-id [DONE_OPTION_ID]
```

## Complete Workflow Example

```bash
# 1. Create issue
ISSUE_NUM=$(gh issue create --title "feat: Add feature" --body "..." | grep -oE '[0-9]+$')

# 2. Add to project
gh project item-add [PROJECT_NUM] --owner [OWNER] --url https://github.com/[OWNER]/[REPO]/issues/${ISSUE_NUM}

# 3. Get item ID
ITEM_ID=$(gh api graphql -f query='...' --jq '...')

# 4. Update to In Progress
gh project item-edit --project-id [ID] --id ${ITEM_ID} --field-id [FIELD] --single-select-option-id [OPTION]

# 5. Create branch
git checkout -b feature/issue-${ISSUE_NUM}-feature-name

# 6. Make changes
# [edit files]

# 7. Commit
git add .
git commit -m "feat: Add feature

Closes #${ISSUE_NUM}"

# 8. Push
git push -u origin feature/issue-${ISSUE_NUM}-feature-name

# 9. Create PR
gh pr create --title "feat: Add feature" --body "Closes #${ISSUE_NUM}" --base main

# 10. After review, merge
gh pr merge --squash --delete-branch

# 11. Update to Done
gh project item-edit --project-id [ID] --id ${ITEM_ID} --field-id [FIELD] --single-select-option-id [DONE_OPTION]
```
```

### Phase 5: Claude Code Integration

Configure Claude Code to automate these workflows.

#### 1. Verify Auto-Approvals

Ensure `.claude/settings.local.json` includes:

```json
{
  "requireApproval": {
    "allow": [
      "Bash(gh issue *)",
      "Bash(gh pr *)",
      "Bash(gh project *)",
      "Bash(gh api graphql *)"
    ]
  }
}
```

#### 2. Create Workflow Prompts

Document standard prompts for Claude in `CLAUDE_WORKFLOWS.md`:

```markdown
# Claude Code Workflow Prompts

## Creating a New Feature

"I want to add a new feature: [description]. Please:
1. Create a GitHub issue with the requirements
2. Add it to the project board
3. Create a feature branch
4. Update the project status to In Progress"

## After Completing Work

"I've completed the feature. Please:
1. Create a pull request
2. Add screenshots (if UI changes)
3. Update the project board
4. Provide a summary for the PR description"

## Code Review

"Please review this PR:
1. Check code quality
2. Verify acceptance criteria
3. Test functionality
4. Provide review comments"

## After PR Approval

"Please merge this PR:
1. Merge with squash
2. Delete the feature branch
3. Update project board to Done
4. Add completion comment to issue"
```

## 📊 Output Checklist

After completing this step, verify:

- ✅ GitHub project board created (if enabled in config)
- ✅ Project ID and field IDs documented in `project-board-ids.json`
- ✅ Five columns configured: Backlog, Ready, In Progress, In Review, Done
- ✅ Issue template created (`.project-intake/templates/issue-template.md`)
- ✅ PR template created (`.project-intake/templates/pr-template.md`)
- ✅ GitHub workflows documented (`GITHUB_WORKFLOWS.md`)
- ✅ Claude Code workflows documented (`CLAUDE_WORKFLOWS.md`)
- ✅ Auto-approvals configured for GitHub CLI commands
- ✅ Complete workflow example tested

## 🔧 Troubleshooting

### Project Board Not Created
```bash
# Check authentication
gh auth status

# Refresh with project scope
gh auth refresh -s project

# Try again
gh project create --owner [owner] --title "[name]"
```

### Can't Get Project ID
```bash
# List all projects to find the right one
gh project list --owner [owner]

# Use correct query for user vs organization
# User: user(login: $owner) { projectV2... }
# Org: organization(login: $owner) { projectV2... }
```

### Item Not Added to Project
```bash
# Verify URL format
https://github.com/[owner]/[repo]/issues/[number]

# Check project permissions
gh project view [number] --owner [owner]
```

## 🔄 Next Step

Once GitHub integration is complete, proceed to:
**06-quality-standards.md** - Document code quality and security standards

---

**Estimated Time:** 10-15 minutes
**Tools Used:** Bash (gh CLI), Write, GraphQL queries
**Output:** Project board configured, workflows documented, automation enabled
