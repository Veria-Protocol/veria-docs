# Getting Started

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- PostgreSQL database (or Vercel Postgres)
- Git

## Clone Repository

```bash
git clone https://github.com/Veria-Protocol/veria-platform.git
cd veria-platform
```

## Install Dependencies

```bash
npm install
```

This will also run `prisma generate` automatically via the `postinstall` script.

## Environment Setup

### Copy Example Environment

```bash
cp .env.example .env.local
```

### Required Environment Variables

Edit `.env.local` with your values:

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/veria"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/veria"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email - Resend (required for magic link auth)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"

# Stripe (required for payments)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### Optional Environment Variables

```bash
# OAuth Providers
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_xxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# AI Services
ANTHROPIC_API_KEY="xxx"
OPENAI_API_KEY="xxx"
```

## Database Setup

### Local PostgreSQL

If running PostgreSQL locally:

```bash
# Create database
createdb veria

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Using Vercel Postgres

1. Create a Vercel project
2. Add Vercel Postgres integration
3. Copy connection strings to `.env.local`
4. Run `npx prisma migrate deploy`

### Seed Data (Optional)

```bash
npx prisma db seed
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

Key directories to understand:

```
src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
├── lib/           # Utilities and services
└── types/         # TypeScript definitions

prisma/
└── schema.prisma  # Database schema

docs/              # Project documentation
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature
```

### 2. Make Changes

Edit files in `src/`

### 3. Test Locally

```bash
npm run dev
```

### 4. Build Test

```bash
npm run build
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: description"
git push origin feature/your-feature
```

### 6. Create PR

Open a Pull Request on GitHub for review.

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Create/run migrations |
| `npx prisma generate` | Regenerate Prisma client |

## Troubleshooting

### Database Connection Issues

```bash
# Verify connection
npx prisma db pull

# Reset database (development only!)
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate client
npx prisma generate
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense

### Settings

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

## Next Steps

1. [Project Structure](../architecture/02-project-structure.md) - Understand the codebase
2. [Tech Stack](../architecture/01-tech-stack.md) - Learn the technologies
3. [Authentication](../architecture/03-authentication.md) - Understand auth flows
4. [Database Schema](../database/01-schema-overview.md) - Learn the data model
