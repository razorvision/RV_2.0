# Step 4: Development Environment Setup

## 🎯 Goal

Configure development tools, environment variables, code formatting, and Claude Code automation to create a consistent, efficient development environment for the team.

## 📋 Instructions for Claude Code

### Phase 1: Check and Install Required Tools

Verify and install essential development tools.

#### 1. GitHub CLI

**Check if installed:**
```bash
gh --version
```

**If not installed (Windows):**
```bash
winget install --id GitHub.cli
```

**If not installed (Mac):**
```bash
brew install gh
```

**If not installed (Linux):**
```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

**Authenticate:**
```bash
# Authenticate with GitHub
gh auth login || {
  echo "❌ GitHub CLI authentication failed"
  echo "   Please check your internet connection and try again"
  exit 1
}

# Verify authentication
gh auth status || {
  echo "❌ GitHub CLI authentication verification failed"
  exit 1
}

echo "✅ GitHub CLI authenticated successfully"
```

**Grant project access (required for project board automation):**
```bash
# Grant project permissions
gh auth refresh -s project || {
  echo "❌ Failed to grant project permissions"
  echo "   This is required for project board automation"
  echo "   Try running: gh auth refresh -s project"
  exit 1
}

# Verify project permissions
gh auth status 2>&1 | grep -q "project" && {
  echo "✅ Project permissions granted"
} || {
  echo "⚠️  Warning: Project permissions may not be granted"
  echo "   Run 'gh auth status' to check scopes"
}
```

#### 2. Playwright (for screenshot automation)

**Check if installed:**
```bash
pnpm list playwright || npm list playwright
```

**If not installed:**
```bash
# Add as dev dependency
[pnpm/npm/yarn] add -D playwright

# Install Chromium browser
[pnpm/npm/yarn] exec playwright install chromium
```

**Test installation:**
```javascript
// test-playwright.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('✅ Playwright working!');
  await browser.close();
})();
```

```bash
node test-playwright.js
rm test-playwright.js
```

#### 3. Package Manager Detection

**Auto-detect package manager with validation:**
```bash
detect_package_manager() {
  local PM=""

  # First check package.json packageManager field
  if [ -f "package.json" ]; then
    PM_FIELD=$(node -p "require('./package.json').packageManager || ''" 2>/dev/null)
    if [ -n "$PM_FIELD" ]; then
      PM=$(echo $PM_FIELD | cut -d@ -f1)
      echo "📦 Package manager from package.json: $PM"
    fi
  fi

  # If not in package.json, check lock files
  if [ -z "$PM" ]; then
    if [ -f "pnpm-lock.yaml" ]; then
      PM="pnpm"
    elif [ -f "yarn.lock" ]; then
      PM="yarn"
    elif [ -f "package-lock.json" ]; then
      PM="npm"
    else
      echo "⚠️  No lock file found, defaulting to npm"
      PM="npm"
    fi
  fi

  # Verify package manager is installed
  if ! command -v $PM &> /dev/null; then
    echo "❌ Error: $PM is not installed"
    echo "   Install it with: npm install -g $PM"
    echo "   Or use a different package manager"
    exit 1
  fi

  echo "✅ Using package manager: $PM ($(command -v $PM))"
  echo "$PM"
}

# Usage
PM=$(detect_package_manager)
```

### Phase 2: Environment Variables Setup

Create `.env.example` template from existing `.env` file.

#### 1. Read Existing .env

```bash
# Check if .env exists
if [ -f ".env" ]; then
  # Copy to .env.example, removing sensitive values
  cat .env
fi
```

#### 2. Create .env.example

Replace sensitive values with placeholders:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API Keys
API_KEY=your-api-key-here

# Server Configuration
NODE_ENV=development
PORT=3000
```

**Rules for placeholders:**
- Database passwords: `password`
- JWT secrets: `your-super-secret-jwt-key-change-this-in-production`
- API keys: `your-api-key-here`
- Keep structure and variable names identical
- Add comments explaining each variable

#### 3. Verify .env is in .gitignore

```bash
# Check if .env is ignored
git check-ignore -v .env

# If not, add to .gitignore
if ! grep -q "^.env$" .gitignore; then
  echo ".env" >> .gitignore
fi
```

### Phase 3: Code Formatting Setup

Configure Prettier for consistent code style.

#### 1. Check for Existing Configuration

```bash
# Look for Prettier config
ls -la | grep -E "\.prettierrc|prettier\.config"
```

#### 2. Create .prettierrc if Needed

If no Prettier config exists, create one:

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always"
}
```

#### 3. Add Format Script to package.json

Check if format script exists:
```bash
cat package.json | grep "format"
```

If not, add to scripts:
```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### 4. Create .prettierignore

```
# Build output
dist/
build/
out/
.next/

# Dependencies
node_modules/
.pnp
.pnp.js

# Coverage
coverage/

# Generated files
*.min.js
*.min.css

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock
```

### Phase 4: Claude Code Auto-Approval Configuration

Set up pre-approved commands for automated workflows.

#### 1. Check Existing Configuration

```bash
# Check if settings exist
cat .claude/settings.local.json
```

#### 2. Create/Update .claude/settings.local.json

Merge with existing settings or create new:

```json
{
  "requireApproval": {
    "allow": [
      "Bash(gh issue create*)",
      "Bash(gh issue view*)",
      "Bash(gh issue comment*)",
      "Bash(gh issue close*)",
      "Bash(gh issue list*)",
      "Bash(gh pr create*)",
      "Bash(gh pr view*)",
      "Bash(gh pr comment*)",
      "Bash(gh pr review*)",
      "Bash(gh pr merge*)",
      "Bash(gh pr list*)",
      "Bash(gh project item-add*)",
      "Bash(gh project item-edit*)",
      "Bash(gh project list*)",
      "Bash(gh api graphql*)",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(git push*)",
      "Bash(git pull*)",
      "Bash(git checkout*)",
      "Bash(git branch*)",
      "Bash(docker ps*)",
      "Bash(docker exec*)",
      "Bash(docker logs*)",
      "Bash(pnpm *)",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Bash(node *)",
      "Bash(npx *)",
      "Bash(curl*)",
      "Bash(ls*)",
      "Bash(cat*)",
      "Bash(pwd)",
      "Bash(echo*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

**Customize for project:**
- Replace `pnpm` with actual package manager
- Add project-specific commands
- Remove unused commands

### Phase 5: TypeScript Path Aliases (if applicable)

Verify or configure path aliases for cleaner imports.

#### 1. Check tsconfig.json

```bash
cat tsconfig.json | grep -A 10 "paths"
```

#### 2. Recommended Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/*"],
      "@shared/*": ["./shared/*"],
      "@server/*": ["./server/*"],
      "@components/*": ["./client/components/*"],
      "@lib/*": ["./client/lib/*"]
    }
  }
}
```

#### 3. Update Vite Config (if using Vite)

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
      '@components': path.resolve(__dirname, './client/components'),
      '@lib': path.resolve(__dirname, './client/lib'),
    },
  },
});
```

### Phase 6: Development Scripts Verification

Ensure package.json has essential scripts.

#### Required Scripts

```json
{
  "scripts": {
    "dev": "[dev server command]",
    "build": "[build command]",
    "start": "[production start command]",
    "test": "[test command]",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "lint": "[linting command if applicable]"
  }
}
```

**Verify each script works:**
```bash
# Test dev server (stop after 5 seconds)
timeout 5 [pnpm/npm/yarn] dev || true

# Test build
[pnpm/npm/yarn] build

# Test typecheck
[pnpm/npm/yarn] typecheck

# Test format
[pnpm/npm/yarn] format:check
```

### Phase 7: Database Setup (if applicable)

Configure database development environment.

#### 1. Check for Database Configuration

```bash
# Look for database config
ls drizzle.config.ts prisma/schema.prisma knexfile.js 2>/dev/null
```

#### 2. Docker Compose (if exists)

```bash
# Check for docker-compose
cat docker-compose.yml

# Start database
docker-compose up -d

# Verify running
docker ps
```

#### 3. Database Scripts

Add to package.json if using Drizzle:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx server/db/seed.ts"
  }
}
```

Or for Prisma:
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## 📊 Output Checklist

After completing this step, verify:

- ✅ GitHub CLI installed and authenticated
- ✅ GitHub CLI has project access (`gh auth refresh -s project`)
- ✅ Playwright installed (if needed for screenshots)
- ✅ Package manager detected and documented
- ✅ `.env.example` created with placeholders
- ✅ `.env` verified in `.gitignore`
- ✅ Prettier configured (`.prettierrc` exists)
- ✅ `.prettierignore` created
- ✅ Format scripts added to `package.json`
- ✅ Claude Code auto-approvals configured (`.claude/settings.local.json`)
- ✅ TypeScript path aliases verified
- ✅ All package.json scripts tested
- ✅ Database setup verified (if applicable)

## 🔧 Troubleshooting

### GitHub CLI Not Authenticated
```bash
gh auth status
gh auth login
gh auth refresh -s project
```

### Playwright Installation Fails
```bash
# Install specific browser only
pnpm exec playwright install chromium --with-deps
```

### Package Manager Detection Issues
```bash
# Manually set in config.json
"packageManager": "pnpm"
```

### Path Aliases Not Working
```bash
# Restart TypeScript server
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## 🔄 Next Step

Once dev environment is configured, proceed to:
**05-github-integration.md** - Set up GitHub project board and workflows

---

**Estimated Time:** 10-15 minutes
**Tools Used:** Bash, Write, Read
**Output:** Complete development environment configured
