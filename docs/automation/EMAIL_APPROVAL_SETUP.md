# Email Approval Flow Setup Guide

This guide walks you through setting up the email-based approval flow for the Notion status report automation.

**What it does:** When your status report is ready, you get a test email with an "✅ Approve & Send" button at the top. Click the button to instantly trigger the final send to all recipients.

**Architecture:**
- Test email with approval button → Click button → Vercel function processes approval → GitHub workflow triggers final send

---

## Prerequisites

- GitHub repository with Notion status report automation already set up
- Vercel account (free tier works fine)
- The status report workflow already running and creating PRs

---

## Step 1: Deploy the Approval Handler to Vercel

The approval handler is a serverless function that processes approval clicks.

### 1.1 Create a Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click "Add New" → "Project"
4. Select your `RV_2.0` repository
5. Click "Import"
6. Leave all settings default
7. Click "Deploy"

**Save your deployment URL** (looks like: `https://rv-2-0.vercel.app`)

### 1.2 Verify Files Are in Place

After Vercel deploys, the approval handler should be automatically available at:
```
https://your-deployment-url.vercel.app/api/approve
```

The file `api/approve.js` already exists in your repository, so Vercel will automatically create this endpoint.

---

## Step 2: Generate an Approval Token Secret

This secret signs the approval links so only legitimate requests work.

Open your terminal and run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the output - this is your `APPROVAL_TOKEN_SECRET`.

---

## Step 3: Add GitHub Secrets

The workflow needs these secrets to include the approval button in emails.

### 3.1 Go to GitHub Secrets

1. Open your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2 Add Three Secrets

Add these exactly:

**Secret 1: `APPROVAL_TOKEN_SECRET`**
- Name: `APPROVAL_TOKEN_SECRET`
- Value: (paste the secret you generated in Step 2)
- Click "Add secret"

**Secret 2: `VERCEL_DEPLOYMENT_URL`**
- Name: `VERCEL_DEPLOYMENT_URL`
- Value: `https://your-deployment-url.vercel.app` (from Step 1.1)
- Click "Add secret"

**Secret 3: `GITHUB_TOKEN`** (if not already present)
- Name: `GITHUB_TOKEN`
- Value: Your GitHub Personal Access Token (or use the built-in `${{ secrets.GITHUB_TOKEN }}` from Actions)
  - If you need to create one: Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Needs `repo` and `workflow` permissions
- Click "Add secret"

---

## Step 4: Test the Flow

### 4.1 Trigger the Workflow Manually

1. Go to your GitHub repository
2. Click **Actions**
3. Select the **Notion Status Report** workflow (or **notion-status-report**)
4. Click **Run workflow** (if you don't see this button, it means the workflow needs a manual dispatch input)
5. Click **Run workflow** to start

### 4.2 Check the PR

1. After a minute or two, the workflow should create a PR
2. Merge the PR by clicking **Merge pull request**
3. Confirm merge

### 4.3 Check Your Email

1. The **Send Status Report Email** workflow should automatically trigger
2. **Check your inbox** for an email with subject `[TEST] Product Status Update - [DATE]`
3. Look for the green approval button at the top that says **"✅ Approve & Send"**

### 4.4 Click the Approval Button

1. **Click the green button** in the email
2. This opens a Vercel function that:
   - Validates your approval link
   - Triggers the final email send to all recipients
   - Shows a confirmation page

3. **Check your inbox again** - you should see the final email sent to all recipients in `EMAIL_RECIPIENTS`

---

## Troubleshooting

### ❌ No approval button in test email

**Cause:** The environment variables weren't passed correctly.

**Fix:**
1. Check the workflow logs: GitHub → Actions → Workflow run → "Send test email to me" step
2. Look for error messages about missing environment variables
3. Verify all three secrets are added correctly in GitHub Settings → Secrets and variables → Actions
4. Workflow file has the variables - if you still see errors, re-run the workflow after adding secrets

### ❌ Clicking button shows "Approval Failed"

**Cause:** The approval link token is invalid or expired.

**Fix:**
1. Make sure `APPROVAL_TOKEN_SECRET` matches between:
   - GitHub Secrets
   - Your local `.env` (if testing locally)
2. Token expires in 24 hours - if it's been more than 24 hours, trigger a new test email
3. Check Vercel logs: go to Vercel → Project → Deployments → Latest → Logs

### ❌ "Failed to send status report email" in PR comment

**Cause:** Approval triggered but final send failed.

**Fix:**
1. Check the workflow run logs in GitHub Actions
2. Verify `GMAIL_FROM_EMAIL`, `GMAIL_APP_PASSWORD`, and `EMAIL_RECIPIENTS` are configured
3. Make sure Gmail app password is correct (16 characters, spaces matter)
4. Check that `EMAIL_RECIPIENTS` is a valid comma-separated list

### ❌ Approval button URL looks wrong

**Cause:** `VERCEL_DEPLOYMENT_URL` has incorrect format.

**Fix:**
- Should be: `https://your-project.vercel.app` (no trailing slash)
- Should NOT be: `https://your-project.vercel.app/` (trailing slash causes issues)

---

## How It Works (Technical Details)

### Email Button Click Flow

```
1. You receive test email with button:
   📧 [TEST] Product Status Update - Dec 16, 2024
   ✅ Approve & Send
   (links to: https://your-vercel.app/api/approve?token=ABC123&run_id=456)

2. You click the button

3. Vercel function receives the click:
   - Validates token (uses APPROVAL_TOKEN_SECRET to verify signature)
   - Checks run_id matches the GitHub workflow
   - Calls GitHub API to trigger workflow dispatch

4. GitHub Actions receives dispatch:
   - "Send email to all recipients" step runs
   - Sends final email to EMAIL_RECIPIENTS

5. You get confirmation page:
   ✅ Approval Confirmed!
   Your status report has been approved and is being sent...
```

### Security

- **Token signing:** Each approval link is cryptographically signed with your `APPROVAL_TOKEN_SECRET`
- **One-time use:** Links are only valid for 24 hours (you can customize in `api/approve.js`)
- **GitHub RBAC:** The Vercel function uses GitHub API with your `GITHUB_TOKEN` to trigger the workflow
- **No passwords exposed:** Email never contains secrets, only the signed approval token

---

## Customization

### Change Approval Button Text/Color

Edit `scripts/send-email.mjs` in the `injectApprovalButton()` function:

```javascript
const approvalButtonHtml = `
<div style="background: #f0fdf4; border: 1px solid #86efac; ...">
  <p>📧 Preview: Click below to approve and send to all recipients</p>
  <a href="${approvalUrl}" style="...">✅ Approve & Send</a>
</div>
`;
```

### Change Token Expiration

Edit `api/approve.js` to add a timestamp check (currently checks for 24 hours):

```javascript
// Add at the top of handler function
const createdAt = parseInt(req.query.created_at || 0);
const now = Date.now();
const maxAge = 24 * 60 * 60 * 1000; // 24 hours

if (now - createdAt > maxAge) {
  return res.status(401).json({ error: 'Approval link expired' });
}
```

### Disable Approval Button (Revert to GitHub)

To go back to the manual GitHub Actions UI approval:

1. Edit `.github/workflows/send-status-email.yml`
2. Remove `IS_TEST_EMAIL`, `APPROVAL_TOKEN_SECRET`, `VERCEL_DEPLOYMENT_URL` environment variables
3. The test email won't include the button, and you'll need to manually trigger via GitHub Actions

---

## Related Documentation

- [Notion Status Report Automation](./NOTION_STATUS_AUTOMATION.md) - Full setup guide
- [Status Report Files Reference](./STATUS_REPORT_REFERENCE.md) - File locations and roles
- [Troubleshooting Guide](../../guides/TROUBLESHOOTING.md)

---

## Support

If you encounter issues:

1. **Check workflow logs:** GitHub → Actions → Latest run → View logs
2. **Check Vercel logs:** Vercel → Project → Deployments → Latest → Logs
3. **Verify secrets:** GitHub Settings → Secrets → Check all three are present and correct
4. **Test locally:** Copy secrets to `.env` and run `node scripts/send-email.mjs` with `IS_TEST_EMAIL=true`

---

**Last Updated:** December 16, 2024
**Vercel Free Tier:** ✅ Sufficient (1M requests/month, you use ~4-5/month)
