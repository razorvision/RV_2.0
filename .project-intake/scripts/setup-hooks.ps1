# Setup Git Hooks Script (PowerShell)
# Installs pre-commit hook to prevent direct commits to main branch

Write-Host "🔧 Setting up Git hooks..." -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    Write-Host "   Run this script from the root of your project" -ForegroundColor Yellow
    exit 1
}

# Check if hooks directory exists
if (-not (Test-Path ".git\hooks")) {
    Write-Host "📁 Creating .git\hooks directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path ".git\hooks" -Force | Out-Null
}

# Copy pre-commit hook
if (Test-Path ".project-intake\templates\pre-commit") {
    Write-Host "📋 Installing pre-commit hook..." -ForegroundColor Yellow
    Copy-Item ".project-intake\templates\pre-commit" ".git\hooks\pre-commit" -Force
    Write-Host "✅ Pre-commit hook installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Error: pre-commit template not found" -ForegroundColor Red
    Write-Host "   Looking for: .project-intake\templates\pre-commit" -ForegroundColor Yellow
    exit 1
}

# Test the hook
Write-Host ""
Write-Host "🧪 Testing pre-commit hook..." -ForegroundColor Cyan

try {
    $currentBranch = git symbolic-ref --short HEAD 2>$null

    if ($currentBranch -eq "main") {
        Write-Host "⚠️  You are currently on the 'main' branch" -ForegroundColor Yellow
        Write-Host "   The pre-commit hook will prevent direct commits to main" -ForegroundColor Yellow
        Write-Host "   To test, try creating a test commit (it will be blocked)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Currently on branch: $currentBranch" -ForegroundColor Green
        Write-Host "   Commits are allowed on feature branches" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not determine current branch" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Git hooks setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "The pre-commit hook will now:" -ForegroundColor Cyan
Write-Host "  ✓ Prevent direct commits to 'main' branch" -ForegroundColor White
Write-Host "  ✓ Enforce feature branch workflow" -ForegroundColor White
Write-Host "  ✓ Provide helpful error messages" -ForegroundColor White
Write-Host ""
Write-Host "To bypass in emergencies: git commit --no-verify" -ForegroundColor Yellow
