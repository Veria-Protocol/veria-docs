# Screen Address

Screen a wallet address for compliance risks.

## Endpoint

```
POST https://api.veria.cc/v1/screen
```

## Authentication

```bash
Authorization: Bearer veria_xxx
```

## Request

```bash
curl -X POST https://api.veria.cc/v1/screen \
  -H "Authorization: Bearer veria_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  }'
```

### Request Body

```json
{
  "input": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| input | string | Yes | Ethereum address, ENS name, or Solana address |

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

| Field | Type | Description |
|-------|------|-------------|
| score | number | Risk score 0-100 |
| risk | string | low, medium, high, or critical |
| chain | string | Detected chain (ethereum, solana) |
| resolved | string | Resolved address (ENS resolved to hex) |
| latency_ms | number | Processing time in milliseconds |
| details.sanctions_hit | boolean | True if address is on a sanctions list |
| details.pep_hit | boolean | True if associated with politically exposed person |
| details.watchlist_hit | boolean | True if on any watchlist |
| details.checked_lists | array | Sanctions lists checked |
| details.address_type | string | wallet, contract, exchange, mixer |

## Risk Levels

| Level | Score | Action |
|-------|-------|--------|
| low | 0-29 | Proceed |
| medium | 30-59 | Review recommended |
| high | 60-79 | Block recommended |
| critical | 80-100 | Block required |

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "The provided address is not valid"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| INVALID_API_KEY | API key is invalid or revoked |
| RATE_LIMIT_EXCEEDED | Too many requests |
| INVALID_ADDRESS | Address is malformed |
| SUBSCRIPTION_REQUIRED | Feature requires paid subscription |
