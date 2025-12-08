# Feature Flags Guide

Implementing and managing feature flags for safe deployments, A/B testing, and gradual rollouts.

## Table of Contents

- [Overview](#overview)
- [When to Use Feature Flags](#when-to-use-feature-flags)
- [Implementation Options](#implementation-options)
- [Flag Naming & Organization](#flag-naming--organization)
- [Usage Patterns](#usage-patterns)
- [Testing with Flags](#testing-with-flags)
- [Flag Lifecycle](#flag-lifecycle)
- [Best Practices](#best-practices)

## Overview

### What Are Feature Flags?

Feature flags (also called feature toggles) are conditional statements that enable or disable features at runtime without deploying new code.

```typescript
if (featureFlags.newCheckout) {
  return <NewCheckoutFlow />;
}
return <LegacyCheckout />;
```

### Benefits

| Benefit | Description |
|---------|-------------|
| **Safe deployments** | Deploy code without enabling it |
| **Gradual rollouts** | Release to 5% → 25% → 100% of users |
| **Quick rollback** | Disable broken features instantly |
| **A/B testing** | Test variations with real users |
| **User targeting** | Enable for specific users/segments |

## When to Use Feature Flags

### Good Use Cases

✅ **New features that might need rollback**
```typescript
if (flags.newDashboard) {
  return <DashboardV2 />;
}
```

✅ **Gradual rollouts of risky changes**
```typescript
if (flags.newPaymentProcessor && isInRolloutGroup(user)) {
  return processWithNewProvider(payment);
}
```

✅ **A/B testing**
```typescript
const variant = flags.pricingPageVariant; // 'control' | 'variant-a' | 'variant-b'
```

✅ **Beta features for specific users**
```typescript
if (flags.betaFeatures && user.isBetaTester) {
  return <BetaToolbar />;
}
```

✅ **Kill switches for external dependencies**
```typescript
if (flags.enableThirdPartyWidget && !flags.widgetKillSwitch) {
  return <ThirdPartyWidget />;
}
```

### When NOT to Use Feature Flags

❌ **Simple conditional logic**
```typescript
// Don't use a flag for this
if (user.isAdmin) {
  return <AdminPanel />;
}
```

❌ **Configuration that never changes**
```typescript
// Use environment variables instead
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

❌ **Short-term workarounds**
```typescript
// Fix the bug instead of flagging around it
if (!flags.workaroundBug123) { ... }
```

## Implementation Options

### Option 1: Environment Variables (Simple)

Best for: Small projects, static flags

```typescript
// lib/featureFlags.ts
export const flags = {
  newDashboard: process.env.NEXT_PUBLIC_FF_NEW_DASHBOARD === 'true',
  betaFeatures: process.env.NEXT_PUBLIC_FF_BETA === 'true',
} as const;

// Usage
import { flags } from '@/lib/featureFlags';

if (flags.newDashboard) {
  // ...
}
```

**.env.local:**
```bash
NEXT_PUBLIC_FF_NEW_DASHBOARD=true
NEXT_PUBLIC_FF_BETA=false
```

**Pros:** Simple, no external service
**Cons:** Requires redeploy to change, no user targeting

### Option 2: Database-Backed Flags

Best for: Dynamic flags without external service

```typescript
// lib/featureFlags.ts
import { prisma } from './prisma';
import { cache } from 'react';

interface FeatureFlag {
  name: string;
  enabled: boolean;
  percentage?: number;
  userIds?: string[];
}

export const getFlags = cache(async () => {
  const flags = await prisma.featureFlag.findMany();
  return Object.fromEntries(
    flags.map(f => [f.name, f])
  );
});

export async function isEnabled(
  flagName: string,
  userId?: string
): Promise<boolean> {
  const flags = await getFlags();
  const flag = flags[flagName];

  if (!flag) return false;
  if (!flag.enabled) return false;

  // User-specific override
  if (userId && flag.userIds?.includes(userId)) {
    return true;
  }

  // Percentage rollout
  if (flag.percentage !== undefined && flag.percentage < 100) {
    if (!userId) return false;
    const hash = simpleHash(userId + flagName);
    return (hash % 100) < flag.percentage;
  }

  return true;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
```

**Prisma schema:**
```prisma
model FeatureFlag {
  id         String   @id @default(cuid())
  name       String   @unique
  enabled    Boolean  @default(false)
  percentage Int?
  userIds    String[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

**Pros:** Dynamic, user targeting, no external service
**Cons:** Database load, caching complexity

### Option 3: LaunchDarkly / Flagsmith (Enterprise)

Best for: Large teams, advanced targeting

```typescript
// lib/featureFlags.ts
import { init, LDClient } from 'launchdarkly-node-server-sdk';

let ldClient: LDClient;

export async function initFeatureFlags() {
  ldClient = init(process.env.LAUNCHDARKLY_SDK_KEY!);
  await ldClient.waitForInitialization();
}

export async function isEnabled(
  flagKey: string,
  user: { id: string; email?: string; plan?: string }
): Promise<boolean> {
  const ldUser = {
    key: user.id,
    email: user.email,
    custom: { plan: user.plan },
  };

  return ldClient.variation(flagKey, ldUser, false);
}
```

**Pros:** Advanced targeting, analytics, audit logs
**Cons:** Cost, external dependency

### Option 4: Vercel Edge Config

Best for: Vercel-hosted projects

```typescript
// lib/featureFlags.ts
import { get } from '@vercel/edge-config';

export async function isEnabled(flagName: string): Promise<boolean> {
  const flags = await get('featureFlags');
  return flags?.[flagName] ?? false;
}
```

**Pros:** Fast edge reads, Vercel integration
**Cons:** Vercel-only, limited targeting

## Flag Naming & Organization

### Naming Convention

```
<scope>_<feature>_<variant?>

Examples:
checkout_new_flow
dashboard_v2
experiment_pricing_variant_a
killswitch_payment_provider
beta_ai_assistant
```

### Categories

Organize flags by purpose:

```typescript
export const flags = {
  // Release flags (temporary, for safe deploys)
  release: {
    newCheckout: 'release_new_checkout',
    dashboardV2: 'release_dashboard_v2',
  },

  // Experiment flags (A/B tests)
  experiment: {
    pricingPage: 'experiment_pricing_page',
    onboardingFlow: 'experiment_onboarding',
  },

  // Operational flags (kill switches)
  ops: {
    thirdPartyWidget: 'ops_third_party_widget',
    heavyReports: 'ops_heavy_reports',
  },

  // Permission flags (access control)
  permission: {
    betaFeatures: 'permission_beta_features',
    adminTools: 'permission_admin_tools',
  },
} as const;
```

## Usage Patterns

### Server-Side (App Router)

```typescript
// app/dashboard/page.tsx
import { isEnabled } from '@/lib/featureFlags';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  const showNewDashboard = await isEnabled('dashboard_v2', session?.user?.id);

  if (showNewDashboard) {
    return <DashboardV2 />;
  }

  return <DashboardLegacy />;
}
```

### Client-Side with Context

```typescript
// contexts/FeatureFlagContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface Flags {
  newCheckout: boolean;
  betaFeatures: boolean;
}

const FeatureFlagContext = createContext<Flags | null>(null);

export function FeatureFlagProvider({
  children,
  flags,
}: {
  children: ReactNode;
  flags: Flags;
}) {
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
}

// Usage in component
function CheckoutButton() {
  const flags = useFeatureFlags();

  if (flags.newCheckout) {
    return <NewCheckoutButton />;
  }
  return <LegacyCheckoutButton />;
}
```

### API Route Protection

```typescript
// app/api/beta/route.ts
import { isEnabled } from '@/lib/featureFlags';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasBetaAccess = await isEnabled('beta_features', session.user.id);

  if (!hasBetaAccess) {
    return Response.json({ error: 'Feature not available' }, { status: 403 });
  }

  // ... beta functionality
}
```

### Gradual Rollout

```typescript
// lib/featureFlags.ts
export async function isInRollout(
  flagName: string,
  userId: string,
  percentage: number
): Promise<boolean> {
  // Create deterministic hash so same user always gets same result
  const hash = simpleHash(userId + flagName);
  return (hash % 100) < percentage;
}

// Usage: 25% rollout
const useNewFeature = await isInRollout('new_payment', user.id, 25);
```

## Testing with Flags

### Unit Tests

```typescript
// Mock the feature flags module
vi.mock('@/lib/featureFlags', () => ({
  isEnabled: vi.fn(),
}));

describe('CheckoutPage', () => {
  it('renders new checkout when flag is enabled', async () => {
    const { isEnabled } = await import('@/lib/featureFlags');
    (isEnabled as Mock).mockResolvedValue(true);

    render(<CheckoutPage />);

    expect(screen.getByTestId('new-checkout')).toBeInTheDocument();
  });

  it('renders legacy checkout when flag is disabled', async () => {
    const { isEnabled } = await import('@/lib/featureFlags');
    (isEnabled as Mock).mockResolvedValue(false);

    render(<CheckoutPage />);

    expect(screen.getByTestId('legacy-checkout')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('new checkout flow', async ({ page }) => {
    // Set flag via test API or environment
    await page.goto('/checkout?ff_new_checkout=true');

    await expect(page.getByTestId('new-checkout')).toBeVisible();
  });

  test('legacy checkout flow', async ({ page }) => {
    await page.goto('/checkout?ff_new_checkout=false');

    await expect(page.getByTestId('legacy-checkout')).toBeVisible();
  });
});
```

### Test Override Mechanism

```typescript
// lib/featureFlags.ts
export async function isEnabled(
  flagName: string,
  userId?: string,
  overrides?: Record<string, boolean>
): Promise<boolean> {
  // Allow test overrides
  if (overrides?.[flagName] !== undefined) {
    return overrides[flagName];
  }

  // Normal flag evaluation...
}

// In tests
await isEnabled('new_feature', 'user-1', { new_feature: true });
```

## Flag Lifecycle

### 1. Planning
- Document flag purpose and success criteria
- Define rollout plan
- Set removal date

### 2. Implementation
```typescript
// Add flag with documentation
/**
 * @flag new_checkout
 * @description New streamlined checkout flow
 * @owner @alice
 * @created 2024-01-15
 * @planned-removal 2024-03-01
 */
if (await isEnabled('new_checkout', userId)) {
  // New implementation
}
```

### 3. Rollout
1. Internal testing (team only)
2. Beta users (5%)
3. Gradual rollout (25% → 50% → 100%)
4. Monitor metrics at each stage

### 4. Cleanup
```markdown
## Flag Removal Checklist: new_checkout

- [ ] Flag at 100% for 2+ weeks
- [ ] No rollbacks needed
- [ ] Metrics look good
- [ ] Remove flag checks from code
- [ ] Remove old code path
- [ ] Delete flag from system
- [ ] Update documentation
```

### Flag Registry

Track all flags:

```markdown
# Feature Flag Registry

| Flag | Owner | Created | Status | Removal Date |
|------|-------|---------|--------|--------------|
| new_checkout | @alice | 2024-01-15 | 100% | 2024-03-01 |
| pricing_experiment | @bob | 2024-02-01 | 50% | 2024-04-01 |
| beta_ai | @carol | 2024-01-01 | Beta only | TBD |
```

## Best Practices

### Do's

✅ **Keep flags short-lived**
- Release flags: Remove within 4-6 weeks
- Experiments: Remove when concluded
- Permanent flags: Document why they're permanent

✅ **Default to off**
```typescript
const isEnabled = flags.newFeature ?? false;
```

✅ **Use flags at the highest level possible**
```typescript
// ✅ Good - single check at page level
if (flags.newDashboard) {
  return <NewDashboard />;
}

// ❌ Bad - flags scattered throughout
function Widget() {
  if (flags.newDashboard) { /* ... */ }
}
function Sidebar() {
  if (flags.newDashboard) { /* ... */ }
}
```

✅ **Log flag evaluations**
```typescript
function isEnabled(flag: string, userId: string) {
  const result = evaluateFlag(flag, userId);
  logger.debug('Flag evaluated', { flag, userId, result });
  return result;
}
```

### Don'ts

❌ **Don't nest flags**
```typescript
// Bad - hard to reason about
if (flags.featureA) {
  if (flags.featureB) {
    // What state are we in?
  }
}
```

❌ **Don't use flags for permissions**
```typescript
// Bad - use proper RBAC instead
if (flags.adminAccess) { ... }

// Good
if (user.role === 'admin') { ... }
```

❌ **Don't forget to clean up**
```typescript
// This flag has been at 100% for 6 months...
if (flags.newFeature) { // <- Remove this!
  return <NewFeature />;
}
```

## Related Resources

- [Deployment Guide](../infrastructure/DEPLOYMENT_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Technical Debt](TECHNICAL_DEBT.md)
