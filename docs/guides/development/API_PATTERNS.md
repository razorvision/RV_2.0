# API Patterns Guide

Best practices for designing and implementing REST APIs.

## Table of Contents

- [REST Conventions](#rest-conventions)
- [Route Organization](#route-organization)
- [Request Validation](#request-validation)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Versioning](#versioning)

---

## REST Conventions

### HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve resource(s) | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Update resource partially | Yes | No |
| DELETE | Remove resource | Yes | No |

### URL Structure

```
GET    /api/users              # List all users
GET    /api/users/:id          # Get single user
POST   /api/users              # Create user
PUT    /api/users/:id          # Replace user
PATCH  /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user

# Nested resources
GET    /api/users/:id/posts    # Get user's posts
POST   /api/users/:id/posts    # Create post for user

# Actions (when CRUD doesn't fit)
POST   /api/users/:id/activate # Activate user
POST   /api/orders/:id/cancel  # Cancel order
```

### Naming Guidelines

- Use **plural nouns** for resources: `/users` not `/user`
- Use **lowercase** with hyphens: `/user-profiles` not `/userProfiles`
- Use **nouns**, not verbs: `/users` not `/getUsers`
- Keep URLs **shallow**: max 2 levels of nesting

---

## Route Organization

### Next.js App Router Structure

```
app/
└── api/
    ├── users/
    │   ├── route.ts           # GET (list), POST (create)
    │   └── [id]/
    │       ├── route.ts       # GET, PUT, PATCH, DELETE
    │       └── posts/
    │           └── route.ts   # GET user's posts
    ├── posts/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    └── auth/
        ├── login/
        │   └── route.ts
        └── register/
            └── route.ts
```

### Route Handler Template

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Validation schema
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch data
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const result = createUserSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: { 
            message: 'Validation failed', 
            code: 'VALIDATION_ERROR',
            details: result.error.flatten().fieldErrors 
          } 
        },
        { status: 400 }
      )
    }

    // Check for duplicate
    const existing = await prisma.user.findUnique({
      where: { email: result.data.email }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: { message: 'Email already exists', code: 'DUPLICATE_EMAIL' } },
        { status: 409 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: result.data,
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
```

---

## Request Validation

### Using Zod

```typescript
import { z } from 'zod'

// Define schemas
const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
})

// Partial schema for updates
const updateUserSchema = userSchema.partial()

// Query params schema
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
})

// Validation helper
function validateBody<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
    }
  }
  return { success: true as const, data: result.data }
}
```

### Validation Middleware Pattern

```typescript
// lib/api/validate.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const result = schema.safeParse(body)
      
      if (!result.success) {
        return NextResponse.json(
          {
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: result.error.flatten().fieldErrors,
            },
          },
          { status: 400 }
        )
      }
      
      return handler(request, result.data)
    } catch {
      return NextResponse.json(
        { error: { message: 'Invalid JSON', code: 'INVALID_JSON' } },
        { status: 400 }
      )
    }
  }
}
```

---

## Response Formats

### Success Responses

```typescript
// Single resource
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// Collection with pagination
{
  "data": [
    { "id": "user_123", "name": "John" },
    { "id": "user_456", "name": "Jane" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}

// Action result
{
  "data": {
    "success": true,
    "message": "Email sent successfully"
  }
}
```

### Error Responses

```typescript
// Standard error format
{
  "error": {
    "message": "Human readable message",
    "code": "MACHINE_READABLE_CODE",
    "details": {}  // Optional additional info
  }
}

// Validation error
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["Invalid email format"],
      "name": ["Name is required"]
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that creates resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, state conflict |
| 422 | Unprocessable | Valid syntax but semantic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unexpected server error |

---

## Error Handling

### Custom Error Class

```typescript
// lib/api/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.details && { details: this.details }),
      },
    }
  }
}

// Common errors
export const Errors = {
  unauthorized: () => new ApiError(401, 'UNAUTHORIZED', 'Authentication required'),
  forbidden: () => new ApiError(403, 'FORBIDDEN', 'Access denied'),
  notFound: (resource: string) => 
    new ApiError(404, 'NOT_FOUND', `${resource} not found`),
  conflict: (message: string) => 
    new ApiError(409, 'CONFLICT', message),
  validation: (details: Record<string, string[]>) =>
    new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details),
}
```

### Error Handler Wrapper

```typescript
// lib/api/handler.ts
import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './errors'

type Handler = (request: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorHandler(handler: Handler): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(error.toJSON(), { status: error.statusCode })
      }
      
      console.error('Unhandled error:', error)
      return NextResponse.json(
        { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
        { status: 500 }
      )
    }
  }
}
```

---

## Authentication

### Protected Routes

```typescript
// lib/api/auth.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Errors } from './errors'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw Errors.unauthorized()
  }
  return session
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    throw Errors.forbidden()
  }
  return session
}

// Usage in route
export async function GET() {
  const session = await requireAuth()
  // ... rest of handler
}

export async function DELETE() {
  await requireRole(['admin'])
  // ... rest of handler
}
```

---

## Rate Limiting

### Using Upstash

```typescript
// lib/api/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
})

export async function checkRateLimit(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: { message: 'Too many requests', code: 'RATE_LIMITED' } },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }
  
  return null // No rate limit hit
}

// Usage
export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request)
  if (rateLimitResponse) return rateLimitResponse
  
  // ... rest of handler
}
```

---

## Versioning

### URL-Based Versioning

```
/api/v1/users
/api/v2/users
```

```
app/
└── api/
    ├── v1/
    │   └── users/
    │       └── route.ts
    └── v2/
        └── users/
            └── route.ts
```

### Header-Based Versioning

```typescript
export async function GET(request: NextRequest) {
  const version = request.headers.get('API-Version') || 'v1'
  
  if (version === 'v2') {
    // V2 implementation
  } else {
    // V1 implementation (default)
  }
}
```

---

## Related Documentation

- [Error Handling](ERROR_HANDLING.md) - Frontend error handling
- [Auth Implementation Guide](../../frameworks/AUTH_IMPLEMENTATION_GUIDE.md) - Authentication setup
- [Testing Guide](TESTING_GUIDE.md) - Testing API routes
