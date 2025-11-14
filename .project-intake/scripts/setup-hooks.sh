#!/bin/bash

# Setup Git Hooks Script
# Installs pre-commit hook to prevent direct commits to main branch

echo "🔧 Setting up Git hooks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Error: Not in a git repository"
  echo "   Run this script from the root of your project"
  exit 1
fi

# Check if hooks directory exists
if [ ! -d ".git/hooks" ]; then
  echo "📁 Creating .git/hooks directory..."
  mkdir -p .git/hooks || {
    echo "❌ Error: Failed to create .git/hooks directory"
    echo "   Check file permissions and try again"
    exit 1
  }
fi

# Copy pre-commit hook
if [ -f ".project-intake/templates/pre-commit" ]; then
  echo "📋 Installing pre-commit hook..."
  cp .project-intake/templates/pre-commit .git/hooks/pre-commit || {
    echo "❌ Error: Failed to copy pre-commit hook"
    echo "   Check file permissions and try again"
    exit 1
  }

  # Make executable (Unix/Mac/Git Bash)
  chmod +x .git/hooks/pre-commit 2>/dev/null || {
    echo "⚠️  Warning: Could not make hook executable"
    echo "   This is normal on Windows - hook will still work"
  }

  echo "✅ Pre-commit hook installed successfully!"
else
  echo "❌ Error: pre-commit template not found"
  echo "   Looking for: .project-intake/templates/pre-commit"
  echo "   Make sure you're running this from the project root"
  exit 1
fi

# Test the hook
echo ""
echo "🧪 Testing pre-commit hook..."
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "⚠️  You are currently on the 'main' branch"
  echo "   The pre-commit hook will prevent direct commits to main"
  echo "   To test, try creating a test commit (it will be blocked)"
else
  echo "✅ Currently on branch: $CURRENT_BRANCH"
  echo "   Commits are allowed on feature branches"
fi

echo ""
echo "🎉 Git hooks setup complete!"
echo ""
echo "The pre-commit hook will now:"
echo "  ✓ Prevent direct commits to 'main' branch"
echo "  ✓ Enforce feature branch workflow"
echo "  ✓ Provide helpful error messages"
echo ""
echo "To bypass in emergencies: git commit --no-verify"
