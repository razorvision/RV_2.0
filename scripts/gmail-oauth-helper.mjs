#!/usr/bin/env node

/**
 * Gmail OAuth Helper
 *
 * Interactive script to generate a Gmail OAuth refresh token for automated email sending.
 * This is a one-time setup process.
 *
 * Steps:
 * 1. Create a Google Cloud project
 * 2. Enable Gmail API
 * 3. Create OAuth 2.0 credentials (Desktop application)
 * 4. Run this script and follow the prompts
 * 5. Add the generated credentials to GitHub Secrets
 *
 * Usage:
 *   node scripts/gmail-oauth-helper.mjs --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
 *
 * Or interactively:
 *   node scripts/gmail-oauth-helper.mjs
 */

import { google } from 'googleapis';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function getCredentialsFromArgs() {
  const args = process.argv.slice(2);
  let clientId = null;
  let clientSecret = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--client-id' && i + 1 < args.length) {
      clientId = args[i + 1];
    }
    if (args[i] === '--client-secret' && i + 1 < args.length) {
      clientSecret = args[i + 1];
    }
  }

  return { clientId, clientSecret };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Gmail OAuth Refresh Token Generator                  ║');
  console.log('║     For automated Notion status report email delivery          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('Prerequisites:');
  console.log('1. Create a Google Cloud project: https://console.cloud.google.com');
  console.log('2. Enable the Gmail API');
  console.log('3. Create OAuth 2.0 credentials (Desktop application)');
  console.log('4. Download the credentials JSON file\n');

  let { clientId, clientSecret } = await getCredentialsFromArgs();

  if (!clientId || !clientSecret) {
    console.log('Enter your OAuth credentials from Google Cloud Console:\n');
    clientId = await question('Client ID: ');
    clientSecret = await question('Client Secret: ');
  }

  if (!clientId || !clientSecret) {
    console.error('Error: Client ID and Client Secret are required');
    process.exit(1);
  }

  // Create OAuth2 client
  // Note: We use 'urn:ietf:wg:oauth:2.0:oob' for out-of-band (manual) authorization
  // which doesn't require a local server - user copies code from browser URL instead
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send']
  });

  console.log('\n1. Visit this URL in your browser to authorize:');
  console.log(`   ${authUrl}\n`);

  console.log('2. After you grant permission, you\'ll see a page with an authorization code');
  console.log('3. Copy the code from that page (it will be a long alphanumeric string)\n');

  const authCode = await question('Enter the authorization code: ');

  if (!authCode) {
    console.error('Error: Authorization code is required');
    process.exit(1);
  }

  try {
    // Exchange auth code for tokens
    console.log('\nExchanging authorization code for tokens...');
    const { tokens } = await oauth2Client.getToken(authCode);

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                  SUCCESS! ✅                                 ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('Add these to your GitHub repository secrets:\n');

    console.log('GMAIL_CLIENT_ID:');
    console.log(`  ${clientId}\n`);

    console.log('GMAIL_CLIENT_SECRET:');
    console.log(`  ${clientSecret}\n`);

    console.log('GMAIL_REFRESH_TOKEN:');
    console.log(`  ${tokens.refresh_token}\n`);

    console.log('Steps to add secrets to GitHub:');
    console.log('1. Go to repository Settings → Secrets and variables → Actions');
    console.log('2. Click "New repository secret"');
    console.log('3. Add each secret (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN)');
    console.log('4. Make sure EMAIL_RECIPIENTS is also set\n');

    console.log('Your OAuth credentials are now ready for automated email sending!');

  } catch (error) {
    console.error('Error exchanging authorization code:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(error => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
