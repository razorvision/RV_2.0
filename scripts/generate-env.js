#!/usr/bin/env node

/**
 * =============================================================================
 * Environment File Generator
 * =============================================================================
 * Generates .env.local from .env.example with interactive prompts.
 *
 * Usage:
 *   node scripts/generate-env.js
 *   node scripts/generate-env.js --template supabase
 *   node scripts/generate-env.js --auto
 *
 * Options:
 *   --template <name>  Use a predefined template (supabase, neon, clerk)
 *   --auto             Auto-generate secrets, prompt only for required values
 *   --force            Overwrite existing .env.local
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Parse arguments
const args = process.argv.slice(2);
const template = args.find((a) => a.startsWith('--template='))?.split('=')[1] ||
  (args.includes('--template') ? args[args.indexOf('--template') + 1] : null);
const autoMode = args.includes('--auto');
const forceMode = args.includes('--force');

// Templates
const templates = {
  supabase: {
    DATABASE_URL: 'postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true',
    DIRECT_URL: 'postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres',
    NEXT_PUBLIC_SUPABASE_URL: 'https://[project-ref].supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
  },
  neon: {
    DATABASE_URL: 'postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require',
  },
  clerk: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_...',
    CLERK_SECRET_KEY: 'sk_test_...',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/dashboard',
  },
  nextauth: {
    AUTH_SECRET: 'generate',
    NEXTAUTH_URL: 'http://localhost:3000',
    GITHUB_CLIENT_ID: '',
    GITHUB_CLIENT_SECRET: '',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
  },
  stripe: {
    STRIPE_SECRET_KEY: 'sk_test_...',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_...',
    STRIPE_WEBHOOK_SECRET: 'whsec_...',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_...',
  },
};

// Readline interface
let rl;

function createRL() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Helper functions
function print(text, color = 'reset') {
  console.log(colors[color] + text + colors.reset);
}

async function prompt(question, defaultValue = '') {
  return new Promise((resolve) => {
    const defaultText = defaultValue ? ` [${defaultValue}]` : '';
    rl.question(`${question}${defaultText}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function parseEnvFile(content) {
  const lines = content.split('\n');
  const variables = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      variables.push({ type: 'comment', content: line });
      continue;
    }

    // Parse KEY=value
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Remove quotes from value
      const cleanValue = value.replace(/^["']|["']$/g, '');
      variables.push({
        type: 'variable',
        key,
        value: cleanValue,
        original: line,
      });
    }
  }

  return variables;
}

function categorizeVariable(key) {
  // Determine if variable needs user input or can be auto-generated
  const autoGenerate = ['AUTH_SECRET', 'NEXTAUTH_SECRET', 'SECRET_KEY'];
  const urlPatterns = ['_URL', '_ENDPOINT', '_HOST'];
  const secretPatterns = ['SECRET', 'KEY', 'TOKEN', 'PASSWORD'];

  if (autoGenerate.some((pattern) => key.includes(pattern))) {
    return 'auto-generate';
  }

  if (key.startsWith('NEXT_PUBLIC_APP_')) {
    return 'auto-generate';
  }

  if (urlPatterns.some((pattern) => key.includes(pattern))) {
    return 'required';
  }

  if (secretPatterns.some((pattern) => key.includes(pattern))) {
    return 'required';
  }

  return 'optional';
}

function getVariableHelp(key) {
  const help = {
    DATABASE_URL: 'Database connection string from your provider',
    AUTH_SECRET: 'Auto-generated secure key for NextAuth',
    NEXTAUTH_URL: 'Your app URL (http://localhost:3000 for dev)',
    GITHUB_CLIENT_ID: 'From GitHub OAuth App settings',
    GITHUB_CLIENT_SECRET: 'From GitHub OAuth App settings',
    GOOGLE_CLIENT_ID: 'From Google Cloud Console',
    GOOGLE_CLIENT_SECRET: 'From Google Cloud Console',
    STRIPE_SECRET_KEY: 'From Stripe Dashboard API Keys',
    STRIPE_PUBLISHABLE_KEY: 'From Stripe Dashboard API Keys',
    STRIPE_WEBHOOK_SECRET: 'From Stripe Dashboard Webhooks',
    RESEND_API_KEY: 'From Resend Dashboard',
    UPLOADTHING_SECRET: 'From UploadThing Dashboard',
    NEXT_PUBLIC_POSTHOG_KEY: 'From PostHog Project Settings',
    NEXT_PUBLIC_SUPABASE_URL: 'From Supabase Project Settings > API',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'From Supabase Project Settings > API',
  };

  return help[key] || null;
}

async function main() {
  print('');
  print('╔══════════════════════════════════════════════════════════╗', 'cyan');
  print('║           ENVIRONMENT FILE GENERATOR                     ║', 'cyan');
  print('╚══════════════════════════════════════════════════════════╝', 'cyan');
  print('');

  // Check for existing .env.local
  if (fs.existsSync('.env.local') && !forceMode) {
    print('  .env.local already exists!', 'yellow');
    print('  Use --force to overwrite, or edit manually.', 'yellow');
    process.exit(1);
  }

  // Read .env.example if it exists
  let baseContent = '';
  if (fs.existsSync('.env.example')) {
    baseContent = fs.readFileSync('.env.example', 'utf8');
    print('  Found .env.example, using as base template', 'green');
  } else {
    print('  No .env.example found, creating from scratch', 'yellow');
    baseContent = `# Application
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=

# Authentication
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
`;
  }

  // Apply template if specified
  if (template && templates[template]) {
    print(`  Applying "${template}" template`, 'blue');
    const templateVars = templates[template];

    for (const [key, value] of Object.entries(templateVars)) {
      if (value === 'generate') {
        templateVars[key] = generateSecret();
      }
    }

    // Merge template into base content
    let lines = baseContent.split('\n');
    for (const [key, value] of Object.entries(templateVars)) {
      const existingIndex = lines.findIndex((l) =>
        l.trim().startsWith(`${key}=`)
      );
      if (existingIndex >= 0) {
        lines[existingIndex] = `${key}="${value}"`;
      } else {
        lines.push(`${key}="${value}"`);
      }
    }
    baseContent = lines.join('\n');
  }

  // Parse variables
  const variables = parseEnvFile(baseContent);

  // In auto mode, just generate secrets and write
  if (autoMode) {
    print('');
    print('  Auto-generating secrets...', 'blue');

    const outputLines = [];
    for (const item of variables) {
      if (item.type === 'comment') {
        outputLines.push(item.content);
      } else {
        const category = categorizeVariable(item.key);
        let value = item.value;

        if (category === 'auto-generate' || item.key.includes('SECRET')) {
          value = generateSecret();
          print(`  Generated: ${item.key}`, 'green');
        }

        outputLines.push(`${item.key}="${value}"`);
      }
    }

    fs.writeFileSync('.env.local', outputLines.join('\n'));
    print('');
    print('  Created .env.local with auto-generated secrets', 'green');
    print('');
    print('  Edit .env.local to add your API keys and credentials', 'yellow');
    print('');
    process.exit(0);
  }

  // Interactive mode
  rl = createRL();

  print('');
  print('  Fill in the values for each variable.', 'bright');
  print('  Press Enter to keep default, or type "skip" to leave empty.', 'bright');
  print('');

  const outputLines = [];

  for (const item of variables) {
    if (item.type === 'comment') {
      outputLines.push(item.content);
      continue;
    }

    const category = categorizeVariable(item.key);
    const help = getVariableHelp(item.key);

    // Auto-generate secrets
    if (category === 'auto-generate' && !item.value) {
      const generated = generateSecret();
      outputLines.push(`${item.key}="${generated}"`);
      print(`  ${item.key}: ${colors.green}[auto-generated]${colors.reset}`);
      continue;
    }

    // Show help if available
    if (help) {
      print(`  ${colors.cyan}${help}${colors.reset}`);
    }

    // Prompt for value
    const currentValue = item.value || '';
    const answer = await prompt(`  ${item.key}`, currentValue);

    if (answer === 'skip' || answer === '') {
      outputLines.push(`${item.key}=""`);
    } else {
      outputLines.push(`${item.key}="${answer}"`);
    }
  }

  // Write output
  fs.writeFileSync('.env.local', outputLines.join('\n'));
  print('');
  print('  Created .env.local', 'green');
  print('');

  // Validation
  print('  Checking configuration...', 'blue');
  const content = fs.readFileSync('.env.local', 'utf8');
  const hasDatabase = content.includes('DATABASE_URL=') &&
    !content.includes('DATABASE_URL=""');
  const hasAuth = content.includes('AUTH_SECRET=') &&
    !content.includes('AUTH_SECRET=""');

  if (hasDatabase) {
    print('  ✓ DATABASE_URL is set', 'green');
  } else {
    print('  ✗ DATABASE_URL is empty', 'yellow');
  }

  if (hasAuth) {
    print('  ✓ AUTH_SECRET is set', 'green');
  } else {
    print('  ✗ AUTH_SECRET is empty', 'yellow');
  }

  print('');
  print('  Next steps:', 'bright');
  print('  1. Review .env.local and add any missing values');
  print('  2. Run: npm run dev');
  print('');

  rl.close();
}

main().catch((error) => {
  print(`Error: ${error.message}`, 'red');
  process.exit(1);
});
