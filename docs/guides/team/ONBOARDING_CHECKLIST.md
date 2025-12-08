# Developer Onboarding Checklist

A structured checklist for onboarding new team members, ensuring they have everything needed to be productive.

## Table of Contents

- [Before Day 1](#before-day-1)
- [Day 1: Access & Setup](#day-1-access--setup)
- [Days 2-3: Environment & Codebase](#days-2-3-environment--codebase)
- [Week 1: First Contributions](#week-1-first-contributions)
- [Week 2: Deeper Understanding](#week-2-deeper-understanding)
- [First Month: Full Productivity](#first-month-full-productivity)
- [Onboarding Buddy Guide](#onboarding-buddy-guide)

## Before Day 1

### For Manager/Team Lead

- [ ] Create accounts and request access:
  - [ ] GitHub organization invite
  - [ ] 1Password vault access
  - [ ] Vercel team access
  - [ ] Sentry team access
  - [ ] Slack workspace invite
  - [ ] Project management tool (Linear, Jira, etc.)
- [ ] Assign onboarding buddy
- [ ] Schedule welcome meeting
- [ ] Prepare first-week tasks (good first issues)
- [ ] Add to team calendar and recurring meetings

### For Onboarding Buddy

- [ ] Review new team member's background
- [ ] Prepare questions they might have
- [ ] Block time for pairing sessions
- [ ] Identify 2-3 good starter tasks

## Day 1: Access & Setup

### Morning: Accounts & Access

#### GitHub
- [ ] Accept organization invite
- [ ] Set up 2FA (required)
- [ ] Configure SSH keys
- [ ] Join relevant teams
- [ ] Star main repositories

```bash
# Verify GitHub access
git clone git@github.com:org/main-repo.git
```

#### Communication
- [ ] Join Slack workspace
- [ ] Join relevant channels:
  - [ ] #engineering
  - [ ] #project-[name]
  - [ ] #incidents (if applicable)
  - [ ] #random / #watercooler
- [ ] Set up Slack profile with name and photo
- [ ] Install Slack on phone for urgent notifications

#### Secrets & Credentials
- [ ] Accept 1Password invite
- [ ] Install 1Password desktop app
- [ ] Install 1Password CLI (optional but recommended)
- [ ] Verify access to Development vault

### Afternoon: Local Environment

#### Development Tools
- [ ] Install required software:
  - [ ] Node.js (use version in `.nvmrc`)
  - [ ] Git
  - [ ] VS Code or preferred editor
  - [ ] Docker Desktop (if used)

- [ ] Install VS Code extensions:
  - [ ] ESLint
  - [ ] Prettier
  - [ ] GitLens
  - [ ] Tailwind CSS IntelliSense (if applicable)

#### Claude Code (if used)
- [ ] Install Claude Code CLI
- [ ] Authenticate with Anthropic
- [ ] Configure MCP servers per [MCP_SERVERS_GUIDE.md](../../integrations/MCP_SERVERS_GUIDE.md)
- [ ] Test Claude Code in repository

#### Repository Setup
- [ ] Clone main repository
- [ ] Copy `.env.example` to `.env.local`
- [ ] Get secrets from 1Password or team lead
- [ ] Install dependencies: `npm install`
- [ ] Run database setup: `npx prisma db push` (if applicable)
- [ ] Start development server: `npm run dev`
- [ ] Verify app runs at http://localhost:3000

### End of Day 1 Checkpoint

- [ ] Can access GitHub and clone repos
- [ ] Can access Slack and communicate with team
- [ ] Can access 1Password and retrieve secrets
- [ ] Local development environment runs
- [ ] Met with onboarding buddy

## Days 2-3: Environment & Codebase

### Day 2: Understanding the Stack

#### Read Documentation
- [ ] [CLAUDE.md](../../CLAUDE.md) - Project guidelines
- [ ] [Coding Standards](../development/CODING_STANDARDS.md)
- [ ] [Branch Strategy](BRANCH_STRATEGY.md)
- [ ] Architecture overview (if exists)

#### Explore Codebase
- [ ] Understand folder structure:
  ```
  src/
  ├── app/          # Next.js routes
  ├── components/   # React components
  ├── lib/          # Utilities and helpers
  └── ...
  ```
- [ ] Find and read these key files:
  - [ ] `package.json` - dependencies and scripts
  - [ ] `next.config.js` - Next.js configuration
  - [ ] `prisma/schema.prisma` - Database schema (if applicable)
  - [ ] Main layout file
  - [ ] Example API route
  - [ ] Example page component

#### Hands-on Exploration
- [ ] Make a small change (e.g., update a string)
- [ ] Verify hot reload works
- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`

### Day 3: Development Workflow

#### Git Workflow Practice
- [ ] Create a branch following naming convention
- [ ] Make a small change (fix typo, improve comment)
- [ ] Commit with conventional commit message
- [ ] Push and create a PR
- [ ] Request review from buddy
- [ ] Address feedback and merge

#### Tools & Services
- [ ] Log into Vercel, explore dashboard
- [ ] View a preview deployment
- [ ] Log into Sentry, view recent errors
- [ ] Understand how deployments work

#### Meetings & Communication
- [ ] Attend standup (if applicable)
- [ ] Understand how to ask for help
- [ ] Know who to contact for what

### End of Day 3 Checkpoint

- [ ] Understand project architecture
- [ ] Successfully made first PR
- [ ] Know how to run tests and linting
- [ ] Comfortable with development workflow

## Week 1: First Contributions

### Pick Up First Real Task
- [ ] Get assigned a "good first issue"
- [ ] Understand the requirements
- [ ] Ask clarifying questions
- [ ] Implement the solution
- [ ] Write tests
- [ ] Submit PR
- [ ] Respond to review feedback
- [ ] See it merged and deployed

### Deepen Technical Understanding
- [ ] Understand authentication flow
- [ ] Understand data fetching patterns
- [ ] Review a teammate's PR
- [ ] Pair program on a task

### Team Integration
- [ ] 1:1 with manager
- [ ] Coffee chat with 2-3 team members
- [ ] Attend sprint planning/retro
- [ ] Understand team's current priorities

### End of Week 1 Checkpoint

- [ ] Merged at least one meaningful PR
- [ ] Completed a code review
- [ ] Understand team processes
- [ ] Feel comfortable asking questions

## Week 2: Deeper Understanding

### Technical Deep Dives
- [ ] Understand database schema
- [ ] Learn about key integrations (payments, auth, etc.)
- [ ] Review error handling patterns
- [ ] Understand deployment pipeline

### Take on More Complex Work
- [ ] Pick up a medium-complexity issue
- [ ] Work more independently
- [ ] Start participating in technical discussions
- [ ] Identify documentation gaps

### Process Understanding
- [ ] Understand incident response process
- [ ] Know how to escalate issues
- [ ] Understand release process
- [ ] Learn about monitoring and alerts

### End of Week 2 Checkpoint

- [ ] Can work independently on tasks
- [ ] Understand system architecture
- [ ] Comfortable with all development tools
- [ ] Know how to debug issues

## First Month: Full Productivity

### By End of Month 1

#### Technical
- [ ] Completed 5+ PRs
- [ ] Reviewed 5+ PRs
- [ ] Understand full deployment pipeline
- [ ] Can debug production issues
- [ ] Know who owns which areas

#### Process
- [ ] Comfortable with all team ceremonies
- [ ] Understand project roadmap
- [ ] Can estimate work accurately
- [ ] Know when to ask for help vs. figure it out

#### Relationships
- [ ] Met with all team members
- [ ] Know who to go to for different questions
- [ ] Feel like part of the team
- [ ] Comfortable speaking up in meetings

### Feedback Session

Schedule 1:1 with manager to discuss:
- What's going well?
- What's confusing or frustrating?
- What additional support would help?
- Any process improvements to suggest?

## Onboarding Buddy Guide

### Your Role

As an onboarding buddy, you're the new team member's go-to person for:
- Questions they're embarrassed to ask
- Context on why things are the way they are
- Introduction to team culture
- Day-to-day help

### Time Commitment

- **Week 1:** 1-2 hours daily availability
- **Week 2:** 30-60 minutes daily
- **Weeks 3-4:** As needed, check-in every few days

### Suggested Schedule

**Day 1:**
- Welcome meeting (30 min)
- Help with environment setup (as needed)
- End-of-day check-in (15 min)

**Days 2-3:**
- Morning check-in (15 min)
- Codebase walkthrough (1 hour)
- Answer questions (as needed)

**Week 1:**
- Daily check-in (15 min)
- Pair on first task (1-2 hours)
- Review their first PR

**Weeks 2-4:**
- 2-3 check-ins per week
- Available for questions
- Provide feedback to manager

### Tips for Buddies

1. **Be patient** - Things obvious to you aren't obvious to them
2. **Encourage questions** - "No question is too basic"
3. **Share context** - Explain the "why" behind processes
4. **Be honest** - It's okay to say "I don't know, let's find out"
5. **Celebrate wins** - Acknowledge first PR, first deploy, etc.

### Questions to Ask Them

- "What's confusing you right now?"
- "Is there anything blocking you?"
- "What would help you be more productive?"
- "Are you getting enough support?"

## Resources

### Documentation
- [Dev Environment Setup](../DEV_ENVIRONMENT_SETUP.md)
- [Coding Standards](../development/CODING_STANDARDS.md)
- [Branch Strategy](BRANCH_STRATEGY.md)
- [Code Review Guidelines](CODE_REVIEW_GUIDELINES.md)

### People
- **Your buddy:** [Name]
- **Manager:** [Name]
- **Tech lead:** [Name]
- **DevOps/Infra:** [Name]

### Bookmarks to Save
- Repository: [URL]
- Project board: [URL]
- Vercel dashboard: [URL]
- Sentry dashboard: [URL]
- Documentation: [URL]

---

**Questions about onboarding?** Ask your buddy or post in #engineering!
