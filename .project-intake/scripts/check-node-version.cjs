#!/usr/bin/env node

/**
 * Node.js Version Checker
 * 
 * Validates that Node.js version meets minimum requirements
 */

const MINIMUM_NODE_VERSION = 18;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  log('', 'reset');
  log('🔍 Checking Node.js Version', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');

  // Get current Node.js version
  const currentVersion = process.versions.node;
  const majorVersion = parseInt(currentVersion.split('.')[0], 10);

  log(`Current Node.js version: ${currentVersion}`, 'reset');
  log(`Minimum required version: ${MINIMUM_NODE_VERSION}.x`, 'reset');
  log('', 'reset');

  if (majorVersion >= MINIMUM_NODE_VERSION) {
    log(`✅ Node.js version check passed!`, 'green');
    log('', 'reset');
    process.exit(0);
  } else {
    log(`❌ Node.js version ${currentVersion} is too old`, 'red');
    log(`   Minimum required: ${MINIMUM_NODE_VERSION}.x`, 'yellow');
    log('', 'reset');
    log('Please upgrade Node.js:', 'cyan');
    log('  • Download from: https://nodejs.org/', 'reset');
    log('  • Or use nvm: nvm install 18', 'reset');
    log('  • Or use nvm (Windows): nvm install 18', 'reset');
    log('', 'reset');
    process.exit(1);
  }
}

// Run check
try {
  checkNodeVersion();
} catch (error) {
  log('❌ Unexpected error during version check:', 'red');
  log(`   ${error.message}`, 'yellow');
  console.error(error);
  process.exit(1);
}
