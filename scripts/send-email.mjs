#!/usr/bin/env node

/**
 * Notion Status Report Email Sender
 *
 * Sends the generated HTML status report via Gmail SMTP.
 * Uses Gmail App Passwords for authentication (simpler than OAuth).
 *
 * Required environment variables:
 * - GMAIL_FROM_EMAIL: Your Gmail address (e.g., your@gmail.com)
 * - GMAIL_APP_PASSWORD: 16-character app password from Google Account
 * - EMAIL_RECIPIENTS: Comma-separated email addresses
 *
 * Optional (for approval button in test emails):
 * - APPROVAL_TOKEN_SECRET: Secret for signing approval links
 * - VERCEL_DEPLOYMENT_URL: Vercel deployment URL (e.g., https://rv-2-0.vercel.app)
 * - GITHUB_RUN_ID: GitHub Actions run ID (passed by workflow)
 * - IS_TEST_EMAIL: Set to 'true' to include approval button
 *
 * To generate an app password:
 * 1. Enable 2FA: https://myaccount.google.com/security
 * 2. Generate app password: https://myaccount.google.com/apppasswords
 * 3. Select Mail + Windows (or your OS)
 * 4. Copy the 16-char password
 *
 * Input: NOTION_PROJECT_STATUS.html
 */

import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generateApprovalToken, buildApprovalUrl } from './utils/approval-token.mjs';

// Load environment variables
config();

const GMAIL_FROM_EMAIL = process.env.GMAIL_FROM_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const EMAIL_RECIPIENTS = process.env.EMAIL_RECIPIENTS;
const IS_TEST_EMAIL = process.env.IS_TEST_EMAIL === 'true';
const APPROVAL_TOKEN_SECRET = process.env.APPROVAL_TOKEN_SECRET;
const VERCEL_DEPLOYMENT_URL = process.env.VERCEL_DEPLOYMENT_URL;
const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID;

// Validate required environment variables
const missingVars = [];
if (!GMAIL_FROM_EMAIL) missingVars.push('GMAIL_FROM_EMAIL');
if (!GMAIL_APP_PASSWORD) missingVars.push('GMAIL_APP_PASSWORD');
if (!EMAIL_RECIPIENTS) missingVars.push('EMAIL_RECIPIENTS');

// If sending test email with approval button, need additional variables
if (IS_TEST_EMAIL) {
  if (!APPROVAL_TOKEN_SECRET) missingVars.push('APPROVAL_TOKEN_SECRET (required for test email approval button)');
  if (!VERCEL_DEPLOYMENT_URL) missingVars.push('VERCEL_DEPLOYMENT_URL (required for test email approval button)');
  if (!GITHUB_RUN_ID) missingVars.push('GITHUB_RUN_ID (required for test email approval button)');
}

if (missingVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

async function sendEmail() {
  try {
    // Read HTML report
    const reportPath = path.join(process.cwd(), 'NOTION_PROJECT_STATUS.html');
    if (!fs.existsSync(reportPath)) {
      throw new Error(`Report file not found: ${reportPath}`);
    }

    let htmlContent = fs.readFileSync(reportPath, 'utf-8');

    // If this is a test email, inject approval button
    if (IS_TEST_EMAIL) {
      htmlContent = injectApprovalButton(htmlContent);
    }

    // Parse recipients
    const recipients = EMAIL_RECIPIENTS
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (recipients.length === 0) {
      throw new Error('No valid email recipients provided');
    }

    console.log(`Preparing to send report to: ${recipients.join(', ')}`);

    // Get today's date for subject
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const subject = IS_TEST_EMAIL
      ? `[TEST] Product Status Update - ${dateStr}`
      : `Product Status Update - ${dateStr}`;

    // Create Nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_FROM_EMAIL,
        pass: GMAIL_APP_PASSWORD  // This is the 16-char app password, not your Gmail password
      }
    });

    // Send email
    const mailOptions = {
      from: GMAIL_FROM_EMAIL,
      to: recipients.join(', '),
      subject: subject,
      html: htmlContent
    };

    console.log('\nSending email...');
    const result = await transporter.sendMail(mailOptions);

    console.log(`\n✅ Email sent successfully!`);
    console.log(`Response ID: ${result.response}`);
    console.log(`Subject: ${subject}`);
    console.log(`Recipients: ${recipients.join(', ')}`);
    if (IS_TEST_EMAIL) {
      console.log(`\n📧 Test email includes approval button. Click to trigger final send.`);
    }

  } catch (error) {
    console.error('Error sending email:', error.message);
    process.exit(1);
  }
}

/**
 * Inject an approval button into the HTML email
 * The button appears at the top with a secure signed URL
 */
function injectApprovalButton(htmlContent) {
  const token = generateApprovalToken(GITHUB_RUN_ID, APPROVAL_TOKEN_SECRET);
  const approvalUrl = buildApprovalUrl(GITHUB_RUN_ID, token, VERCEL_DEPLOYMENT_URL);

  const approvalButtonHtml = `
<div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
  <p style="margin: 0 0 12px 0; color: #166534; font-weight: bold;">📧 Preview: Click below to approve and send to all recipients</p>
  <a href="${approvalUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; border: none; cursor: pointer;">✅ Approve & Send</a>
  <p style="margin: 12px 0 0 0; color: #666; font-size: 12px;">This link expires in 24 hours.</p>
</div>
  `;

  // Inject after the opening body tag or at the start of content
  if (htmlContent.includes('<body')) {
    return htmlContent.replace(/(<body[^>]*>)/i, '$1' + approvalButtonHtml);
  }

  // Fallback: prepend to the HTML
  return approvalButtonHtml + htmlContent;
}

// Run the email sender
sendEmail();
