#!/bin/bash

# Config Validator for Project Intake System (Bash version)
# Validates that config.json exists and has required fields

set -e

echo ""
echo "🔍 Validating config.json..."
echo ""

CONFIG_PATH=".project-intake/config.json"
TEMPLATE_PATH=".project-intake/config.template.json"

# Check if config exists
if [ ! -f "$CONFIG_PATH" ]; then
  echo "❌ Error: config.json not found"
  echo "   Location: $CONFIG_PATH"
  echo ""
  echo "Please create config.json:"
  echo "  1. Copy the template:"
  echo "     cp $TEMPLATE_PATH $CONFIG_PATH"
  echo "  2. Edit config.json and fill in your project details"
  echo "  3. Run this validator again"
  echo ""
  exit 1
fi

# Check if jq is available (for better JSON parsing)
if ! command -v jq &> /dev/null; then
  echo "⚠️  Warning: jq not found, using basic validation"
  echo "   Install jq for better validation: brew install jq (Mac) or apt install jq (Linux)"
  echo ""

  # Basic validation without jq
  if ! grep -q '"projectName"' "$CONFIG_PATH"; then
    echo "❌ Error: config.json missing 'projectName' field"
    exit 1
  fi

  if ! grep -q '"githubOwner"' "$CONFIG_PATH"; then
    echo "❌ Error: config.json missing 'githubOwner' field"
    exit 1
  fi

  if ! grep -q '"githubRepo"' "$CONFIG_PATH"; then
    echo "❌ Error: config.json missing 'githubRepo' field"
    exit 1
  fi

  echo "✅ Basic validation passed"
  echo "   Note: Install jq for comprehensive validation"
  echo ""
  exit 0
fi

# Advanced validation with jq
ERRORS=0
WARNINGS=0

# Check required fields
PROJECT_NAME=$(jq -r '.projectName // empty' "$CONFIG_PATH")
GITHUB_OWNER=$(jq -r '.githubOwner // empty' "$CONFIG_PATH")
GITHUB_REPO=$(jq -r '.githubRepo // empty' "$CONFIG_PATH")

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Error: Required field 'projectName' is missing or empty"
  ERRORS=$((ERRORS + 1))
fi

if [ -z "$GITHUB_OWNER" ]; then
  echo "❌ Error: Required field 'githubOwner' is missing or empty"
  ERRORS=$((ERRORS + 1))
fi

if [ -z "$GITHUB_REPO" ]; then
  echo "❌ Error: Required field 'githubRepo' is missing or empty"
  ERRORS=$((ERRORS + 1))
fi

# Validate GitHub owner format
if [ -n "$GITHUB_OWNER" ] && ! echo "$GITHUB_OWNER" | grep -qE '^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$'; then
  echo "❌ Error: githubOwner '$GITHUB_OWNER' contains invalid characters"
  ERRORS=$((ERRORS + 1))
fi

# Validate GitHub repo format
if [ -n "$GITHUB_REPO" ] && ! echo "$GITHUB_REPO" | grep -qE '^[a-zA-Z0-9._-]+$'; then
  echo "❌ Error: githubRepo '$GITHUB_REPO' contains invalid characters"
  ERRORS=$((ERRORS + 1))
fi

# Check boolean fields
CREATE_PROJECT_BOARD=$(jq -r '.createProjectBoard // false' "$CONFIG_PATH")
if [ "$CREATE_PROJECT_BOARD" != "true" ] && [ "$CREATE_PROJECT_BOARD" != "false" ]; then
  echo "⚠️  Warning: createProjectBoard should be true or false"
  WARNINGS=$((WARNINGS + 1))
fi

# Check package manager
PACKAGE_MANAGER=$(jq -r '.packageManager // "auto-detect"' "$CONFIG_PATH")
if [ -n "$PACKAGE_MANAGER" ] && [ "$PACKAGE_MANAGER" != "pnpm" ] && [ "$PACKAGE_MANAGER" != "npm" ] && [ "$PACKAGE_MANAGER" != "yarn" ] && [ "$PACKAGE_MANAGER" != "auto-detect" ]; then
  echo "⚠️  Warning: packageManager should be 'pnpm', 'npm', 'yarn', or 'auto-detect'"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for help fields (leftover from template)
HELP_FIELDS=$(jq -r 'keys[] | select(startswith("_"))' "$CONFIG_PATH" 2>/dev/null | wc -l)
if [ "$HELP_FIELDS" -gt 0 ]; then
  echo "⚠️  Warning: Config contains $HELP_FIELDS template help fields (can be removed)"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Print results
if [ $ERRORS -gt 0 ]; then
  echo "❌ Config validation failed with $ERRORS error(s)"
  echo "   Please fix the errors above and run validation again"
  echo ""
  exit 1
fi

if [ $WARNINGS -gt 0 ]; then
  echo "⚠️  Config validation passed with $WARNINGS warning(s)"
  echo "   Warnings are non-critical but should be addressed"
  echo ""
fi

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ Config validation passed!"
  echo ""
  echo "Configuration summary:"
  echo "   Project: $PROJECT_NAME"
  echo "   GitHub: $GITHUB_OWNER/$GITHUB_REPO"
  echo "   Package Manager: $PACKAGE_MANAGER"
  echo ""
  echo "✅ Ready to run project intake system!"
  echo ""
fi

exit 0
