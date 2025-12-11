---
title: Testing Guide
parent: Development
grand_parent: Guides
---
# Testing Guide

Comprehensive testing strategies for maintaining code quality and preventing regressions.

## Framework-Specific Testing

This guide covers general testing patterns. For framework-specific setups:

| Framework | Guide | Description |
|-----------|-------|-------------|
| **Django + Docker** | [Testing Template Packet](../../../testing-template-packet/START-HERE.md) | Complete Django/pytest/Docker setup with `/test` Claude command |
| Next.js | See [E2E Testing](#e2e-testing) below | Playwright-based testing |
| API Routes | See [Integration Testing](#integration-testing) below | Route handler testing patterns |

> **Using Django?** The [Testing Template Packet](../../../testing-template-packet/START-HERE.md) provides a complete testing infrastructure with Claude Code integration, Docker support, and example tests. Start there instead of building from scratch.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)

## Testing Philosophy

### The Testing Pyramid

```
        /\
       /  \      E2E Tests (few)
      /----\     - Critical user flows
     /      \    - Smoke tests
    /--------\   Integration Tests (some)
   /          \  - API routes
  /------------\ - Component interactions
 /              \
/----------------\ Unit Tests (many)
                   - Functions
                   - Components
                   - Utilities
```

### Guiding Principles

1. **Test behavior, not implementation** - Tests should verify what code does, not how
2. **Fast feedback** - Unit tests run in milliseconds, keep them fast
3. **Deterministic** - Tests should produce same results every run
4. **Independent** - Tests shouldn't depend on each other or run order

## Test Types

| Type | Speed | Scope | When to Use |
|------|-------|-------|-------------|
| Unit | Fast (ms) | Single function/component | Pure logic, utilities, isolated components |
| Integration | Medium (s) | Multiple units together | API routes, database operations, component trees |
| E2E | Slow (s-min) | Full application | Critical user journeys, smoke tests |

## Unit Testing

### Framework: Vitest

Vitest provides fast, ESM-native testing with excellent TypeScript support.

```typescript
// math.ts
export function calculateTotal(items: { price: number; quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// math.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './math';

describe('calculateTotal', () => {
  it('calculates sum of items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('handles single item', () => {
    expect(calculateTotal([{ price: 100, quantity: 1 }])).toBe(100);
  });
});
```

### Testing React Components

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Custom Hooks

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Mocking

```typescript
// userService.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchUser } from './userService';

// Mock the fetch API
global.fetch = vi.fn();

describe('fetchUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns user data on success', async () => {
    const mockUser = { id: 1, name: 'John' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const user = await fetchUser(1);

    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('throws on network error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

## Integration Testing

### Testing API Routes (Next.js)

```typescript
// app/api/users/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('GET /api/users', () => {
  it('returns users list', async () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    const request = new Request('http://localhost/api/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);
  });
});

describe('POST /api/users', () => {
  it('creates new user', async () => {
    const newUser = { id: 1, name: 'Jane', email: 'jane@example.com' };
    (prisma.user.create as any).mockResolvedValue(newUser);

    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(newUser);
  });
});
```

### Testing with Database

For true integration tests, use a test database:

```typescript
// tests/integration/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function setupTestDatabase() {
  // Clear all tables
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.post.deleteMany(),
  ]);
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
}

// tests/integration/users.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDatabase, teardownTestDatabase } from './setup';

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
});

beforeEach(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});
```

## E2E Testing

### Framework: Playwright

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'wrong@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="error-message"]')).toHaveText(
      'Invalid email or password'
    );
  });
});
```

### Page Object Pattern

```typescript
// tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('[data-testid="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('user can sign in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  await expect(page).toHaveURL('/dashboard');
});
```

### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('dashboard components', async ({ page }) => {
  await page.goto('/dashboard');

  // Screenshot specific element
  const sidebar = page.locator('[data-testid="sidebar"]');
  await expect(sidebar).toHaveScreenshot('sidebar.png');
});
```

## Coverage Requirements

### Minimum Thresholds

```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/',
      ],
    },
  },
});
```

### Coverage by Type

| Code Type | Target | Rationale |
|-----------|--------|-----------|
| Business logic | 90%+ | Core functionality must be well-tested |
| Utilities | 95%+ | Pure functions are easy to test fully |
| Components | 80%+ | Focus on behavior, not styling |
| API routes | 85%+ | Critical integration points |
| Config/types | 0% | Not runtime code |

## Best Practices

### Naming Conventions

```typescript
// Use descriptive test names that explain the scenario
describe('UserService', () => {
  describe('createUser', () => {
    it('creates a new user with valid data', () => {});
    it('throws ValidationError when email is invalid', () => {});
    it('throws DuplicateError when email already exists', () => {});
  });
});
```

### Arrange-Act-Assert Pattern

```typescript
it('calculates discount correctly', () => {
  // Arrange
  const cart = createCart();
  cart.addItem({ price: 100, quantity: 2 });
  const coupon = { type: 'percentage', value: 10 };

  // Act
  const total = cart.calculateTotal(coupon);

  // Assert
  expect(total).toBe(180); // 200 - 10% discount
});
```

### Test Data Factories

```typescript
// tests/factories/user.ts
import { faker } from '@faker-js/faker';

export function createUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

// Usage in tests
it('displays user name', () => {
  const user = createUser({ name: 'John Doe' });
  render(<UserCard user={user} />);
  expect(screen.getByText('John Doe')).toBeVisible();
});
```

### What NOT to Test

- Third-party library internals
- Framework behavior (Next.js routing, React rendering)
- Static content that doesn't change
- Console.log statements
- CSS styling (use visual regression instead)

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific file
npm test -- math.test.ts

# Run with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E in UI mode
npx playwright test --ui
```

## Related Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Code Quality Policy](CODE_QUALITY_POLICY.md)
