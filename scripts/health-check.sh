#!/bin/bash

# =============================================================================
# Application Health Check Script
# =============================================================================
# Checks the health of a running application and its dependencies.
# Use this to verify deployment readiness or diagnose issues.
#
# Usage:
#   bash scripts/health-check.sh                    # Check localhost:3000
#   bash scripts/health-check.sh http://example.com # Check custom URL
#   bash scripts/health-check.sh --services-only    # Only check services
#
# Exit codes:
#   0 - All health checks passed
#   1 - One or more health checks failed
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default configuration
APP_URL="${1:-http://localhost:3000}"
TIMEOUT=10
SERVICES_ONLY=false

# Counters
PASSED=0
FAILED=0

# Parse arguments
for arg in "$@"; do
  case $arg in
    --services-only)
      SERVICES_ONLY=true
      ;;
    --timeout=*)
      TIMEOUT="${arg#*=}"
      ;;
    --help|-h)
      echo "Usage: $0 [URL] [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  URL                Application URL (default: http://localhost:3000)"
      echo "  --services-only    Only check infrastructure services"
      echo "  --timeout=N        HTTP timeout in seconds (default: 10)"
      echo "  --help             Show this help message"
      exit 0
      ;;
  esac
done

# Helper functions
print_header() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_pass() {
  ((PASSED++))
  echo -e "  ${GREEN}✓${NC} $1"
}

check_fail() {
  ((FAILED++))
  echo -e "  ${RED}✗${NC} $1"
  if [ -n "$2" ]; then
    echo -e "    ${YELLOW}→${NC} $2"
  fi
}

check_info() {
  echo -e "  ${BLUE}ℹ${NC} $1"
}

# =============================================================================
# Check: System Resources
# =============================================================================
check_system() {
  print_header "System Resources"

  # Disk space
  local disk_usage
  if command -v df &> /dev/null; then
    disk_usage=$(df -h . 2>/dev/null | awk 'NR==2 {print $5}' | tr -d '%')
    if [ -n "$disk_usage" ]; then
      if [ "$disk_usage" -lt 90 ]; then
        check_pass "Disk usage: ${disk_usage}%"
      else
        check_fail "Disk usage critical: ${disk_usage}%" "Free up disk space"
      fi
    fi
  fi

  # Memory (Linux/Mac)
  if command -v free &> /dev/null; then
    local mem_available
    mem_available=$(free -m 2>/dev/null | awk '/^Mem:/ {print $7}')
    if [ -n "$mem_available" ]; then
      if [ "$mem_available" -gt 500 ]; then
        check_pass "Available memory: ${mem_available}MB"
      else
        check_fail "Low memory: ${mem_available}MB" "Close unused applications"
      fi
    fi
  fi

  # Node.js version
  if command -v node &> /dev/null; then
    local node_version
    node_version=$(node --version)
    local major_version
    major_version=$(echo "$node_version" | cut -d'.' -f1 | tr -d 'v')
    if [ "$major_version" -ge 18 ]; then
      check_pass "Node.js version: $node_version"
    else
      check_fail "Node.js version: $node_version" "Upgrade to Node.js 18+"
    fi
  else
    check_fail "Node.js not installed"
  fi
}

# =============================================================================
# Check: Database
# =============================================================================
check_database() {
  print_header "Database"

  # Check for DATABASE_URL
  local db_url=""
  if [ -f ".env.local" ]; then
    db_url=$(grep "^DATABASE_URL=" .env.local 2>/dev/null | cut -d'=' -f2-)
  elif [ -f ".env" ]; then
    db_url=$(grep "^DATABASE_URL=" .env 2>/dev/null | cut -d'=' -f2-)
  fi

  if [ -z "$db_url" ]; then
    check_info "DATABASE_URL not found in environment"
    return
  fi

  # Detect database type
  local db_type="unknown"
  if [[ "$db_url" == *"postgresql"* ]] || [[ "$db_url" == *"postgres"* ]]; then
    db_type="PostgreSQL"
  elif [[ "$db_url" == *"mysql"* ]]; then
    db_type="MySQL"
  elif [[ "$db_url" == *"sqlite"* ]] || [[ "$db_url" == *"file:"* ]]; then
    db_type="SQLite"
  fi

  check_info "Database type: $db_type"

  # Try to connect via Prisma
  if [ -f "prisma/schema.prisma" ] && command -v npx &> /dev/null; then
    if npx prisma db execute --stdin <<< "SELECT 1" &> /dev/null; then
      check_pass "Database connection successful"
    else
      check_fail "Database connection failed" "Check DATABASE_URL and ensure database is running"
    fi
  fi

  # Check if PostgreSQL is running locally (common case)
  if [ "$db_type" = "PostgreSQL" ]; then
    if command -v pg_isready &> /dev/null; then
      if pg_isready &> /dev/null; then
        check_pass "PostgreSQL server is accepting connections"
      else
        check_info "PostgreSQL not responding locally (may be remote)"
      fi
    fi
  fi
}

# =============================================================================
# Check: Redis
# =============================================================================
check_redis() {
  print_header "Redis (Optional)"

  # Check for Redis URL
  local redis_url=""
  if [ -f ".env.local" ]; then
    redis_url=$(grep -E "^(REDIS_URL|UPSTASH_REDIS_REST_URL)=" .env.local 2>/dev/null | head -1 | cut -d'=' -f2-)
  elif [ -f ".env" ]; then
    redis_url=$(grep -E "^(REDIS_URL|UPSTASH_REDIS_REST_URL)=" .env 2>/dev/null | head -1 | cut -d'=' -f2-)
  fi

  if [ -z "$redis_url" ]; then
    check_info "Redis not configured"
    return
  fi

  # Try redis-cli ping
  if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
      check_pass "Redis connection successful"
    else
      check_fail "Redis connection failed" "Check REDIS_URL and ensure Redis is running"
    fi
  else
    check_info "redis-cli not installed, cannot verify connection"
  fi
}

# =============================================================================
# Check: Docker Services
# =============================================================================
check_docker_services() {
  print_header "Docker Services"

  if ! command -v docker &> /dev/null; then
    check_info "Docker not installed"
    return
  fi

  if ! docker info &> /dev/null; then
    check_fail "Docker daemon not running"
    return
  fi

  check_pass "Docker daemon is running"

  # Check docker-compose services
  if [ -f "docker-compose.yml" ] || [ -f "compose.yaml" ]; then
    local compose_file="docker-compose.yml"
    [ -f "compose.yaml" ] && compose_file="compose.yaml"

    check_info "Compose file: $compose_file"

    # List running containers from this project
    if command -v docker-compose &> /dev/null; then
      local services
      services=$(docker-compose ps --services 2>/dev/null || echo "")
      if [ -n "$services" ]; then
        while IFS= read -r service; do
          local status
          status=$(docker-compose ps "$service" 2>/dev/null | grep -E "(Up|running)" || echo "")
          if [ -n "$status" ]; then
            check_pass "Service '$service' is running"
          else
            check_fail "Service '$service' is not running" "docker-compose up -d $service"
          fi
        done <<< "$services"
      fi
    fi
  else
    check_info "No docker-compose.yml found"
  fi
}

# =============================================================================
# Check: Application Health
# =============================================================================
check_application() {
  print_header "Application"

  if [ "$SERVICES_ONLY" = true ]; then
    check_info "Skipped (--services-only)"
    return
  fi

  check_info "Target: $APP_URL"

  # Check if application is responding
  if command -v curl &> /dev/null; then
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout "$TIMEOUT" "$APP_URL" 2>/dev/null || echo "000")

    if [ "$http_code" = "000" ]; then
      check_fail "Application not responding" "Is the server running? Try: npm run dev"
    elif [ "$http_code" = "200" ]; then
      check_pass "Application responding (HTTP $http_code)"
    elif [ "$http_code" -ge 200 ] && [ "$http_code" -lt 400 ]; then
      check_pass "Application responding (HTTP $http_code)"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
      check_fail "Client error (HTTP $http_code)" "Check application logs"
    else
      check_fail "Server error (HTTP $http_code)" "Check application logs"
    fi
  else
    check_info "curl not available, cannot check HTTP"
  fi

  # Check API health endpoint if it exists
  local api_health="${APP_URL}/api/health"
  if command -v curl &> /dev/null; then
    local api_code
    api_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout "$TIMEOUT" "$api_health" 2>/dev/null || echo "000")

    if [ "$api_code" = "200" ]; then
      check_pass "Health endpoint responding ($api_health)"
    elif [ "$api_code" != "000" ] && [ "$api_code" != "404" ]; then
      check_info "Health endpoint: HTTP $api_code"
    fi
  fi
}

# =============================================================================
# Check: Ports
# =============================================================================
check_ports() {
  print_header "Port Availability"

  local ports=(3000 5432 6379)
  local port_names=("Next.js" "PostgreSQL" "Redis")

  for i in "${!ports[@]}"; do
    local port="${ports[$i]}"
    local name="${port_names[$i]}"

    if command -v lsof &> /dev/null; then
      local pid
      pid=$(lsof -i ":$port" -t 2>/dev/null | head -1)
      if [ -n "$pid" ]; then
        local process
        process=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
        check_info "Port $port ($name): In use by $process (PID: $pid)"
      else
        check_info "Port $port ($name): Available"
      fi
    elif command -v netstat &> /dev/null; then
      if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        check_info "Port $port ($name): In use"
      else
        check_info "Port $port ($name): Available"
      fi
    fi
  done
}

# =============================================================================
# Check: External Services
# =============================================================================
check_external_services() {
  print_header "External Connectivity"

  local endpoints=(
    "https://api.github.com:GitHub API"
    "https://registry.npmjs.org:npm Registry"
  )

  for entry in "${endpoints[@]}"; do
    local url="${entry%%:*}"
    local name="${entry##*:}"

    if command -v curl &> /dev/null; then
      local http_code
      http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null || echo "000")

      if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        check_pass "$name is reachable"
      elif [ "$http_code" = "000" ]; then
        check_fail "$name unreachable" "Check network connection"
      else
        check_info "$name returned HTTP $http_code"
      fi
    fi
  done
}

# =============================================================================
# Summary
# =============================================================================
print_summary() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  HEALTH CHECK SUMMARY${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${GREEN}Passed:${NC} $PASSED"
  echo -e "  ${RED}Failed:${NC} $FAILED"
  echo ""

  if [ $FAILED -eq 0 ]; then
    echo -e "  ${GREEN}Status: All systems healthy!${NC}"
  else
    echo -e "  ${RED}Status: Issues detected${NC}"
    echo ""
    echo "  Review failed checks above and address any issues."
  fi

  echo ""
  echo -e "  Checked: $(date '+%Y-%m-%d %H:%M:%S')"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =============================================================================
# Main
# =============================================================================
main() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║              APPLICATION HEALTH CHECK                    ║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"

  check_system
  check_database
  check_redis
  check_docker_services
  check_application
  check_ports
  check_external_services

  print_summary

  if [ $FAILED -gt 0 ]; then
    exit 1
  fi

  exit 0
}

main
