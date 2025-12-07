# Pricing Tiers

Veria uses a two-tier pricing model designed to capture developers early and expand with growing protocols.

## Tier Overview

| Tier | Price | Target | Goal |
|------|-------|--------|------|
| Builder | $499/month | Developers, startups, hackathons | Get SDK into codebases |
| Protocol | $2,500/month | Mainnet protocols, institutions | Premium positioning |

## Builder Tier ($499/month)

**Target Customer**:
- Early-stage Web3 projects
- Hackathon participants
- Individual developers
- Testnet-stage protocols

**Included Features**:
- Full SDK access (`@veria/sdk`)
- 10,000 API calls/month
- Sandbox environment
- Community support (Discord)
- Basic compliance reports
- Email notifications

**Not Included**:
- White-label options
- Custom rule engines
- Dedicated support
- SLA guarantees
- Advanced analytics

**Conversion Goals**:
- Same-day integration
- Low friction sign-up
- Credit card payment
- No sales calls required

## Protocol Tier ($2,500/month)

**Target Customer**:
- Mainnet DeFi protocols (e.g., Maple, Goldfinch)
- Institutional asset managers
- Crypto funds
- Regulated exchanges

**Included Features**:
- Everything in Builder, plus:
- 100,000 API calls/month
- White-label UI components
- Custom compliance rules
- Dedicated account manager
- 99.9% uptime SLA
- Priority support (Slack)
- Advanced analytics dashboard
- Custom report templates

**Sales Process**:
- Demo call required
- Custom onboarding
- Contract negotiation
- Annual billing available

## Usage-Based Add-ons

Both tiers can purchase additional capacity:

| Add-on | Price |
|--------|-------|
| Additional 10k API calls | $50 |
| Custom jurisdiction rules | $200/jurisdiction |
| Extended data retention | $100/month |
| Priority webhook delivery | $150/month |

## Free Trial

**Trial Details**:
- 14-day full access
- No credit card required
- Access to Builder features
- Sandbox API key included

**Trial Database Model** (from Prisma schema):

```prisma
model TrialWorkspace {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  tier        String        @default("standard")
  status      String        @default("active")
  createdAt   DateTime      @default(now())
  expiresAt   DateTime
  convertedAt DateTime?
  ownerId     String
  owner       User          @relation(...)
  apiKeys     TrialApiKey[]
}
```

## Stripe Integration

Payments are handled via Stripe with the following structure:

**Subscription Model**:
```prisma
model Subscription {
  id                   String    @id
  userId               String    @unique
  stripeCustomerId     String    @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  status               String
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean   @default(false)
}
```

**Price IDs** (set in environment):
```
STRIPE_BUILDER_PRICE_ID=price_xxx
STRIPE_PROTOCOL_PRICE_ID=price_yyy
```

## Conversion Metrics

Key metrics to track:

1. **Trial to Builder**: Target 10% conversion
2. **Builder to Protocol**: Target 5% annual upsell
3. **MRR Goal**: $50k from Builder tier
4. **ARPU**: $499 Builder, $2,500 Protocol
