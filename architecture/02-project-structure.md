# Project Structure

## Root Directory

```
VERIA_PLATFORM/
├── .claude/              # Claude Code configuration
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
├── .env.local            # Local overrides (gitignored)
├── .genkit/              # Genkit AI configuration
├── .next/                # Next.js build output
├── .vercel/              # Vercel deployment config
├── docs/                 # Project documentation
├── node_modules/         # Dependencies
├── prisma/               # Database schema
├── public/               # Static assets
├── scripts/              # Build/utility scripts
├── src/                  # Source code
├── todos/                # Task tracking
├── AGENTS.md             # AI assistant config
├── CLAUDE.md             # Claude-specific config
├── middleware.ts         # Next.js middleware
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vercel.json           # Vercel deployment
```

## Source Directory (`src/`)

```
src/
├── ace/                  # ACE module (compliance engine)
├── admin/                # Admin dashboard pages
├── app/                  # Next.js App Router pages
├── auth/                 # Authentication utilities
├── compliance/           # Compliance logic
├── components/           # React components
├── config/               # Application configuration
├── content/              # Static content/copy
├── data/                 # Data constants
├── design/               # Design system
├── integrations/         # Third-party integrations
├── lib/                  # Shared utilities
├── modules/              # Feature modules
├── partner/              # Partner portal
├── pricing/              # Pricing logic
├── styles/               # Global styles
└── types/                # TypeScript types
```

## App Router Pages (`src/app/`)

```
src/app/
├── (auth)/               # Auth pages (login, signup)
├── (dashboards)/         # Protected dashboard routes
├── (marketing)/          # Public marketing pages
├── about/                # About page
├── accountants/          # Accountant-focused landing
├── ace/                  # ACE module pages
├── admin/                # Admin panel
├── api/                  # API routes
│   ├── auth/             # NextAuth endpoints
│   ├── billing/          # Stripe webhooks
│   ├── compliance/       # Compliance API
│   └── ...
├── choose-plan/          # Plan selection
├── contact/              # Contact page
├── dashboard/            # User dashboard
├── demo/                 # Demo pages
├── demo-flow/            # Guided demo
├── docs/                 # Documentation pages
├── institutions/         # Institution landing
├── intake/               # Onboarding intake
├── invite/               # Invite flow
├── legal/                # Legal pages (terms, privacy)
├── onboarding/           # User onboarding
├── partner/              # Partner portal
├── playground/           # API playground
├── pricing/              # Pricing page
├── product/              # Product pages
├── protocol/             # Protocol property pages
├── resources/            # Resource pages
├── security/             # Security page
├── settings/             # User settings
├── support/              # Support page
├── globals.css           # Global styles
├── layout.tsx            # Root layout
├── page.tsx              # Home page
└── providers.tsx         # React context providers
```

## Components (`src/components/`)

```
src/components/
├── analytics/            # Analytics components
├── brand/                # Brand-specific components
├── compliance/           # Compliance UI
├── conversion/           # Conversion optimization
├── cta/                  # Call-to-action components
├── dashboard/            # Dashboard widgets
├── demo/                 # Demo components
├── demo-flow/            # Guided demo flow
├── docs/                 # Documentation components
├── esd/                  # ESD components
├── features/             # Feature showcases
├── ui/                   # Base UI components (shadcn/ui style)
├── Header.tsx            # Main header
├── Footer.tsx            # Main footer
├── ContactForm.tsx       # Contact form
└── ...                   # Other standalone components
```

## Library (`src/lib/`)

```
src/lib/
├── ai/                   # AI/LLM utilities
├── analytics/            # Analytics helpers
├── api/                  # API client utilities
├── billing/              # Billing/Stripe helpers
├── dashboard/            # Dashboard utilities
├── demo/                 # Demo engine
├── demo-engine/          # Demo state machine
├── demo-wrapper/         # Demo UI wrapper
├── email/                # Email templates
├── events/               # Event handling
├── funnels/              # Conversion funnels
├── hooks/                # Custom React hooks
├── mdx/                  # MDX utilities
├── modules/              # Module system
├── partner-hub/          # Partner hub logic
├── payment/              # Payment processing
├── providers/            # Provider utilities
├── trials/               # Trial management
├── typography/           # Typography utilities
├── usage/                # Usage tracking
├── utils/                # General utilities
├── auth.ts               # Auth configuration
├── csrf.ts               # CSRF protection
├── db.ts                 # Database client
├── stripe.ts             # Stripe client
├── wagmi.ts              # wagmi configuration
└── utils.ts              # Common utilities
```

## Database (`prisma/`)

```
prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations
```

## Public Assets (`public/`)

```
public/
├── images/               # Image assets
├── icons/                # Icon files
├── fonts/                # Custom fonts
└── ...                   # Other static files
```

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.mjs` | ESLint rules |
| `postcss.config.mjs` | PostCSS plugins |
| `components.json` | shadcn/ui configuration |
| `vercel.json` | Vercel deployment settings |
