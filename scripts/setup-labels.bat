@echo off
REM GitHub Project Management Setup Script (Windows)
REM This script creates all labels and milestones for a new repository

echo.
echo Setting up Project Management Infrastructure...
echo.

REM Check if gh CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo GitHub CLI (gh) is not installed.
    echo Install it from: https://cli.github.com/
    exit /b 1
)

echo GitHub CLI found
echo.

REM Verify we're in a git repository
git rev-parse --git-dir >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Not in a git repository. Please run this from your repo root.
    exit /b 1
)

echo Creating Labels...
echo.

REM Priority Labels
echo Creating priority labels...
gh label create "priority: high" --color "d73a4a" --description "Critical, needs immediate attention" 2>nul || echo   priority: high already exists
gh label create "priority: medium" --color "fbca04" --description "Important but not urgent" 2>nul || echo   priority: medium already exists
gh label create "priority: low" --color "0e8a16" --description "Nice to have, low urgency" 2>nul || echo   priority: low already exists

REM Type Labels
echo Creating type labels...
gh label create "type: feature" --color "a2eeef" --description "New feature or enhancement" 2>nul || echo   type: feature already exists
gh label create "type: bug" --color "d73a4a" --description "Something isn't working" 2>nul || echo   type: bug already exists
gh label create "type: documentation" --color "0075ca" --description "Documentation only changes" 2>nul || echo   type: documentation already exists
gh label create "type: refactor" --color "fbca04" --description "Code refactoring" 2>nul || echo   type: refactor already exists
gh label create "type: test" --color "c5def5" --description "Adding or updating tests" 2>nul || echo   type: test already exists

REM Status Labels
echo Creating status labels...
gh label create "status: blocked" --color "b60205" --description "Blocked by dependency or issue" 2>nul || echo   status: blocked already exists
gh label create "status: in-progress" --color "0052cc" --description "Currently being worked on" 2>nul || echo   status: in-progress already exists
gh label create "status: needs-review" --color "fbca04" --description "Awaiting code review" 2>nul || echo   status: needs-review already exists
gh label create "status: ready" --color "0e8a16" --description "Ready to be worked on" 2>nul || echo   status: ready already exists

REM Phase Labels
echo Creating phase labels...
gh label create "phase: 1" --color "d876e3" --description "Phase 1 - MVP" 2>nul || echo   phase: 1 already exists
gh label create "phase: 2" --color "d876e3" --description "Phase 2 - Enhancements" 2>nul || echo   phase: 2 already exists
gh label create "phase: 3" --color "d876e3" --description "Phase 3 - Advanced Features" 2>nul || echo   phase: 3 already exists

REM Client Visibility Labels
echo Creating client visibility labels...
gh label create "client: visible" --color "ff69b4" --description "User-facing changes" 2>nul || echo   client: visible already exists
gh label create "client: internal" --color "c2e0c6" --description "Internal/backend changes" 2>nul || echo   client: internal already exists

REM Effort Labels
echo Creating effort labels...
gh label create "effort: small" --color "bfdadc" --description "< 2 hours" 2>nul || echo   effort: small already exists
gh label create "effort: medium" --color "5b9aa6" --description "2-8 hours" 2>nul || echo   effort: medium already exists
gh label create "effort: large" --color "1d4e5c" --description "> 8 hours" 2>nul || echo   effort: large already exists

REM Epic Label
echo Creating epic label...
gh label create "epic" --color "3e4b9e" --description "Large feature spanning multiple issues" 2>nul || echo   epic already exists

echo.
echo All labels created!
echo.

REM Create Milestones
echo Creating Milestones...
echo.

REM Get repo info
for /f "delims=" %%i in ('gh repo view --json nameWithOwner -q .nameWithOwner') do set REPO=%%i

echo Creating milestones for %REPO%...

gh api "repos/%REPO%/milestones" -f title="Phase 1: MVP Launch" -f description="Initial MVP release with core features" 2>nul && echo   Created: Phase 1: MVP Launch || echo   Phase 1: MVP Launch may already exist
gh api "repos/%REPO%/milestones" -f title="Phase 2: Enhancements" -f description="Feature enhancements and optimizations" 2>nul && echo   Created: Phase 2: Enhancements || echo   Phase 2: Enhancements may already exist
gh api "repos/%REPO%/milestones" -f title="Phase 3: Advanced Features" -f description="Advanced functionality and scaling" 2>nul && echo   Created: Phase 3: Advanced Features || echo   Phase 3: Advanced Features may already exist

echo.
echo All milestones created!
echo.

echo Project Management setup complete!
echo.
echo Next steps:
echo 1. Review PROJECT_MANAGEMENT_GUIDE.md for workflows
echo 2. Set up GitHub Project board (see PROJECT_VIEWS_GUIDE.md)
echo 3. Enable GitHub Discussions (optional, in repo Settings)
echo 4. Start creating issues with the new templates!
echo.

pause
