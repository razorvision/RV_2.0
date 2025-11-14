# Step 3: Documentation Generation

## 🎯 Goal

Generate comprehensive, accurate project documentation including README, workflow guides, contributing guidelines, and team onboarding checklists using insights from the codebase analysis.

## 📋 Instructions for Claude Code

### Phase 1: README.md Generation/Update

Use the codebase analysis from Step 1 to generate or update the README.

#### README Template Structure

```markdown
# [Project Name]

[One-line project description from config or analysis]

## ✨ Features

[List key features discovered in analysis]
- Feature 1
- Feature 2
- Feature 3

## 🚀 Tech Stack

### Frontend
- **Framework:** [React/Vue/etc + version]
- **Build Tool:** [Vite/Webpack/etc + version]
- **Styling:** [Tailwind/CSS Modules/etc]
- **Routing:** [React Router/etc]
- **State Management:** [Context API/Redux/etc]
- **UI Components:** [shadcn/ui/Material-UI/etc]
- **Forms:** [React Hook Form/etc]
- **Data Fetching:** [TanStack Query/etc]

### Backend (if applicable)
- **Framework:** [Express/Fastify/etc]
- **Database:** [PostgreSQL/MySQL/etc]
- **ORM:** [Drizzle/Prisma/etc]
- **Authentication:** [JWT/Passport/etc]

### Development Tools
- **Package Manager:** [pnpm/npm/yarn + version]
- **TypeScript:** [version]
- **Linting:** [ESLint/Prettier]
- **Testing:** [Vitest/Jest/Playwright]

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- [pnpm/npm/yarn] installed
- [Database] installed (if applicable)
- [Docker] installed (if applicable)
- Git installed
- GitHub CLI installed (optional, for workflows)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone [repository-url]
cd [project-folder]
```

### 2. Install dependencies

```bash
[pnpm install / npm install / yarn install]
```

### 3. Set up environment variables

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Add required environment variables here
```

### 4. Set up database (if applicable)

```bash
# Start database (Docker)
docker-compose up -d

# Run migrations
[pnpm/npm/yarn] drizzle-kit push

# Seed database (optional)
[pnpm/npm/yarn] tsx server/db/seed.ts
```

### 5. Start development server

```bash
[pnpm/npm/yarn] dev
```

The application will be available at `http://localhost:[port]`

## 📝 Usage

### Development

```bash
# Start dev server
[pnpm/npm/yarn] dev

# Build for production
[pnpm/npm/yarn] build

# Start production server
[pnpm/npm/yarn] start

# Run tests
[pnpm/npm/yarn] test

# Format code
[pnpm/npm/yarn] format

# Type check
[pnpm/npm/yarn] typecheck
```

### Database Commands (if applicable)

```bash
# Generate migrations
[pnpm/npm/yarn] drizzle-kit generate

# Push schema to database
[pnpm/npm/yarn] drizzle-kit push

# Open Drizzle Studio
[pnpm/npm/yarn] drizzle-kit studio

# Seed database
[pnpm/npm/yarn] tsx server/db/seed.ts
```

## 📁 Project Structure

```
[project-name]/
├── client/                 # Frontend application
│   ├── components/        # Reusable UI components
│   │   └── ui/           # Base UI components (shadcn/ui)
│   ├── pages/            # Route-level page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main app component
│   └── global.css        # Global styles
├── server/               # Backend application (if applicable)
│   ├── routes/           # API routes
│   ├── db/               # Database configuration
│   │   ├── schema.ts     # Database schema
│   │   ├── index.ts      # Database connection
│   │   └── migrations/   # Migration files
│   └── middleware/       # Express middleware
├── shared/               # Shared types and utilities
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── .project-intake/      # Project setup automation (can be removed)
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

[Document the color palette and design tokens from tailwind.config.ts]

### Color Palette

```css
Primary: [color] - [purpose]
Secondary: [color] - [purpose]
Accent: [color] - [purpose]
```

### Typography

- **Headings:** [font-family]
- **Body:** [font-family]
- **Monospace:** [font-family]

## 🌐 Environment Variables

Create a `.env` file with the following variables:

```env
# [Category]
VARIABLE_NAME=value    # Description

# [Another Category]
OTHER_VAR=value        # Description
```

See `.env.example` for a complete template.

## 📚 API Documentation (if applicable)

### Authentication Endpoints

```
POST /api/auth/register - Create new user account
POST /api/auth/login    - Authenticate user
POST /api/auth/logout   - End user session
GET  /api/auth/me       - Get current user
```

[Document other endpoints discovered]

## 🧪 Testing

```bash
# Run all tests
[pnpm/npm/yarn] test

# Run tests in watch mode
[pnpm/npm/yarn] test:watch

# Run specific test file
[pnpm/npm/yarn] test [file-path]
```

## 🚀 Deployment

[Add deployment instructions specific to the project]

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

**Important:** This project uses a pre-commit hook that blocks direct commits to `main`. All changes must go through the feature branch → PR workflow.

## 📖 Additional Documentation

- [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) - Git workflow and best practices
- [TEAM_MEETING_CHECKLIST.md](TEAM_MEETING_CHECKLIST.md) - Onboarding checklist
- [CODEBASE_EXPLORATION_GUIDE.md](CODEBASE_EXPLORATION_GUIDE.md) - How to explore this codebase

## 📄 License

[Specify license]

## 👥 Authors

[List contributors]

## 📧 Support

For support, email [support-email] or open an issue in the repository.

---

Built with ❤️ by [team/organization]
```

#### README Generation Process

1. **Read config.json** for project metadata
2. **Use Step 1 analysis** for technical details
3. **Fill in README.template.md** from templates/
4. **Verify all sections** have accurate information
5. **Update existing README** if one exists (preserve custom content)
6. **Format with Prettier** if available

### Phase 2: WORKFLOW_GUIDE.md Creation

Copy the workflow guide template and customize for this project.

**Source:** `.project-intake/templates/WORKFLOW_GUIDE.md`

**Customizations needed:**
- Replace `[pnpm/npm/yarn]` with actual package manager
- Update GitHub username/organization
- Add project-specific workflow steps
- Update branch naming examples with actual features

### Phase 3: CONTRIBUTING.md Creation

Create contributing guidelines to help new team members.

```markdown
# Contributing to [Project Name]

Thank you for considering contributing to [Project Name]! This document outlines the process and guidelines.

## 🚦 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone [your-fork-url]
   cd [project-folder]
   ```
3. **Install dependencies:**
   ```bash
   [pnpm/npm/yarn] install
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔀 Workflow

### Pre-Commit Hook

**Important:** This project has a pre-commit hook that blocks direct commits to `main`.

If you try to commit directly to `main`, you'll see:
```
❌ ERROR: Direct commits to 'main' branch are not allowed!
```

Always work on feature branches!

### Branch Naming

Follow these conventions:

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

**Examples:**
- `feature/add-user-dashboard`
- `bugfix/fix-login-error`
- `docs/update-api-docs`

### Commit Messages

Use conventional commit format:

```
<type>: <short summary>

[optional body]
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```bash
feat: Add user authentication
fix: Resolve navigation menu bug
docs: Update installation instructions
```

## 🔄 Pull Request Process

1. **Push your branch:**
   ```bash
   git push -u origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference to related issues (if any)
   - Screenshots (for UI changes)

3. **Wait for review** - A maintainer will review your PR

4. **Address feedback** if changes are requested

5. **Merge** - Once approved, a maintainer will merge your PR

## ✅ Code Quality Standards

### Style Guide

- Follow existing code style
- Use TypeScript for type safety
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure existing tests pass: `[pnpm/npm/yarn] test`
- Add integration tests for critical paths

### Formatting

- Run `[pnpm/npm/yarn] format` before committing
- Code must pass type checking: `[pnpm/npm/yarn] typecheck`

## 🐛 Reporting Bugs

Create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, etc.)

## 💡 Suggesting Features

Create an issue with:
- Clear description of the feature
- Use case and benefits
- Potential implementation approach
- Examples from other projects (if applicable)

## 📞 Getting Help

- Check existing documentation
- Search existing issues
- Ask in discussions
- Contact maintainers: [email]

## 🙏 Thank You!

Your contributions make this project better!
```

### Phase 4: TEAM_MEETING_CHECKLIST.md Creation

Copy and customize the team meeting checklist template.

**Source:** `.project-intake/templates/TEAM_MEETING_CHECKLIST.md` (copied from current project)

**Customizations:**
- Update project name
- Update repository URL
- Update GitHub organization/username
- Update package manager commands
- Add project-specific steps

### Phase 5: CODEBASE_EXPLORATION_GUIDE.md Creation

This guide helps new developers explore the codebase.

**Source:** Copy existing `CODEBASE_EXPLORATION_GUIDE.md` or use template

**Include:**
- How to use Glob and Read tools
- Tech stack exploration questions
- Project structure analysis
- Key files and their purposes
- Common patterns in the codebase

## 📊 Output Checklist

After completing this step, verify:

- ✅ README.md created/updated with accurate information
- ✅ All README sections filled in from analysis
- ✅ WORKFLOW_GUIDE.md created with git best practices
- ✅ CONTRIBUTING.md created with contribution guidelines
- ✅ TEAM_MEETING_CHECKLIST.md created for onboarding
- ✅ CODEBASE_EXPLORATION_GUIDE.md created (optional)
- ✅ All markdown files formatted correctly
- ✅ All placeholders replaced with actual values
- ✅ Links between documents verified

## 📝 Documentation Best Practices

1. **Keep it updated** - Documentation should match the code
2. **Use clear language** - Write for beginners
3. **Add examples** - Show, don't just tell
4. **Use visual aids** - Screenshots, diagrams where helpful
5. **Link related docs** - Help readers navigate
6. **Version changes** - Note when docs were last updated

## 🔄 Next Step

Once documentation is complete, proceed to:
**04-dev-environment.md** - Configure development tools and environment

---

**Estimated Time:** 15-20 minutes
**Tools Used:** Write, Read, analysis from Step 1
**Output:** Complete documentation suite (README, guides, checklists)
