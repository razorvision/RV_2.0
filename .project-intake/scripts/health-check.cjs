#!/usr/bin/env node

/**
 * Project Health Check Dashboard
 *
 * Validates project setup and shows completion status of all intake steps
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

function checkExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function printHeader() {
  log('', 'reset');
  log('🏥 Project Health Check Dashboard', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');
}

function printStep(stepNumber, stepName, status, details = []) {
  const statusIcon = status === 'complete' ? '✅' : status === 'partial' ? '⚠️' : '❌';
  const statusColor = status === 'complete' ? 'green' : status === 'partial' ? 'yellow' : 'red';

  log(`${statusIcon} Step ${stepNumber}: ${stepName}`, statusColor);

  if (details.length > 0) {
    details.forEach(detail => {
      const detailIcon = detail.status ? '  ✓' : '  ✗';
      const detailColor = detail.status ? 'gray' : 'yellow';
      log(`${detailIcon} ${detail.message}`, detailColor);
    });
  }
  log('', 'reset');
}

function checkStep0Prerequisites() {
  const checks = [];

  // Check if in git repo
  const gitStatus = execCommand('git status 2>&1');
  checks.push({
    status: gitStatus !== null,
    message: 'Git repository initialized',
  });

  // Check if config.json exists
  const configExists = checkExists('.project-intake/config.json');
  checks.push({
    status: configExists,
    message: 'config.json exists',
  });

  // Check if config is valid
  let configValid = false;
  if (configExists) {
    try {
      const config = JSON.parse(fs.readFileSync('.project-intake/config.json', 'utf8'));
      configValid = !!(config.projectName && config.githubOwner && config.githubRepo);
      checks.push({
        status: configValid,
        message: 'config.json has required fields (projectName, githubOwner, githubRepo)',
      });
    } catch (error) {
      checks.push({
        status: false,
        message: 'config.json is valid JSON',
      });
    }
  }

  const allComplete = checks.every(c => c.status);
  return {
    status: allComplete ? 'complete' : 'incomplete',
    checks,
  };
}

function checkStep1InitialAnalysis() {
  const checks = [];

  // Check if README exists and has been updated
  const readmeExists = checkExists('README.md');
  checks.push({
    status: readmeExists,
    message: 'README.md exists',
  });

  // Check if README has tech stack section
  if (readmeExists) {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    const hasTechStack = readmeContent.includes('Tech Stack') || readmeContent.includes('Technology Stack');
    checks.push({
      status: hasTechStack,
      message: 'README documents tech stack',
    });
  }

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function checkStep2GitSetup() {
  const checks = [];

  // Check if pre-commit hook exists
  const hookExists = checkExists('.git/hooks/pre-commit');
  checks.push({
    status: hookExists,
    message: 'Pre-commit hook installed',
  });

  // Check if hook prevents main commits
  if (hookExists) {
    const hookContent = fs.readFileSync('.git/hooks/pre-commit', 'utf8');
    const blocksMain = hookContent.includes('main') || hookContent.includes('master');
    checks.push({
      status: blocksMain,
      message: 'Hook blocks direct commits to main',
    });
  }

  // Check for WORKFLOW_GUIDE
  const workflowExists = checkExists('WORKFLOW_GUIDE.md');
  checks.push({
    status: workflowExists,
    message: 'WORKFLOW_GUIDE.md exists',
  });

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function checkStep3Documentation() {
  const checks = [];

  // Check for key documentation files
  const files = [
    { path: 'README.md', name: 'README.md' },
    { path: 'WORKFLOW_GUIDE.md', name: 'WORKFLOW_GUIDE.md' },
    { path: 'TEAM_MEETING_CHECKLIST.md', name: 'TEAM_MEETING_CHECKLIST.md' },
    { path: 'CONTRIBUTING.md', name: 'CONTRIBUTING.md' },
  ];

  files.forEach(file => {
    checks.push({
      status: checkExists(file.path),
      message: `${file.name} exists`,
    });
  });

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function checkStep4DevEnvironment() {
  const checks = [];

  // Check GitHub CLI
  const ghInstalled = execCommand('gh --version') !== null;
  checks.push({
    status: ghInstalled,
    message: 'GitHub CLI installed',
  });

  if (ghInstalled) {
    const ghAuth = execCommand('gh auth status 2>&1');
    const ghAuthenticated = ghAuth && ghAuth.includes('Logged in');
    checks.push({
      status: ghAuthenticated,
      message: 'GitHub CLI authenticated',
    });
  }

  // Check for .env.example
  const envExampleExists = checkExists('.env.example');
  checks.push({
    status: envExampleExists,
    message: '.env.example exists',
  });

  // Check for Prettier config
  const prettierExists = checkExists('.prettierrc') || checkExists('.prettierrc.json') || checkExists('.prettierrc.js');
  checks.push({
    status: prettierExists,
    message: 'Prettier config exists',
  });

  // Check package manager
  const packageJsonExists = checkExists('package.json');
  if (packageJsonExists) {
    const pnpmLock = checkExists('pnpm-lock.yaml');
    const npmLock = checkExists('package-lock.json');
    const yarnLock = checkExists('yarn.lock');
    checks.push({
      status: pnpmLock || npmLock || yarnLock,
      message: 'Package manager lock file exists',
    });
  }

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function checkStep5GitHubIntegration() {
  const checks = [];

  // Check if GitHub CLI is available
  const ghInstalled = execCommand('gh --version') !== null;

  if (!ghInstalled) {
    checks.push({
      status: false,
      message: 'GitHub CLI required for project board check',
    });
    return {
      status: 'incomplete',
      checks,
    };
  }

  // Try to check for project board
  try {
    const config = JSON.parse(fs.readFileSync('.project-intake/config.json', 'utf8'));
    const projectList = execCommand(`gh project list --owner ${config.githubOwner} --format json 2>&1`);

    if (projectList) {
      const projects = JSON.parse(projectList);
      const hasProjectBoard = projects && projects.projects && projects.projects.length > 0;
      checks.push({
        status: hasProjectBoard,
        message: hasProjectBoard ? 'GitHub project board exists' : 'No project boards found',
      });
    } else {
      checks.push({
        status: false,
        message: 'Unable to query GitHub projects',
      });
    }
  } catch (error) {
    checks.push({
      status: false,
      message: 'Unable to verify project board (check GitHub CLI auth)',
    });
  }

  // Check for issue templates
  const issueTemplateExists = checkExists('.github/ISSUE_TEMPLATE.md') ||
                               checkExists('.github/ISSUE_TEMPLATE/') ||
                               checkExists('.project-intake/templates/issue-template.md');
  checks.push({
    status: issueTemplateExists,
    message: 'Issue template available',
  });

  // Check for PR template
  const prTemplateExists = checkExists('.github/PULL_REQUEST_TEMPLATE.md') ||
                           checkExists('.project-intake/templates/pr-template.md');
  checks.push({
    status: prTemplateExists,
    message: 'PR template available',
  });

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function checkStep6QualityStandards() {
  const checks = [];

  // Check for quality documentation
  const readmeExists = checkExists('README.md');
  if (readmeExists) {
    const readmeContent = fs.readFileSync('README.md', 'utf8');

    const hasCodingStandards = readmeContent.includes('Coding Standards') ||
                                readmeContent.includes('Code Style') ||
                                readmeContent.includes('Best Practices');
    checks.push({
      status: hasCodingStandards,
      message: 'Coding standards documented',
    });

    const hasSecurity = readmeContent.includes('Security') || readmeContent.includes('security');
    checks.push({
      status: hasSecurity,
      message: 'Security practices documented',
    });

    const hasArchitecture = readmeContent.includes('Architecture') || readmeContent.includes('Project Structure');
    checks.push({
      status: hasArchitecture,
      message: 'Architecture documented',
    });
  } else {
    checks.push({
      status: false,
      message: 'README.md required for quality standards',
    });
  }

  // Check for testing setup
  const packageJsonExists = checkExists('package.json');
  if (packageJsonExists) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasTestScript = packageJson.scripts && packageJson.scripts.test;
    checks.push({
      status: hasTestScript,
      message: 'Test script configured',
    });
  }

  const allComplete = checks.every(c => c.status);
  const anyComplete = checks.some(c => c.status);

  return {
    status: allComplete ? 'complete' : anyComplete ? 'partial' : 'incomplete',
    checks,
  };
}

function printSummary(results) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');

  const completed = results.filter(r => r.status === 'complete').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const incomplete = results.filter(r => r.status === 'incomplete').length;
  const total = results.length;

  log('📊 Summary', 'cyan');
  log(`   Complete:   ${completed}/${total}`, 'green');
  if (partial > 0) {
    log(`   Partial:    ${partial}/${total}`, 'yellow');
  }
  if (incomplete > 0) {
    log(`   Incomplete: ${incomplete}/${total}`, 'red');
  }

  log('', 'reset');

  const completionRate = Math.round((completed / total) * 100);

  if (completionRate === 100) {
    log('✅ All intake steps complete! Your project is fully set up.', 'green');
  } else if (completionRate >= 50) {
    log('⚠️  Project intake is in progress. Complete remaining steps.', 'yellow');
  } else {
    log('❌ Project intake incomplete. Run the intake system with Claude Code.', 'red');
  }

  log('', 'reset');

  if (completionRate < 100) {
    log('💡 Next steps:', 'cyan');
    log('   1. Open Claude Code', 'reset');
    log('   2. Say: "Please execute the project intake system in .project-intake/"', 'reset');
    log('   3. Review and complete any remaining steps', 'reset');
    log('', 'reset');
  }
}

function main() {
  printHeader();

  const results = [];

  const step0 = checkStep0Prerequisites();
  printStep('0', 'Prerequisites', step0.status, step0.checks);
  results.push(step0);

  const step1 = checkStep1InitialAnalysis();
  printStep('1', 'Initial Analysis', step1.status, step1.checks);
  results.push(step1);

  const step2 = checkStep2GitSetup();
  printStep('2', 'Git Setup', step2.status, step2.checks);
  results.push(step2);

  const step3 = checkStep3Documentation();
  printStep('3', 'Documentation', step3.status, step3.checks);
  results.push(step3);

  const step4 = checkStep4DevEnvironment();
  printStep('4', 'Development Environment', step4.status, step4.checks);
  results.push(step4);

  const step5 = checkStep5GitHubIntegration();
  printStep('5', 'GitHub Integration', step5.status, step5.checks);
  results.push(step5);

  const step6 = checkStep6QualityStandards();
  printStep('6', 'Quality Standards', step6.status, step6.checks);
  results.push(step6);

  printSummary(results);
}

// Run health check
try {
  main();
} catch (error) {
  log('❌ Unexpected error during health check:', 'red');
  log(`   ${error.message}`, 'yellow');
  console.error(error);
  process.exit(1);
}
