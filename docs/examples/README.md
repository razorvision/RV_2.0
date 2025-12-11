# Code Examples

Practical, copy-paste-ready code examples for common patterns. All examples are production-tested and follow best practices.

## 🎯 Quick Find

| I need... | Go here |
|-----------|---------|
| **Working code to reference** | [Code Patterns](#code-patterns) |
| **Before/after comparisons** | [Before/After Examples](#beforeafter-examples) |
| **Templates to start from** | [Templates](#templates) |

---

## 📚 Example Categories

### Code Patterns

Real implementations of common patterns:

**Authentication:**
- [Basic Auth Setup](code-patterns/auth-implementation/basic-setup.md)
- [JWT Sessions](code-patterns/auth-implementation/jwt-sessions.md)
- [Social Providers](code-patterns/auth-implementation/social-providers.md)

**Database Operations:**
- [CRUD Patterns](code-patterns/database-operations/crud-patterns.md)
- [Transactions](code-patterns/database-operations/transactions.md)
- [Complex Queries](code-patterns/database-operations/complex-queries.md)

**API Endpoints:**
- [REST API](code-patterns/api-endpoints/rest-api.md)
- [Error Handling](code-patterns/api-endpoints/error-handling.md)
- [Input Validation](code-patterns/api-endpoints/validation.md)

**Testing:**
- [Unit Tests](code-patterns/testing-examples/unit-tests.md)
- [Integration Tests](code-patterns/testing-examples/integration-tests.md)
- [E2E Tests](code-patterns/testing-examples/e2e-tests.md)

---

### Before/After Examples

Side-by-side comparisons showing improvements:

- [Error Handling](before-after/error-handling.md) - From basic try/catch to comprehensive error boundaries
- [Database Queries](before-after/database-queries.md) - From N+1 problems to optimized queries
- [Component Structure](before-after/component-structure.md) - From monolithic to modular
- [API Design](before-after/api-design.md) - From inconsistent to RESTful

---

### Templates

Copy-paste-ready templates:

- [API Route Template](templates/api-route.md)
- [Database Model Template](templates/database-model.md)
- [React Component Template](templates/react-component.md)
- [Test Suite Template](templates/test-suite.md)

---

## 🔍 Example Format

Each example follows this structure:

### 1. **Context**
When and why to use this pattern.

### 2. **Code**
Complete, runnable example with comments.

### 3. **Key Points**
Important details and gotchas.

### 4. **Alternatives**
Other approaches and when to use them.

### 5. **Testing**
How to test this pattern.

---

## 💡 Featured Examples

### Quick Start: API Endpoint

**Complete Next.js API route with validation, error handling, and logging:**

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Input validation schema
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin']).default('user'),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const data = createUserSchema.parse(body)

    // Check for existing user
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    // Log unexpected errors
    console.error('Failed to create user:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Key features:**
- ✅ Input validation with Zod
- ✅ Proper HTTP status codes
- ✅ Error handling (validation vs. server errors)
- ✅ Database interaction with Prisma
- ✅ Select only needed fields

**See full guide:** [API Endpoint Pattern](code-patterns/api-endpoints/rest-api.md)

---

### Quick Start: React Component

**Production-ready component with TypeScript, error handling, and accessibility:**

```typescript
// components/UserCard.tsx
import { useState } from 'react'
import { User } from '@/types'

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!onDelete) return

    const confirmed = confirm(`Delete user ${user.name}?`)
    if (!confirmed) return

    setIsDeleting(true)
    setError(null)

    try {
      await onDelete(user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="border rounded-lg p-4 shadow-sm"
      role="article"
      aria-label={`User card for ${user.name}`}
    >
      {error && (
        <div
          className="bg-red-50 text-red-800 p-2 rounded mb-2"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label={`Edit ${user.name}`}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            aria-label={`Delete ${user.name}`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}
```

**Key features:**
- ✅ TypeScript props with optional callbacks
- ✅ Loading states
- ✅ Error handling with user feedback
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Confirmation before destructive actions

**See full guide:** [React Component Pattern](code-patterns/react-components/user-card.md)

---

### Quick Start: Database Transaction

**Safe multi-step database operation:**

```typescript
// lib/orders.ts
import { prisma } from '@/lib/prisma'

export async function createOrder(userId: string, items: OrderItem[]) {
  // Use transaction to ensure atomicity
  return await prisma.$transaction(async (tx) => {
    // 1. Create order
    const order = await tx.order.create({
      data: {
        userId,
        status: 'pending',
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    })

    // 2. Create order items
    await tx.orderItem.createMany({
      data: items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    // 3. Update product inventory
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // 4. Return order with items
    return await tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  })
}
```

**Why transactions?**
- ✅ All operations succeed or all fail (atomicity)
- ✅ No partial orders in database
- ✅ Inventory stays consistent

**See full guide:** [Transaction Patterns](code-patterns/database-operations/transactions.md)

---

## 🎓 How to Use Examples

### 1. Find Relevant Example
Use the search or browse by category.

### 2. Read the Context
Understand when and why to use this pattern.

### 3. Copy and Adapt
Copy the code and modify for your use case.

### 4. Test Thoroughly
Adapt the test examples to your situation.

### 5. Refer Back
Bookmark examples you use frequently.

---

## 📖 Example Navigation

### By Technology

**Frontend:**
- React components
- Form handling
- State management
- API calls

**Backend:**
- API routes
- Database queries
- Authentication
- File uploads

**Testing:**
- Unit tests
- Integration tests
- E2E tests
- Mocking

**DevOps:**
- Docker setup
- CI/CD pipelines
- Environment config

### By Pattern

**CRUD Operations:**
- Create → [API Route](code-patterns/api-endpoints/rest-api.md)
- Read → [Database Queries](code-patterns/database-operations/crud-patterns.md)
- Update → [Optimistic Updates](before-after/optimistic-updates.md)
- Delete → [Soft Deletes](code-patterns/database-operations/soft-deletes.md)

**Error Handling:**
- [Try/Catch Patterns](before-after/error-handling.md)
- [Error Boundaries](code-patterns/react-components/error-boundary.md)
- [API Errors](code-patterns/api-endpoints/error-handling.md)

**Authentication:**
- [Session Auth](code-patterns/auth-implementation/basic-setup.md)
- [JWT Tokens](code-patterns/auth-implementation/jwt-sessions.md)
- [OAuth](code-patterns/auth-implementation/social-providers.md)

---

## 🤝 Contributing Examples

Have a great pattern to share?

1. **Write the example** following the format above
2. **Test it** - Ensure code works
3. **Document it** - Explain the why, not just the what
4. **Submit a PR** - Share with the team

**See:** [Documentation Guidelines](../guides/team/DOCUMENTATION_GUIDELINES.md)

---

## 🔗 Related Resources

- [Best Practices](../best-practices/) - Patterns and anti-patterns
- [Learning Paths](../learning-paths/) - Progressive tutorials
- [Troubleshooting](../troubleshooting/) - Fix common issues
- [Tools Guide](../tools/) - Development tools

---

**Last Updated:** 2024-12-11
