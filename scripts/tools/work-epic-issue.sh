#!/bin/bash
set -e

# work-epic-issue.sh
# Wrapper for epic issue workflow with GitHub integration
#
# Usage:
#   ./scripts/work-epic-issue.sh next [epic-number]
#   ./scripts/work-epic-issue.sh complete <issue-number> [epic-number]

COMMAND="$1"
shift

# Get project ID (DYN-002 BBCom Data Warehouse)
PROJECT_ID="PVT_kwDOALZa3M4BG1h9"

# Get status field option IDs
STATUS_TODO="bee1d1f1"        # Backlog
STATUS_READY="5a02e3ec"       # Ready
STATUS_IN_PROGRESS="47fc9ee4" # In Progress
STATUS_REVIEW="c3881e4f"      # Review
STATUS_DONE="98236657"        # Done

update_issue_status() {
    local issue_number=$1
    local status_name=$2
    local status_id=$3

    echo "📊 Updating GitHub project status to '${status_name}'..."

    # Get project item ID for this issue
    ITEM_ID=$(gh issue view "$issue_number" --json projectItems --jq ".projectItems[] | select(.title==\"DYN-002 BBCom Data Warehouse\") | .id")

    if [[ -z "$ITEM_ID" ]]; then
        echo "⚠️  Warning: Issue not in project, skipping status update"
        return
    fi

    # Note: Updating project v2 fields requires GraphQL which is complex
    # For now, we'll just echo the command needed
    echo "   Issue #${issue_number} → ${status_name}"
    echo "   (Manual update required via GitHub UI or GraphQL API)"
}

if [[ "$COMMAND" == "next" ]]; then
    # Get next issue
    ./scripts/track-epic-progress.sh next "$@"

    # Extract issue number from state file
    EPIC_NUMBER=$(./scripts/track-epic-progress.sh status "$@" 2>&1 | grep "In Progress" | grep -oE "#[0-9]+" | tr -d '#' || echo "")

    if [[ -n "$EPIC_NUMBER" ]]; then
        update_issue_status "$EPIC_NUMBER" "In Progress" "$STATUS_IN_PROGRESS"
        echo ""
        echo "🎯 Next: Implement issue #${EPIC_NUMBER}"
    fi

elif [[ "$COMMAND" == "complete" ]]; then
    ISSUE_NUMBER="$1"
    EPIC_NUMBER="$2"

    if [[ -z "$ISSUE_NUMBER" ]]; then
        echo "Error: Issue number required"
        echo "Usage: $0 complete <issue-number> [epic-number]"
        exit 1
    fi

    # Close the issue on GitHub
    echo "🔒 Closing GitHub issue #${ISSUE_NUMBER}..."
    COMMIT_SHA=$(git rev-parse --short HEAD)
    gh issue close "$ISSUE_NUMBER" --comment "Completed in commit ${COMMIT_SHA}. Part of Epic work."

    # Mark complete in tracker
    ./scripts/track-epic-progress.sh complete "$ISSUE_NUMBER" "$EPIC_NUMBER"

    # Status should auto-update to Done when issue is closed
    echo ""
    echo "✅ Issue #${ISSUE_NUMBER} closed and marked complete"

else
    echo "Error: Unknown command: $COMMAND"
    echo ""
    echo "Usage:"
    echo "  $0 next [epic-number]              Get next issue and mark in progress"
    echo "  $0 complete <issue> [epic-number]  Close issue and mark complete"
    exit 1
fi
