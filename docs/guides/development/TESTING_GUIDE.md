# Testing Guide

Comprehensive guide for testing strategies, patterns, and best practices.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Organization](#test-organization)
- [Mocking Strategies](#mocking-strategies)
- [Coverage Requirements](#coverage-requirements)

---

## Testing Philosophy

### The Testing Pyramid

```
        /\        E2E Tests (few, slow, high confidence)
       /  \       
      /----\      Integration Tests (some, medium speed)
     /      \
    /--------\    Unit Tests (many, fast, isolated)
```

### Core Principles

1. **Test behavior, not implementation** - Tests should verify what code does, not how
2. **Keep tests fast** - Slow tests don't get run
3. **Make tests deterministic** - Same input = same output, every time
4. **Test in isolation** - Unit tests shouldn't depend on external services
5. **Write readable tests** - Tests are documentation

---

## Test Types

### Unit Tests
- Test individual functions/components in isolation
- Fast (< 100ms each)
- No external dependencies (database, API, filesystem)
- High volume (majority of tests)

### Integration Tests
- Test multiple components together
- May use test databases or mocked services
- Medium speed
- Verify component interactions

### End-to-End Tests
- Test complete user flows
- Use real browser (Playwright)
- Slowest but highest confidence
- Cover critical paths only

---

## Unit Testing

### Setup (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
```

### Testing Functions

```typescript
// utils/calculate.ts
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// utils/calculate.test.ts
import { describe, it, expect } from 'vitest'
import { calculateTotal } from './calculate'

describe('calculateTotal', () => {
  it('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0)
  })

  it('calculates single item correctly', () => {
    const items = [{ price: 10, quantity: 2 }]
    expect(calculateTotal(items)).toBe(20)
  })

  it('sums multiple items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ]
    expect(calculateTotal(items)).toBe(35)
  })

  it('handles decimal prices', () => {
    const items = [{ price: 10.99, quantity: 1 }]
    expect(calculateTotal(items)).toBeCloseTo(10.99)
  })
})
```

### Testing React Components

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

### Testing Hooks

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

---

## Integration Testing

### Testing API Routes (Next.js)

```typescript
// app/api/users/route.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { GET, POST } from './route'

describe('GET /api/users', () => {
  beforeEach(async () => {
    // Seed test data
    await prisma.user.create({
      data: { email: 'test@example.com', name: 'Test User' }
    })
  })

  afterEach(async () => {
    // Clean up
    await prisma.user.deleteMany()
  })

  it('returns all users', async () => {
    const request = new Request('http://localhost/api/users')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.users).toHaveLength(1)
    expect(data.users[0].email).toBe('test@example.com')
  })
})

describe('POST /api/users', () => {
  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  it('creates a new user', async () => {
    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@example.com', name: 'New User' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user.email).toBe('new@example.com')
  })

  it('returns 400 for invalid email', async () => {
    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid', name: 'User' })
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
```

### Testing with Test Database

```typescript
// tests/setup.ts
import { beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

beforeAll(async () => {
  // Run migrations on test database
  // Or use a separate test database URL
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

---

## End-to-End Testing

### Setup (Playwright)

```bash
npm init playwright@latest
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Writing E2E Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Welcome')
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials')
  })
})
```

### Page Object Pattern

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('[name="email"]')
    this.passwordInput = page.locator('[name="password"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('[role="alert"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}

// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test('user can sign in', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')
  
  await expect(page).toHaveURL('/dashboard')
})
```

---

## Test Organization

### File Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx      # Co-located unit tests
│   ├── utils/
│   │   ├── calculate.ts
│   │   └── calculate.test.ts
│   └── hooks/
│       ├── useAuth.ts
│       └── useAuth.test.ts
├── tests/
│   ├── integration/           # Integration tests
│   │   └── api/
│   │       └── users.test.ts
│   └── setup.ts               # Test setup
└── e2e/                       # E2E tests
    ├── auth.spec.ts
    ├── checkout.spec.ts
    └── pages/                 # Page objects
        └── LoginPage.ts
```

### Naming Conventions

```typescript
// Unit/Integration: *.test.ts or *.test.tsx
Button.test.tsx
calculate.test.ts
users.test.ts

// E2E: *.spec.ts
auth.spec.ts
checkout.spec.ts
```

---

## Mocking Strategies

### Mocking Functions

```typescript
import { vi } from 'vitest'

// Mock a function
const mockFn = vi.fn()
mockFn.mockReturnValue('result')
mockFn.mockResolvedValue('async result')

// Verify calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(2)
```

### Mocking Modules

```typescript
// Mock entire module
vi.mock('@/lib/api', () => ({
  fetchUsers: vi.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
}))

// Mock with factory
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    }
  }
}))
```

### Mocking API Calls (MSW)

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test User' }
    ])
  }),
  
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 2, ...body }, { status: 201 })
  }),
]

// tests/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Coverage Requirements

### Minimum Coverage

| Type | Target | Required For |
|------|--------|-------------|
| Statements | 80% | All code |
| Branches | 75% | All code |
| Functions | 80% | All code |
| Lines | 80% | All code |

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      }
    }
  }
})
```

### Running Coverage

```bash
# Generate coverage report
npm run test -- --coverage

# View HTML report
open coverage/index.html
```

---

## Best Practices

### Do's

- Write tests before fixing bugs (regression tests)
- Use descriptive test names that explain the scenario
- Keep tests independent and isolated
- Test edge cases and error conditions
- Use factories for test data

### Don'ts

- Don't test implementation details
- Don't use `any` in test code
- Don't skip tests without an issue reference
- Don't test third-party library internals
- Don't share state between tests

---

## Related Documentation

- [Code Quality Policy](CODE_QUALITY_POLICY.md) - Test requirements in PRs
- [CI Monitoring Guide](../../workflows/CI_MONITORING_GUIDE.md) - Running tests in CI
- [Error Handling](ERROR_HANDLING.md) - Testing error scenarios
