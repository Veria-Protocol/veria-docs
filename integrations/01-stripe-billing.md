# Stripe Billing Integration

## Overview

Veria uses Stripe for subscription management and payment processing.

## Configuration

### Environment Variables

```bash
STRIPE_SECRET_KEY=sk_live_xxx      # Server-side Stripe key
STRIPE_PUBLISHABLE_KEY=pk_live_xxx # Client-side Stripe key
STRIPE_WEBHOOK_SECRET=whsec_xxx    # Webhook signature verification
```

### Stripe Client

**Location**: `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
```

## Subscription Service

**Location**: `src/lib/billing/subscription-service.ts`

### Core Functions

#### Get Subscription

```typescript
// By user ID
const subscription = await getSubscriptionByUserId(userId)

// By Stripe customer ID
const subscription = await getSubscriptionByCustomerId(customerId)

// By Stripe subscription ID
const subscription = await getSubscriptionByStripeId(subscriptionId)
```

#### Create Subscription

```typescript
const subscription = await createSubscription({
  userId: 'user_xxx',
  stripeCustomerId: 'cus_xxx',
  stripeSubscriptionId: 'sub_xxx',
  stripePriceId: 'price_xxx',
  status: 'active',
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(),
})
```

#### Update Subscription

```typescript
await updateSubscription(subscriptionId, {
  status: 'canceled',
  cancelAtPeriodEnd: true,
})
```

### Stripe Event Handlers

#### Subscription Created

```typescript
export async function handleStripeSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  // Creates or updates subscription record in database
}
```

#### Subscription Updated

```typescript
export async function handleStripeSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  // Syncs subscription status, period dates, etc.
}
```

#### Subscription Deleted

```typescript
export async function handleStripeSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  // Marks subscription as canceled in database
}
```

### Plan Tier Helpers

```typescript
// Get user's current plan tier
const tier = await getUserPlanTier(userId) // 'free' | 'builder' | 'protocol'

// Check if user has active subscription
const hasActive = await hasActiveSubscription(userId)

// Get workspace subscription data
const data = await getWorkspaceSubscriptionData(userId)
```

## Free Tier Provisioning

**Location**: `src/lib/billing/free-tier-provisioning.ts`

New users automatically receive a free tier:

```typescript
export async function provisionFreeTier(userId: string, email: string) {
  // Creates Stripe customer
  // Sets up free tier subscription record
}

export async function hasFreeTier(userId: string): Promise<boolean> {
  // Checks if user has free tier
}
```

## Plan Enforcement

**Location**: `src/lib/billing/plan-enforcement.ts`

### Plan Limits

```typescript
const limits = getPlanLimits(tier)
// Returns: { apiCalls, partnerOrgs, users, features }
```

### Feature Access

```typescript
const canAccess = hasFeatureAccess(tier, 'custom_rules')
// Returns: boolean
```

### API Limits

```typescript
const withinLimit = isWithinAPILimit(tier, currentUsage)
// Returns: boolean
```

### Upgrade Suggestions

```typescript
const suggestion = getUpgradeSuggestion(currentTier, 'feature_name')
// Returns: { suggestedTier, message }
```

## Webhook Handling

**Location**: `src/app/api/billing/webhook/route.ts`

### Webhook Endpoint

```
POST /api/billing/webhook
```

### Verified Events

```typescript
const relevantEvents = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
]
```

### Webhook Verification

```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

## Database Schema

### Subscription Model

```prisma
model Subscription {
  id                   String    @id @default(cuid())
  userId               String    @unique
  stripeCustomerId     String    @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  status               String
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean   @default(false)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  User                 User      @relation(...)
}
```

### Status Values

| Status | Description |
|--------|-------------|
| `active` | Subscription is active and paid |
| `trialing` | In trial period |
| `past_due` | Payment failed, grace period |
| `canceled` | Subscription ended |
| `unpaid` | Multiple payment failures |

## Checkout Flow

### Create Checkout Session

```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: 'subscription',
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  success_url: `${baseUrl}/dashboard?success=true`,
  cancel_url: `${baseUrl}/pricing?canceled=true`,
})
```

### Customer Portal

```typescript
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${baseUrl}/dashboard`,
})
```

## Price IDs

Configure in environment:

```bash
STRIPE_BUILDER_PRICE_ID=price_xxx   # $499/month
STRIPE_PROTOCOL_PRICE_ID=price_yyy  # $2,500/month
```

## Testing

### Test Mode

Use Stripe test keys (prefix `sk_test_` and `pk_test_`).

### Test Cards

| Number | Result |
|--------|--------|
| 4242424242424242 | Success |
| 4000000000000002 | Declined |
| 4000002500003155 | Requires 3DS |

### Webhook Testing

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/billing/webhook

# Trigger test event
stripe trigger customer.subscription.created
```
