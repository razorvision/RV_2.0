#!/usr/bin/env node

/**
 * Gmail OAuth Setup - Simpler Version
 *
 * This script helps you get Gmail credentials for automated email sending.
 *
 * Steps:
 * 1. Create a Google Cloud project: https://console.cloud.google.com/projectcreate
 * 2. Enable Gmail API: https://console.cloud.google.com/apis/library/gmail.googleapis.com
 * 3. Create OAuth credentials (Desktop app): https://console.cloud.google.com/apis/credentials
 * 4. Run this script and follow the prompts
 *
 * Usage:
 *   node scripts/gmail-oauth-setup.mjs
 */

import { google } from 'googleapis';
import readline from 'readline';
import http from 'http';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Gmail OAuth Setup for Status Reports                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('This script will help you set up Gmail authentication.\n');

  console.log('Prerequisites (if you haven\'t done this yet):');
  console.log('1. Create a Google Cloud project:');
  console.log('   https://console.cloud.google.com/projectcreate\n');

  console.log('2. Enable Gmail API:');
  console.log('   https://console.cloud.google.com/apis/library/gmail.googleapis.com\n');

  console.log('3. Create OAuth 2.0 credentials (Desktop application):');
  console.log('   https://console.cloud.google.com/apis/credentials\n');

  console.log('4. In the OAuth consent screen, add your email as a test user\n');

  const clientId = await question('Enter your Client ID: ');
  const clientSecret = await question('Enter your Client Secret: ');

  if (!clientId || !clientSecret) {
    console.error('Error: Client ID and Secret are required');
    process.exit(1);
  }

  console.log('\nStarting authorization...\n');

  // Create OAuth2 client with local redirect
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/callback'
  );

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send']
  });

  console.log('📖 Opening authorization URL in your browser...\n');
  console.log('If it doesn\'t open, visit this URL manually:');
  console.log(`${authUrl}\n`);

  // Start local server to catch the callback
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith('/callback')) {
      const url = new URL(req.url, 'http://localhost:3000');
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Authorization Error</h1><p>${error}</p><p>Check your Client ID and Secret</p>`);
        console.error(`Authorization failed: ${error}`);
        server.close();
        process.exit(1);
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>✅ Authorization Successful!</h1><p>You can close this window and return to the terminal.</p>');

        try {
          // Exchange code for tokens
          console.log('Exchanging code for tokens...\n');
          const { tokens } = await oauth2Client.getToken(code);

          console.log('╔══════════════════════════════════════════════════════════════╗');
          console.log('║                  SUCCESS! ✅                                 ║');
          console.log('╚══════════════════════════════════════════════════════════════╝\n');

          console.log('Add these secrets to your GitHub repository:\n');

          console.log('Secret Name: GMAIL_CLIENT_ID');
          console.log(`Value: ${clientId}\n`);

          console.log('Secret Name: GMAIL_CLIENT_SECRET');
          console.log(`Value: ${clientSecret}\n`);

          console.log('Secret Name: GMAIL_REFRESH_TOKEN');
          console.log(`Value: ${tokens.refresh_token}\n`);

          console.log('Steps:');
          console.log('1. Go to: https://github.com/razorvision/RV_2.0/settings/secrets/actions');
          console.log('2. Click "New repository secret" for each of the 3 secrets above');
          console.log('3. Also add EMAIL_RECIPIENTS (comma-separated emails)\n');

          console.log('Done! Your Gmail automation is ready.');
          server.close();
          rl.close();
          process.exit(0);

        } catch (error) {
          console.error('Error exchanging code:', error.message);
          server.close();
          process.exit(1);
        }
      }
    }
  });

  server.listen(3000, () => {
    console.log('🔗 Local server running at http://localhost:3000\n');
    console.log('Waiting for authorization...\n');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error('Error: Port 3000 is already in use');
      console.error('Either close the program using port 3000 or try again later');
    } else {
      console.error('Server error:', error.message);
    }
    process.exit(1);
  });

  // Timeout after 5 minutes
  setTimeout(() => {
    console.error('Authorization timeout (5 minutes). Closing...');
    server.close();
    process.exit(1);
  }, 5 * 60 * 1000);
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
