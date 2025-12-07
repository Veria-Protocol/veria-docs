# Technology Stack

## Overview

Veria is built with a modern TypeScript stack optimized for developer experience and rapid iteration.

## Core Technologies

### Framework: Next.js 14

- **Version**: 14.2.x (App Router)
- **Runtime**: Node.js
- **Rendering**: Server Components + Client Components
- **API Routes**: Route handlers in `src/app/api/`

```json
{
  "next": "^14.2.33"
}
```

### Database: PostgreSQL + Prisma

- **Database**: PostgreSQL (hosted on Vercel Postgres)
- **ORM**: Prisma Client
- **Schema**: `prisma/schema.prisma`
- **Migrations**: Prisma Migrate

```json
{
  "@prisma/client": "^6.17.1",
  "prisma": "^6.17.1"
}
```

### Authentication: NextAuth.js

- **Version**: 4.x
- **Adapter**: Prisma Adapter
- **Providers**: Email magic link, wallet connect
- **Session**: JWT + database sessions

```json
{
  "next-auth": "^4.24.13",
  "@auth/prisma-adapter": "^2.11.0"
}
```

### Payments: Stripe

- **Server SDK**: `stripe`
- **Client SDK**: `@stripe/stripe-js`
- **Features**: Subscriptions, webhooks, customer portal

```json
{
  "stripe": "^14.25.0",
  "@stripe/stripe-js": "^8.1.0"
}
```

### Styling: Tailwind CSS v4

- **Version**: 4.x (latest)
- **PostCSS**: Custom config
- **Animations**: `tw-animate-css`

```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4"
}
```

### UI Components: Radix UI

Headless, accessible UI primitives:

```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.8",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-tooltip": "^1.2.8"
}
```

### Web3: wagmi + RainbowKit

- **Wallet Connect**: RainbowKit
- **React Hooks**: wagmi
- **Low-level**: viem

```json
{
  "@rainbow-me/rainbowkit": "^2.2.9",
  "wagmi": "^2.18.1",
  "viem": "^2.38.3"
}
```

### Analytics: PostHog

- **Client SDK**: `posthog-js`
- **Features**: Event tracking, feature flags, session replay

```json
{
  "posthog-js": "^1.283.0"
}
```

### AI Integration

- **Anthropic**: Claude API for AI features
- **OpenAI**: Alternative AI provider

```json
{
  "@anthropic-ai/sdk": "^0.65.0",
  "openai": "^6.9.1"
}
```

### Email: Resend

- **Provider**: Resend
- **Transport**: Nodemailer (backup)

```json
{
  "resend": "^6.2.0",
  "nodemailer": "^7.0.10"
}
```

## Development Tools

### TypeScript

```json
{
  "typescript": "^5"
}
```

### Linting

```json
{
  "eslint": "^9",
  "eslint-config-next": "15.5.6",
  "prettier": "^3.6.2"
}
```

### Testing: Playwright

```json
{
  "playwright": "^1.57.0"
}
```

## Utility Libraries

| Library | Purpose |
|---------|---------|
| `clsx` | Conditional class names |
| `tailwind-merge` | Merge Tailwind classes |
| `class-variance-authority` | Component variants |
| `lucide-react` | Icon library |
| `framer-motion` | Animations |
| `recharts` | Data visualization |
| `date-fns` | Date manipulation |
| `bcryptjs` | Password hashing |
| `use-debounce` | React debounce hooks |

## Infrastructure

### Hosting: Vercel

- **Platform**: Vercel
- **Region**: Auto (edge)
- **Config**: `vercel.json`

### Database: Vercel Postgres

- **Pooling**: Connection pooling enabled
- **URLs**: `DATABASE_URL` (pooled), `POSTGRES_URL_NON_POOLING` (direct)

### CDN/Storage: Vercel

- **Static Assets**: Automatic CDN
- **Image Optimization**: Next.js Image component

### Caching: Vercel KV

```json
{
  "@vercel/kv": "^3.0.0"
}
```
