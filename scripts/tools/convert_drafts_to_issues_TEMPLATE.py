#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Project Draft Issues to Real Issues Converter
====================================================

This script bulk converts GitHub Project V2 draft issues to real repository issues.
Uses GitHub GraphQL API via the gh CLI tool.

SETUP INSTRUCTIONS:
===================

1. Prerequisites:
   - Install GitHub CLI: https://cli.github.com/
   - Authenticate: gh auth login
   - Python 3.6+

2. Get Your Project ID:
   For organization projects:
   gh api graphql -f query='
   {
     organization(login: "YOUR_ORG") {
       projectV2(number: PROJECT_NUMBER) {
         id
       }
     }
   }'

   For user projects:
   gh api graphql -f query='
   {
     user(login: "YOUR_USERNAME") {
       projectV2(number: PROJECT_NUMBER) {
         id
       }
     }
   }'

3. Update the configuration below with your values

4. Run: python convert_drafts_to_issues_TEMPLATE.py

"""

import subprocess
import json
import sys
import time
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


# ============================================================================
# CONFIGURATION - UPDATE THESE VALUES FOR EACH CLIENT
# ============================================================================

# Project ID (get this from the GraphQL query above)
PROJECT_ID = "PVT_kwDOALZa3M4BIkNl"  # REPLACE WITH YOUR PROJECT ID

# Repository information (format: "owner/repo-name")
REPO_OWNER = "razorvision"  # REPLACE WITH REPOSITORY OWNER
REPO_NAME = "wiseloan-core"  # REPLACE WITH REPOSITORY NAME
REPO_ID = f"{REPO_OWNER}/{REPO_NAME}"

# Project URL for final summary (optional, for display only)
# Format: https://github.com/orgs/ORG_NAME/projects/PROJECT_NUMBER
# or: https://github.com/users/USERNAME/projects/PROJECT_NUMBER
PROJECT_URL = "https://github.com/orgs/razorvision/projects/18"  # REPLACE WITH YOUR PROJECT URL

# Rate limiting configuration (adjust if you hit rate limits)
BATCH_SIZE = 10  # Process this many issues before pausing
DELAY_BETWEEN_BATCHES = 2  # Seconds to wait between batches

# ============================================================================
# END CONFIGURATION
# ============================================================================


def run_gh_command(query):
    """Execute a GitHub CLI GraphQL query."""
    try:
        result = subprocess.run(
            ["gh", "api", "graphql", "-f", f"query={query}"],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            check=True
        )
        if result.stdout:
            return json.loads(result.stdout)
        return None
    except subprocess.CalledProcessError as e:
        print(f"Error running gh command: {e.stderr}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None


def get_repository_id():
    """Get the repository node ID from GitHub."""
    query = f"""
    {{
      repository(owner: "{REPO_OWNER}", name: "{REPO_NAME}") {{
        id
      }}
    }}
    """
    result = run_gh_command(query)
    if result and "data" in result:
        return result["data"]["repository"]["id"]
    return None


def get_draft_issues(cursor=None):
    """Fetch draft issues from the project."""
    after_clause = f', after: "{cursor}"' if cursor else ""

    query = f"""
    {{
      node(id: "{PROJECT_ID}") {{
        ... on ProjectV2 {{
          items(first: 100{after_clause}) {{
            pageInfo {{
              hasNextPage
              endCursor
            }}
            nodes {{
              id
              type
              content {{
                ... on DraftIssue {{
                  title
                  body
                }}
                ... on Issue {{
                  id
                  title
                }}
              }}
            }}
          }}
        }}
      }}
    }}
    """

    result = run_gh_command(query)
    if result and "data" in result:
        return result["data"]["node"]["items"]
    return None


def convert_draft_to_issue(item_id, title, body, repo_id):
    """Convert a draft issue to a real issue."""
    # Escape quotes in title and body for GraphQL
    title_escaped = title.replace('"', '\\"').replace('\n', ' ')
    body_escaped = (body or "").replace('"', '\\"').replace('\n', '\\n') if body else ""

    mutation = f"""
    mutation {{
      convertProjectV2DraftIssueItemToIssue(
        input: {{
          itemId: "{item_id}"
          repositoryId: "{repo_id}"
        }}
      ) {{
        item {{
          id
        }}
      }}
    }}
    """

    result = run_gh_command(mutation)
    return result is not None and "data" in result


def main():
    print("=" * 70)
    print("🚀 GitHub Project Draft Issues → Real Issues Converter")
    print("=" * 70)
    print(f"Project ID: {PROJECT_ID}")
    print(f"Target Repository: {REPO_ID}")
    print(f"Project URL: {PROJECT_URL}\n")

    # Step 1: Get repository ID
    print("📦 Step 1/3: Getting repository ID...")
    repo_id = get_repository_id()
    if not repo_id:
        print("❌ Failed to get repository ID")
        print("\n💡 Troubleshooting:")
        print("   1. Check that REPO_OWNER and REPO_NAME are correct")
        print("   2. Ensure you have access to the repository")
        print("   3. Verify gh CLI is authenticated: gh auth status")
        sys.exit(1)
    print(f"✅ Repository ID: {repo_id}\n")

    # Step 2: Fetch all draft issues
    print("📋 Step 2/3: Fetching draft issues...")
    all_drafts = []
    cursor = None
    page = 1

    while True:
        print(f"   Fetching page {page}...")
        items_data = get_draft_issues(cursor)

        if not items_data:
            print("❌ Failed to fetch draft issues")
            print("\n💡 Troubleshooting:")
            print("   1. Check that PROJECT_ID is correct")
            print("   2. Ensure you have access to the project")
            print("   3. Verify the project exists and has draft issues")
            sys.exit(1)

        # Filter only draft issues
        for item in items_data["nodes"]:
            if item["type"] == "DRAFT_ISSUE":
                all_drafts.append({
                    "id": item["id"],
                    "title": item["content"]["title"],
                    "body": item["content"].get("body", "")
                })

        if not items_data["pageInfo"]["hasNextPage"]:
            break

        cursor = items_data["pageInfo"]["endCursor"]
        page += 1

    total_drafts = len(all_drafts)
    print(f"\n✅ Found {total_drafts} draft issues to convert\n")

    if total_drafts == 0:
        print("✨ No draft issues found. All done!")
        return

    # Step 3: Convert drafts
    print(f"⚠️  About to convert {total_drafts} drafts to real issues in {REPO_ID}")
    print("✅ Auto-confirmed - starting conversion...\n")

    print(f"🔄 Step 3/3: Converting drafts (batch size: {BATCH_SIZE})...\n")
    success_count = 0
    error_count = 0

    for i, draft in enumerate(all_drafts, 1):
        # Truncate long titles for display
        display_title = draft['title'][:60] + "..." if len(draft['title']) > 60 else draft['title']
        print(f"[{i}/{total_drafts}] Converting: {display_title}")

        if convert_draft_to_issue(draft["id"], draft["title"], draft["body"], repo_id):
            success_count += 1
            print(f"   ✅ Success")
        else:
            error_count += 1
            print(f"   ❌ Failed")

        # Delay between batches to avoid rate limits
        if i % BATCH_SIZE == 0 and i < total_drafts:
            print(f"\n⏸️  Pausing {DELAY_BETWEEN_BATCHES}s to avoid rate limits...\n")
            time.sleep(DELAY_BETWEEN_BATCHES)

    # Summary
    print(f"\n{'='*70}")
    print(f"✨ Conversion Complete!")
    print(f"{'='*70}")
    print(f"✅ Successfully converted: {success_count}")
    if error_count > 0:
        print(f"❌ Failed: {error_count}")
    print(f"📊 Total processed: {total_drafts}")
    print(f"\n🔗 View project: {PROJECT_URL}")
    print(f"🔗 View repository: https://github.com/{REPO_ID}/issues")


if __name__ == "__main__":
    main()
