# Config Validator for Project Intake System (PowerShell version)
# Validates that config.json exists and has required fields

Write-Host ""
Write-Host "🔍 Validating config.json..." -ForegroundColor Cyan
Write-Host ""

$configPath = ".project-intake\config.json"
$templatePath = ".project-intake\config.template.json"

# Check if config exists
if (-not (Test-Path $configPath)) {
    Write-Host "❌ Error: config.json not found" -ForegroundColor Red
    Write-Host "   Location: $configPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create config.json:" -ForegroundColor Cyan
    Write-Host "  1. Copy the template:" -ForegroundColor White
    Write-Host "     Copy-Item $templatePath $configPath" -ForegroundColor Gray
    Write-Host "  2. Edit config.json and fill in your project details" -ForegroundColor White
    Write-Host "  3. Run this validator again" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Read and parse config
try {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
} catch {
    Write-Host "❌ Error: Failed to parse config.json" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure config.json is valid JSON" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

$errors = @()
$warnings = @()

# Define required fields
$requiredFields = @{
    projectName = "string"
    githubOwner = "string"
    githubRepo = "string"
}

# Validate required fields
foreach ($field in $requiredFields.Keys) {
    if (-not $config.PSObject.Properties.Name.Contains($field)) {
        $errors += "Missing required field: $field"
        continue
    }

    $value = $config.$field
    $expectedType = $requiredFields[$field]

    # Check for empty string
    if ($expectedType -eq "string" -and ([string]::IsNullOrWhiteSpace($value))) {
        $errors += "Required field '$field' is empty"
        continue
    }

    # Check type
    $actualType = $value.GetType().Name.ToLower()
    if ($actualType -ne $expectedType) {
        $errors += "Field '$field' should be $expectedType, got $actualType"
    }
}

# Validate GitHub owner format
if ($config.githubOwner -and $config.githubOwner -notmatch '^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$') {
    $errors += "githubOwner '$($config.githubOwner)' contains invalid characters"
}

# Validate GitHub repo format
if ($config.githubRepo -and $config.githubRepo -notmatch '^[a-zA-Z0-9._-]+$') {
    $errors += "githubRepo '$($config.githubRepo)' contains invalid characters"
}

# Validate package manager
if ($config.packageManager) {
    $validPackageManagers = @('pnpm', 'npm', 'yarn', 'auto-detect')
    if ($config.packageManager -notin $validPackageManagers) {
        $warnings += "packageManager should be one of: $($validPackageManagers -join ', ')"
    }
}

# Check for boolean fields
if ($config.PSObject.Properties.Name.Contains('createProjectBoard')) {
    if ($config.createProjectBoard -isnot [bool]) {
        $warnings += "createProjectBoard should be true or false (boolean)"
    }
}

# Check for help fields
$helpFields = $config.PSObject.Properties.Name | Where-Object { $_ -like '_*' }
if ($helpFields.Count -gt 0) {
    $warnings += "Config contains template help fields: $($helpFields -join ', ')"
    $warnings += "These can be removed (optional)"
}

# Print results
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($errors.Count -gt 0) {
    Write-Host "❌ Found $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  Found $($warnings.Count) warning(s):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ Config validation passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration summary:" -ForegroundColor Cyan
    Write-Host "   Project: $($config.projectName)" -ForegroundColor White
    Write-Host "   GitHub: $($config.githubOwner)/$($config.githubRepo)" -ForegroundColor White
    if ($config.packageManager) {
        Write-Host "   Package Manager: $($config.packageManager)" -ForegroundColor White
    }
    if ($config.createProjectBoard) {
        $boardName = if ($config.projectBoardName) { $config.projectBoardName } else { "$($config.projectName) Development" }
        Write-Host "   Project Board: $boardName" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "✅ Ready to run project intake system!" -ForegroundColor Green
    Write-Host ""
    exit 0
}

if ($errors.Count -gt 0) {
    Write-Host "❌ Config validation failed" -ForegroundColor Red
    Write-Host "   Please fix the errors above and run validation again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if ($warnings.Count -gt 0 -and $errors.Count -eq 0) {
    Write-Host "⚠️  Config validation passed with warnings" -ForegroundColor Yellow
    Write-Host "   Warnings are non-critical but should be addressed" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}
