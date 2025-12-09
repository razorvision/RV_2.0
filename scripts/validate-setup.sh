#!/bin/bash

# =============================================================================
# Project Setup Validator
# =============================================================================
# Validates that a project is properly configured for development.
# Checks files, environment variables, dependencies, and services.
#
# Usage:
#   bash scripts/validate-setup.sh
#   bash scripts/validate-setup.sh --fix    # Attempt automatic fixes
#   bash scripts/validate-setup.sh --quiet  # Only show errors
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Options
FIX_MODE=false
QUIET_MODE=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --fix)
      FIX_MODE=true
      ;;
    --quiet)
      QUIET_MODE=true
      ;;
    --help|-h)
      echo "Usage: $0 [--fix] [--quiet]"
      echo "  --fix    Attempt to automatically fix issues"
      echo "  --quiet  Only show errors and warnings"
      exit 0
      ;;
  esac
done

# Helper functions
print_header() {
  if [ "$QUIET_MODE" = false ]; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  fi
}

check_pass() {
  ((PASSED++))
  if [ "$QUIET_MODE" = false ]; then
    echo -e "  ${GREEN}✓${NC} $1"
  fi
}

check_fail() {
  ((FAILED++))
  echo -e "  ${RED}✗${NC} $1"
  if [ -n "$2" ]; then
    echo -e "    ${YELLOW}Fix:${NC} $2"
  fi
}

check_warn() {
  ((WARNINGS++))
  if [ "$QUIET_MODE" = false ]; then
    echo -e "  ${YELLOW}⚠${NC} $1"
  fi
}

check_skip() {
  if [ "$QUIET_MODE" = false ]; then
    echo -e "  ${BLUE}○${NC} $1 (skipped)"
  fi
}

# =============================================================================
# Check: Required Files
# =============================================================================
check_required_files() {
  print_header "Required Files"

  # Core files
  local required_files=(
    "package.json:Project manifest"
    "tsconfig.json:TypeScript configuration"
  )

  # Optional but recommended
  local recommended_files=(
    ".env.local:Environment variables (or .env)"
    "prisma/schema.prisma:Database schema"
    "src/app/layout.tsx:Next.js root layout (App Router)"
    "docker-compose.yml:Docker services configuration"
  )

  for entry in "${required_files[@]}"; do
    file="${entry%%:*}"
    desc="${entry##*:}"
    if [ -f "$file" ]; then
      check_pass "$desc ($file)"
    else
      check_fail "$desc ($file) - Required file missing"
    fi
  done

  for entry in "${recommended_files[@]}"; do
    file="${entry%%:*}"
    desc="${entry##*:}"

    # Special handling for .env files
    if [ "$file" = ".env.local" ]; then
      if [ -f ".env.local" ] || [ -f ".env" ]; then
        check_pass "$desc"
      else
        check_warn "$desc - Not found (create from .env.example)"
      fi
    elif [ -f "$file" ]; then
      check_pass "$desc ($file)"
    else
      check_warn "$desc ($file) - Not found"
    fi
  done
}

# =============================================================================
# Check: Environment Variables
# =============================================================================
check_env_variables() {
  print_header "Environment Variables"

  # Determine which env file to check
  local env_file=""
  if [ -f ".env.local" ]; then
    env_file=".env.local"
  elif [ -f ".env" ]; then
    env_file=".env"
  else
    check_fail "No environment file found (.env.local or .env)"
    if [ -f ".env.example" ]; then
      echo -e "    ${YELLOW}Fix:${NC} cp .env.example .env.local"
    fi
    return
  fi

  check_pass "Environment file found ($env_file)"

  # Required variables
  local required_vars=(
    "DATABASE_URL:Database connection string"
  )

  # Auth variables (at least one required)
  local auth_vars=(
    "AUTH_SECRET"
    "NEXTAUTH_SECRET"
  )

  # Check required variables
  for entry in "${required_vars[@]}"; do
    var="${entry%%:*}"
    desc="${entry##*:}"
    value=$(grep "^${var}=" "$env_file" 2>/dev/null | cut -d'=' -f2-)

    if [ -n "$value" ] && [ "$value" != '""' ] && [ "$value" != "''" ]; then
      check_pass "$var is set"
    else
      check_fail "$var - $desc not set"
    fi
  done

  # Check auth secret (one of multiple options)
  local auth_found=false
  for var in "${auth_vars[@]}"; do
    value=$(grep "^${var}=" "$env_file" 2>/dev/null | cut -d'=' -f2-)
    if [ -n "$value" ] && [ "$value" != '""' ] && [ "$value" != "''" ]; then
      auth_found=true
      check_pass "$var is set"
      break
    fi
  done

  if [ "$auth_found" = false ]; then
    check_fail "Auth secret (AUTH_SECRET or NEXTAUTH_SECRET) not set"
    echo -e "    ${YELLOW}Fix:${NC} Add to $env_file: AUTH_SECRET=\"\$(openssl rand -base64 32)\""
  fi

  # Check for placeholder values
  if grep -q "your-" "$env_file" 2>/dev/null; then
    check_warn "Possible placeholder values found (containing 'your-')"
  fi

  if grep -q "changeme" "$env_file" 2>/dev/null; then
    check_warn "Possible placeholder values found (containing 'changeme')"
  fi
}

# =============================================================================
# Check: Node.js Dependencies
# =============================================================================
check_dependencies() {
  print_header "Dependencies"

  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    check_fail "node_modules not found"
    if [ "$FIX_MODE" = true ]; then
      echo -e "    ${BLUE}Attempting fix: npm install${NC}"
      npm install
      check_pass "Dependencies installed"
    else
      echo -e "    ${YELLOW}Fix:${NC} npm install"
    fi
    return
  fi

  check_pass "node_modules directory exists"

  # Check key packages
  local key_packages=(
    "next:Next.js framework"
    "react:React library"
    "@prisma/client:Prisma client"
  )

  for entry in "${key_packages[@]}"; do
    pkg="${entry%%:*}"
    desc="${entry##*:}"

    if [ -d "node_modules/$pkg" ]; then
      check_pass "$desc ($pkg) installed"
    else
      check_warn "$desc ($pkg) not found"
    fi
  done

  # Check if Prisma client is generated
  if [ -d "node_modules/.prisma/client" ]; then
    check_pass "Prisma client generated"
  elif [ -f "prisma/schema.prisma" ]; then
    check_fail "Prisma client not generated"
    if [ "$FIX_MODE" = true ]; then
      echo -e "    ${BLUE}Attempting fix: npx prisma generate${NC}"
      npx prisma generate
      check_pass "Prisma client generated"
    else
      echo -e "    ${YELLOW}Fix:${NC} npx prisma generate"
    fi
  fi
}

# =============================================================================
# Check: Database Connection
# =============================================================================
check_database() {
  print_header "Database"

  if [ ! -f "prisma/schema.prisma" ]; then
    check_skip "No Prisma schema found"
    return
  fi

  # Check if we can reach the database
  if command -v npx &> /dev/null; then
    if npx prisma db execute --stdin <<< "SELECT 1" &> /dev/null; then
      check_pass "Database connection successful"
    else
      check_warn "Could not connect to database (may not be running)"
      echo -e "    ${YELLOW}Fix:${NC} Start your database or check DATABASE_URL"
    fi
  else
    check_skip "npx not available - cannot test database"
  fi
}

# =============================================================================
# Check: TypeScript
# =============================================================================
check_typescript() {
  print_header "TypeScript"

  if [ ! -f "tsconfig.json" ]; then
    check_skip "No tsconfig.json found"
    return
  fi

  if command -v npx &> /dev/null; then
    echo -e "  Running type check..."
    if npx tsc --noEmit 2>/dev/null; then
      check_pass "No TypeScript errors"
    else
      check_fail "TypeScript errors found"
      echo -e "    ${YELLOW}Fix:${NC} Run 'npx tsc --noEmit' to see errors"
    fi
  else
    check_skip "npx not available - cannot run type check"
  fi
}

# =============================================================================
# Check: Linting
# =============================================================================
check_linting() {
  print_header "Code Quality"

  if [ -f "package.json" ] && grep -q '"lint"' package.json 2>/dev/null; then
    echo -e "  Running linter..."
    if npm run lint --silent 2>/dev/null; then
      check_pass "No lint errors"
    else
      check_warn "Lint errors found"
      echo -e "    ${YELLOW}Fix:${NC} Run 'npm run lint' to see errors"
    fi
  else
    check_skip "No lint script found in package.json"
  fi
}

# =============================================================================
# Check: Git Configuration
# =============================================================================
check_git() {
  print_header "Git Configuration"

  if [ -d ".git" ]; then
    check_pass "Git repository initialized"
  else
    check_warn "Not a git repository"
    return
  fi

  # Check .gitignore
  if [ -f ".gitignore" ]; then
    check_pass ".gitignore exists"

    # Check for common entries
    local should_ignore=(
      "node_modules"
      ".env.local"
      ".next"
    )

    for entry in "${should_ignore[@]}"; do
      if grep -q "$entry" .gitignore 2>/dev/null; then
        check_pass "$entry in .gitignore"
      else
        check_warn "$entry not in .gitignore"
      fi
    done
  else
    check_fail ".gitignore not found"
  fi
}

# =============================================================================
# Check: Docker (optional)
# =============================================================================
check_docker() {
  print_header "Docker (Optional)"

  if ! command -v docker &> /dev/null; then
    check_skip "Docker not installed"
    return
  fi

  check_pass "Docker installed"

  if docker info &> /dev/null; then
    check_pass "Docker daemon running"
  else
    check_warn "Docker daemon not running"
  fi

  if [ -f "docker-compose.yml" ] || [ -f "compose.yaml" ]; then
    check_pass "Docker Compose file found"
  else
    check_skip "No docker-compose.yml found"
  fi
}

# =============================================================================
# Summary
# =============================================================================
print_summary() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  VALIDATION SUMMARY${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${GREEN}Passed:${NC}   $PASSED"
  echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
  echo -e "  ${RED}Failed:${NC}   $FAILED"
  echo ""

  if [ $FAILED -eq 0 ]; then
    echo -e "  ${GREEN}Status: Ready for development!${NC}"
    echo ""
    echo "  Next steps:"
    echo "    npm run dev"
    echo ""
  else
    echo -e "  ${RED}Status: Issues need attention${NC}"
    echo ""
    echo "  Fix the failed checks above, then run this script again."
    if [ "$FIX_MODE" = false ]; then
      echo "  Tip: Run with --fix to attempt automatic fixes"
    fi
    echo ""
  fi

  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =============================================================================
# Main
# =============================================================================
main() {
  if [ "$QUIET_MODE" = false ]; then
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║           PROJECT SETUP VALIDATOR                        ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
  fi

  check_required_files
  check_env_variables
  check_dependencies
  check_database
  check_typescript
  check_linting
  check_git
  check_docker

  print_summary

  # Exit with error code if any checks failed
  if [ $FAILED -gt 0 ]; then
    exit 1
  fi

  exit 0
}

main
