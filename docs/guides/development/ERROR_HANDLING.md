# Error Handling Guide

Comprehensive guide for handling errors across frontend and backend.

## Table of Contents

- [Error Handling Philosophy](#error-handling-philosophy)
- [React Error Boundaries](#react-error-boundaries)
- [Async Error Handling](#async-error-handling)
- [Form Validation Errors](#form-validation-errors)
- [API Error Handling](#api-error-handling)
- [Logging and Monitoring](#logging-and-monitoring)
- [User-Facing Errors](#user-facing-errors)

---

## Error Handling Philosophy

### Core Principles

1. **Fail gracefully** - Never show a blank screen
2. **Be specific** - Tell users what went wrong
3. **Be actionable** - Tell users what to do next
4. **Log everything** - Debug information for developers
5. **Don't leak secrets** - Hide sensitive error details in production

### Error Categories

| Category | Example | User Message | Developer Action |
|----------|---------|--------------|------------------|
| **Validation** | Invalid email | "Please enter a valid email" | None needed |
| **Auth** | Session expired | "Please log in again" | None needed |
| **Not Found** | Missing resource | "Item not found" | None needed |
| **Network** | API timeout | "Connection error. Try again." | Monitor |
| **Server** | 500 error | "Something went wrong" | Alert + Log |
| **Client** | JS exception | "Something went wrong" | Log + Fix |

---

## React Error Boundaries

### Basic Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        We're sorry, but something unexpected happened.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Page
      </button>
      {process.env.NODE_ENV === 'development' && error && (
        <pre className="mt-4 p-4 bg-red-50 text-red-800 rounded text-sm overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
    </div>
  )
}
```

### Next.js Error Boundary (App Router)

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}

// app/global-error.tsx (for root layout errors)
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
```

### Scoped Error Boundaries

```typescript
// Wrap specific sections that might fail
function Dashboard() {
  return (
    <div>
      <Header />
      
      <ErrorBoundary fallback={<ChartErrorFallback />}>
        <AnalyticsChart />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<ListErrorFallback />}>
        <RecentActivity />
      </ErrorBoundary>
    </div>
  )
}
```

---

## Async Error Handling

### Try-Catch Pattern

```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error (fetch failed)
      console.error('Network error:', error)
      throw new Error('Unable to connect. Please check your internet connection.')
    }
    
    // Re-throw other errors
    throw error
  }
}
```

### Error State in Components

```typescript
function DataDisplay() {
  const [data, setData] = useState(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
  if (!data) return <EmptyState />

  return <DataView data={data} />
}
```

### With TanStack Query

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  if (isLoading) return <ProfileSkeleton />
  
  if (error) {
    return (
      <ErrorCard
        title="Failed to load profile"
        message={error.message}
        onRetry={refetch}
      />
    )
  }

  return <Profile user={data} />
}
```

---

## Form Validation Errors

### Inline Validation Display

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
    </form>
  )
}
```

### Server-Side Validation Errors

```typescript
async function onSubmit(data: FormData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      // Handle validation errors from server
      if (result.error?.code === 'VALIDATION_ERROR') {
        Object.entries(result.error.details).forEach(([field, messages]) => {
          setError(field as keyof FormData, {
            message: (messages as string[])[0],
          })
        })
        return
      }
      
      // Handle other errors
      setError('root', { message: result.error?.message || 'Something went wrong' })
      return
    }

    // Success
    toast.success('Message sent!')
  } catch (error) {
    setError('root', { message: 'Network error. Please try again.' })
  }
}
```

---

## API Error Handling

### Consistent Error Response Format

```typescript
// types/api.ts
interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}

interface ApiResponse<T> {
  data?: T
  error?: ApiError
}
```

### API Client with Error Handling

```typescript
// lib/api-client.ts
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || 'Request failed',
      response.status,
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.details
    )
  }

  return data
}

// Usage
try {
  const user = await apiRequest<User>('/api/users/123')
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'NOT_FOUND':
        // Handle not found
        break
      case 'UNAUTHORIZED':
        // Redirect to login
        break
      default:
        // Show generic error
    }
  }
}
```

---

## Logging and Monitoring

### Client-Side Logging

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log('debug', message, context),
    
  info: (message: string, context?: Record<string, unknown>) =>
    log('info', message, context),
    
  warn: (message: string, context?: Record<string, unknown>) =>
    log('warn', message, context),
    
  error: (message: string, error?: Error, context?: Record<string, unknown>) =>
    log('error', message, context, error),
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    ...(error && {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    }),
  }

  // Console output
  console[level](entry)

  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production' && level === 'error') {
    sendToMonitoring(entry)
  }
}

async function sendToMonitoring(entry: LogEntry) {
  // Example: Send to logging endpoint
  fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(entry),
  }).catch(() => {
    // Silently fail - don't cause more errors
  })
}

export { logger }
```

### Sentry Integration

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  })
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

// Usage in error boundary
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  captureError(error, { componentStack: errorInfo.componentStack })
}
```

---

## User-Facing Errors

### Error Message Guidelines

| Situation | Bad | Good |
|-----------|-----|------|
| Network failure | "fetch failed" | "Unable to connect. Check your internet connection." |
| Not found | "404" | "We couldn't find what you're looking for." |
| Server error | "Internal server error" | "Something went wrong. Please try again later." |
| Validation | "Invalid input" | "Please enter a valid email address." |
| Auth | "Unauthorized" | "Please log in to continue." |

### Toast Notifications

```typescript
// Using react-hot-toast
import toast from 'react-hot-toast'

// Success
toast.success('Changes saved!')

// Error with action
toast.error(
  (t) => (
    <div>
      <p>Failed to save changes</p>
      <button onClick={() => {
        retry()
        toast.dismiss(t.id)
      }}>
        Retry
      </button>
    </div>
  ),
  { duration: 5000 }
)

// Promise toast
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save',
  }
)
```

---

## Related Documentation

- [API Patterns](API_PATTERNS.md) - API error responses
- [Testing Guide](TESTING_GUIDE.md) - Testing error scenarios
- [Incident Response](../infrastructure/INCIDENT_RESPONSE.md) - Production errors
