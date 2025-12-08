# Database Patterns

Best practices for database design, queries, and data management using Prisma with PostgreSQL.

## Table of Contents

- [Schema Design](#schema-design)
- [Query Patterns](#query-patterns)
- [Transactions](#transactions)
- [Soft Deletes](#soft-deletes)
- [Audit Trails](#audit-trails)
- [Seeding](#seeding)
- [Migrations](#migrations)
- [Performance](#performance)

## Schema Design

### Naming Conventions

```prisma
// Models: PascalCase, singular
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations: camelCase
  posts     Post[]
  profile   Profile?

  @@map("users") // Table name: snake_case, plural
}

// Enums: PascalCase
enum UserRole {
  USER
  ADMIN
  MODERATOR
}
```

### Standard Fields

Every model should include:

```prisma
model Entity {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("entities")
}
```

### Relationships

```prisma
// One-to-Many
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])
}

// Many-to-Many (explicit join table for extra fields)
model Post {
  id   String     @id @default(cuid())
  tags PostTag[]
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  postId    String   @map("post_id")
  tagId     String   @map("tag_id")
  addedAt   DateTime @default(now()) @map("added_at")
  post      Post     @relation(fields: [postId], references: [id])
  tag       Tag      @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
  @@map("post_tags")
}

// One-to-One
model User {
  id      String   @id @default(cuid())
  profile Profile?
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

### Indexes

```prisma
model Post {
  id          String   @id @default(cuid())
  authorId    String   @map("author_id")
  status      PostStatus
  publishedAt DateTime? @map("published_at")
  title       String

  // Single column index
  @@index([authorId])

  // Composite index (order matters - most selective first)
  @@index([status, publishedAt])

  // Full-text search (PostgreSQL)
  @@index([title], type: BTree)
}
```

## Query Patterns

### Basic CRUD

```typescript
// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Read (single)
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Read (with relations)
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    posts: true,
    profile: true,
  },
});

// Read (list with filtering)
const posts = await prisma.post.findMany({
  where: {
    authorId: userId,
    status: 'PUBLISHED',
  },
  orderBy: { publishedAt: 'desc' },
  take: 10,
  skip: 0,
});

// Update
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

### Avoiding N+1 Queries

```typescript
// ❌ N+1 Problem - fetches posts for each user separately
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}

// ✅ Solution - use include
const users = await prisma.user.findMany({
  include: { posts: true },
});

// ✅ Or use select for specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});
```

### Complex Filtering

```typescript
// OR conditions
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
    ],
  },
});

// AND with nested conditions
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { status: 'PUBLISHED' },
      { publishedAt: { lte: new Date() } },
      {
        author: {
          role: 'ADMIN',
        },
      },
    ],
  },
});

// NOT
const activeUsers = await prisma.user.findMany({
  where: {
    NOT: { status: 'DELETED' },
  },
});
```

### Aggregations

```typescript
// Count
const count = await prisma.post.count({
  where: { authorId: userId },
});

// Group by
const postsByStatus = await prisma.post.groupBy({
  by: ['status'],
  _count: { id: true },
});

// Aggregate
const stats = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { viewCount: true },
  _max: { viewCount: true },
  where: { authorId: userId },
});
```

## Transactions

### Interactive Transactions

Use when operations depend on each other:

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Decrement from source
  const source = await tx.account.update({
    where: { id: sourceId },
    data: { balance: { decrement: amount } },
  });

  if (source.balance < 0) {
    throw new Error('Insufficient funds');
  }

  // Increment to destination
  const destination = await tx.account.update({
    where: { id: destId },
    data: { balance: { increment: amount } },
  });

  return { source, destination };
});
```

### Batch Transactions

Use when operations are independent:

```typescript
const [users, posts, comments] = await prisma.$transaction([
  prisma.user.count(),
  prisma.post.count(),
  prisma.comment.count(),
]);
```

### Transaction Options

```typescript
await prisma.$transaction(
  async (tx) => {
    // operations
  },
  {
    maxWait: 5000, // Max time to acquire connection
    timeout: 10000, // Max execution time
    isolationLevel: 'Serializable', // Transaction isolation
  }
);
```

## Soft Deletes

### Schema Setup

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  deletedAt DateTime? @map("deleted_at")

  @@index([deletedAt])
}
```

### Query Middleware

```typescript
// lib/prisma.ts
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    post: {
      async findMany({ model, operation, args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUnique({ args, query }) {
        // Convert to findFirst to add deletedAt filter
        return prisma.post.findFirst({
          where: { ...args.where, deletedAt: null },
        });
      },
    },
  },
});

export { prisma };
```

### Soft Delete Function

```typescript
async function softDelete(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  });
}

async function restore(postId: string) {
  // Use $queryRaw to bypass middleware
  return prisma.$queryRaw`
    UPDATE posts SET deleted_at = NULL WHERE id = ${postId}
  `;
}
```

## Audit Trails

### Schema

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id")
  action     String   // CREATE, UPDATE, DELETE
  changes    Json?    // What changed
  userId     String?  @map("user_id")
  createdAt  DateTime @default(now()) @map("created_at")

  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### Audit Middleware

```typescript
// lib/audit.ts
interface AuditContext {
  userId?: string;
}

const auditContext = new AsyncLocalStorage<AuditContext>();

export function withAuditContext<T>(
  context: AuditContext,
  fn: () => Promise<T>
): Promise<T> {
  return auditContext.run(context, fn);
}

// In your Prisma client
const prisma = new PrismaClient().$extends({
  query: {
    $allOperations({ model, operation, args, query }) {
      const result = query(args);

      // Log mutations
      if (['create', 'update', 'delete'].includes(operation)) {
        const ctx = auditContext.getStore();

        result.then((data) => {
          prisma.auditLog.create({
            data: {
              entityType: model,
              entityId: data.id,
              action: operation.toUpperCase(),
              changes: args.data,
              userId: ctx?.userId,
            },
          });
        });
      }

      return result;
    },
  },
});
```

### Usage

```typescript
// In API route
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  return withAuditContext({ userId: session?.user?.id }, async () => {
    const post = await prisma.post.create({
      data: { title: 'New Post', authorId: session.user.id },
    });
    return NextResponse.json(post);
  });
}
```

## Seeding

### Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (in development)
  if (process.env.NODE_ENV === 'development') {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create posts
  await prisma.post.createMany({
    data: [
      { title: 'First Post', authorId: admin.id },
      { title: 'Second Post', authorId: admin.id },
    ],
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### package.json

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Run Seed

```bash
npx prisma db seed
```

## Migrations

### Creating Migrations

```bash
# Generate migration from schema changes
npx prisma migrate dev --name add_user_role

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Best Practices

1. **One change per migration** - Easier to rollback
2. **Test migrations** - Run on staging first
3. **Backup before production** - Always
4. **Use `--create-only`** - Review SQL before applying

```bash
# Create migration without applying
npx prisma migrate dev --create-only --name rename_column

# Review generated SQL in prisma/migrations/
# Then apply
npx prisma migrate dev
```

### Data Migrations

For data transformations, create a separate script:

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Split fullName into firstName and lastName
  const users = await prisma.user.findMany({
    where: { firstName: null },
  });

  for (const user of users) {
    const [firstName, ...rest] = user.fullName?.split(' ') || [''];
    const lastName = rest.join(' ');

    await prisma.user.update({
      where: { id: user.id },
      data: { firstName, lastName },
    });
  }
}

main();
```

## Performance

### Query Optimization

```typescript
// Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't fetch large fields like bio
  },
});

// Limit results
const recentPosts = await prisma.post.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' },
});

// Use cursor pagination for large datasets
const posts = await prisma.post.findMany({
  take: 10,
  cursor: { id: lastPostId },
  skip: 1,
});
```

### Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Query Logging

```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`Slow query (${e.duration}ms):`, e.query);
  }
});
```

## Related Resources

- [API Patterns](../guides/development/API_PATTERNS.md)
- [Performance Guide](PERFORMANCE_GUIDE.md)
- [Prisma Documentation](https://www.prisma.io/docs)
