# Veria

Compliance API for Web3. Screen wallet addresses for sanctions and risk.

## Quick Start

```bash
curl -X POST https://api.veria.cc/v1/screen \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}'
```

Response:

```json
{
  "score": 15,
  "risk": "low",
  "details": {
    "sanctions_hit": false,
    "pep_hit": false
  }
}
```

## Get an API Key

Sign up at [protocol.veria.cc](https://protocol.veria.cc)

## Documentation

- [API Reference](api-reference/)
  - [Authentication](api-reference/authentication.md)
  - [Screen Address](api-reference/screen.md)
- [Examples](examples/)
  - [Node.js](examples/node/)
  - [Python](examples/python/)
  - [Go](examples/go/)
  - [React + wagmi](examples/react/)

## Risk Levels

| Level | Score | Action |
|-------|-------|--------|
| low | 0-29 | Proceed |
| medium | 30-59 | Review |
| high | 60-79 | Block recommended |
| critical | 80-100 | Block required |

## Pricing

| Tier | Price | Operations/Month | Overage |
|------|-------|------------------|---------|
| Sandbox | Free | 100 | Hard limit |
| Professional | $499/mo | 10,000 | $0.06/op |
| Scale | $2,000/mo | 100,000 | $0.035/op |
| Enterprise | $5,000/mo | 500,000 | $0.02/op |

**Professional:** For production teams integrating compliance infrastructure.
**Scale:** For platforms operating at sustained transaction volume.
**Enterprise:** For regulated organizations and protocol-level deployments.

All paid tiers include mainnet commercial license, audit-ready compliance logs, and SLA guarantees.
