# Authentication

## Overview

Veria uses NextAuth.js v4 with a database session strategy, supporting multiple authentication providers.

## Configuration

**Location**: `src/lib/auth.ts`

### Session Strategy

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",  // Database-backed sessions
  },
  // ...
}
```

Database sessions provide:
- Server-side session validation
- Immediate session revocation
- Multi-device session management

## Authentication Providers

### 1. Email Magic Link (Primary)

Users receive a secure link via email to sign in.

**Provider**: Resend (SMTP)

```typescript
EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER || "resend",
      pass: process.env.RESEND_API_KEY || "",
    },
  },
  from: process.env.EMAIL_FROM || "noreply@veria.cc",
})
```

**Environment Variables**:
```
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@veria.cc
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
```

### 2. Google OAuth

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
```

**Environment Variables**:
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

### 3. GitHub OAuth

```typescript
GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
})
```

**Environment Variables**:
```
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

### 4. Wallet Connect (Planned)

Wallet authentication is planned but not yet implemented. The `CredentialsProvider` is incompatible with database session strategy, requiring a custom OAuth-like flow.

## Authentication Flow

### Sign In Flow

```
User → Sign In Page → Choose Provider
                          ↓
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
      Email            Google           GitHub
         ↓                ↓                ↓
    Magic Link       OAuth Flow       OAuth Flow
         ↓                ↓                ↓
    Click Link       Consent         Consent
         ↓                ↓                ↓
         └────────────────┼────────────────┘
                          ↓
              NextAuth Callback
                          ↓
              Create/Update User
                          ↓
              Provision Free Tier
                          ↓
              Redirect to Dashboard
```

### New User Provisioning

On first sign-in, the system automatically provisions a free tier:

```typescript
events: {
  async createUser(message) {
    if (message.user?.id && message.user?.email) {
      await provisionFreeTier(message.user.id, message.user.email)
    }
  },
}
```

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Sign In | `/signin` | Authentication entry |
| Error | `/auth/error` | Auth error display |
| Verify Email | `/auth/verify-email` | Magic link confirmation |

```typescript
pages: {
  signIn: "/signin",
  error: "/auth/error",
  verifyRequest: "/auth/verify-email",
},
```

## Callbacks

### Redirect Callback

Controls post-authentication redirects:

```typescript
async redirect({ url, baseUrl }) {
  // Allow relative URLs
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`
  }
  // Allow same-origin URLs
  if (new URL(url).origin === baseUrl) {
    return url
  }
  // Default to dashboard
  return `${baseUrl}/dashboard`
}
```

### SignIn Callback

Handles provider-specific logic:

```typescript
async signIn({ user, account }) {
  // OAuth providers: Mark email as verified
  if (account?.provider === 'google' || account?.provider === 'github') {
    await db.user.updateMany({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })
    // Trigger API key activation
    await fetch('/api/webhooks/email-verified', { ... })
  }
  return true
}
```

### Session Callback

Enriches session with user ID:

```typescript
async session({ session, user }) {
  if (user && session.user) {
    session.user.id = user.id
  }
  return session
}
```

## Cookie Configuration

Secure cookie settings for production:

```typescript
cookies: {
  sessionToken: {
    name: 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
}
```

## Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  company       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  Account       Account[]
  Session       Session[]
  Subscription  Subscription?
}
```

### Account Model (OAuth)

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
  User              User    @relation(...)

  @@unique([provider, providerAccountId])
}
```

### Session Model

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  User         User     @relation(...)
}
```

## Server-Side Auth Helper

Use in Server Components and API routes:

```typescript
import { auth } from "@/lib/auth"

// In Server Component
export default async function ProtectedPage() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return <div>Welcome, {session.user.email}</div>
}
```

## Environment Variables

Required for authentication:

```bash
# NextAuth
NEXTAUTH_URL=https://veria.cc
NEXTAUTH_SECRET=xxx  # Generate with: openssl rand -base64 32

# Email (Resend)
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@veria.cc

# Google OAuth (optional)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```
