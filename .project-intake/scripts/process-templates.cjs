#!/usr/bin/env node

/**
 * Template Processor for Project Intake System
 *
 * Replaces placeholders in template files with values from config.json
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

function loadConfig() {
  const configPath = path.join(process.cwd(), '.project-intake', 'config.json');

  if (!fs.existsSync(configPath)) {
    log('❌ Error: config.json not found', 'red');
    log('   Run validate-config first to check your configuration', 'yellow');
    process.exit(1);
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    log('❌ Error: Failed to parse config.json', 'red');
    log(`   ${error.message}`, 'yellow');
    process.exit(1);
  }
}

function processTemplate(templateContent, config) {
  let processed = templateContent;

  // Replace placeholders with config values
  const replacements = {
    '{{projectName}}': config.projectName || 'YourProject',
    '{{githubOwner}}': config.githubOwner || 'your-username',
    '{{githubRepo}}': config.githubRepo || 'your-repo',
    '{{projectBoardName}}': config.projectBoardName || config.projectName + ' Development',
    '{{packageManager}}': config.packageManager || 'pnpm',
    '{{primaryLanguage}}': config.primaryLanguage || 'TypeScript',
    '{{frontendFramework}}': config.frontendFramework || 'React',
    '{{buildTool}}': config.buildTool || 'Vite',
    '{{databaseType}}': config.databaseType || 'PostgreSQL',
    '{{databaseORM}}': config.databaseORM || 'Drizzle',
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }

  return processed;
}

function processFile(templatePath, outputPath, config) {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const processedContent = processTemplate(templateContent, config);
    fs.writeFileSync(outputPath, processedContent, 'utf8');
    return true;
  } catch (error) {
    log(`   ❌ Failed to process ${path.basename(templatePath)}: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('', 'reset');
  log('🔄 Processing Template Files', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');

  // Load config
  const config = loadConfig();

  log(`📦 Project: ${config.projectName}`, 'cyan');
  log(`📦 GitHub: ${config.githubOwner}/${config.githubRepo}`, 'cyan');
  log('', 'reset');

  const templatesDir = path.join(process.cwd(), '.project-intake', 'templates');
  const projectRoot = process.cwd();

  // Define template → output file mappings
  const filesToProcess = [
    {
      template: path.join(templatesDir, 'WORKFLOW_GUIDE.template.md'),
      output: path.join(projectRoot, 'WORKFLOW_GUIDE.md'),
    },
    {
      template: path.join(templatesDir, 'TEAM_MEETING_CHECKLIST.template.md'),
      output: path.join(projectRoot, 'TEAM_MEETING_CHECKLIST.md'),
    },
    {
      template: path.join(templatesDir, 'README.template.md'),
      output: path.join(projectRoot, 'README.md'),
      skipIfExists: true, // Don't overwrite existing README
    },
    {
      template: path.join(templatesDir, 'issue-template.md'),
      output: path.join(projectRoot, '.github', 'ISSUE_TEMPLATE.md'),
      createDir: true, // Create .github directory if needed
    },
    {
      template: path.join(templatesDir, 'pr-template.md'),
      output: path.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md'),
      createDir: true, // Create .github directory if needed
    },
    {
      template: path.join(templatesDir, '.prettierrc'),
      output: path.join(projectRoot, '.prettierrc'),
      skipIfExists: true, // Don't overwrite existing Prettier config
    },
    {
      template: path.join(templatesDir, '.env.example'),
      output: path.join(projectRoot, '.env.example'),
      skipIfExists: true, // Don't overwrite existing .env.example
    },
  ];

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of filesToProcess) {
    const outputName = path.basename(file.output);

    // Check if we should skip existing files
    if (file.skipIfExists && fs.existsSync(file.output)) {
      log(`⏭️  Skipped: ${outputName} (already exists)`, 'yellow');
      skipped++;
      continue;
    }

    // Check if template exists
    if (!fs.existsSync(file.template)) {
      log(`⚠️  Warning: Template not found for ${outputName}`, 'yellow');
      skipped++;
      continue;
    }

    // Create output directory if needed
    if (file.createDir) {
      const outputDir = path.dirname(file.output);
      if (!fs.existsSync(outputDir)) {
        try {
          fs.mkdirSync(outputDir, { recursive: true });
          log(`📁 Created directory: ${path.relative(projectRoot, outputDir)}`, 'cyan');
        } catch (error) {
          log(`   ❌ Failed to create directory for ${outputName}: ${error.message}`, 'red');
          failed++;
          continue;
        }
      }
    }

    // Process template
    log(`🔄 Processing: ${outputName}...`, 'reset');
    if (processFile(file.template, file.output, config)) {
      log(`   ✅ Created: ${outputName}`, 'green');
      processed++;
    } else {
      failed++;
    }
  }

  log('', 'reset');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');

  log(`✅ Processed: ${processed} file(s)`, 'green');
  if (skipped > 0) {
    log(`⏭️  Skipped: ${skipped} file(s)`, 'yellow');
  }
  if (failed > 0) {
    log(`❌ Failed: ${failed} file(s)`, 'red');
  }

  log('', 'reset');

  if (failed > 0) {
    log('❌ Template processing completed with errors', 'red');
    process.exit(1);
  } else {
    log('✅ Template processing complete!', 'green');
    log('', 'reset');
    log('Next steps:', 'cyan');
    log('  1. Review the generated files', 'reset');
    log('  2. Make any necessary customizations', 'reset');
    log('  3. Commit the files to your repository', 'reset');
    log('', 'reset');
    process.exit(0);
  }
}

// Run main function
try {
  main();
} catch (error) {
  log('❌ Unexpected error:', 'red');
  log(`   ${error.message}`, 'yellow');
  console.error(error);
  process.exit(1);
}
