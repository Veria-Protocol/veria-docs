# Database Schema Overview

## Database Technology

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Pooled via Vercel Postgres

## Entity Relationship Diagram

```
┌──────────────────┐
│       User       │
├──────────────────┤
│ id               │
│ email (unique)   │
│ name             │
│ emailVerified    │
│ image            │
│ company          │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │
    ┌────┴────┬────────────┬─────────────┐
    │         │            │             │
    ▼         ▼            ▼             ▼
┌────────┐ ┌────────┐ ┌────────────┐ ┌────────────────┐
│Account │ │Session │ │Subscription│ │TrialWorkspace  │
└────────┘ └────────┘ └────────────┘ └───────┬────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │TrialApiKey  │
                                      └─────────────┘

┌──────────────────┐        ┌──────────────────┐
│  ApiKeyMetadata  │───────▶│     ApiCall      │
└────────┬─────────┘        └──────────────────┘
         │
         ▼
     (links to User)

┌──────────────────┐
│VerificationToken │  (standalone - for email verification)
└──────────────────┘
```

## Models Summary

| Model | Purpose | Key Relations |
|-------|---------|---------------|
| User | Core user account | Has many: Account, Session, ApiKeyMetadata, TrialWorkspace |
| Account | OAuth provider links | Belongs to: User |
| Session | Active login sessions | Belongs to: User |
| Subscription | Stripe subscription | Belongs to: User (1:1) |
| ApiKeyMetadata | API key management | Belongs to: User; Has many: ApiCall |
| ApiCall | API usage tracking | Belongs to: ApiKeyMetadata |
| TrialWorkspace | Trial environment | Belongs to: User; Has many: TrialApiKey |
| TrialApiKey | Trial API credentials | Belongs to: TrialWorkspace |
| VerificationToken | Email verification | Standalone (no relations) |

## Core Models

### User

Central user entity:

```prisma
model User {
  id              String           @id @default(cuid())
  name            String?
  email           String           @unique
  emailVerified   DateTime?
  image           String?
  company         String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  Account         Account[]
  ApiKeyMetadata  ApiKeyMetadata[]
  Session         Session[]
  Subscription    Subscription?
  TrialWorkspaces TrialWorkspace[]
}
```

### Subscription

Stripe subscription data:

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

### ApiKeyMetadata

API key management:

```prisma
model ApiKeyMetadata {
  id        String    @id
  userId    String
  keyHash   String    @unique
  label     String?
  status    String    @default("pending_verification")
  tier      String    @default("free")
  createdAt DateTime  @default(now())
  revokedAt DateTime?
  ApiCall   ApiCall[]
  User      User      @relation(...)
}
```

## Authentication Models

### Account (OAuth)

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  User              User    @relation(...)

  @@unique([provider, providerAccountId])
}
```

### Session

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  User         User     @relation(...)
}
```

### VerificationToken

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Trial System Models

### TrialWorkspace

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
  cancelledAt DateTime?
  ownerId     String
  owner       User          @relation(...)
  apiKeys     TrialApiKey[]
}
```

**Status values**: `active`, `expired`, `converted`, `cancelled`
**Tier values**: `standard`, `enterprise`

### TrialApiKey

```prisma
model TrialApiKey {
  id          String         @id @default(cuid())
  workspaceId String
  keyHash     String         @unique
  label       String?
  status      String         @default("active")
  createdAt   DateTime       @default(now())
  revokedAt   DateTime?
  workspace   TrialWorkspace @relation(...)
}
```

## Usage Tracking

### ApiCall

```prisma
model ApiCall {
  id             String         @id
  apiKeyId       String
  endpoint       String
  method         String
  statusCode     Int
  latencyMs      Int
  requestBody    Json?
  responseBody   Json?
  createdAt      DateTime       @default(now())
  ApiKeyMetadata ApiKeyMetadata @relation(...)
}
```

## Indexes

Performance indexes defined on frequently queried fields:

```prisma
// User lookups
@@index([userId])

// API key lookups
@@index([keyHash])

// Time-based queries
@@index([createdAt])

// Status filtering
@@index([status])
@@index([expiresAt])
```

## Common Queries

### Get User with Subscription

```typescript
const user = await db.user.findUnique({
  where: { email },
  include: {
    Subscription: true,
    ApiKeyMetadata: true,
  }
})
```

### Get Active Trial Workspaces

```typescript
const trials = await db.trialWorkspace.findMany({
  where: {
    ownerId: userId,
    status: 'active',
    expiresAt: { gt: new Date() }
  },
  include: { apiKeys: true }
})
```

### Track API Call

```typescript
await db.apiCall.create({
  data: {
    id: generateId(),
    apiKeyId: key.id,
    endpoint: '/api/v1/screen',
    method: 'POST',
    statusCode: 200,
    latencyMs: 45,
  }
})
```
