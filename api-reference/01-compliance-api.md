# Compliance API

## Endpoint

```
POST https://api.veria.cc/v1/screen
```

## Request

```json
{
  "input": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
```

Accepts: Ethereum address, ENS name, or Solana address.

## Response

```json
{
  "score": 15,
  "risk": "low",
  "chain": "ethereum",
  "resolved": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "latency_ms": 45,
  "details": {
    "sanctions_hit": false,
    "pep_hit": false,
    "watchlist_hit": false,
    "checked_lists": ["OFAC SDN", "UN Consolidated", "EU Sanctions", "UK HMT"],
    "address_type": "wallet"
  }
}
```

## Risk Levels

| Level | Score | Meaning |
|-------|-------|---------|
| low | 0-29 | No risk indicators |
| medium | 30-59 | Review recommended |
| high | 60-79 | Block recommended |
| critical | 80-100 | Block required |

## Rate Limits

| Tier | Calls/Month |
|------|-------------|
| Sandbox | 100 |
| Growth | 10,000 |
| Builder | 100,000 |
| Protocol | 500,000 |
