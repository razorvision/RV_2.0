# Analytics Integration Guide

Guide for integrating analytics and tracking in your Next.js application.

## Provider Comparison

| Provider | Best For | Free Tier | Privacy |
|----------|----------|-----------|---------|
| **Vercel Analytics** | Vercel apps | Included | Good |
| **PostHog** | Product analytics | 1M events/mo | Self-host option |
| **Plausible** | Privacy-first | None ($9/mo) | Excellent |
| **Mixpanel** | User analytics | 20M events/mo | Moderate |
| **Google Analytics** | General purpose | Unlimited | Poor |

## Vercel Analytics

### Installation

```bash
npm install @vercel/analytics @vercel/speed-insights
```

### Setup

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Custom Events

```typescript
import { track } from '@vercel/analytics'

// Track custom events
track('button_click', { buttonId: 'signup' })
track('purchase', { product: 'pro_plan', value: 29 })
```

## PostHog Integration

### Installation

```bash
npm install posthog-js
```

### Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Provider Setup

```tsx
// components/providers/PostHogProvider.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // We'll capture manually
    capture_pageleave: true,
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

### Add to Layout

```tsx
// app/layout.tsx
import { PHProvider } from '@/components/providers/PostHogProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  )
}
```

### Custom Events

```typescript
import { usePostHog } from 'posthog-js/react'

function SignupButton() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('signup_clicked', {
      source: 'homepage',
      plan: 'free',
    })
  }

  return <button onClick={handleClick}>Sign Up</button>
}
```

### User Identification

```typescript
import posthog from 'posthog-js'

// When user signs in
function onUserSignIn(user: User) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    plan: user.plan,
  })
}

// When user signs out
function onUserSignOut() {
  posthog.reset()
}
```

### Feature Flags

```typescript
import { useFeatureFlagEnabled } from 'posthog-js/react'

function NewFeature() {
  const flagEnabled = useFeatureFlagEnabled('new-feature')

  if (!flagEnabled) return null

  return <div>New Feature!</div>
}
```

## Plausible Analytics

### Script-based Setup (Simplest)

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain="yourdomain.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Custom Events

```typescript
// lib/analytics.ts
export function trackEvent(event: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props })
  }
}

// Usage
trackEvent('Signup', { plan: 'pro' })
trackEvent('Download', { file: 'guide.pdf' })
```

### TypeScript Types

```typescript
// types/plausible.d.ts
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export {}
```

## Mixpanel Integration

### Installation

```bash
npm install mixpanel-browser
```

### Setup

```typescript
// lib/mixpanel.ts
import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  track_pageview: true,
  persistence: 'localStorage',
})

export { mixpanel }

// Event tracking
export function track(event: string, properties?: Record<string, any>) {
  mixpanel.track(event, properties)
}

// User identification
export function identify(userId: string, traits?: Record<string, any>) {
  mixpanel.identify(userId)
  if (traits) {
    mixpanel.people.set(traits)
  }
}

// Reset on logout
export function reset() {
  mixpanel.reset()
}
```

### Provider

```tsx
// components/providers/MixpanelProvider.tsx
'use client'

import { createContext, useContext, useEffect } from 'react'
import { mixpanel } from '@/lib/mixpanel'
import { useAuth } from '@/lib/auth'

const MixpanelContext = createContext(mixpanel)

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      mixpanel.identify(user.id)
      mixpanel.people.set({
        $email: user.email,
        $name: user.name,
      })
    }
  }, [user])

  return (
    <MixpanelContext.Provider value={mixpanel}>
      {children}
    </MixpanelContext.Provider>
  )
}

export const useMixpanel = () => useContext(MixpanelContext)
```

## Server-Side Analytics

### Track Server Events

```typescript
// lib/analytics-server.ts
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY!
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com'

export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, any>
) {
  await fetch(`${POSTHOG_HOST}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_API_KEY,
      distinct_id: distinctId,
      event,
      properties: {
        ...properties,
        $lib: 'server',
      },
    }),
  })
}

// Usage in API route
export async function POST(request: Request) {
  const session = await auth()

  await trackServerEvent(session?.user?.id || 'anonymous', 'api_call', {
    endpoint: '/api/users',
    method: 'POST',
  })

  // ... rest of handler
}
```

## Custom Analytics Hook

```typescript
// hooks/useAnalytics.ts
'use client'

import { useCallback } from 'react'
import { usePostHog } from 'posthog-js/react'
import { usePathname } from 'next/navigation'

interface TrackOptions {
  name: string
  properties?: Record<string, any>
}

export function useAnalytics() {
  const posthog = usePostHog()
  const pathname = usePathname()

  const track = useCallback(
    ({ name, properties = {} }: TrackOptions) => {
      posthog.capture(name, {
        ...properties,
        path: pathname,
        timestamp: new Date().toISOString(),
      })
    },
    [posthog, pathname]
  )

  const identify = useCallback(
    (userId: string, traits?: Record<string, any>) => {
      posthog.identify(userId, traits)
    },
    [posthog]
  )

  const reset = useCallback(() => {
    posthog.reset()
  }, [posthog])

  return { track, identify, reset }
}

// Usage
function ProductCard({ product }: { product: Product }) {
  const { track } = useAnalytics()

  const handleClick = () => {
    track({
      name: 'product_clicked',
      properties: {
        productId: product.id,
        productName: product.name,
        price: product.price,
      },
    })
  }

  return <div onClick={handleClick}>{/* ... */}</div>
}
```

## A/B Testing

### With PostHog

```typescript
import { useFeatureFlagVariantKey } from 'posthog-js/react'

function PricingPage() {
  const variant = useFeatureFlagVariantKey('pricing-test')

  if (variant === 'control') {
    return <OldPricingPage />
  }

  if (variant === 'variant-a') {
    return <NewPricingPageA />
  }

  return <NewPricingPageB />
}
```

### Track Conversions

```typescript
function CheckoutSuccess() {
  const posthog = usePostHog()

  useEffect(() => {
    posthog.capture('checkout_completed', {
      $set: { has_purchased: true },
    })
  }, [])

  return <div>Thank you for your purchase!</div>
}
```

## Privacy & Consent

### Consent Manager

```tsx
// components/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import posthog from 'posthog-js'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent')
    if (!consent) {
      setShowBanner(true)
      posthog.opt_out_capturing() // Disable until consent
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing()
    }
  }, [])

  const accept = () => {
    localStorage.setItem('analytics_consent', 'accepted')
    posthog.opt_in_capturing()
    setShowBanner(false)
  }

  const decline = () => {
    localStorage.setItem('analytics_consent', 'declined')
    posthog.opt_out_capturing()
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100">
      <p>We use analytics to improve your experience.</p>
      <button onClick={accept}>Accept</button>
      <button onClick={decline}>Decline</button>
    </div>
  )
}
```

### GDPR Compliance

```typescript
// lib/analytics.ts
export function respectDoNotTrack() {
  if (typeof window !== 'undefined') {
    const dnt = navigator.doNotTrack || (window as any).doNotTrack
    if (dnt === '1' || dnt === 'yes') {
      posthog.opt_out_capturing()
      return true
    }
  }
  return false
}
```

## Common Events to Track

### E-commerce

```typescript
// Product viewed
track('product_viewed', { product_id, product_name, price, category })

// Added to cart
track('add_to_cart', { product_id, quantity, cart_value })

// Checkout started
track('checkout_started', { cart_value, item_count })

// Purchase completed
track('purchase', { order_id, revenue, currency, items })
```

### SaaS

```typescript
// Signup
track('signup', { method: 'email' | 'google' | 'github' })

// Onboarding
track('onboarding_step', { step: 1, step_name: 'profile' })
track('onboarding_completed')

// Feature usage
track('feature_used', { feature: 'export', format: 'csv' })

// Subscription
track('subscription_started', { plan: 'pro', billing: 'monthly' })
track('subscription_cancelled', { plan: 'pro', reason: 'too_expensive' })
```

## Debugging

### Development Mode

```typescript
// Only track in production
if (process.env.NODE_ENV === 'production') {
  posthog.init(...)
}

// Or enable debug mode
posthog.init(key, {
  debug: process.env.NODE_ENV === 'development',
})
```

### Event Logging

```typescript
// Log all events in development
if (process.env.NODE_ENV === 'development') {
  const originalTrack = posthog.capture.bind(posthog)
  posthog.capture = (event, properties) => {
    console.log('📊 Track:', event, properties)
    return originalTrack(event, properties)
  }
}
```

## Related Documentation

- [PostHog Documentation](https://posthog.com/docs)
- [Plausible Documentation](https://plausible.io/docs)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Mixpanel Documentation](https://docs.mixpanel.com/)

---

**Last Updated:** 2024-12-08
