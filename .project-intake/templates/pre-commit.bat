@echo off
REM Pre-commit hook to prevent direct commits to main branch (Windows .bat version)
REM This ensures all changes go through the feature branch -> PR -> merge workflow

REM Get current branch name
for /f "tokens=*" %%i in ('git symbolic-ref --short HEAD 2^>nul') do set BRANCH=%%i

if "%BRANCH%"=="main" (
    echo.
    echo ========================================
    echo ❌ ERROR: Direct commits to 'main' branch are not allowed!
    echo ========================================
    echo.
    echo Please follow the proper workflow:
    echo   1. Create a feature branch:
    echo      git checkout -b feature/your-feature-name
    echo.
    echo   2. Make your changes and commit:
    echo      git add .
    echo      git commit -m "feat: your description"
    echo.
    echo   3. Push and create a PR:
    echo      git push -u origin feature/your-feature-name
    echo      gh pr create
    echo.
    echo   4. Merge via PR:
    echo      gh pr merge --squash
    echo.
    echo If you absolutely need to commit to main ^(emergencies only^):
    echo   git commit --no-verify
    echo.
    exit /b 1
)

exit /b 0
