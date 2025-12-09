#!/usr/bin/env node

/**
 * =============================================================================
 * Interactive Project Setup Wizard
 * =============================================================================
 * Guides you through setting up a new project from the template.
 *
 * Usage:
 *   node scripts/setup-wizard.js
 *
 * Features:
 *   - Interactive prompts for configuration
 *   - Template copying and customization
 *   - Environment file generation
 *   - Dependency installation
 *   - Database setup
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

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

// Configuration
const config = {
  projectName: '',
  displayName: '',
  description: '',
  framework: 'nextjs',
  database: 'postgres',
  databaseProvider: 'supabase',
  auth: 'nextauth',
  features: [],
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper functions
function print(text, color = 'reset') {
  console.log(colors[color] + text + colors.reset);
}

function printHeader() {
  console.log('');
  print('╔══════════════════════════════════════════════════════════╗', 'cyan');
  print('║                                                          ║', 'cyan');
  print('║           PROJECT SETUP WIZARD                           ║', 'cyan');
  print('║                                                          ║', 'cyan');
  print('╚══════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
}

function printStep(step, total, title) {
  console.log('');
  print(`─── Step ${step}/${total}: ${title} ───`, 'blue');
  console.log('');
}

async function prompt(question, defaultValue = '') {
  return new Promise((resolve) => {
    const defaultText = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`  ${question}${defaultText}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function promptSelect(question, options) {
  console.log(`  ${question}`);
  options.forEach((opt, i) => {
    console.log(`    ${i + 1}. ${opt.label}`);
  });
  console.log('');

  const answer = await prompt('Enter number', '1');
  const index = parseInt(answer) - 1;

  if (index >= 0 && index < options.length) {
    return options[index].value;
  }
  return options[0].value;
}

async function promptMultiSelect(question, options) {
  console.log(`  ${question} (comma-separated numbers)`);
  options.forEach((opt, i) => {
    console.log(`    ${i + 1}. ${opt.label}`);
  });
  console.log('');

  const answer = await prompt('Enter numbers (e.g., 1,2,3)', '');
  if (!answer) return [];

  const indices = answer.split(',').map((n) => parseInt(n.trim()) - 1);
  return indices
    .filter((i) => i >= 0 && i < options.length)
    .map((i) => options[i].value);
}

async function confirm(question) {
  const answer = await prompt(`${question} (y/n)`, 'y');
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Step functions
async function gatherBasicInfo() {
  printStep(1, 5, 'Project Information');

  const dirName = path.basename(process.cwd());

  config.projectName = await prompt('Project name (kebab-case)', dirName);
  config.displayName = await prompt(
    'Display name',
    config.projectName
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
  config.description = await prompt(
    'Description',
    'A modern web application'
  );
}

async function selectFramework() {
  printStep(2, 5, 'Tech Stack');

  config.framework = await promptSelect('Choose your framework:', [
    { label: 'Next.js 14+ (App Router)', value: 'nextjs' },
    { label: 'FastAPI (Python)', value: 'fastapi' },
    { label: 'Express.js', value: 'express' },
  ]);

  if (config.framework === 'nextjs') {
    config.database = await promptSelect('Choose your database:', [
      { label: 'PostgreSQL', value: 'postgres' },
      { label: 'MySQL', value: 'mysql' },
      { label: 'SQLite', value: 'sqlite' },
    ]);

    if (config.database === 'postgres') {
      config.databaseProvider = await promptSelect('Database provider:', [
        { label: 'Supabase (recommended - includes auth, storage)', value: 'supabase' },
        { label: 'Neon (serverless PostgreSQL)', value: 'neon' },
        { label: 'Railway (simple setup)', value: 'railway' },
        { label: 'Local Docker', value: 'local' },
      ]);
    }

    config.auth = await promptSelect('Choose authentication:', [
      { label: 'NextAuth.js (free, flexible)', value: 'nextauth' },
      { label: 'Clerk (beautiful UI, fast setup)', value: 'clerk' },
      { label: 'Supabase Auth (if using Supabase)', value: 'supabase' },
      { label: 'None (add later)', value: 'none' },
    ]);
  }
}

async function selectFeatures() {
  printStep(3, 5, 'Additional Features');

  config.features = await promptMultiSelect('Select features to include:', [
    { label: 'Stripe payments', value: 'stripe' },
    { label: 'Email (Resend)', value: 'email' },
    { label: 'File uploads (UploadThing)', value: 'uploads' },
    { label: 'Analytics (PostHog)', value: 'analytics' },
    { label: 'Docker setup', value: 'docker' },
    { label: 'GitHub Actions CI/CD', value: 'cicd' },
  ]);
}

async function generateEnvFile() {
  printStep(4, 5, 'Environment Configuration');

  const env = [];
  env.push('# =============================================================================');
  env.push(`# Environment Configuration for ${config.displayName}`);
  env.push('# Generated by setup-wizard.js');
  env.push('# =============================================================================');
  env.push('');

  // App configuration
  env.push('# App');
  env.push(`NEXT_PUBLIC_APP_NAME="${config.displayName}"`);
  env.push('NEXT_PUBLIC_APP_URL=http://localhost:3000');
  env.push('');

  // Database
  env.push('# Database');
  if (config.databaseProvider === 'supabase') {
    env.push('# Get these from: https://supabase.com/dashboard/project/_/settings/api');
    env.push('DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"');
    env.push('DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"');
  } else if (config.databaseProvider === 'neon') {
    env.push('# Get from: https://console.neon.tech');
    env.push('DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"');
  } else if (config.databaseProvider === 'local') {
    env.push('DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp"');
  } else {
    env.push('DATABASE_URL="postgresql://user:password@localhost:5432/myapp"');
  }
  env.push('');

  // Auth
  if (config.auth === 'nextauth') {
    env.push('# Auth (NextAuth.js)');
    env.push('# Generate with: openssl rand -base64 32');
    env.push(`AUTH_SECRET="${generateSecret()}"`);
    env.push('NEXTAUTH_URL=http://localhost:3000');
    env.push('');
    env.push('# OAuth Providers (optional)');
    env.push('GITHUB_CLIENT_ID=');
    env.push('GITHUB_CLIENT_SECRET=');
    env.push('GOOGLE_CLIENT_ID=');
    env.push('GOOGLE_CLIENT_SECRET=');
  } else if (config.auth === 'clerk') {
    env.push('# Auth (Clerk)');
    env.push('# Get from: https://dashboard.clerk.com');
    env.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...');
    env.push('CLERK_SECRET_KEY=sk_test_...');
  } else if (config.auth === 'supabase') {
    env.push('# Auth (Supabase)');
    env.push('NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co');
    env.push('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
    env.push('SUPABASE_SERVICE_ROLE_KEY=');
  }
  env.push('');

  // Optional features
  if (config.features.includes('stripe')) {
    env.push('# Stripe');
    env.push('# Get from: https://dashboard.stripe.com/apikeys');
    env.push('STRIPE_SECRET_KEY=sk_test_...');
    env.push('STRIPE_PUBLISHABLE_KEY=pk_test_...');
    env.push('STRIPE_WEBHOOK_SECRET=whsec_...');
    env.push('');
  }

  if (config.features.includes('email')) {
    env.push('# Email (Resend)');
    env.push('# Get from: https://resend.com/api-keys');
    env.push('RESEND_API_KEY=re_...');
    env.push(`EMAIL_FROM=noreply@${config.projectName}.com`);
    env.push('');
  }

  if (config.features.includes('uploads')) {
    env.push('# File Uploads (UploadThing)');
    env.push('# Get from: https://uploadthing.com/dashboard');
    env.push('UPLOADTHING_SECRET=sk_live_...');
    env.push('UPLOADTHING_APP_ID=');
    env.push('');
  }

  if (config.features.includes('analytics')) {
    env.push('# Analytics (PostHog)');
    env.push('# Get from: https://posthog.com');
    env.push('NEXT_PUBLIC_POSTHOG_KEY=phc_...');
    env.push('NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com');
    env.push('');
  }

  const envContent = env.join('\n');

  print('Generated environment configuration:', 'green');
  console.log('');
  console.log('  Preview of .env.local:');
  console.log('  ─────────────────────');
  envContent.split('\n').slice(0, 20).forEach((line) => {
    console.log(`  ${line}`);
  });
  console.log('  ...');
  console.log('');

  const shouldWrite = await confirm('Write to .env.local?');
  if (shouldWrite) {
    fs.writeFileSync('.env.local', envContent);
    print('  Created .env.local', 'green');

    // Also create .env.example with placeholder values
    const exampleContent = envContent
      .replace(/=".+"/g, '=""')
      .replace(/=sk_test_.+/g, '=')
      .replace(/=pk_test_.+/g, '=')
      .replace(/=whsec_.+/g, '=')
      .replace(/=re_.+/g, '=')
      .replace(/=phc_.+/g, '=');
    fs.writeFileSync('.env.example', exampleContent);
    print('  Created .env.example', 'green');
  }

  return envContent;
}

async function finalize() {
  printStep(5, 5, 'Finalize Setup');

  console.log('  Configuration Summary:');
  console.log('  ─────────────────────');
  console.log(`  Project: ${config.displayName}`);
  console.log(`  Framework: ${config.framework}`);
  console.log(`  Database: ${config.database} (${config.databaseProvider})`);
  console.log(`  Auth: ${config.auth}`);
  console.log(`  Features: ${config.features.join(', ') || 'none'}`);
  console.log('');

  const runInstall = await confirm('Install dependencies? (npm install)');
  if (runInstall) {
    print('  Installing dependencies...', 'blue');
    try {
      execSync('npm install', { stdio: 'inherit' });
      print('  Dependencies installed!', 'green');
    } catch {
      print('  Failed to install dependencies', 'red');
    }
  }

  if (config.framework === 'nextjs' && config.database !== 'none') {
    const runPrisma = await confirm('Generate Prisma client?');
    if (runPrisma) {
      print('  Generating Prisma client...', 'blue');
      try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        print('  Prisma client generated!', 'green');
      } catch {
        print('  Failed to generate Prisma client (this is OK if schema doesn\'t exist yet)', 'yellow');
      }
    }
  }
}

function generateSecret(length = 32) {
  // Use crypto for secure secret generation
  return require('crypto').randomBytes(length).toString('base64').slice(0, length);
}

function printNextSteps() {
  console.log('');
  print('═══════════════════════════════════════════════════════════', 'green');
  print('                    SETUP COMPLETE!                         ', 'green');
  print('═══════════════════════════════════════════════════════════', 'green');
  console.log('');
  print('Next steps:', 'bright');
  console.log('');
  console.log('  1. Edit .env.local with your actual credentials');
  console.log('');
  console.log('  2. Set up your database:');
  if (config.databaseProvider === 'supabase') {
    console.log('     - Create project at https://supabase.com');
    console.log('     - Copy connection string to DATABASE_URL');
  } else if (config.databaseProvider === 'neon') {
    console.log('     - Create database at https://neon.tech');
    console.log('     - Copy connection string to DATABASE_URL');
  } else if (config.databaseProvider === 'local') {
    console.log('     - Run: docker compose up -d db');
  }
  console.log('');
  console.log('  3. Initialize the database:');
  console.log('     npx prisma db push');
  console.log('');
  console.log('  4. Start development:');
  console.log('     npm run dev');
  console.log('');
  console.log('  5. Open http://localhost:3000');
  console.log('');
  print('Documentation:', 'bright');
  console.log('');
  console.log('  - Setup Guide: docs/getting-started/QUICKSTART.md');
  console.log('  - Framework Patterns: docs/frameworks/');
  console.log('  - Deployment: docs/deployment/');
  console.log('');
  print('Happy coding!', 'cyan');
  console.log('');
}

// Main
async function main() {
  printHeader();

  print('This wizard will help you set up your project.', 'bright');
  print('Press Ctrl+C at any time to exit.', 'yellow');
  console.log('');

  try {
    await gatherBasicInfo();
    await selectFramework();
    await selectFeatures();
    await generateEnvFile();
    await finalize();
    printNextSteps();
  } catch (error) {
    if (error.message === 'readline was closed') {
      console.log('\n');
      print('Setup cancelled.', 'yellow');
    } else {
      print(`Error: ${error.message}`, 'red');
    }
  } finally {
    rl.close();
  }
}

main();
