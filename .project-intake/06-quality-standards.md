# Step 6: Code Quality & Security Standards

## 🎯 Goal

Document coding conventions, security best practices, architecture patterns, testing guidelines, and code review standards discovered in the codebase to maintain consistency and quality.

## 📋 Instructions for Claude Code

### Phase 1: Coding Conventions Documentation

Analyze the codebase to identify and document established patterns.

#### 1. File and Folder Naming

**Observe patterns:**
```bash
# Check component naming
ls client/components/

# Check page naming
ls client/pages/

# Check utility naming
ls client/lib/ client/utils/
```

**Document conventions:**

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `UserDashboard.tsx` |
| Pages | PascalCase | `About.tsx`, `Index.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Contexts | PascalCase with Context suffix | `AuthContext.tsx` |
| Types | PascalCase | `User.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_URL.ts` |

#### 2. Component Structure Pattern

Analyze existing components to identify the standard structure:

```typescript
/**
 * Component Name
 *
 * Brief description of what this component does.
 *
 * @example
 * <ComponentName prop1="value" prop2="value" />
 */

// 1. Imports
import { useState, useEffect } from 'react';
import { ExternalLibrary } from 'external-library';
import { LocalComponent } from '@/components/LocalComponent';
import { utilityFunction } from '@/lib/utils';
import type { TypeDefinition } from '@/types';

// 2. Type Definitions (if needed)
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component Definition
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 4. State
  const [state, setState] = useState<Type>(initialValue);

  // 5. Hooks
  const customHook = useCustomHook();

  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 7. Event Handlers
  const handleEvent = () => {
    // Handler logic
  };

  // 8. Helper Functions
  const helperFunction = () => {
    // Helper logic
  };

  // 9. Early Returns (if applicable)
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  // 10. Main Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}
```

#### 3. Import Order Convention

```typescript
// 1. React and core libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Third-party UI libraries
import { Button } from '@radix-ui/react-button';

// 3. Local components (aliased)
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/Card';

// 4. Utilities and helpers (aliased)
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';

// 5. Types (aliased)
import type { User } from '@/types/user';

// 6. Styles (if any)
import './Component.css';
```

#### 4. TypeScript Best Practices

Document TypeScript patterns observed:

```typescript
// ✅ Good: Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Use type for unions and intersections
type Status = 'pending' | 'success' | 'error';
type UserWithStatus = User & { status: Status };

// ✅ Good: Explicit return types for functions
function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// ✅ Good: Use const assertions for literal types
const STATUSES = ['pending', 'success', 'error'] as const;
type Status = typeof STATUSES[number];

// ❌ Bad: Using 'any'
function processData(data: any) { } // Avoid

// ✅ Good: Use 'unknown' and type guards
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Now TypeScript knows data is string
  }
}
```

### Phase 2: Security Best Practices

Document security patterns and requirements.

#### 1. Environment Variables & Secrets

**Rules:**
- Never commit secrets to git
- Use `.env` files for local development
- Add `.env` to `.gitignore`
- Provide `.env.example` with placeholders
- Use environment variables for all sensitive data

**Example .env.example:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API Keys
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
```

#### 2. Password Handling

```typescript
// ✅ Good: Hash passwords with bcrypt
import bcrypt from 'bcrypt';

// When creating user
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);

// When authenticating
const isValid = await bcrypt.compare(password, passwordHash);
```

**Rules:**
- Never store plain text passwords
- Use bcrypt or argon2 for hashing
- Use minimum 10 salt rounds for bcrypt
- Never log passwords

#### 3. SQL Injection Prevention

```typescript
// ✅ Good: Use parameterized queries (Drizzle ORM)
const user = await db.select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

// ✅ Good: Use Prisma
const user = await prisma.user.findUnique({
  where: { email }
});

// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`; // SQL injection risk!
```

#### 4. XSS Prevention

```tsx
// ✅ Good: React automatically escapes JSX content
<div>{userInput}</div>

// ⚠️ Caution: dangerouslySetInnerHTML (only use for trusted content)
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />

// ✅ Good: Sanitize if you must use HTML
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(untrustedHTML);
```

#### 5. Authentication & Authorization

```typescript
// ✅ Good: Verify JWT tokens
import jwt from 'jsonwebtoken';

// Create token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

// ✅ Good: Protect routes
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### 6. Input Validation

```typescript
// ✅ Good: Use Zod for validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

// Validate
const result = userSchema.safeParse(data);
if (!result.success) {
  return { errors: result.error.flatten() };
}
```

### Phase 3: Architecture Patterns

Document the project's architectural decisions.

#### 1. Folder Structure Philosophy

```
client/              # All frontend code
├── components/      # Reusable UI components
│   ├── ui/         # Base components (buttons, inputs, etc.)
│   └── [Feature]   # Feature-specific components
├── pages/          # Route-level pages (one per route)
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── types/          # TypeScript type definitions

server/             # All backend code
├── routes/         # API route handlers
├── middleware/     # Express middleware
├── db/             # Database config, schema, migrations
└── services/       # Business logic

shared/             # Code shared between client and server
└── types/          # Shared TypeScript types
```

#### 2. State Management

**Local State:**
```typescript
// Use useState for component-specific state
const [isOpen, setIsOpen] = useState(false);
```

**Global State:**
```typescript
// Use React Context for app-wide state
const { user, login, logout } = useAuth();
```

**Server State:**
```typescript
// Use TanStack Query for server data
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users'),
});
```

#### 3. API Design

```typescript
// RESTful endpoint conventions
GET    /api/users          // List all users
GET    /api/users/:id      // Get single user
POST   /api/users          // Create user
PUT    /api/users/:id      // Update user (full)
PATCH  /api/users/:id      // Update user (partial)
DELETE /api/users/:id      // Delete user

// Nested resources
GET    /api/users/:id/posts       // Get user's posts
POST   /api/users/:id/posts       // Create post for user
```

#### 4. Error Handling

```typescript
// ✅ Good: Consistent error responses
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ✅ Good: Frontend error handling
try {
  const data = await api.post('/endpoint', payload);
  return { data };
} catch (error) {
  console.error('Error:', error);
  return { error: error.message };
}
```

### Phase 4: Testing Guidelines

Document testing expectations and patterns.

#### 1. Unit Testing

```typescript
// test/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/formatDate';

describe('formatDate', () => {
  it('formats date in MM/DD/YYYY format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('01/15/2024');
  });

  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
});
```

#### 2. Component Testing

```typescript
// test/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### 3. Integration Testing

```typescript
// test/api/auth.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('POST /api/auth/register', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

### Phase 5: Code Review Checklist

Create a standard checklist for code reviews.

```markdown
# Code Review Checklist

## Functionality
- [ ] Code implements the requirements
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] No obvious bugs

## Code Quality
- [ ] Code is readable and well-organized
- [ ] Functions are small and focused
- [ ] Variable and function names are descriptive
- [ ] No unnecessary complexity
- [ ] DRY principle followed (no duplication)
- [ ] Comments added for complex logic

## TypeScript
- [ ] No 'any' types (use 'unknown' + type guards)
- [ ] Proper type definitions
- [ ] Interfaces for object shapes
- [ ] Return types specified for functions

## Security
- [ ] No secrets committed
- [ ] Input validation implemented
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (escaped output)
- [ ] Authentication/authorization checked

## Testing
- [ ] Unit tests added for new functions
- [ ] Component tests added for new components
- [ ] Integration tests added for API endpoints
- [ ] All tests passing
- [ ] Edge cases covered

## Performance
- [ ] No unnecessary re-renders
- [ ] Database queries optimized
- [ ] Large lists virtualized if needed
- [ ] Images optimized

## Accessibility
- [ ] Semantic HTML used
- [ ] Aria labels added where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards

## Documentation
- [ ] README updated if needed
- [ ] JSDoc comments added for public APIs
- [ ] Complex logic explained in comments
- [ ] Environment variables documented

## Git
- [ ] Commit messages follow conventions
- [ ] Branch name follows conventions
- [ ] PR description is clear and complete
- [ ] No merge conflicts
```

## 📊 Output Checklist

After completing this step, verify:

- ✅ Coding conventions documented
- ✅ Component structure pattern defined
- ✅ Import order convention established
- ✅ TypeScript best practices documented
- ✅ Security guidelines created
- ✅ Architecture patterns explained
- ✅ Testing guidelines provided
- ✅ Code review checklist created
- ✅ All examples are clear and actionable

## 📝 Where to Document

Create/update these files:

1. **CODING_STANDARDS.md** - Conventions and patterns
2. **SECURITY.md** - Security best practices
3. **ARCHITECTURE.md** - Architecture decisions
4. **TESTING.md** - Testing guidelines
5. **CODE_REVIEW_CHECKLIST.md** - Review checklist

Or combine into single **QUALITY_STANDARDS.md** file.

## 🔄 Next Step

Quality standards documentation complete! Proceed to:
**Final Report Generation** - Create comprehensive setup summary

---

**Estimated Time:** 10-15 minutes
**Tools Used:** Read, Write, analysis from codebase
**Output:** Complete quality and security standards documentation
