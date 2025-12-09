# Authentication

All API requests require an API key.

## API Key

Pass your API key in the Authorization header:

```bash
curl -X POST https://api.veria.cc/v1/screen \
  -H "Authorization: Bearer veria_xxx" \
  -H "Content-Type: application/json" \
  -d '{"input": "0x..."}'
```

## Get an API Key

1. Sign up at [protocol.veria.cc](https://protocol.veria.cc)
2. Go to Settings > API Keys
3. Click "Create API Key"

## Rate Limits

| Tier | Calls/Month | Calls/Minute |
|------|-------------|--------------|
| Sandbox | 100 | 10 |
| Growth | 10,000 | 100 |
| Builder | 100,000 | 500 |
| Protocol | 500,000 | 1,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Base URL

```
https://api.veria.cc/v1
```
