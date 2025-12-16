# Notion Status Report Automation - Setup Guide

## Overview

This guide walks you through setting up automated Notion status report generation and email delivery on Monday, Wednesday, and Friday at 8 AM CT.

## What Was Implemented

### New Files Created

1. **`scripts/fetch-notion-data.mjs`**
   - Fetches data from Notion database
   - Outputs JSON to `data/notion-raw.json`
   - Uses environment variables (no hardcoded credentials)

2. **`scripts/generate-report.mjs`**
   - Reads Notion JSON data
   - Filters for target clients (CBB, DLC, Wise Loan)
   - Categorizes issues by priority
   - Updates HTML report with fresh data
   - Preserves RazorVision branding

3. **`scripts/send-email.mjs`**
   - Sends HTML report via Gmail API
   - Authenticates using OAuth refresh token
   - Supports comma-separated recipient list

4. **`scripts/gmail-oauth-helper.mjs`**
   - Interactive script for Gmail OAuth setup
   - One-time run to generate refresh token

5. **`.github/workflows/notion-status-report.yml`**
   - Scheduled workflow (Mon/Wed/Fri at 8 AM CT = 2 PM UTC)
   - Fetches Notion data → Generates report → Creates PR

6. **`.github/workflows/send-status-email.yml`**
   - Triggered on PR merge
   - Sends email to recipients after manual review

### Files Updated

1. **`scripts/fetch-notion-data.mjs` → `scripts/fetch-notion-data.mjs`**
   - Moved from root directory to scripts/
   - Removed hardcoded Notion token (security fix)
   - Now reads from environment variables
   - Outputs JSON for pipeline processing

2. **`.env.example`**
   - Added Notion integration variables
   - Added Gmail OAuth variables
   - Added email recipients variable

3. **`package.json`**
   - Added `googleapis@^128.0.0`
   - Added `dotenv@^16.0.0`

---

## Setup Steps

### Step 1: Local Development (Optional but Recommended)

Before deploying to GitHub Actions, test locally:

```bash
# Install dependencies
npm install

# Create .env file for local testing
cp .env.example .env.local

# Add your Notion credentials
NOTION_API_TOKEN=ntn_V30610709989EaTDaFWA3KzC80kz2nFlw7r2yjofguRfjz
NOTION_DATABASE_ID=23c0b6743c9680cbbe3cc83f47774509
```

Test the Notion fetch:
```bash
node scripts/fetch-notion-data.mjs
```

This should create `data/notion-raw.json` with Notion data.

### Step 2: Gmail OAuth Setup

This is a one-time setup process.

#### 2a. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name: "RazorVision Status Reports")
3. Enable the Gmail API:
   - Search for "Gmail API"
   - Click "Enable"

#### 2b. Create OAuth 2.0 Credentials

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → OAuth 2.0 Client ID
3. Application type: Desktop application
4. Click "Create"
5. Download the credentials JSON file (or note the Client ID and Secret)

#### 2c. Generate Refresh Token

```bash
# Run the interactive helper script
node scripts/gmail-oauth-helper.mjs

# Or pass credentials as arguments
node scripts/gmail-oauth-helper.mjs --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
```

Follow the prompts:
1. Visit the Google authorization URL (opens in browser)
2. Grant permissions to "RazorVision Status Bot"
3. Copy the authorization code from the redirect URL
4. Paste the code into the script
5. The script will display your credentials

Save the output! You'll need it for GitHub.

### Step 3: Add GitHub Secrets

1. Go to your repository: https://github.com/razorvision/RV_2.0
2. Settings → Secrets and variables → Actions
3. Add these secrets:

| Secret Name | Value | Source |
|---|---|---|
| `NOTION_API_TOKEN` | `ntn_V30610709989EaTDaFWA3KzC80kz2nFlw7r2yjofguRfjz` | Your existing Notion token |
| `NOTION_DATABASE_ID` | `23c0b6743c9680cbbe3cc83f47774509` | Your Notion database ID |
| `GMAIL_CLIENT_ID` | From Step 2c output | Gmail OAuth credentials |
| `GMAIL_CLIENT_SECRET` | From Step 2c output | Gmail OAuth credentials |
| `GMAIL_REFRESH_TOKEN` | From Step 2c output | Generated refresh token |
| `EMAIL_RECIPIENTS` | `boss@example.com,manager@example.com` | Comma-separated email list |

### Step 4: Test the Workflows

#### Test Report Generation

1. Go to Actions → "Generate Notion Status Report"
2. Click "Run workflow" (workflow_dispatch button)
3. Wait for it to complete
4. Check the created PR for the generated report
5. Review the content for accuracy
6. Merge the PR to trigger email sending

#### Test Email Sending

1. After merging the test PR from Step 4, check the second workflow
2. Go to Actions → "Send Status Report Email"
3. Verify the email was sent successfully (check workflow logs)
4. Verify receipt of the email at recipients' addresses

---

## Configuration

### Changing Email Recipients

**Option A: Update GitHub Secret**
1. Go to Settings → Secrets and variables → Actions
2. Click on `EMAIL_RECIPIENTS`
3. Update the value (comma-separated emails)
4. Save

**Option B: Update Environment Variable Locally**
Edit `.env.local`:
```env
EMAIL_RECIPIENTS=user1@example.com,user2@example.com,user3@example.com
```

### Changing Report Schedule

To change when reports are generated (currently Mon/Wed/Fri at 2 PM UTC / 8 AM CT):

Edit `.github/workflows/notion-status-report.yml`:
```yaml
on:
  schedule:
    - cron: '0 14 * * 1,3,5'  # Change this line
    # Format: minute hour day-of-month month day-of-week
    # Examples:
    # '0 14 * * 1,3,5'  = Mon/Wed/Fri at 2 PM UTC (8 AM CT)
    # '0 9 * * 1,3,5'   = Mon/Wed/Fri at 9 AM UTC (3 AM CT)
    # '0 16 * * *'      = Every day at 4 PM UTC (10 AM CT)
```

### Changing Target Clients

Currently filters for: CBB, DLC, Wise Loan (excludes RV 2.0 internal projects)

Edit `scripts/generate-report.mjs`:
```javascript
// Line ~28
const TARGET_CLIENTS = ['CBB', 'DLC', 'Wise Loan'];  // Modify this list
```

### Adding Custom Report Sections

The report HTML structure is preserved. To add custom sections or modify layout:

Edit `NOTION_PROJECT_STATUS.html` (header, footer, CSS styling)

The content area is automatically updated by the scripts.

---

## Troubleshooting

### "Missing required environment variables"

**Cause:** Environment variables not set or file doesn't exist

**Fix:**
1. Verify `.env.local` file exists with all required variables
2. Run `npm install` to ensure dependencies are installed
3. Check that `NOTION_API_TOKEN` and `NOTION_DATABASE_ID` are set
4. For GitHub Actions, verify secrets are added in Settings

### Workflow fails to fetch Notion data

**Cause:** Invalid token or database ID

**Fix:**
1. Test locally: `node scripts/fetch-notion-data.mjs`
2. Check error message for specific API issue
3. Verify Notion integration is shared with the database
4. Regenerate credentials if needed

### Email not sending

**Cause:** Gmail OAuth credentials invalid or recipients not specified

**Fix:**
1. Verify `EMAIL_RECIPIENTS` secret is set
2. Run `node scripts/gmail-oauth-helper.mjs` to regenerate refresh token
3. Update GitHub secrets with new credentials
4. Check workflow logs for specific error

### Report content looks wrong

**Cause:** Notion data structure changed or filtering logic issue

**Fix:**
1. Check `data/notion-raw.json` to see what Notion returned
2. Verify items have required fields (Name, Status, Priority, Client)
3. Review `scripts/generate-report.mjs` filtering logic
4. Ensure target clients match items in Notion

### "Could not find page" error

**Cause:** Using page ID instead of database ID

**Fix:**
- Verify `NOTION_DATABASE_ID` is the database ID, not a page ID
- Database IDs are in URLs like: `/23c0b6743c9680cbbe3cc83f47774509`

---

## Monitoring

### View Workflow Runs

1. Go to Actions in your repository
2. Click on a workflow to see run history
3. Click on a specific run to see logs
4. Each workflow step outputs status and results

### Check Email Delivery

1. After PR merge, check the "Send Status Report Email" workflow
2. Look for success message with message ID
3. Verify emails arrived in recipients' inboxes
4. Check spam folder if not found

### View Raw Notion Data

The script outputs JSON for debugging:

```bash
cat data/notion-raw.json | jq '.items | length'  # Count items
cat data/notion-raw.json | jq '.items[0]'        # View first item
```

---

## Manual Workflow Triggers

Anytime you want to test or manually run the workflows:

1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow" dropdown
4. Click "Run workflow" button

This is useful for:
- Testing changes before they're scheduled
- Generating reports on-demand
- Debugging issues

---

## Security Notes

✅ **What's secure:**
- No hardcoded tokens (all in environment variables)
- Notion token stored as GitHub Secret
- Gmail OAuth tokens stored securely
- Manual approval before email sending

⚠️ **What to watch:**
- Don't commit `.env.local` file (add to `.gitignore`)
- Don't share refresh tokens (regenerate if compromised)
- Regularly audit GitHub Secrets
- Monitor email recipients list

---

## Next Steps

1. Complete Gmail OAuth setup (Step 2)
2. Add GitHub Secrets (Step 3)
3. Test workflows (Step 4)
4. First automated run will be Monday at 8 AM CT

For questions or issues, check the troubleshooting section or review workflow logs.

---

**Last Updated:** December 16, 2025
**Implementation Date:** December 16, 2025
