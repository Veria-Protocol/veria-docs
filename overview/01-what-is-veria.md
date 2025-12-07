# What is Veria?

## Mission

Veria builds compliance infrastructure for the tokenized economy. The platform enables developers, protocols, and institutions to integrate regulatory compliance directly into their applications.

## The Problem

Digital asset businesses face complex, evolving regulatory requirements:
- Tax reporting obligations across jurisdictions
- KYC/AML compliance for transactions
- Audit trails for institutional accountability
- Real-time compliance verification for DeFi protocols

Traditional compliance solutions are:
- Expensive (enterprise-only pricing)
- Slow to integrate (months of implementation)
- Not designed for Web3 (built for traditional finance)

## The Solution

Veria provides:

### For Developers ("Builder" Tier - $499/mo)
- Simple SDK: `import { Veria } from '@veria/sdk'`
- Compliance APIs for transaction validation
- Pre-built UI components for compliance workflows
- Sandbox environment for testing

### For Institutions ("Protocol" Tier - $2,500/mo)
- White-label compliance infrastructure
- Custom rule engines
- Dedicated support and SLAs
- Advanced reporting and analytics

## Core Capabilities

### 1. Transaction Compliance
```typescript
const result = await veria.validateTransaction({
  from: '0x...',
  to: '0x...',
  amount: '1000',
  asset: 'USDC'
});

if (result.compliant) {
  // Proceed with transaction
}
```

### 2. Tax Reporting
- Automated cost basis tracking
- Capital gains calculations
- Multi-jurisdiction tax reports
- Accountant-ready exports

### 3. Audit Trail
- Immutable compliance logs
- Real-time event streaming
- Regulatory examination support
- Custom retention policies

## The Trojan Horse Strategy

Veria's growth strategy:

1. **Land**: Get `import { Veria }` into developer codebases via the affordable Builder tier
2. **Expand**: As projects grow, upsell to Protocol tier with advanced features
3. **Anchor**: Become compliance infrastructure that protocols can't remove

Target: $50k MRR via Builder tier, then expand to institutional Protocol tier.

## Key Differentiators

| Traditional Compliance | Veria |
|----------------------|-------|
| 6-month implementation | Same-day integration |
| $50k+ annual contracts | $499/mo starting price |
| REST-only APIs | SDK + APIs + Components |
| Finance-first design | Developer-first design |
| Per-user pricing | Usage-based pricing |
