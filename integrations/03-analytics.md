# Analytics Integration

## Overview

Veria uses PostHog for product analytics, including event tracking, feature flags, and session replay.

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### PostHog Client

**Location**: `src/lib/analytics/posthog.ts`

```typescript
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Manual control
      capture_pageleave: true,
    })
  }
}

export { posthog }
```

## Provider Setup

**Location**: `src/lib/providers/posthog-provider.tsx`

```typescript
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { posthog } from '@/lib/analytics/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>
}
```

## Event Tracking

### Track Events

```typescript
import { posthog } from '@/lib/analytics/posthog'

// Simple event
posthog.capture('button_clicked')

// Event with properties
posthog.capture('signup_started', {
  source: 'landing_page',
  tier: 'builder',
})

// Event with user properties
posthog.capture('subscription_created', {
  plan: 'protocol',
  $set: {
    plan_tier: 'protocol',
    signup_date: new Date().toISOString(),
  },
})
```

### Standard Events

| Event | Description | Properties |
|-------|-------------|------------|
| `signup_started` | User begins signup | `source`, `tier` |
| `signup_completed` | User completes signup | `method` (email/google/github) |
| `trial_started` | Trial workspace created | `tier` |
| `subscription_created` | Paid subscription | `plan`, `price` |
| `api_key_created` | API key generated | `label` |
| `demo_started` | Demo flow initiated | `demo_type` |
| `demo_completed` | Demo flow finished | `demo_type`, `duration` |

## User Identification

### Identify Users

```typescript
// After successful auth
posthog.identify(userId, {
  email: user.email,
  name: user.name,
  company: user.company,
  created_at: user.createdAt,
})
```

### Reset on Logout

```typescript
// On logout
posthog.reset()
```

## Feature Flags

### Check Feature Flag

```typescript
import { posthog } from '@/lib/analytics/posthog'

// Boolean flag
const showNewFeature = posthog.isFeatureEnabled('new_pricing_page')

// Multivariate flag
const variant = posthog.getFeatureFlag('onboarding_flow')
// Returns: 'control' | 'variant_a' | 'variant_b'
```

### React Hook

```typescript
import { useFeatureFlag } from 'posthog-js/react'

function Component() {
  const showFeature = useFeatureFlag('feature_name')

  if (!showFeature) {
    return null
  }

  return <NewFeature />
}
```

### Feature Flag Events

```typescript
// Track feature flag exposure
posthog.capture('$feature_flag_called', {
  $feature_flag: 'flag_name',
  $feature_flag_response: variant,
})
```

## Session Recording

### Enable Recording

```typescript
posthog.init(key, {
  // ...
  session_recording: {
    maskAllInputs: true,
    maskInputFn: (text, element) => {
      // Mask sensitive inputs
      if (element.type === 'password') return '••••••••'
      return text
    },
  },
})
```

### Identify Session

Sessions are automatically linked to identified users.

## Conversion Funnels

### Define Funnel Steps

Track sequential events:

```typescript
// Step 1: Visit pricing
posthog.capture('pricing_page_viewed')

// Step 2: Select plan
posthog.capture('plan_selected', { plan: 'builder' })

// Step 3: Start checkout
posthog.capture('checkout_started', { plan: 'builder' })

// Step 4: Complete purchase
posthog.capture('purchase_completed', { plan: 'builder', amount: 499 })
```

## Analytics Components

### Analytics Provider

**Location**: `src/components/analytics/`

```typescript
'use client'

import { PostHogProvider } from '@/lib/providers/posthog-provider'

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return <PostHogProvider>{children}</PostHogProvider>
}
```

## A/B Testing

### Create Experiment

In PostHog dashboard:
1. Create feature flag
2. Set variants (control, test)
3. Set rollout percentage

### Track Experiment

```typescript
// Get variant
const variant = posthog.getFeatureFlag('pricing_experiment')

// Track conversion with variant
posthog.capture('conversion', {
  experiment: 'pricing_experiment',
  variant: variant,
  value: 499,
})
```

## Privacy Compliance

### Opt-out

```typescript
// User opts out of tracking
posthog.opt_out_capturing()

// Check opt-out status
const isOptedOut = posthog.has_opted_out_capturing()

// Opt back in
posthog.opt_in_capturing()
```

### Data Masking

```typescript
posthog.init(key, {
  // Mask all text inputs
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '.sensitive-data',
  },
})
```

## Debugging

### Enable Debug Mode

```typescript
posthog.init(key, {
  debug: process.env.NODE_ENV === 'development',
})
```

### View Events

In development, events are logged to console when debug is enabled.

### PostHog Toolbar

Enable the toolbar for visual debugging:

```typescript
posthog.init(key, {
  loaded: (posthog) => {
    if (process.env.NODE_ENV === 'development') {
      posthog.debug()
    }
  },
})
```

## Server-Side Analytics

For server-side events (API routes, webhooks):

```typescript
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

// Track server-side event
posthog.capture({
  distinctId: userId,
  event: 'api_key_created',
  properties: {
    tier: 'builder',
  },
})

// Shutdown on function end
await posthog.shutdown()
```
