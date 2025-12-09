#!/usr/bin/env node

/**
 * =============================================================================
 * Project Setup Validator (Cross-Platform)
 * =============================================================================
 * Validates that a project is properly configured for development.
 * Works on Windows, macOS, and Linux without bash.
 *
 * Usage:
 *   node scripts/validate-setup.js
 *   node scripts/validate-setup.js --fix
 *   node scripts/validate-setup.js --quiet
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors (ANSI escape codes)
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

// Counters
let passed = 0;
let failed = 0;
let warnings = 0;

// Options
const args = process.argv.slice(2);
const FIX_MODE = args.includes('--fix');
const QUIET_MODE = args.includes('--quiet');

// Helper functions
function printHeader(title) {
  if (!QUIET_MODE) {
    console.log('');
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}  ${title}${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  }
}

function checkPass(message) {
  passed++;
  if (!QUIET_MODE) {
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  }
}

function checkFail(message, fix = '') {
  failed++;
  console.log(`  ${colors.red}✗${colors.reset} ${message}`);
  if (fix) {
    console.log(`    ${colors.yellow}Fix:${colors.reset} ${fix}`);
  }
}

function checkWarn(message) {
  warnings++;
  if (!QUIET_MODE) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${message}`);
  }
}

function checkSkip(message) {
  if (!QUIET_MODE) {
    console.log(`  ${colors.blue}○${colors.reset} ${message} (skipped)`);
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

// =============================================================================
// Check: Required Files
// =============================================================================
function checkRequiredFiles() {
  printHeader('Required Files');

  const requiredFiles = [
    { path: 'package.json', desc: 'Project manifest' },
    { path: 'tsconfig.json', desc: 'TypeScript configuration' },
  ];

  const recommendedFiles = [
    { path: '.env.local', alt: '.env', desc: 'Environment variables' },
    { path: 'prisma/schema.prisma', desc: 'Database schema' },
    { path: 'src/app/layout.tsx', desc: 'Next.js root layout' },
    { path: 'docker-compose.yml', alt: 'compose.yaml', desc: 'Docker services' },
  ];

  for (const file of requiredFiles) {
    if (fileExists(file.path)) {
      checkPass(`${file.desc} (${file.path})`);
    } else {
      checkFail(`${file.desc} (${file.path}) - Required file missing`);
    }
  }

  for (const file of recommendedFiles) {
    const exists = fileExists(file.path) || (file.alt && fileExists(file.alt));
    if (exists) {
      checkPass(`${file.desc}`);
    } else {
      checkWarn(`${file.desc} - Not found`);
    }
  }
}

// =============================================================================
// Check: Environment Variables
// =============================================================================
function checkEnvVariables() {
  printHeader('Environment Variables');

  let envFile = null;
  let envPath = null;

  if (fileExists('.env.local')) {
    envFile = readFile('.env.local');
    envPath = '.env.local';
  } else if (fileExists('.env')) {
    envFile = readFile('.env');
    envPath = '.env';
  }

  if (!envFile) {
    checkFail('No environment file found (.env.local or .env)');
    if (fileExists('.env.example')) {
      console.log(`    ${colors.yellow}Fix:${colors.reset} Copy .env.example to .env.local`);
    }
    return;
  }

  checkPass(`Environment file found (${envPath})`);

  // Parse env file
  const envVars = {};
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });

  // Check required variables
  const requiredVars = ['DATABASE_URL'];
  for (const varName of requiredVars) {
    if (envVars[varName] && envVars[varName].length > 0) {
      checkPass(`${varName} is set`);
    } else {
      checkFail(`${varName} is not set`);
    }
  }

  // Check auth secret
  const authSecret = envVars['AUTH_SECRET'] || envVars['NEXTAUTH_SECRET'];
  if (authSecret && authSecret.length > 0) {
    checkPass('Auth secret is set');
  } else {
    checkFail('Auth secret (AUTH_SECRET or NEXTAUTH_SECRET) not set');
  }

  // Check for placeholders
  const envContent = envFile.toLowerCase();
  if (envContent.includes('your-') || envContent.includes('changeme') || envContent.includes('replace-')) {
    checkWarn('Possible placeholder values detected');
  }
}

// =============================================================================
// Check: Dependencies
// =============================================================================
function checkDependencies() {
  printHeader('Dependencies');

  if (!fileExists('node_modules')) {
    checkFail('node_modules not found');
    if (FIX_MODE) {
      console.log(`    ${colors.blue}Attempting fix: npm install${colors.reset}`);
      const result = runCommand('npm install');
      if (result !== null) {
        checkPass('Dependencies installed');
      }
    } else {
      console.log(`    ${colors.yellow}Fix:${colors.reset} npm install`);
    }
    return;
  }

  checkPass('node_modules directory exists');

  // Check key packages
  const keyPackages = [
    { name: 'next', desc: 'Next.js framework' },
    { name: 'react', desc: 'React library' },
    { name: '@prisma/client', desc: 'Prisma client' },
  ];

  for (const pkg of keyPackages) {
    const pkgPath = path.join('node_modules', pkg.name);
    if (fileExists(pkgPath)) {
      checkPass(`${pkg.desc} (${pkg.name}) installed`);
    } else {
      checkWarn(`${pkg.desc} (${pkg.name}) not found`);
    }
  }

  // Check Prisma client generation
  if (fileExists('node_modules/.prisma/client')) {
    checkPass('Prisma client generated');
  } else if (fileExists('prisma/schema.prisma')) {
    checkFail('Prisma client not generated');
    if (FIX_MODE) {
      console.log(`    ${colors.blue}Attempting fix: npx prisma generate${colors.reset}`);
      const result = runCommand('npx prisma generate');
      if (result !== null) {
        checkPass('Prisma client generated');
      }
    } else {
      console.log(`    ${colors.yellow}Fix:${colors.reset} npx prisma generate`);
    }
  }
}

// =============================================================================
// Check: TypeScript
// =============================================================================
function checkTypeScript() {
  printHeader('TypeScript');

  if (!fileExists('tsconfig.json')) {
    checkSkip('No tsconfig.json found');
    return;
  }

  if (!QUIET_MODE) {
    console.log('  Running type check...');
  }

  const result = runCommand('npx tsc --noEmit 2>&1');
  if (result !== null && !result.includes('error TS')) {
    checkPass('No TypeScript errors');
  } else {
    checkFail('TypeScript errors found');
    console.log(`    ${colors.yellow}Fix:${colors.reset} Run 'npx tsc --noEmit' to see errors`);
  }
}

// =============================================================================
// Check: Linting
// =============================================================================
function checkLinting() {
  printHeader('Code Quality');

  const packageJson = readFile('package.json');
  if (!packageJson) {
    checkSkip('No package.json found');
    return;
  }

  try {
    const pkg = JSON.parse(packageJson);
    if (!pkg.scripts || !pkg.scripts.lint) {
      checkSkip('No lint script found');
      return;
    }
  } catch {
    checkSkip('Could not parse package.json');
    return;
  }

  if (!QUIET_MODE) {
    console.log('  Running linter...');
  }

  const result = runCommand('npm run lint 2>&1');
  if (result !== null && !result.toLowerCase().includes('error')) {
    checkPass('No lint errors');
  } else {
    checkWarn('Lint errors found');
    console.log(`    ${colors.yellow}Fix:${colors.reset} Run 'npm run lint' to see errors`);
  }
}

// =============================================================================
// Check: Git
// =============================================================================
function checkGit() {
  printHeader('Git Configuration');

  if (!fileExists('.git')) {
    checkWarn('Not a git repository');
    return;
  }

  checkPass('Git repository initialized');

  if (fileExists('.gitignore')) {
    checkPass('.gitignore exists');

    const gitignore = readFile('.gitignore') || '';
    const shouldIgnore = ['node_modules', '.env.local', '.next'];

    for (const entry of shouldIgnore) {
      if (gitignore.includes(entry)) {
        checkPass(`${entry} in .gitignore`);
      } else {
        checkWarn(`${entry} not in .gitignore`);
      }
    }
  } else {
    checkFail('.gitignore not found');
  }
}

// =============================================================================
// Summary
// =============================================================================
function printSummary() {
  console.log('');
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  VALIDATION SUMMARY${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('');
  console.log(`  ${colors.green}Passed:${colors.reset}   ${passed}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset} ${warnings}`);
  console.log(`  ${colors.red}Failed:${colors.reset}   ${failed}`);
  console.log('');

  if (failed === 0) {
    console.log(`  ${colors.green}Status: Ready for development!${colors.reset}`);
    console.log('');
    console.log('  Next steps:');
    console.log('    npm run dev');
  } else {
    console.log(`  ${colors.red}Status: Issues need attention${colors.reset}`);
    console.log('');
    console.log('  Fix the failed checks above, then run this script again.');
    if (!FIX_MODE) {
      console.log('  Tip: Run with --fix to attempt automatic fixes');
    }
  }

  console.log('');
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

// =============================================================================
// Main
// =============================================================================
function main() {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node validate-setup.js [--fix] [--quiet]');
    console.log('  --fix    Attempt to automatically fix issues');
    console.log('  --quiet  Only show errors and warnings');
    process.exit(0);
  }

  if (!QUIET_MODE) {
    console.log('');
    console.log(`${colors.blue}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║           PROJECT SETUP VALIDATOR                        ║${colors.reset}`);
    console.log(`${colors.blue}╚══════════════════════════════════════════════════════════╝${colors.reset}`);
  }

  checkRequiredFiles();
  checkEnvVariables();
  checkDependencies();
  checkTypeScript();
  checkLinting();
  checkGit();

  printSummary();

  process.exit(failed > 0 ? 1 : 0);
}

main();
