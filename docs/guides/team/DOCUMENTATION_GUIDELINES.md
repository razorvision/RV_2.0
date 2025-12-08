# Documentation Guidelines

This document outlines best practices for creating and maintaining project documentation. Good documentation is essential for onboarding new team members, maintaining code quality, and ensuring project longevity.

## Table of Contents

- [Documentation Philosophy](#documentation-philosophy)
- [Types of Documentation](#types-of-documentation)
- [README Best Practices](#readme-best-practices)
- [Code Documentation](#code-documentation)
- [API Documentation](#api-documentation)
- [Writing Style Guidelines](#writing-style-guidelines)
- [Keeping Documentation Updated](#keeping-documentation-updated)

## Documentation Philosophy

### Core Principles

1. **Write for your future self** - Document as if you'll forget everything in 6 months
2. **Write for beginners** - Assume minimal context, explain acronyms and concepts
3. **Show, don't just tell** - Include examples and code snippets
4. **Keep it current** - Outdated documentation is worse than no documentation
5. **Make it discoverable** - Link related documents, use clear file names
6. **Be concise** - Respect the reader's time, get to the point

### When to Document

✅ **Always document:**
- Public APIs and interfaces
- Complex algorithms or business logic
- Non-obvious decisions and trade-offs
- Setup and installation procedures
- Architecture and design patterns
- Security considerations
- Breaking changes

❌ **Don't document:**
- Self-explanatory code
- Temporary workarounds (fix them instead)
- Implementation details that might change
- Obvious functionality

## Types of Documentation

### 1. README.md (Project Overview)

**Purpose:** First impression, quick start, essential information

**Must include:**
- Project name and description
- Key features
- Tech stack
- Prerequisites
- Installation instructions
- Usage examples
- Links to other documentation

**Example structure:**
```markdown
# Project Name

Brief description in one sentence.

## Features
- Feature 1
- Feature 2

## Tech Stack
List main technologies

## Installation
Step-by-step setup

## Usage
How to run and use

## Documentation
Links to other docs

## Contributing
Link to CONTRIBUTING.md
```

### 2. CONTRIBUTING.md (Contribution Guide)

**Purpose:** Help others contribute effectively

**Should include:**
- How to set up development environment
- Coding standards and style guide
- Branch naming conventions
- Commit message format
- Pull request process
- Testing requirements
- Code review expectations

### 3. ARCHITECTURE.md (System Design)

**Purpose:** Explain high-level system design and decisions

**Should include:**
- System overview and diagram
- Folder structure explanation
- Key architectural decisions
- Technology choices and rationale
- Data flow and state management
- Integration points
- Future considerations

### 4. API Documentation

**Purpose:** Help developers use your APIs

**Should include:**
- Endpoint descriptions
- Request/response formats
- Authentication requirements
- Error codes and handling
- Rate limiting
- Examples for each endpoint

### 5. Inline Code Comments

**Purpose:** Explain complex or non-obvious code

**When to use:**
- Complex algorithms
- Business logic
- Workarounds for bugs
- Performance optimizations
- Security considerations

## README Best Practices

### Structure Template

```markdown
# Project Name

One-line description

## ✨ Features

List key capabilities

## 🚀 Tech Stack

### Frontend
- Framework: [React/Vue/etc]
- Build: [Vite/Webpack]
- Styling: [Tailwind/CSS]

### Backend (if applicable)
- Framework: [Express/etc]
- Database: [PostgreSQL/etc]
- ORM: [Drizzle/Prisma]

## 📋 Prerequisites

- Node.js 18+
- [Package manager]
- [Database]

## 🔧 Installation

### 1. Clone repository
\`\`\`bash
git clone [url]
cd [project]
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up environment
\`\`\`bash
cp .env.example .env
# Edit .env with your settings
\`\`\`

### 4. Start development
\`\`\`bash
npm run dev
\`\`\`

## 📝 Usage

### Development Commands
\`\`\`bash
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
\`\`\`

## 📁 Project Structure

\`\`\`
project/
├── src/           # Source code
├── tests/         # Test files
└── docs/          # Documentation
\`\`\`

## 🧪 Testing

How to run tests and write new ones

## 🚀 Deployment

Deployment instructions

## 🤝 Contributing

Link to CONTRIBUTING.md

## 📄 License

License information

## 👥 Authors

Contributors

## 📧 Support

How to get help
```

### README Do's and Don'ts

✅ **Do:**
- Use emojis sparingly for visual scanning
- Include badges (build status, version, license)
- Add screenshots for UI projects
- Link to detailed documentation
- Keep it concise (detailed info goes elsewhere)
- Update after major changes

❌ **Don't:**
- Write walls of text
- Include entire API documentation
- Leave placeholder text
- Use broken links
- Duplicate information from other docs
- Let it become outdated

## Code Documentation

### JSDoc Comments

Use JSDoc for functions, classes, and complex types:

```typescript
/**
 * Calculates the total price including tax and discount.
 *
 * @param basePrice - The original price before tax and discount
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param discountPercent - Discount percentage (0-100)
 * @returns The final price after tax and discount
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.08, 10);
 * // Returns 97.2 (100 - 10% = 90, + 8% tax = 97.2)
 * ```
 */
function calculateTotal(
  basePrice: number,
  taxRate: number,
  discountPercent: number
): number {
  const discounted = basePrice * (1 - discountPercent / 100);
  return discounted * (1 + taxRate);
}
```

### Component Documentation

Document React components with clear descriptions:

```typescript
/**
 * UserCard displays user information in a card format.
 *
 * Features:
 * - Avatar with fallback to initials
 * - Role badge with color coding
 * - Click handler for navigation
 * - Loading and error states
 *
 * @example
 * ```tsx
 * <UserCard
 *   user={userData}
 *   onClick={() => navigate(`/users/${user.id}`)}
 * />
 * ```
 */
export function UserCard({ user, onClick }: UserCardProps) {
  // Implementation
}
```

### Inline Comments

Use inline comments for complex logic:

```typescript
// ✅ Good: Explains WHY, not WHAT
// Use setTimeout to defer execution until after the current render cycle
// to prevent state update warnings
setTimeout(() => setIsOpen(true), 0);

// ✅ Good: Explains non-obvious business logic
// Users with role 'admin' can see all projects, but 'manager' role
// can only see projects from their department
const visibleProjects = user.role === 'admin'
  ? allProjects
  : allProjects.filter(p => p.departmentId === user.departmentId);

// ❌ Bad: States the obvious
// Set count to 0
const count = 0;

// ❌ Bad: Comment is outdated
// Fetch users from API (no longer true, now using cached data)
const users = getCachedUsers();
```

### Comment Best Practices

1. **Explain WHY, not WHAT** - Code shows what, comments explain why
2. **Document workarounds** - Explain temporary fixes and why they exist
3. **Note TODOs clearly** - Use TODO: format for future improvements
4. **Update comments** - When code changes, update comments
5. **Remove dead code** - Don't comment out code, delete it (git remembers)

### TODO Comments

```typescript
// TODO: Replace with proper error boundary once React 18 migration is complete
// TODO(username): Add input validation - see issue #123
// FIXME: This causes memory leak, needs investigation
// HACK: Workaround for Safari bug - remove when Safari 17+ is baseline
// NOTE: This must run before component mount due to timing issues
```

## API Documentation

### REST API Documentation Format

```markdown
## Endpoint Name

Brief description of what this endpoint does.

### Request

\`\`\`
POST /api/users
\`\`\`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Body:**
\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
\`\`\`

### Response

**Success (201 Created):**
\`\`\`json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error (400 Bad Request):**
\`\`\`json
{
  "error": {
    "message": "Email already exists",
    "code": "DUPLICATE_EMAIL"
  }
}
\`\`\`

### Example

\`\`\`typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user'
  })
});

const user = await response.json();
\`\`\`
```

### API Documentation Tools

Consider using:
- **OpenAPI/Swagger** - Standard API documentation format
- **Postman Collections** - Shareable API examples
- **API Blueprint** - Markdown-based API documentation
- **GraphQL Playground** - For GraphQL APIs

## Writing Style Guidelines

### General Writing Tips

1. **Use active voice** - "The function returns" not "The value is returned"
2. **Be concise** - Remove unnecessary words
3. **Use present tense** - "Returns the user" not "Will return the user"
4. **Use imperative mood** - "Click the button" not "You should click"
5. **Be specific** - "Install Node.js 18+" not "Install Node"
6. **Define acronyms** - "JWT (JSON Web Token)" on first use

### Formatting Guidelines

**Code blocks:**
````markdown
```typescript
// Always specify language for syntax highlighting
const example = "code";
```
````

**File paths:**
```markdown
Use code formatting for file paths: `src/components/Button.tsx`
```

**Commands:**
```markdown
Show commands in code blocks with language:
```bash
npm install
```
```

**Lists:**
```markdown
- Use hyphens for unordered lists
- Be consistent with punctuation
- Keep items parallel in structure

1. Use numbers for ordered lists
2. When sequence matters
3. For step-by-step instructions
```

**Links:**
```markdown
Use descriptive link text: [Installation Guide](./INSTALL.md)
Not: [Click here](./INSTALL.md)
```

### Tone and Voice

- **Professional but friendly** - Write like you're helping a colleague
- **Avoid jargon** - Use simple terms or define technical ones
- **Be inclusive** - Use "they/them" for generic references
- **Stay positive** - Focus on solutions, not problems
- **Be humble** - Acknowledge limitations and trade-offs

## Keeping Documentation Updated

### When to Update Documentation

Update docs when:
- Adding new features
- Changing APIs or interfaces
- Fixing bugs that affect usage
- Updating dependencies significantly
- Changing development workflow
- Discovering new gotchas or issues

### Documentation in Pull Requests

**PR checklist should include:**
- [ ] Updated README if public API changed
- [ ] Updated inline documentation
- [ ] Added/updated examples
- [ ] Updated CHANGELOG
- [ ] Verified all links work
- [ ] Checked for typos and formatting

### Documentation Review

**When reviewing documentation:**
- Test all examples and commands
- Check that links work
- Verify accuracy against code
- Ensure clarity for target audience
- Look for outdated information
- Check formatting and structure

### Documentation Maintenance

**Quarterly review:**
- Review all major documentation files
- Test installation instructions from scratch
- Update screenshots if UI changed
- Verify all external links
- Check for outdated references to versions/tools
- Update "last updated" dates

## Documentation Checklist

Use this checklist for new projects or major updates:

### Essential Documentation
- [ ] README.md with complete setup instructions
- [ ] CONTRIBUTING.md with contribution guidelines
- [ ] CODE_OF_CONDUCT.md (if open source)
- [ ] LICENSE file
- [ ] .env.example with all required variables
- [ ] CHANGELOG.md (for versioned projects)

### Code Documentation
- [ ] JSDoc comments on public functions/classes
- [ ] Component documentation with examples
- [ ] Inline comments for complex logic
- [ ] API endpoint documentation
- [ ] Type definitions with descriptions

### Developer Resources
- [ ] ARCHITECTURE.md explaining system design
- [ ] Development setup guide
- [ ] Testing guide
- [ ] Deployment guide
- [ ] Troubleshooting guide

### User Documentation (if applicable)
- [ ] User guide or manual
- [ ] FAQ
- [ ] Tutorial or quick start
- [ ] API reference
- [ ] Changelog for users

## Tools and Resources

### Documentation Tools

- **Markdown editors:** [Typora](https://typora.io/), [MarkText](https://marktext.app/)
- **Diagramming:** [Mermaid](https://mermaid.js.org/), [Excalidraw](https://excalidraw.com/)
- **API docs:** [Swagger](https://swagger.io/), [Postman](https://www.postman.com/)
- **Static sites:** [Docusaurus](https://docusaurus.io/), [VitePress](https://vitepress.dev/)

### Writing Resources

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)
- [Write the Docs](https://www.writethedocs.org/)
- [Markdown Guide](https://www.markdownguide.org/)

## Examples

### Good Documentation Example

```markdown
## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header of your requests.

### Getting a Token

First, register or log in to receive a token:

\`\`\`bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret"}'
\`\`\`

Response:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "7d"
}
\`\`\`

### Using the Token

Include the token in subsequent requests:

\`\`\`bash
curl https://api.example.com/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
\`\`\`

**Security Note:** Store tokens securely. Never commit tokens to version control.
```

## Questions or Improvements?

If you have suggestions for improving documentation:
- Open an issue for discussion
- Submit a PR with improvements
- Bring it up in team meetings

Good documentation is everyone's responsibility!

---

**Last Updated:** 2025-11-21
**Maintained By:** Development Team
