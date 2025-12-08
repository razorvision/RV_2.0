# Monitoring & Observability Guide

Comprehensive guide for setting up error tracking, logging, and application monitoring using Sentry and related tools.

## Table of Contents

- [Overview](#overview)
- [Sentry Setup](#sentry-setup)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Logging Best Practices](#logging-best-practices)
- [Alerts & Notifications](#alerts--notifications)
- [Debugging in Production](#debugging-in-production)

## Overview

### Observability Pillars

| Pillar | Purpose | Tool |
|--------|---------|------|
| **Errors** | Catch and diagnose exceptions | Sentry |
| **Performance** | Track response times, Core Web Vitals | Sentry, Vercel Analytics |
| **Logs** | Structured application logs | Sentry Breadcrumbs, Console |
| **Metrics** | Business and technical KPIs | Vercel Analytics, Custom |

### What to Monitor

**Always Monitor:**
- Unhandled exceptions and errors
- API response times and error rates
- Authentication failures
- Database query performance
- Third-party service failures

**Consider Monitoring:**
- User flows and conversion funnels
- Feature usage and adoption
- Resource utilization
- Cache hit rates

## Sentry Setup

### Installation

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Configuration Files

The wizard creates these files:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment identification
  environment: process.env.NODE_ENV,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay (optional)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    /^chrome-extension:\/\//,
    // Network errors users can't control
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    // User aborted requests
    'AbortError',
  ],

  beforeSend(event, hint) {
    // Filter or modify events before sending
    const error = hint.originalException;

    // Don't send expected errors
    if (error instanceof ExpectedError) {
      return null;
    }

    return event;
  },
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

```typescript
// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Next.js Configuration

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing config
};

module.exports = withSentryConfig(nextConfig, {
  // Sentry webpack plugin options
  org: 'your-org',
  project: 'your-project',

  // Upload source maps for better stack traces
  silent: true,

  // Hide source maps from users
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger
  disableLogger: true,
});
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your-auth-token  # For source map uploads
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

## Error Tracking

### Automatic Error Capture

Sentry automatically captures:
- Unhandled JavaScript exceptions
- Unhandled promise rejections
- React error boundary errors
- Server-side errors in API routes

### Manual Error Capture

```typescript
import * as Sentry from '@sentry/nextjs';

// Capture an exception
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'checkout',
      userId: user.id,
    },
    extra: {
      cartItems: cart.items.length,
      totalAmount: cart.total,
    },
  });
}

// Capture a message (for non-error events)
Sentry.captureMessage('User upgraded to premium', {
  level: 'info',
  tags: { plan: 'premium' },
});
```

### Adding Context

```typescript
// Set user context (persists across errors)
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// Clear on logout
Sentry.setUser(null);

// Set tags (key-value pairs for filtering)
Sentry.setTag('feature', 'dashboard');
Sentry.setTag('tenant', tenant.id);

// Set extra context (arbitrary data)
Sentry.setExtra('currentPage', '/dashboard');
Sentry.setExtra('filters', activeFilters);
```

### Breadcrumbs

Breadcrumbs are a trail of events leading up to an error:

```typescript
// Automatic breadcrumbs (enabled by default):
// - Console logs
// - DOM interactions (clicks)
// - XHR/fetch requests
// - Navigation changes

// Manual breadcrumbs
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User clicked checkout button',
  level: 'info',
  data: {
    cartTotal: cart.total,
    itemCount: cart.items.length,
  },
});

// Navigation breadcrumb
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to checkout',
  data: {
    from: '/cart',
    to: '/checkout',
  },
});
```

### Error Boundaries with Sentry

```typescript
// components/ErrorBoundary.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  eventId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
    this.setState({ eventId });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 rounded-lg">
            <h2>Something went wrong</h2>
            <button
              onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}
            >
              Report feedback
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

## Performance Monitoring

### Automatic Performance Tracking

With `tracesSampleRate` configured, Sentry automatically tracks:
- Page load times
- API route durations
- Database queries (with Prisma integration)
- Third-party API calls

### Custom Transactions

```typescript
import * as Sentry from '@sentry/nextjs';

async function processOrder(orderId: string) {
  return Sentry.startSpan(
    {
      name: 'process-order',
      op: 'task',
      attributes: { orderId },
    },
    async (span) => {
      // Child span for validation
      await Sentry.startSpan(
        { name: 'validate-order', op: 'validation' },
        async () => {
          await validateOrder(orderId);
        }
      );

      // Child span for payment
      await Sentry.startSpan(
        { name: 'process-payment', op: 'payment' },
        async () => {
          await processPayment(orderId);
        }
      );

      // Child span for fulfillment
      await Sentry.startSpan(
        { name: 'create-fulfillment', op: 'fulfillment' },
        async () => {
          await createFulfillment(orderId);
        }
      );
    }
  );
}
```

### Web Vitals Tracking

```typescript
// Sentry tracks Core Web Vitals automatically
// You can also report custom web vitals

import { onCLS, onFID, onLCP, onTTFB, onINP } from 'web-vitals';
import * as Sentry from '@sentry/nextjs';

function reportWebVital(metric: any) {
  Sentry.captureMessage(`Web Vital: ${metric.name}`, {
    level: 'info',
    tags: {
      'web-vital': metric.name,
      page: window.location.pathname,
    },
    extra: {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    },
  });
}

// In your app initialization
onCLS(reportWebVital);
onFID(reportWebVital);
onLCP(reportWebVital);
onTTFB(reportWebVital);
onINP(reportWebVital);
```

## Logging Best Practices

### Structured Logging

```typescript
// lib/logger.ts
import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  feature?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();

  // Add as Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: 'app',
    message,
    level: level === 'warn' ? 'warning' : level,
    data: context,
  });

  // Console output for development
  if (process.env.NODE_ENV === 'development') {
    const logFn = level === 'error' ? console.error
                : level === 'warn' ? console.warn
                : console.log;
    logFn(`[${timestamp}] [${level.toUpperCase()}] ${message}`, context);
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
};
```

### What to Log

```typescript
// ✅ Good logging
logger.info('User signed in', { userId: user.id, method: 'google' });
logger.info('Order created', { orderId, total: order.total, items: order.items.length });
logger.warn('Rate limit approaching', { userId, currentRate: 95, limit: 100 });
logger.error('Payment failed', { orderId, error: error.message, provider: 'stripe' });

// ❌ Bad logging
logger.info('Something happened');  // Too vague
logger.info('User data', { user });  // Too much sensitive data
logger.info(`Processing item ${i}`);  // Too noisy in loops
```

### Sensitive Data

```typescript
// Never log:
// - Passwords, tokens, API keys
// - Full credit card numbers
// - Social security numbers
// - Full session tokens

// Sentry scrubbing config
Sentry.init({
  // ...
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    return event;
  },
});
```

## Alerts & Notifications

### Sentry Alert Rules

Configure in Sentry Dashboard → Alerts → Create Alert Rule:

**Critical Alerts (Immediate):**
- Error frequency > 10 in 5 minutes
- New issue in production
- Transaction duration > 5 seconds

**Warning Alerts (Daily Digest):**
- Error frequency trending up
- New unhandled rejection type
- Performance regression detected

### Integration with Slack

```yaml
# In Sentry Dashboard:
# Settings → Integrations → Slack

# Alert routing:
- Critical errors → #incidents channel
- New issues → #engineering channel
- Performance alerts → #performance channel
```

### Custom Alert Webhooks

```typescript
// For custom alert handling (e.g., PagerDuty, custom systems)
// Configure in Sentry Dashboard → Settings → Integrations → Webhooks

// Or use Sentry SDK to send to custom endpoint
Sentry.init({
  beforeSend(event) {
    if (event.level === 'fatal') {
      // Trigger custom alert
      fetch('/api/alerts/critical', {
        method: 'POST',
        body: JSON.stringify({
          title: event.exception?.values?.[0]?.value,
          eventId: event.event_id,
        }),
      });
    }
    return event;
  },
});
```

## Debugging in Production

### Source Maps

Ensure source maps are uploaded for readable stack traces:

```bash
# Verify source maps are uploaded
npx @sentry/cli sourcemaps explain <event-id>
```

### Session Replay

Enable session replay to see exactly what users did before an error:

```typescript
Sentry.init({
  integrations: [
    Sentry.replayIntegration({
      // Capture 10% of all sessions
      sessionSampleRate: 0.1,
      // Capture 100% of sessions with errors
      errorSampleRate: 1.0,
      // Mask all text for privacy
      maskAllText: false,
      // Block all media
      blockAllMedia: false,
    }),
  ],
});
```

### Debug IDs

Add debug IDs to help correlate logs across systems:

```typescript
// Generate request ID middleware
export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();

  Sentry.setTag('requestId', requestId);

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
}
```

### User Feedback

Allow users to report issues:

```typescript
// Show feedback dialog after error
function handleError(error: Error) {
  const eventId = Sentry.captureException(error);

  Sentry.showReportDialog({
    eventId,
    title: 'Something went wrong',
    subtitle: 'Our team has been notified.',
    subtitle2: 'If you\'d like to help, tell us what happened below.',
  });
}
```

## Checklist

### Initial Setup
- [ ] Install @sentry/nextjs
- [ ] Configure DSN in environment variables
- [ ] Set up source map uploads
- [ ] Configure sample rates appropriately
- [ ] Test error capture in development

### Production Readiness
- [ ] Set environment tags (production/staging/development)
- [ ] Configure user context on authentication
- [ ] Set up Slack/email alert integrations
- [ ] Configure error filtering (ignore expected errors)
- [ ] Enable session replay for debugging

### Ongoing
- [ ] Review error trends weekly
- [ ] Address high-volume errors promptly
- [ ] Update ignored errors list as needed
- [ ] Monitor performance baselines
- [ ] Review and tune alert thresholds

## Related Resources

- [Incident Response](INCIDENT_RESPONSE.md)
- [Error Handling](../development/ERROR_HANDLING.md)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
