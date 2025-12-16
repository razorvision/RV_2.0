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

// Load environment variables
config();

const GMAIL_FROM_EMAIL = process.env.GMAIL_FROM_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const EMAIL_RECIPIENTS = process.env.EMAIL_RECIPIENTS;

// Validate required environment variables
const missingVars = [];
if (!GMAIL_FROM_EMAIL) missingVars.push('GMAIL_FROM_EMAIL');
if (!GMAIL_APP_PASSWORD) missingVars.push('GMAIL_APP_PASSWORD');
if (!EMAIL_RECIPIENTS) missingVars.push('EMAIL_RECIPIENTS');

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

    const htmlContent = fs.readFileSync(reportPath, 'utf-8');

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

    const subject = `Product Status Update - ${dateStr}`;

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

  } catch (error) {
    console.error('Error sending email:', error.message);
    process.exit(1);
  }
}

// Run the email sender
sendEmail();
