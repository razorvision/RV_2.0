# API Design Patterns

Standards and patterns for building consistent, maintainable REST APIs.

## Table of Contents

- [REST Conventions](#rest-conventions)
- [Request Validation](#request-validation)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Authentication & Authorization](#authentication--authorization)
- [Pagination](#pagination)
- [Rate Limiting](#rate-limiting)

## REST Conventions

### HTTP Methods

| Method | Purpose | Idempotent | Request Body |
|--------|---------|------------|--------------|
| GET | Retrieve resource(s) | Yes | No |
| POST | Create new resource | No | Yes |
| PUT | Replace entire resource | Yes | Yes |
| PATCH | Partial update | Yes | Yes |
| DELETE | Remove resource | Yes | Optional |

### URL Structure

```
GET    /api/users              # List all users
GET    /api/users/:id          # Get single user
POST   /api/users              # Create user
PUT    /api/users/:id          # Replace user
PATCH  /api/users/:id          # Update user fields
DELETE /api/users/:id          # Delete user

# Nested resources
GET    /api/users/:id/posts    # User's posts
POST   /api/users/:id/posts    # Create post for user

# Actions (when CRUD doesn't fit)
POST   /api/users/:id/verify   # Custom action
POST   /api/orders/:id/cancel  # Custom action
```

### Naming Guidelines

- Use **plural nouns** for resources: `/users`, not `/user`
- Use **kebab-case** for multi-word: `/order-items`, not `/orderItems`
- Use **query params** for filtering: `/users?role=admin&active=true`
- Avoid verbs in URLs: `/users`, not `/getUsers`

## Request Validation

### Zod Schema Validation

```typescript
// lib/validations/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  age: z.number().int().min(13).max(120).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### Using Validation in Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/lib/validations/user';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: validationResult.data,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Query Parameter Validation

```typescript
// app/api/users/route.ts
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'email']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const queryResult = querySchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!queryResult.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: queryResult.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, role, search, sortBy, order } = queryResult.data;
  // ... use validated params
}
```

## Response Formats

### Success Responses

```typescript
// Single resource
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// Collection with pagination
{
  "data": [
    { "id": "1", "name": "John" },
    { "id": "2", "name": "Jane" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasMore": true
  }
}

// Empty collection
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0,
    "hasMore": false
  }
}
```

### Response Helper

```typescript
// lib/api/response.ts
import { NextResponse } from 'next/server';

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function paginated<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number }
) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return NextResponse.json({
    data,
    pagination: {
      ...pagination,
      totalPages,
      hasMore: pagination.page < totalPages,
    },
  });
}
```

## Error Handling

### Error Response Format

```typescript
// Standard error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "email": ["Invalid email format"],
      "age": ["Must be at least 13"]
    }
  }
}

// Simple error
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Handler Utility

```typescript
// lib/api/errors.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // Custom API error
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status }
    );
  }

  // Prisma not found
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    return NextResponse.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      },
      { status: 404 }
    );
  }

  // Prisma unique constraint
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return NextResponse.json(
      {
        error: {
          code: 'CONFLICT',
          message: 'Resource already exists',
        },
      },
      { status: 409 }
    );
  }

  // Generic error
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
```

### Using Error Handler

```typescript
// app/api/users/[id]/route.ts
import { handleApiError, ApiError } from '@/lib/api/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      throw new ApiError('NOT_FOUND', 'User not found', 404);
    }

    return success(user);
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Authentication & Authorization

### Protecting Routes

```typescript
// lib/api/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ApiError } from './errors';

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new ApiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  return session.user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new ApiError('FORBIDDEN', 'Insufficient permissions', 403);
  }

  return user;
}
```

### Usage in Routes

```typescript
// app/api/admin/users/route.ts
export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const users = await prisma.user.findMany();
    return success(users);
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Pagination

### Cursor-Based Pagination (Recommended)

Better performance for large datasets and real-time data.

```typescript
// app/api/posts/route.ts
const querySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { cursor, limit } = querySchema.parse(
      Object.fromEntries(searchParams.entries())
    );

    const posts = await prisma.post.findMany({
      take: limit + 1, // Fetch one extra to check if there's more
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor item itself
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return NextResponse.json({
      data,
      pagination: {
        nextCursor,
        hasMore,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Offset-Based Pagination

Simpler but less efficient for large datasets.

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = querySchema.parse(
      Object.fromEntries(searchParams.entries())
    );

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count(),
    ]);

    return paginated(data, { page, limit, total });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Rate Limiting

### Simple In-Memory Rate Limiter

```typescript
// lib/api/rateLimit.ts
const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
) {
  const now = Date.now();
  const record = requests.get(identifier);

  if (!record || now > record.resetTime) {
    requests.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

// Usage in route
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = rateLimit(ip, 10, 60000); // 10 requests per minute

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Try again in ${rateLimitResult.resetIn} seconds`,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.resetIn),
        },
      }
    );
  }

  // Continue with request handling...
}
```

## Related Resources

- [Error Handling Guide](ERROR_HANDLING.md)
- [Testing Guide](TESTING_GUIDE.md) - Testing API routes
- [Zod Documentation](https://zod.dev/)
