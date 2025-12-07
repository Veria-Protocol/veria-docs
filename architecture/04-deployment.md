# Deployment

## Overview

Veria is deployed on Vercel with PostgreSQL database and integrated services.

## Hosting: Vercel

**Platform**: Vercel (Next.js native)
**Build**: Automatic on push to `main`
**Preview**: PR-based preview deployments

### Vercel Configuration

**File**: `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/v1/screen",
      "destination": "/api/v1/screen"
    }
  ],
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

## Next.js Configuration

**File**: `next.config.js`

### Build Settings

```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint in production builds
  },
  typescript: {
    ignoreBuildErrors: true,   // Disable TS errors (third-party library issues)
  },
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || 'development'
  },
}
```

### Security Headers

Applied to all routes:

```javascript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
    ],
  },
]
```

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self'
  https://api.veria.cc
  https://*.veria.cc
  https://veria-api-prod-*.run.app
  https://api.stripe.com
  https://vitals.vercel-analytics.com
  https://api.ensideas.com
  https://app.posthog.com;
```

## Database: Vercel Postgres

**Provider**: Vercel Postgres (PostgreSQL)
**Connection**: Pooled connections via Prisma

### Connection URLs

```bash
# Pooled connection (for serverless)
DATABASE_URL=postgres://user:pass@host:5432/db?pgbouncer=true

# Direct connection (for migrations)
POSTGRES_URL_NON_POOLING=postgres://user:pass@host:5432/db
```

### Prisma Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Authentication
NEXTAUTH_URL=https://veria.cc
NEXTAUTH_SECRET=xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@veria.cc

# Payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Optional Variables

```bash
# OAuth Providers
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# AI Services
ANTHROPIC_API_KEY=xxx
OPENAI_API_KEY=xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_DEMO=true
```

## Deployment Workflow

### Automatic Deployment

```
Push to main → Vercel Build → Deploy to Production
Push to PR   → Vercel Build → Deploy to Preview URL
```

### Build Process

1. Install dependencies: `npm install`
2. Generate Prisma client: `prisma generate`
3. Build Next.js: `next build`
4. Deploy to Vercel Edge Network

### Build Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

## Domain Configuration

### Primary Domains

| Domain | Purpose |
|--------|---------|
| veria.cc | Gateway (production) |
| protocol.veria.cc | Protocol property |
| tax.veria.cc | Tax property |

### Preview Domains

```
[branch]-veria.vercel.app
```

## Monitoring

### Vercel Analytics

- Web Vitals (LCP, FID, CLS)
- Server timing
- Error tracking

### PostHog

- Event tracking
- Session replay
- Feature flags

## Database Migrations

### Development

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migration
npx prisma migrate deploy
```

### Production

Migrations run automatically on deployment via:

```bash
npx prisma migrate deploy
```

## Rollback

### Instant Rollback

Vercel supports instant rollback to previous deployments:

1. Go to Vercel Dashboard
2. Select Deployments
3. Click "..." on previous deployment
4. Select "Promote to Production"

### Database Rollback

Prisma migrations are not automatically reversible. For rollback:

1. Create a new migration that reverts changes
2. Or restore from database backup

## Caching

### Vercel Edge Cache

- Static assets: Cached at edge
- API routes: Not cached by default
- ISR pages: Configurable revalidation

### Vercel KV

Redis-compatible caching:

```typescript
import { kv } from '@vercel/kv'

// Cache API responses
await kv.set('key', value, { ex: 3600 })
const cached = await kv.get('key')
```

## Health Checks

### API Health

```
GET /api/health
→ { status: 'ok', timestamp: '...' }
```

### Database Health

```
GET /api/health/db
→ { status: 'ok', connected: true }
```
