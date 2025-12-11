---
title: Email Integration Guide
parent: Integrations
---
# Email Integration Guide

Guide for integrating email services (Resend, SendGrid, Postmark) in your Next.js application.

## Overview

### Provider Comparison

| Provider | Best For | Free Tier | Pricing |
|----------|----------|-----------|---------|
| **Resend** | Modern apps | 3K/mo | $20/mo for 50K |
| **SendGrid** | High volume | 100/day | $15/mo for 50K |
| **Postmark** | Transactional | 100/mo | $15/mo for 10K |
| **AWS SES** | Cost-sensitive | 62K/mo (from EC2) | $0.10/1K |

## Resend Integration

### Installation

```bash
npm install resend
```

### Environment Variables

```env
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

### Basic Setup

```typescript
// lib/email.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
```

### React Email Templates

```bash
npm install @react-email/components
```

```tsx
// emails/WelcomeEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
  actionUrl: string
}

export function WelcomeEmail({ name, actionUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Our App!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome, {name}!</Text>
          <Text style={paragraph}>
            We're excited to have you on board. Get started by setting up your account.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={actionUrl}>
              Get Started
            </Button>
          </Section>
          <Text style={footer}>
            If you didn't create this account, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '20px',
}

const paragraph = {
  fontSize: '16px',
  color: '#4a4a4a',
  lineHeight: '26px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  marginBottom: '30px',
}

const button = {
  backgroundColor: '#0070f3',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
}

const footer = {
  fontSize: '14px',
  color: '#8a8a8a',
  marginTop: '20px',
}
```

### Sending with React Email

```typescript
// lib/email.ts
import { render } from '@react-email/render'
import { WelcomeEmail } from '@/emails/WelcomeEmail'

export async function sendWelcomeEmail(email: string, name: string) {
  const html = render(WelcomeEmail({
    name,
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  }))

  return sendEmail({
    to: email,
    subject: 'Welcome to Our App!',
    html,
  })
}
```

### API Route for Email

```typescript
// app/api/email/welcome/route.ts
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'
import { auth } from '@/lib/auth'

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await sendWelcomeEmail(session.user.email, session.user.name || 'User')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

## Common Email Templates

### Password Reset

```tsx
// emails/PasswordResetEmail.tsx
import { Body, Button, Container, Head, Html, Preview, Text } from '@react-email/components'

interface PasswordResetEmailProps {
  resetUrl: string
  expiresIn: string
}

export function PasswordResetEmail({ resetUrl, expiresIn }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Reset Your Password</Text>
          <Text style={paragraph}>
            Click the button below to reset your password. This link will expire in {expiresIn}.
          </Text>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
          <Text style={footer}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### Invoice/Receipt

```tsx
// emails/InvoiceEmail.tsx
interface InvoiceEmailProps {
  invoiceNumber: string
  amount: string
  items: Array<{ name: string; quantity: number; price: string }>
  invoiceUrl: string
}

export function InvoiceEmail({ invoiceNumber, amount, items, invoiceUrl }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice #{invoiceNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Invoice #{invoiceNumber}</Text>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Item</th>
                <th style={th}>Qty</th>
                <th style={th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Text style={total}>Total: {amount}</Text>
          <Button style={button} href={invoiceUrl}>
            View Invoice
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
```

## Email Queuing (Background Jobs)

### With Inngest

```bash
npm install inngest
```

```typescript
// lib/inngest/client.ts
import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'my-app' })

// lib/inngest/functions.ts
import { inngest } from './client'
import { sendEmail } from '@/lib/email'

export const sendEmailFunction = inngest.createFunction(
  { id: 'send-email' },
  { event: 'email/send' },
  async ({ event }) => {
    await sendEmail(event.data)
    return { success: true }
  }
)

// Usage
await inngest.send({
  name: 'email/send',
  data: {
    to: 'user@example.com',
    subject: 'Welcome!',
    html: '<p>Hello!</p>',
  },
})
```

### With Bull/BullMQ (Redis)

```typescript
// lib/queue/email.ts
import { Queue, Worker } from 'bullmq'
import { sendEmail } from '@/lib/email'

const connection = { host: 'localhost', port: 6379 }

export const emailQueue = new Queue('email', { connection })

const worker = new Worker(
  'email',
  async (job) => {
    await sendEmail(job.data)
  },
  { connection }
)

// Usage
await emailQueue.add('send', {
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<p>Hello!</p>',
})
```

## Transactional vs Marketing

### Transactional Email (Resend, Postmark)
- Password resets
- Order confirmations
- Account notifications
- Welcome emails

### Marketing Email (Mailchimp, ConvertKit)
- Newsletters
- Promotional campaigns
- Drip sequences

```typescript
// Example: Add user to mailing list
export async function addToMailingList(email: string, name: string) {
  const response = await fetch(
    `https://api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME: name },
      }),
    }
  )
  return response.json()
}
```

## Domain Setup

### DNS Records for Resend

```
Type    Name                    Value
TXT     @                       v=spf1 include:_spf.resend.com ~all
CNAME   resend._domainkey       [provided by Resend]
```

### Verify Domain

```typescript
// Check domain status
const { data } = await resend.domains.list()
console.log(data)
```

## Testing

### Preview Emails

```bash
# Start React Email preview server
npx email dev
```

### Test in Development

```typescript
// lib/email.ts
export async function sendEmail(options: EmailOptions) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:', options)
    return { id: 'dev-' + Date.now() }
  }
  // ... actual send
}
```

## Error Handling

```typescript
export async function sendEmailWithRetry(
  options: EmailOptions,
  maxRetries = 3
) {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendEmail(options)
    } catch (error) {
      lastError = error as Error
      console.error(`Email attempt ${i + 1} failed:`, error)
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
    }
  }

  throw lastError
}
```

## Rate Limiting

```typescript
// Simple rate limiter for email sending
const emailRateLimiter = new Map<string, number[]>()

export function canSendEmail(email: string, limit = 5, windowMs = 60000) {
  const now = Date.now()
  const timestamps = emailRateLimiter.get(email) || []

  // Remove old timestamps
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    return false
  }

  recent.push(now)
  emailRateLimiter.set(email, recent)
  return true
}
```

## Related Documentation

- [Resend Documentation](https://resend.com/docs)
- [React Email](https://react.email/docs/introduction)
- [SendGrid Documentation](https://docs.sendgrid.com/)

---

**Last Updated:** 2024-12-08
