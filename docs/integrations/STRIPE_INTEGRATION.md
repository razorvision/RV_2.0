# Stripe Integration Guide

Complete guide for integrating Stripe payments in your Next.js application.

## Overview

Stripe provides:
- **Payments** - One-time and recurring
- **Checkout** - Hosted payment page
- **Billing** - Subscription management
- **Connect** - Marketplace payments

## Prerequisites

```bash
npm install stripe @stripe/stripe-js
```

## Environment Variables

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Basic Setup

### Server-Side Client

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})
```

### Client-Side Provider

```typescript
// lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}
```

## Checkout Session (One-time Payment)

### Create Checkout Session API

```typescript
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/canceled`,
      metadata: {
        userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
```

### Checkout Button Component

```tsx
// components/CheckoutButton.tsx
'use client'

import { useState } from 'react'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Buy Now'}
    </button>
  )
}
```

## Subscriptions

### Create Subscription Checkout

```typescript
// app/api/subscribe/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await request.json()

  // Get or create Stripe customer
  const customers = await stripe.customers.list({
    email: session.user.email,
    limit: 1,
  })

  let customerId = customers.data[0]?.id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
    })
    customerId = customer.id
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
      },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

### Customer Portal

```typescript
// app/api/billing/portal/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account' }, { status: 400 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: portalSession.url })
}
```

## Webhooks

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const customerId = session.customer as string

  if (userId && customerId) {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) return

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'canceled' },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Update subscription period, send receipt email, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Notify user, update subscription status, etc.
}
```

## Database Schema

```prisma
// prisma/schema.prisma
model User {
  id               String        @id @default(cuid())
  email            String        @unique
  stripeCustomerId String?       @unique
  subscription     Subscription?
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  user                 User     @relation(fields: [userId], references: [id])
  stripeSubscriptionId String   @unique
  stripeCustomerId     String
  status               String   // active, canceled, past_due, etc.
  priceId              String
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

## Testing

### Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### Test Cards

| Number | Description |
|--------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 3220 | 3D Secure required |
| 4000 0000 0000 9995 | Insufficient funds |

## Security Best Practices

1. **Verify webhooks** - Always verify webhook signatures
2. **Idempotency** - Handle duplicate webhook events
3. **Server-side only** - Keep secret key server-side only
4. **HTTPS** - Always use HTTPS in production
5. **Validate metadata** - Verify user ownership

## Common Issues

### Webhook Signature Fails
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Ensure raw body is used (not parsed JSON)
- Verify endpoint URL matches Stripe Dashboard

### Customer Not Found
- Check customer creation flow
- Verify `stripeCustomerId` is saved

### Subscription Not Updating
- Check webhook handler logs
- Verify all relevant events are handled

## Related Documentation

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhook Events](https://stripe.com/docs/webhooks)

---

**Last Updated:** 2024-12-08
