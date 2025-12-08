# Performance Optimization Guide

Strategies for building fast, responsive applications with focus on Core Web Vitals and user experience.

## Table of Contents

- [Core Web Vitals](#core-web-vitals)
- [Next.js Optimizations](#nextjs-optimizations)
- [React Performance](#react-performance)
- [Database Performance](#database-performance)
- [Caching Strategies](#caching-strategies)
- [Bundle Optimization](#bundle-optimization)
- [Monitoring](#monitoring)

## Core Web Vitals

### Key Metrics

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **FID** (First Input Delay) | ≤ 100ms | ≤ 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |

### Improving LCP

```typescript
// 1. Preload critical resources
// In your layout or page
export const metadata = {
  other: {
    'link': [
      { rel: 'preload', href: '/hero-image.webp', as: 'image' },
    ],
  },
};

// 2. Use priority for above-the-fold images
import Image from 'next/image';

<Image
  src="/hero.webp"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preloads the image
/>

// 3. Avoid lazy loading above-the-fold content
// Don't use loading="lazy" for visible content
```

### Improving CLS

```typescript
// 1. Always set dimensions on images
<Image
  src="/photo.webp"
  alt="Photo"
  width={400}  // Required
  height={300} // Required
/>

// 2. Reserve space for dynamic content
<div className="min-h-[200px]">
  {isLoading ? <Skeleton /> : <Content />}
</div>

// 3. Use font-display: swap for web fonts
// In your CSS or next/font config
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

### Improving INP

```typescript
// 1. Break up long tasks
function processLargeList(items: Item[]) {
  const CHUNK_SIZE = 100;

  return new Promise((resolve) => {
    let index = 0;

    function processChunk() {
      const chunk = items.slice(index, index + CHUNK_SIZE);
      // Process chunk...

      index += CHUNK_SIZE;

      if (index < items.length) {
        // Yield to main thread
        requestIdleCallback(processChunk);
      } else {
        resolve(results);
      }
    }

    processChunk();
  });
}

// 2. Use transitions for non-urgent updates
import { useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    // Urgent: update input
    setQuery(e.target.value);

    // Non-urgent: filter results
    startTransition(() => {
      setFilteredResults(filterItems(e.target.value));
    });
  };
}
```

## Next.js Optimizations

### Image Optimization

```typescript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Dynamic Imports

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR if not needed
});

// Lazy load on interaction
const Modal = dynamic(() => import('./Modal'));

function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open</button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}
```

### Route Segment Config

```typescript
// app/blog/[slug]/page.tsx

// Static generation (fastest)
export const dynamic = 'force-static';

// Cache for 1 hour
export const revalidate = 3600;

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### Streaming & Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      {/* Renders immediately */}
      <Header />

      {/* Streams when ready */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
    </div>
  );
}

// Stats component fetches its own data
async function Stats() {
  const stats = await fetchStats(); // Server component
  return <StatsDisplay data={stats} />;
}
```

## React Performance

### Memoization

```typescript
// Memoize expensive calculations
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [items, category]);

// Memoize callbacks passed to children
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);

// Memoize components that receive stable props
const MemoizedList = memo(function List({ items, onSelect }) {
  return items.map(item => (
    <ListItem key={item.id} item={item} onSelect={onSelect} />
  ));
});
```

### When NOT to Memoize

```typescript
// ❌ Don't memoize simple operations
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// ✅ Just compute it
const fullName = `${first} ${last}`;

// ❌ Don't memoize when values change every render
const handleClick = useCallback(() => {
  doSomething(unstableValue); // Changes every render anyway
}, [unstableValue]);

// ❌ Don't memoize components that always re-render
const MemoizedChild = memo(Child);
// If parent always passes new objects, memo is useless
<MemoizedChild data={{ ...newObjectEveryTime }} />
```

### Virtualization for Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Avoiding Unnecessary Re-renders

```typescript
// 1. Lift state down - put state close to where it's used
// ❌ Bad - entire tree re-renders
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter count={count} setCount={setCount} />
      <ExpensiveTree /> {/* Re-renders on every count change! */}
    </div>
  );
}

// ✅ Good - only Counter re-renders
function App() {
  return (
    <div>
      <Counter /> {/* State is inside */}
      <ExpensiveTree />
    </div>
  );
}

// 2. Use children pattern
function Layout({ children }) {
  const [state, setState] = useState();
  return (
    <div>
      <Sidebar state={state} />
      {children} {/* Doesn't re-render when state changes */}
    </div>
  );
}
```

## Database Performance

### Query Optimization

```typescript
// 1. Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// 2. Use include wisely
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      take: 10, // Limit nested queries
      orderBy: { createdAt: 'desc' },
    },
  },
});

// 3. Batch queries with Promise.all
const [users, posts, stats] = await Promise.all([
  prisma.user.findMany(),
  prisma.post.findMany({ take: 10 }),
  prisma.post.count(),
]);
```

### Indexes

```prisma
model Post {
  id        String   @id
  authorId  String
  status    Status
  createdAt DateTime @default(now())

  // Index frequently filtered/sorted columns
  @@index([authorId])
  @@index([status, createdAt])
  @@index([createdAt(sort: Desc)])
}
```

### Connection Pooling

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10',
    },
  },
});
```

## Caching Strategies

### TanStack Query Caching

```typescript
// Stale-while-revalidate
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
  gcTime: 30 * 60 * 1000,   // Keep in cache for 30 minutes
});

// Prefetch on hover
function PostLink({ postId }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPost(postId),
    });
  };

  return (
    <Link href={`/posts/${postId}`} onMouseEnter={prefetch}>
      View Post
    </Link>
  );
}
```

### Next.js Data Cache

```typescript
// Cache fetch requests
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }, // Cache for 1 hour
});

// Force dynamic (no cache)
const data = await fetch('https://api.example.com/user', {
  cache: 'no-store',
});

// Cache with tags for invalidation
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
});

// Invalidate by tag
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
```

### API Response Caching

```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await getPosts();

  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

## Bundle Optimization

### Analyzing Bundle Size

```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking

```typescript
// ❌ Imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Import only what you need
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ✅ Or use a smaller alternative
import { debounce } from 'lodash-es';
```

### Code Splitting

```typescript
// Automatic code splitting with dynamic imports
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Spinner />,
});

// Route-based splitting (automatic in Next.js app router)
// Each route is a separate chunk
```

## Monitoring

### Performance Metrics Collection

```typescript
// lib/analytics.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics
  console.log(metric);

  // Example: Send to custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

// app/layout.tsx
export { reportWebVitals } from '@/lib/analytics';
```

### Real User Monitoring (RUM)

```typescript
// Using web-vitals library
import { onCLS, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    fetch('/api/analytics', { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
onINP(sendToAnalytics);
```

### Performance Budgets

```javascript
// next.config.js
module.exports = {
  experimental: {
    // Warn if page exceeds budget
    largePageDataBytes: 128 * 1000, // 128KB
  },
};

// In CI: Lighthouse CI
// .lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

## Quick Wins Checklist

- [ ] Use Next.js Image component for all images
- [ ] Set explicit width/height on images
- [ ] Use `next/font` for web fonts
- [ ] Enable gzip/brotli compression
- [ ] Lazy load below-the-fold content
- [ ] Virtualize long lists (100+ items)
- [ ] Add loading states to prevent CLS
- [ ] Prefetch likely navigation targets
- [ ] Use appropriate cache headers
- [ ] Monitor Core Web Vitals in production

## Related Resources

- [Database Patterns](DATABASE_PATTERNS.md)
- [State Management](../guides/development/STATE_MANAGEMENT.md)
- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
