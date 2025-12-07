# API Overview

## Base URL

```
Production: https://api.veria.cc
Development: http://localhost:3000/api
```

## API Routes Structure

```
src/app/api/
├── admin/           # Admin endpoints
├── ai/              # AI/LLM endpoints
├── analytics/       # Analytics tracking
├── auth/            # Authentication (NextAuth)
├── billing/         # Stripe billing
├── compliance/      # Core compliance API
├── contact/         # Contact form
├── email/           # Email verification
├── keys/            # API key management
├── org/             # Organization management
├── partner/         # Partner portal
├── partner-hub/     # Partner hub data
├── payment/         # Payment processing
├── public/          # Public endpoints
├── sandbox/         # Sandbox/demo API
├── stripe/          # Stripe webhooks
├── trials/          # Trial management
├── v1/              # Versioned public API
├── webhooks/        # Internal webhooks
└── workspace/       # Workspace management
```

## Authentication

### API Key Authentication

For external API access:

```bash
curl -X POST https://api.veria.cc/v1/screen \
  -H "Authorization: Bearer veria_xxx" \
  -H "Content-Type: application/json" \
  -d '{"address": "0x..."}'
```

### Session Authentication

For internal web app requests, NextAuth session cookies are used automatically.

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "The provided address is not valid"
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limiting

### By Plan Tier

| Tier | Requests/month | Requests/minute |
|------|----------------|-----------------|
| Free | 1,000 | 10 |
| Builder | 10,000 | 100 |
| Protocol | 100,000 | 1,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## CORS Configuration

API v1 endpoints allow cross-origin requests:

```json
{
  "headers": [
    { "key": "Access-Control-Allow-Origin", "value": "*" },
    { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
    { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
  ]
}
```

## API Versioning

### Current Version: v1

Versioned endpoints are under `/api/v1/`:

```
/api/v1/screen    # Address screening
/api/v1/validate  # Transaction validation
```

### URL Rewrite

For cleaner URLs:

```
/v1/screen → /api/v1/screen
```

## Endpoint Categories

### Public API (v1)

External-facing compliance API:

- `POST /v1/screen` - Screen an address
- `POST /v1/validate` - Validate a transaction

### Authentication

- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Billing

- `POST /api/billing/webhook` - Stripe webhooks
- `POST /api/stripe/create-checkout-session` - Start checkout

### Key Management

- `GET /api/keys` - List API keys
- `POST /api/keys` - Create API key
- `DELETE /api/keys/[id]` - Revoke API key

### Trials

- `POST /api/trials` - Create trial workspace
- `GET /api/trials` - List trials
- `DELETE /api/trials/[id]` - End trial

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is invalid or revoked |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INVALID_ADDRESS` | Ethereum address is malformed |
| `SUBSCRIPTION_REQUIRED` | Feature requires paid subscription |
| `TRIAL_EXPIRED` | Trial period has ended |

## SDK Usage

```typescript
import { Veria } from '@veria/sdk'

const veria = new Veria({
  apiKey: 'veria_xxx',
})

const result = await veria.screen('0x...')
```

## Webhook Events

Outbound webhooks for real-time notifications:

```json
{
  "event": "compliance.alert",
  "data": {
    "address": "0x...",
    "risk_level": "high",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```
