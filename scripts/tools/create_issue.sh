#!/bin/bash
#
# create_issue.sh - Create GitHub issues with ALL required properties set
#
# Usage:
#   ./scripts/create_issue.sh \
#     --title "Issue Title" \
#     --body "Issue body content" \
#     --milestone "M1" \
#     --labels "phase:foundation,agent:engineer,work:code,priority:high" \
#     --parent-issue "157" \
#     --story-points "5" \
#     --status "Backlog" \
#     --phase "Foundation" \
#     --agent-type "Engineer" \
#     --priority "High" \
#     --issue-type "Task" \
#     --project-type "Fixed Fee" \
#     --client "BBCom" \
#     --sow-number "DYN-002" \
#     --start-date "2025-10-29" \
#     --target-date "2025-12-01"
#
# Required parameters: --title, --body, --milestone, --labels, --story-points,
#                      --status, --phase, --agent-type, --priority
# Optional parameters: --parent-issue, --issue-type, --project-type, --client,
#                      --sow-number, --start-date, --target-date, --actual-date
#
# Label vs Type Clarification:
#   --labels: Project-specific labels including work:* labels
#             (work:code, work:documentation, work:infrastructure, work:testing, work:planning)
#             Also includes phase:*, agent:*, and priority:* labels
#   --issue-type: Native GitHub Type field (Task, Bug, Feature)
#                 Defaults to "Task" if not specified
#                 Use Task for 95% of issues; Bug for defects; Feature for major new capabilities
#
# Example:
#   --labels "phase:foundation,agent:engineer,work:code,priority:high" \
#   --issue-type "Task"
#
# Compatibility: bash 3.2+ (macOS and Linux compatible)

set -e

# Configuration
REPO="razorvision/dyn-01-data-warehouse"
PROJECT_ID="PVT_kwDOALZa3M4BG1h9"
PROJECT_NUMBER=4
ORG="razorvision"

# Field IDs (from GitHub Project #4)
STORY_POINTS_FIELD_ID="PVTF_lADOALZa3M4BG1h9zg3xFOs"
AGENT_TYPE_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg3xFSM"
PHASE_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg3xzBY"
PRIORITY_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg3xFVA"
STATUS_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg3xE_g"
PROJECT_TYPE_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg340js"
CLIENT_FIELD_ID="PVTSSF_lADOALZa3M4BG1h9zg340kY"
SOW_NUMBER_FIELD_ID="PVTF_lADOALZa3M4BG1h9zg340kc"
START_DATE_FIELD_ID="PVTF_lADOALZa3M4BG1h9zg340kg"
TARGET_DATE_FIELD_ID="PVTF_lADOALZa3M4BG1h9zg340lM"
ACTUAL_DATE_FIELD_ID="PVTF_lADOALZa3M4BG1h9zg340yM"

# Native GitHub Issue Type IDs
TASK_TYPE_ID="IT_kwDOALZa3M4AFtA3"
BUG_TYPE_ID="IT_kwDOALZa3M4AFtA7"
FEATURE_TYPE_ID="IT_kwDOALZa3M4AFtA-"

# Field option ID lookup functions (bash 3.x compatible)
get_status_option_id() {
    case "$1" in
        "Backlog") echo "bee1d1f1" ;;
        "Ready") echo "a27cb4dd" ;;
        "In Progress") echo "d5ecb42e" ;;
        "Review") echo "3b9feeca" ;;
        "Done") echo "3e072ea8" ;;
        *) return 1 ;;
    esac
}

get_phase_option_id() {
    case "$1" in
        "Foundation") echo "ec097299" ;;
        "Silver Layer") echo "4a044f80" ;;
        "Looker") echo "be8d27ab" ;;
        "ADF Pipelines") echo "9ddd1d91" ;;
        "Deployment") echo "d0b18222" ;;
        "Testing") echo "39c51224" ;;
        "Documentation") echo "c7952d4c" ;;
        *) return 1 ;;
    esac
}

get_agent_type_option_id() {
    case "$1" in
        "PM") echo "2f5947a6" ;;
        "Engineer") echo "e1a760da" ;;
        "Architect") echo "48740fc8" ;;
        "DevOps") echo "198afb95" ;;
        "Documentation") echo "c518b5c5" ;;
        *) return 1 ;;
    esac
}

get_priority_option_id() {
    case "$1" in
        "Critical") echo "7895227f" ;;
        "High") echo "a34b2b4e" ;;
        "Medium") echo "977453f1" ;;
        "Low") echo "e0c4c154" ;;
        *) return 1 ;;
    esac
}

get_project_type_option_id() {
    case "$1" in
        "Fixed Fee") echo "9537cb2c" ;;
        "Retainer") echo "8b369934" ;;
        "T&M") echo "0a368dfa" ;;
        "Internal") echo "7bfd393c" ;;
        *) return 1 ;;
    esac
}

get_client_option_id() {
    case "$1" in
        "BBCom") echo "aec0ac67" ;;
        "Razorvision") echo "6648ec8d" ;;
        *) return 1 ;;
    esac
}

validate_date() {
    if [[ ! "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        return 1
    fi
    return 0
}

validate_milestone() {
    local milestone_name="$1"
    # Try to find milestone by title - if not found, gh will error
    if gh api repos/"$REPO"/milestones --jq ".[] | select(.title == \"$milestone_name\") | .title" 2>/dev/null | grep -q "$milestone_name"; then
        return 0
    else
        echo "⚠️  Warning: Milestone '$milestone_name' not found in repository. Creating issue without milestone." >&2
        return 1
    fi
}


# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --title) TITLE="$2"; shift 2 ;;
        --body) BODY="$2"; shift 2 ;;
        --milestone) MILESTONE="$2"; shift 2 ;;
        --labels) LABELS="$2"; shift 2 ;;
        --parent-issue) PARENT_ISSUE="$2"; shift 2 ;;
        --issue-type) ISSUE_TYPE="$2"; shift 2 ;;
        --story-points) STORY_POINTS="$2"; shift 2 ;;
        --status) STATUS="$2"; shift 2 ;;
        --phase) PHASE="$2"; shift 2 ;;
        --agent-type) AGENT_TYPE="$2"; shift 2 ;;
        --priority) PRIORITY="$2"; shift 2 ;;
        --project-type) PROJECT_TYPE="$2"; shift 2 ;;
        --client) CLIENT="$2"; shift 2 ;;
        --sow-number) SOW_NUMBER="$2"; shift 2 ;;
        --start-date) START_DATE="$2"; shift 2 ;;
        --target-date) TARGET_DATE="$2"; shift 2 ;;
        --actual-date) ACTUAL_DATE="$2"; shift 2 ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
done

# Default issue type to Task if not specified
ISSUE_TYPE="${ISSUE_TYPE:-Task}"

# Validate required parameters
if [[ -z "$TITLE" || -z "$BODY" || -z "$LABELS" || \
      -z "$STORY_POINTS" || -z "$STATUS" || -z "$PHASE" || \
      -z "$AGENT_TYPE" || -z "$PRIORITY" ]]; then
    echo "Error: Missing required parameters"
    echo "Required: --title, --body, --labels, --story-points, --status, --phase, --agent-type, --priority"
    echo "Optional: --milestone, --parent-issue, --issue-type, --project-type, --client, --sow-number, --start-date, --target-date, --actual-date"
    exit 1
fi

# Validate option values
if ! get_status_option_id "$STATUS" > /dev/null; then
    echo "Error: Invalid status '$STATUS'. Must be one of: Backlog, Ready, In Progress, Review, Done"
    exit 1
fi

if ! get_phase_option_id "$PHASE" > /dev/null; then
    echo "Error: Invalid phase '$PHASE'. Must be one of: Foundation, Silver Layer, Looker, ADF Pipelines, Deployment, Testing, Documentation"
    exit 1
fi

if ! get_agent_type_option_id "$AGENT_TYPE" > /dev/null; then
    echo "Error: Invalid agent type '$AGENT_TYPE'. Must be one of: PM, Engineer, Architect, DevOps, Documentation"
    exit 1
fi

if ! get_priority_option_id "$PRIORITY" > /dev/null; then
    echo "Error: Invalid priority '$PRIORITY'. Must be one of: Critical, High, Medium, Low"
    exit 1
fi

# Validate optional parameters (if provided)
if [[ -n "$PROJECT_TYPE" ]] && ! get_project_type_option_id "$PROJECT_TYPE" > /dev/null; then
    echo "Error: Invalid project type '$PROJECT_TYPE'. Must be one of: Fixed Fee, Retainer, T&M, Internal"
    exit 1
fi

if [[ -n "$CLIENT" ]] && ! get_client_option_id "$CLIENT" > /dev/null; then
    echo "Error: Invalid client '$CLIENT'. Must be one of: BBCom, Razorvision"
    exit 1
fi

if [[ -n "$START_DATE" ]] && ! validate_date "$START_DATE"; then
    echo "Error: Invalid start date '$START_DATE'. Must be YYYY-MM-DD format"
    exit 1
fi

if [[ -n "$TARGET_DATE" ]] && ! validate_date "$TARGET_DATE"; then
    echo "Error: Invalid target date '$TARGET_DATE'. Must be YYYY-MM-DD format"
    exit 1
fi

if [[ -n "$ACTUAL_DATE" ]] && ! validate_date "$ACTUAL_DATE"; then
    echo "Error: Invalid actual date '$ACTUAL_DATE'. Must be YYYY-MM-DD format"
    exit 1
fi

echo "Creating issue..."
echo "  Title: $TITLE"
echo "  Milestone: $MILESTONE"
echo "  Labels: $LABELS"
echo "  Story Points: $STORY_POINTS"
echo "  Status: $STATUS"
echo "  Phase: $PHASE"
echo "  Agent Type: $AGENT_TYPE"
echo "  Priority: $PRIORITY"
if [[ -n "$PARENT_ISSUE" ]]; then
    echo "  Parent Issue: #$PARENT_ISSUE"
fi
if [[ -n "$PROJECT_TYPE" ]]; then
    echo "  Project Type: $PROJECT_TYPE"
fi
if [[ -n "$CLIENT" ]]; then
    echo "  Client: $CLIENT"
fi
if [[ -n "$SOW_NUMBER" ]]; then
    echo "  SOW Number: $SOW_NUMBER"
fi
if [[ -n "$START_DATE" ]]; then
    echo "  Start Date: $START_DATE"
fi
if [[ -n "$TARGET_DATE" ]]; then
    echo "  Target Date: $TARGET_DATE"
fi
if [[ -n "$ACTUAL_DATE" ]]; then
    echo "  Actual Date: $ACTUAL_DATE"
fi
echo ""

# Step 1: Create the issue
# Validate milestone if provided
MILESTONE_VALID=false
if [[ -n "$MILESTONE" ]]; then
    if validate_milestone "$MILESTONE"; then
        MILESTONE_VALID=true
    else
        # Milestone not found, proceed without it
        MILESTONE=""
    fi
fi

if [[ -n "$MILESTONE" && "$MILESTONE_VALID" == "true" ]]; then
    ISSUE_URL=$(gh issue create \
        --repo "$REPO" \
        --title "$TITLE" \
        --body "$BODY" \
        --milestone "$MILESTONE" \
        --label "$LABELS")
else
    ISSUE_URL=$(gh issue create \
        --repo "$REPO" \
        --title "$TITLE" \
        --body "$BODY" \
        --label "$LABELS")
fi

ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')
echo "✅ Issue created: #$ISSUE_NUMBER"

# Step 2: Get issue node ID and add to project
ISSUE_DATA=$(gh api graphql -f query="
query {
  repository(owner: \"$ORG\", name: \"dyn-01-data-warehouse\") {
    issue(number: $ISSUE_NUMBER) {
      id
    }
  }
}")

ISSUE_NODE_ID=$(echo "$ISSUE_DATA" | jq -r '.data.repository.issue.id')

# Add to project
ADD_RESULT=$(gh api graphql -f query="
mutation {
  addProjectV2ItemById(input: {
    projectId: \"$PROJECT_ID\"
    contentId: \"$ISSUE_NODE_ID\"
  }) {
    item {
      id
    }
  }
}")

PROJECT_ITEM_ID=$(echo "$ADD_RESULT" | jq -r '.data.addProjectV2ItemById.item.id')
echo "✅ Added to project (Item ID: $PROJECT_ITEM_ID)"

# Step 3: Set Story Points
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$STORY_POINTS_FIELD_ID\"
    value: { number: $STORY_POINTS }
  }) {
    projectV2Item { id }
  }
}" > /dev/null

echo "✅ Story Points set to $STORY_POINTS"

# Step 4: Set Status
STATUS_OPTION_ID=$(get_status_option_id "$STATUS")
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$STATUS_FIELD_ID\"
    value: { singleSelectOptionId: \"$STATUS_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null

echo "✅ Status set to $STATUS"

# Step 5: Set Phase
PHASE_OPTION_ID=$(get_phase_option_id "$PHASE")
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$PHASE_FIELD_ID\"
    value: { singleSelectOptionId: \"$PHASE_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null

echo "✅ Phase set to $PHASE"

# Step 6: Set Agent Type
AGENT_TYPE_OPTION_ID=$(get_agent_type_option_id "$AGENT_TYPE")
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$AGENT_TYPE_FIELD_ID\"
    value: { singleSelectOptionId: \"$AGENT_TYPE_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null

echo "✅ Agent Type set to $AGENT_TYPE"

# Step 7: Set Priority
PRIORITY_OPTION_ID=$(get_priority_option_id "$PRIORITY")
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$PRIORITY_FIELD_ID\"
    value: { singleSelectOptionId: \"$PRIORITY_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null

echo "✅ Priority set to $PRIORITY"

# Step 8: Set Project Type (if provided)
if [[ -n "$PROJECT_TYPE" ]]; then
    PROJECT_TYPE_OPTION_ID=$(get_project_type_option_id "$PROJECT_TYPE")
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$PROJECT_TYPE_FIELD_ID\"
    value: { singleSelectOptionId: \"$PROJECT_TYPE_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ Project Type set to $PROJECT_TYPE"
fi

# Step 9: Set Client (if provided)
if [[ -n "$CLIENT" ]]; then
    CLIENT_OPTION_ID=$(get_client_option_id "$CLIENT")
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$CLIENT_FIELD_ID\"
    value: { singleSelectOptionId: \"$CLIENT_OPTION_ID\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ Client set to $CLIENT"
fi

# Step 10: Set SOW Number (if provided)
if [[ -n "$SOW_NUMBER" ]]; then
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$SOW_NUMBER_FIELD_ID\"
    value: { text: \"$SOW_NUMBER\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ SOW Number set to $SOW_NUMBER"
fi

# Step 11: Set Start Date (if provided)
if [[ -n "$START_DATE" ]]; then
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$START_DATE_FIELD_ID\"
    value: { date: \"$START_DATE\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ Start Date set to $START_DATE"
fi

# Step 12: Set Target Date (if provided)
if [[ -n "$TARGET_DATE" ]]; then
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$TARGET_DATE_FIELD_ID\"
    value: { date: \"$TARGET_DATE\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ Target Date set to $TARGET_DATE"
fi

# Step 13: Set Actual Date (if provided)
if [[ -n "$ACTUAL_DATE" ]]; then
    gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: \"$PROJECT_ID\"
    itemId: \"$PROJECT_ITEM_ID\"
    fieldId: \"$ACTUAL_DATE_FIELD_ID\"
    value: { date: \"$ACTUAL_DATE\" }
  }) {
    projectV2Item { id }
  }
}" > /dev/null
    echo "✅ Actual Date set to $ACTUAL_DATE"
fi

# Step 14: Link to parent issue (if provided)
if [[ -n "$PARENT_ISSUE" ]]; then
    echo "Linking to parent issue #$PARENT_ISSUE..."

    # Get parent issue node ID
    PARENT_DATA=$(gh api graphql -f query="
query {
  repository(owner: \"$ORG\", name: \"dyn-01-data-warehouse\") {
    issue(number: $PARENT_ISSUE) {
      id
    }
  }
}")

    PARENT_NODE_ID=$(echo "$PARENT_DATA" | jq -r '.data.repository.issue.id')

    # Add sub-issue relationship
    gh api graphql -f query="
mutation {
  addSubIssue(input: {
    subIssueId: \"$ISSUE_NODE_ID\"
    issueId: \"$PARENT_NODE_ID\"
  }) {
    issue {
      number
    }
  }
}" > /dev/null

    echo "✅ Linked as sub-issue of #$PARENT_ISSUE"
fi

# Step 15: Set native GitHub issue type
ISSUE_TYPE_ID=""
case "$ISSUE_TYPE" in
    "Task") ISSUE_TYPE_ID="$TASK_TYPE_ID" ;;
    "Bug") ISSUE_TYPE_ID="$BUG_TYPE_ID" ;;
    "Feature") ISSUE_TYPE_ID="$FEATURE_TYPE_ID" ;;
    *) echo "⚠️  Warning: Invalid issue type '$ISSUE_TYPE', defaulting to Task"
       ISSUE_TYPE_ID="$TASK_TYPE_ID" ;;
esac

gh api graphql -H "GraphQL-Features: issue_types" -f query="
mutation {
  updateIssue(input: {
    id: \"$ISSUE_NODE_ID\"
    issueTypeId: \"$ISSUE_TYPE_ID\"
  }) {
    issue {
      issueType {
        name
      }
    }
  }
}" > /dev/null

echo "✅ Issue Type set to $ISSUE_TYPE"

echo ""
echo "🎉 Issue #$ISSUE_NUMBER created successfully with all properties set!"
echo "   URL: $ISSUE_URL"
echo "   Type: $ISSUE_TYPE"
if [[ -n "$PARENT_ISSUE" ]]; then
    echo "   Parent: #$PARENT_ISSUE"
fi
echo ""
