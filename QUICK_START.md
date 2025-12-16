# Quick Start - Notion Status Report Automation

## 5-Minute Overview

Your status report automation is **ready to deploy**. Here's what to do next:

## Step 1: Gmail OAuth Setup (10 minutes)

You only do this once.

```bash
# Run the interactive setup
node scripts/gmail-oauth-helper.mjs
```

**What it does:**
1. Opens a Google authorization URL in your browser
2. You grant permissions
3. It generates a refresh token
4. Displays all credentials you need

**Save the output!** You'll need it for GitHub.

## Step 2: Add GitHub Secrets (5 minutes)

1. Go to: https://github.com/razorvision/RV_2.0/settings/secrets/actions
2. Click "New repository secret" 6 times and add:

| Name | Value |
|------|-------|
| `NOTION_API_TOKEN` | `ntn_V30610709989EaTDaFWA3KzC80kz2nFlw7r2yjofguRfjz` |
| `NOTION_DATABASE_ID` | `23c0b6743c9680cbbe3cc83f47774509` |
| `GMAIL_CLIENT_ID` | (from Step 1 output) |
| `GMAIL_CLIENT_SECRET` | (from Step 1 output) |
| `GMAIL_REFRESH_TOKEN` | (from Step 1 output) |
| `EMAIL_RECIPIENTS` | `boss@example.com,other@example.com` |

## Step 3: Test It (5 minutes)

1. Go to: https://github.com/razorvision/RV_2.0/actions
2. Click: "Generate Notion Status Report"
3. Click: "Run workflow" button
4. Wait ~1 minute for it to complete
5. You'll see a new PR with the generated report
6. Review the content
7. Click "Merge pull request"
8. The email workflow will trigger automatically

## Done! ✅

Your automation is now live:

- **Every Monday, Wednesday, Friday at 8 AM CT:**
  - Notion data is fetched
  - Report is generated
  - PR is created for your review

- **When you merge the PR:**
  - Email is sent to recipients

## Configuration

### Change Email Recipients

GitHub Secrets → `EMAIL_RECIPIENTS` → Edit

Examples:
```
boss@example.com
boss@example.com,manager@example.com
team@example.com,external@client.com
```

### Change Report Schedule

Edit: `.github/workflows/notion-status-report.yml`

Line 6-8:
```yaml
on:
  schedule:
    - cron: '0 14 * * 1,3,5'  # Mon/Wed/Fri at 2 PM UTC (8 AM CT)
```

Other options:
```
'0 9 * * 1,3,5'   = Mon/Wed/Fri at 9 AM UTC (3 AM CT)
'0 14 * * *'      = Every day at 2 PM UTC (8 AM CT)
'30 8 * * 1,3,5'  = Mon/Wed/Fri at 8:30 AM UTC
```

### Manually Generate Report Anytime

Go to Actions → "Generate Notion Status Report" → "Run workflow"

This lets you test changes or generate reports on-demand.

## Files You Need to Know

| File | Purpose |
|------|---------|
| `NOTION_PROJECT_STATUS.html` | Generated report (auto-updated) |
| `.github/workflows/notion-status-report.yml` | Schedule & generation logic |
| `.github/workflows/send-status-email.yml` | Email sending logic |
| `docs/automation/NOTION_STATUS_AUTOMATION_SETUP.md` | Full documentation |

## Troubleshooting

### "Missing environment variables" error

→ Verify all 6 GitHub Secrets are added (Section: Step 2)

### Workflow failed to fetch Notion data

→ Check Notion token is correct in GitHub Secrets

### Email not sending

→ Verify `EMAIL_RECIPIENTS` secret is set

### For detailed troubleshooting

→ See: `docs/automation/NOTION_STATUS_AUTOMATION_SETUP.md`

## Support

All documentation is in `docs/automation/`:
- `NOTION_STATUS_AUTOMATION_SETUP.md` - Complete setup guide
- `NOTION_STATUS_AUTOMATION.md` - Architecture & reference

---

**That's it!** Your automation is ready. Go to Step 1 to get started.
