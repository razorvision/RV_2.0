# Notion Status Report Automation

## Overview

Automated system to fetch Notion database updates, generate branded HTML status reports, and send via Gmail on Monday/Wednesday/Friday mornings.

## Architecture

```
GitHub Actions (Scheduled: M/W/F 8 AM)
    ↓
1. Fetch Notion Data (fetch-notion-data.mjs)
    ↓
2. Generate HTML Report (generate-report.mjs)
    ↓
3. Create PR with Generated Report
    ↓
4. Manual Review & Approval
    ↓
5. On PR Merge → Send Email (send-email.mjs)
```

## Components

### 1. GitHub Actions Workflow

**File:** `.github/workflows/notion-status-report.yml`

**Schedule:**
- Monday, Wednesday, Friday at 8:00 AM UTC
- Cron: `0 8 * * 1,3,5`

**Steps:**
1. Checkout repository
2. Setup Node.js 18+
3. Install dependencies
4. Run Notion data fetch
5. Generate HTML report
6. Create PR with updated report
7. Add comment with HTML preview

**Secrets Required:**
- `NOTION_API_TOKEN` - Notion internal integration token
- `GMAIL_CLIENT_ID` - Gmail API OAuth client ID (for email sending workflow)
- `GMAIL_CLIENT_SECRET` - Gmail API OAuth client secret
- `GMAIL_REFRESH_TOKEN` - Gmail API refresh token

### 2. Configuration Files

**`.env.example` additions:**
```env
# Notion Integration
NOTION_API_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=23c0b6743c9680cbbe3cc83f47774509

# Gmail API (OAuth 2.0)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# Email Recipients (comma-separated)
EMAIL_RECIPIENTS=boss@razorvision.net,manager@razorvision.net
```

**`config/email-recipients.json`:**
```json
{
  "recipients": [
    {
      "name": "Boss Name",
      "email": "boss@razorvision.net",
      "type": "to"
    },
    {
      "name": "Manager Name",
      "email": "manager@razorvision.net",
      "type": "cc"
    }
  ],
  "from": {
    "name": "RazorVision Status Bot",
    "email": "status@razorvision.net"
  },
  "subject": "Product Status Update - {{date}}"
}
```

### 3. Scripts

#### `scripts/fetch-notion-data.mjs`

**Updates Needed:**
- Remove hardcoded `NOTION_TOKEN` and `PAGE_ID`
- Read from environment variables
- Add error handling for missing credentials
- Output JSON to `data/notion-raw.json` for next step

**Changes:**
```javascript
// Before:
const NOTION_TOKEN = 'ntn_V30610709989EaTDaFWA3KzC80kz2nFlw7r2yjofguRfjz';
const PAGE_ID = '23c0b6743c9680cbbe3cc83f47774509';

// After:
import { config } from 'dotenv';
config();

const NOTION_TOKEN = process.env.NOTION_API_TOKEN;
const PAGE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !PAGE_ID) {
  console.error('Missing required environment variables: NOTION_API_TOKEN, NOTION_DATABASE_ID');
  process.exit(1);
}
```

#### `scripts/generate-report.mjs` (NEW)

**Purpose:** Generate HTML report from Notion data

**Inputs:**
- `data/notion-raw.json` (from fetch-notion-data.mjs)
- `templates/status-report-template.html` (HTML template with placeholders)

**Outputs:**
- `NOTION_PROJECT_STATUS.html` (generated report)

**Logic:**
1. Read notion-raw.json
2. Parse and categorize issues by priority (URGENT, HIGH, MEDIUM, LOW)
3. Group by client (CBB, DLC, Wise Loan)
4. Filter out RV 2.0 internal items
5. Inject into HTML template
6. Write final HTML file

#### `scripts/send-email.mjs` (NEW)

**Purpose:** Send HTML email via Gmail API

**Inputs:**
- `NOTION_PROJECT_STATUS.html` (report file)
- `config/email-recipients.json` (recipient list)

**Gmail API Flow:**
1. Authenticate using OAuth 2.0 refresh token
2. Read HTML report
3. Construct MIME message with HTML body
4. Send via Gmail API (`gmail.users.messages.send`)

**Dependencies:**
```json
{
  "googleapis": "^128.0.0",
  "dotenv": "^16.0.0"
}
```

### 4. GitHub Actions Workflows

#### Workflow 1: Generate Report (Scheduled)

**File:** `.github/workflows/notion-status-report.yml`

```yaml
name: Generate Notion Status Report

on:
  schedule:
    - cron: '0 8 * * 1,3,5'  # Mon/Wed/Fri 8 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Fetch Notion data
        run: node scripts/fetch-notion-data.mjs
        env:
          NOTION_API_TOKEN: ${{ secrets.NOTION_API_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}

      - name: Generate HTML report
        run: node scripts/generate-report.mjs

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: 'chore: Update Notion status report'
          title: 'Status Report - ${{ github.event.repository.updated_at }}'
          body: |
            ## Automated Status Report

            This PR contains the latest Notion project status report.

            **Generated:** ${{ github.event.repository.updated_at }}
            **Schedule:** Monday/Wednesday/Friday 8 AM UTC

            ### Review Checklist
            - [ ] Report content looks accurate
            - [ ] No internal RV 2.0 items included
            - [ ] All client issues categorized correctly
            - [ ] Ready to send to stakeholders

            **Merge this PR to trigger email sending.**
          branch: automated-status-report
          delete-branch: true
```

#### Workflow 2: Send Email (On PR Merge)

**File:** `.github/workflows/send-status-email.yml`

```yaml
name: Send Status Report Email

on:
  pull_request:
    types: [closed]
    branches: [master]

jobs:
  send-email:
    if: |
      github.event.pull_request.merged == true &&
      startsWith(github.event.pull_request.title, 'Status Report')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Send email via Gmail API
        run: node scripts/send-email.mjs
        env:
          GMAIL_CLIENT_ID: ${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: ${{ secrets.GMAIL_CLIENT_SECRET }}
          GMAIL_REFRESH_TOKEN: ${{ secrets.GMAIL_REFRESH_TOKEN }}
          EMAIL_RECIPIENTS: ${{ secrets.EMAIL_RECIPIENTS }}
```

## Implementation Steps

1. **Move existing files to proper locations**
   - `fetch-notion-data.mjs` → `scripts/fetch-notion-data.mjs`
   - `NOTION_PROJECT_STATUS.html` → `templates/status-report-template.html` (convert to template)

2. **Update fetch-notion-data.mjs**
   - Replace hardcoded credentials with environment variables
   - Add JSON output to `data/notion-raw.json`

3. **Create generate-report.mjs script**
   - Parse Notion data
   - Apply filtering (remove RV 2.0 items)
   - Inject into HTML template
   - Output final report

4. **Create send-email.mjs script**
   - Gmail API OAuth setup
   - Read recipients from config
   - Send HTML email

5. **Create GitHub Actions workflows**
   - Scheduled report generation workflow
   - Email sending on PR merge workflow

6. **Setup Gmail API credentials**
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Generate refresh token
   - Add secrets to GitHub repository

7. **Update .env.example**
   - Add all new environment variables
   - Document each variable

8. **Create email-recipients.json config**
   - Make it easy to edit without touching code
   - Support To/CC/BCC fields

9. **Test workflow**
   - Manual trigger first run
   - Verify PR creation
   - Test email sending after merge

## Gmail API Setup Guide

### 1. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project: "RazorVision Status Reports"
3. Enable Gmail API

### 2. Create OAuth 2.0 Credentials
1. Navigate to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Desktop app
4. Download credentials JSON

### 3. Generate Refresh Token
Use this Node.js script to generate refresh token:

```javascript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000/callback'
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send']
});

console.log('Visit this URL:', authUrl);
// Follow URL, authorize, get code from callback
// Exchange code for tokens:
const { tokens } = await oauth2Client.getToken('AUTH_CODE_FROM_CALLBACK');
console.log('Refresh token:', tokens.refresh_token);
```

### 4. Add Secrets to GitHub
1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `NOTION_API_TOKEN`
   - `NOTION_DATABASE_ID`
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REFRESH_TOKEN`
   - `EMAIL_RECIPIENTS` (comma-separated emails)

## Configuration Management

### Easy Editing Without Code Changes

**Recipients List:**
Edit `config/email-recipients.json` and commit changes. Workflow picks up new recipients on next run.

**Notion Database:**
Update `NOTION_DATABASE_ID` GitHub secret via Settings → Secrets → Actions.

**Schedule:**
Edit cron expression in `.github/workflows/notion-status-report.yml`:
```yaml
on:
  schedule:
    - cron: '0 8 * * 1,3,5'  # Change days/time here
```

## Monitoring & Debugging

### View Workflow Runs
https://github.com/razorvision/RV_2.0/actions

### Check Logs
Each workflow step logs output. Check for errors in:
- Notion API fetch
- HTML generation
- Email sending

### Manual Trigger
All workflows support `workflow_dispatch` for manual testing.

### Test Email Without PR
Run send-email.mjs locally:
```bash
node scripts/send-email.mjs
```

## Security Considerations

1. **Never commit secrets** - All credentials in GitHub Secrets or `.env` (gitignored)
2. **Gmail API OAuth** - More secure than SMTP with app passwords
3. **Least privilege** - Gmail API scope limited to `gmail.send` only
4. **Audit trail** - All emails triggered by PR merges (tracked in GitHub)

## Future Enhancements

1. **Remove manual approval** - Direct email sending on schedule (optional toggle)
2. **Slack notifications** - Post summary to Slack channel
3. **Report history** - Archive past reports in S3 or GitHub Pages
4. **Multi-format** - Generate PDF version alongside HTML
5. **Analytics** - Track issue trends over time
6. **Custom filters** - Allow filtering by client, priority, status in config

---

**Last Updated:** December 16, 2025
**Author:** RazorVision Development Team
