#!/usr/bin/env node

/**
 * Config Validator for Project Intake System
 *
 * Validates that config.json exists and has all required fields with correct types.
 */

const fs = require('fs');
const path = require('path');

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

function validateConfig() {
  const configPath = path.join(process.cwd(), '.project-intake', 'config.json');

  // Check if config.json exists
  if (!fs.existsSync(configPath)) {
    log('❌ Error: config.json not found', 'red');
    log('   Location: .project-intake/config.json', 'yellow');
    log('', 'reset');
    log('Please create config.json:', 'cyan');
    log('  1. Copy the template: cp .project-intake/config.template.json .project-intake/config.json', 'reset');
    log('  2. Edit config.json and fill in your project details', 'reset');
    log('  3. Run this validator again', 'reset');
    process.exit(1);
  }

  // Read and parse config
  let config;
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configContent);
  } catch (error) {
    log('❌ Error: Failed to parse config.json', 'red');
    log(`   ${error.message}`, 'yellow');
    log('', 'reset');
    log('Make sure config.json is valid JSON', 'cyan');
    process.exit(1);
  }

  // Define required fields with their types
  const requiredFields = {
    projectName: 'string',
    githubOwner: 'string',
    githubRepo: 'string',
  };

  // Define optional fields with their types
  const optionalFields = {
    projectDescription: 'string',
    primaryLanguage: 'string',
    packageManager: 'string',
    createProjectBoard: 'boolean',
    projectBoardName: 'string',
    installGitHooks: 'boolean',
    generateDocumentation: 'boolean',
    setupDatabase: 'boolean',
    databaseType: 'string',
    databaseORM: 'string',
    hasBackend: 'boolean',
    backendFramework: 'string',
    frontendFramework: 'string',
    buildTool: 'string',
    stylingApproach: 'string',
    testingFramework: 'string',
    installPlaywright: 'boolean',
    teamMembers: 'array',
    license: 'string',
    supportEmail: 'string',
  };

  const errors = [];
  const warnings = [];

  // Validate required fields
  for (const [field, expectedType] of Object.entries(requiredFields)) {
    if (!(field in config)) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    const value = config[field];

    // Check for empty string
    if (expectedType === 'string' && (!value || value.trim() === '')) {
      errors.push(`Required field '${field}' is empty`);
      continue;
    }

    // Check type
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== expectedType) {
      errors.push(`Field '${field}' should be ${expectedType}, got ${actualType}`);
    }
  }

  // Validate optional fields (only if present)
  for (const [field, expectedType] of Object.entries(optionalFields)) {
    if (field in config) {
      const value = config[field];
      const actualType = Array.isArray(value) ? 'array' : typeof value;

      if (actualType !== expectedType) {
        warnings.push(`Field '${field}' should be ${expectedType}, got ${actualType}`);
      }
    }
  }

  // Validate specific field values
  if (config.packageManager) {
    const validPackageManagers = ['pnpm', 'npm', 'yarn', 'auto-detect'];
    if (!validPackageManagers.includes(config.packageManager)) {
      warnings.push(`packageManager should be one of: ${validPackageManagers.join(', ')}`);
    }
  }

  // Conditional validations - fields required based on other field values
  if (config.createProjectBoard === true) {
    if (!config.projectBoardName || config.projectBoardName.trim() === '') {
      errors.push(`'projectBoardName' is required when 'createProjectBoard' is true`);
    }
  }

  if (config.setupDatabase === true) {
    if (!config.databaseType || config.databaseType.trim() === '') {
      errors.push(`'databaseType' is required when 'setupDatabase' is true`);
    }
    if (!config.databaseORM || config.databaseORM.trim() === '') {
      warnings.push(`'databaseORM' is recommended when 'setupDatabase' is true`);
    }
  }

  if (config.hasBackend === true) {
    if (!config.backendFramework || config.backendFramework.trim() === '') {
      warnings.push(`'backendFramework' is recommended when 'hasBackend' is true`);
    }
  }

  // Validate GitHub owner format (basic check)
  if (config.githubOwner && !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(config.githubOwner)) {
    errors.push(`githubOwner '${config.githubOwner}' contains invalid characters`);
  }

  // Validate GitHub repo format (basic check)
  if (config.githubRepo && !/^[a-zA-Z0-9._-]+$/.test(config.githubRepo)) {
    errors.push(`githubRepo '${config.githubRepo}' contains invalid characters`);
  }

  // Check for help fields (leftover from template)
  const helpFields = Object.keys(config).filter(key => key.startsWith('_'));
  if (helpFields.length > 0) {
    warnings.push(`Config contains template help fields: ${helpFields.join(', ')}`);
    warnings.push('These can be removed (optional)');
  }

  // Print results
  console.log('');
  log('🔍 Config Validation Results', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('');

  if (errors.length > 0) {
    log(`❌ Found ${errors.length} error(s):`, 'red');
    errors.forEach(error => {
      log(`   • ${error}`, 'red');
    });
    console.log('');
  }

  if (warnings.length > 0) {
    log(`⚠️  Found ${warnings.length} warning(s):`, 'yellow');
    warnings.forEach(warning => {
      log(`   • ${warning}`, 'yellow');
    });
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('✅ Config validation passed!', 'green');
    console.log('');
    log('Configuration summary:', 'cyan');
    log(`   Project: ${config.projectName}`, 'reset');
    log(`   GitHub: ${config.githubOwner}/${config.githubRepo}`, 'reset');
    log(`   Package Manager: ${config.packageManager || 'auto-detect'}`, 'reset');
    if (config.createProjectBoard) {
      log(`   Project Board: ${config.projectBoardName || config.projectName + ' Development'}`, 'reset');
    }
    console.log('');
    log('✅ Ready to run project intake system!', 'green');
    console.log('');
    process.exit(0);
  }

  if (errors.length > 0) {
    log('❌ Config validation failed', 'red');
    log('   Please fix the errors above and run validation again', 'yellow');
    console.log('');
    process.exit(1);
  }

  if (warnings.length > 0 && errors.length === 0) {
    log('⚠️  Config validation passed with warnings', 'yellow');
    log('   Warnings are non-critical but should be addressed', 'yellow');
    console.log('');
    process.exit(0);
  }
}

// Run validation
try {
  validateConfig();
} catch (error) {
  log('❌ Unexpected error during validation:', 'red');
  log(`   ${error.message}`, 'yellow');
  console.error(error);
  process.exit(1);
}
