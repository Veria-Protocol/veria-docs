# Veria Protocol Documentation

LLM-friendly documentation for the Veria compliance infrastructure platform.

## What is Veria?

Veria builds compliance infrastructure for the tokenized economy. The platform helps developers, protocols, and institutions navigate regulatory requirements for digital assets.

## Documentation Structure

```
veria-docs/
├── overview/
│   ├── 01-what-is-veria.md         # Platform introduction
│   ├── 02-three-properties.md       # Protocol, Tax, Gateway explained
│   └── 03-pricing-tiers.md          # Builder vs Protocol tiers
├── architecture/
│   ├── 01-tech-stack.md             # Next.js, Prisma, PostgreSQL, etc.
│   ├── 02-project-structure.md      # Directory organization
│   ├── 03-authentication.md         # NextAuth + wallet integration
│   └── 04-deployment.md             # Vercel configuration
├── api-reference/
│   ├── 01-api-overview.md           # API design patterns
│   ├── 02-compliance-api.md         # Core compliance endpoints
│   ├── 03-webhook-events.md         # Event notifications
│   └── 04-rate-limits.md            # Usage tiers and limits
├── database/
│   ├── 01-schema-overview.md        # Entity relationships
│   ├── 02-user-model.md             # User, Account, Session
│   ├── 03-subscription-model.md     # Stripe integration
│   └── 04-trial-workspace-model.md  # Trial management
├── components/
│   ├── 01-ui-components.md          # Radix UI + Tailwind setup
│   ├── 02-demo-components.md        # Interactive demo system
│   └── 03-dashboard-components.md   # Dashboard widgets
├── guides/
│   ├── 01-getting-started.md        # Local development setup
│   ├── 02-adding-features.md        # Feature development workflow
│   └── 03-testing.md                # Testing approach
└── integrations/
    ├── 01-stripe-billing.md         # Payment processing
    ├── 02-wallet-connect.md         # RainbowKit + wagmi
    └── 03-analytics.md              # PostHog integration
```

## Quick Start

1. Clone the main repository: `git clone https://github.com/Veria-Protocol/veria-platform.git`
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env.local`
4. Run database: `npx prisma generate && npx prisma db push`
5. Start development: `npm run dev`

## Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email magic links + wallet connect
- **Payments**: Stripe subscriptions
- **Styling**: Tailwind CSS v4 + Radix UI primitives
- **Web3**: wagmi + RainbowKit for wallet integration
- **Analytics**: PostHog

## Target Audiences

| Property | Subdomain | Audience | Focus |
|----------|-----------|----------|-------|
| Protocol | protocol.veria.cc | Crypto developers | SDK integration, compliance APIs |
| Tax | tax.veria.cc | CFOs, Accountants | Tax reporting, reconciliation |
| Gateway | veria.cc | Both | Entry point, product discovery |

## License

Proprietary - Veria Protocol Inc.
