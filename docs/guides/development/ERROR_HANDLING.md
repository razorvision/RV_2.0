# Error Handling Guide

Comprehensive strategies for handling errors gracefully in React and Next.js applications.

## Table of Contents

- [Philosophy](#philosophy)
- [Error Boundaries](#error-boundaries)
- [Async Error Handling](#async-error-handling)
- [Form Validation Errors](#form-validation-errors)
- [API Error Handling](#api-error-handling)
- [Logging](#logging)
- [User-Facing Messages](#user-facing-messages)

## Philosophy

### Guiding Principles

1. **Fail gracefully** - Never show users a blank page or cryptic error
2. **Log thoroughly** - Capture enough context to debug issues
3. **Recover when possible** - Offer retry, fallback, or alternative actions
4. **Be honest but helpful** - Tell users something went wrong and what they can do

### Error Categories

| Category | Example | User Impact | Handling |
|----------|---------|-------------|----------|
| **Expected** | Validation failure | Immediate feedback | Show inline error |
| **Recoverable** | Network timeout | Can retry | Offer retry button |
| **Boundary** | Component crash | Section unavailable | Show fallback UI |
| **Fatal** | App crash | App unusable | Show error page |

## Error Boundaries

### Basic Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback() {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-red-600">Please refresh the page or try again later.</p>
    </div>
  );
}
```

### Next.js Error Pages

```typescript
// app/error.tsx - Handles errors in route segments
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}

// app/global-error.tsx - Handles root layout errors
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Application Error</h1>
          <p className="mb-6">Something went wrong with the application.</p>
          <button onClick={reset}>Reload Application</button>
        </div>
      </body>
    </html>
  );
}

// app/not-found.tsx - 404 page
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <a href="/" className="text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  );
}
```

### Granular Error Boundaries

```typescript
// Wrap individual sections, not the whole page
function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ErrorBoundary fallback={<WidgetError name="Revenue" />}>
        <RevenueWidget />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError name="Users" />}>
        <UsersWidget />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError name="Orders" />}>
        <OrdersWidget />
      </ErrorBoundary>
    </div>
  );
}

function WidgetError({ name }: { name: string }) {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <p className="text-gray-500">Unable to load {name}</p>
    </div>
  );
}
```

## Async Error Handling

### Try-Catch Pattern

```typescript
// ❌ Unhandled promise rejection
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// ✅ Proper error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new Error('Unable to connect. Please check your internet connection.');
    }
    throw error;
  }
}
```

### Result Pattern

```typescript
// lib/result.ts
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
async function loadUser(id: string) {
  const result = await safeAsync(fetchUser(id));

  if (!result.success) {
    console.error('Failed to load user:', result.error);
    return null;
  }

  return result.data;
}
```

### TanStack Query Error Handling

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) return <Skeleton />;

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-800 mb-2">Failed to load profile</p>
        <button
          onClick={() => refetch()}
          className="text-red-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return <ProfileCard user={data} />;
}
```

### Global Query Error Handler

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        // Global mutation error handler
        toast.error(getErrorMessage(error));
      },
    },
  },
});

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
```

## Form Validation Errors

### With React Hook Form and Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await signUp(data);
    } catch (error) {
      // Handle server-side validation errors
      if (error.code === 'EMAIL_EXISTS') {
        setError('email', {
          type: 'server',
          message: 'This email is already registered',
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Failed to create account. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="p-3 bg-red-50 text-red-800 rounded mb-4">
          {errors.root.message}
        </div>
      )}

      <div className="mb-4">
        <input
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <input
          {...register('password')}
          type="password"
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## API Error Handling

See [API Patterns](API_PATTERNS.md) for comprehensive API error handling patterns.

### Client-Side API Wrapper

```typescript
// lib/api.ts
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error?.code || 'UNKNOWN',
      data.error?.message || 'An error occurred',
      data.error?.details
    );
  }

  return data;
}

// Usage
try {
  const user = await api<User>('/users/123');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      // Handle not found
    } else if (error.status === 401) {
      // Redirect to login
    }
  }
}
```

## Logging

### Structured Logging

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  component?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (process.env.NODE_ENV === 'development') {
    console[level](message, context);
  } else {
    // Send to logging service (e.g., Datadog, Sentry)
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
};

// Usage
logger.error('Failed to fetch user', {
  userId: '123',
  error: error.message,
  stack: error.stack,
});
```

### Error Reporting Integration

```typescript
// lib/errorReporting.ts
export function reportError(
  error: Error,
  context?: Record<string, unknown>
) {
  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context);
    return;
  }

  // In production, send to error tracking service
  // Example with Sentry:
  // Sentry.captureException(error, { extra: context });
}

// Usage in error boundary
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  reportError(error, {
    componentStack: errorInfo.componentStack,
  });
}
```

## User-Facing Messages

### Error Message Guidelines

| ❌ Don't | ✅ Do |
|----------|-------|
| "Error: ECONNREFUSED" | "Unable to connect. Please try again." |
| "500 Internal Server Error" | "Something went wrong. We're looking into it." |
| "Null pointer exception" | "Failed to load data. Please refresh." |
| "Invalid input" | "Please enter a valid email address" |

### Error Message Component

```typescript
interface ErrorMessageProps {
  error: Error | string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, className }: ErrorMessageProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : getUserMessage(error);

  return (
    <div
      className={cn(
        'p-4 bg-red-50 border border-red-200 rounded-lg',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <p className="text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-red-600 hover:underline text-sm"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getUserMessage(error: Error): string {
  // Map technical errors to user-friendly messages
  if (error.message.includes('network')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return 'Please sign in to continue.';
  }
  if (error.message.includes('403') || error.message.includes('forbidden')) {
    return "You don't have permission to access this.";
  }
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }

  // Default message
  return 'Something went wrong. Please try again.';
}
```

## Related Resources

- [API Patterns](API_PATTERNS.md) - Server-side error handling
- [Testing Guide](TESTING_GUIDE.md) - Testing error scenarios
- [Logging Best Practices](../../frameworks/PERFORMANCE_GUIDE.md)
