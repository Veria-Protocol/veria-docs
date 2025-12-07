# The Three Properties

Veria operates three distinct web properties, each targeting a specific audience with tailored messaging and design.

## Overview

| Property | URL | Target Audience | Visual Identity |
|----------|-----|-----------------|-----------------|
| Protocol | protocol.veria.cc | Crypto developers | Black (#020617) + Cyan (#22d3ee) |
| Tax | tax.veria.cc | CFOs, Accountants | White (#ffffff) + Navy (#0f172a) |
| Gateway | veria.cc | Both audiences | Black (#020617) + White text |

## 1. Protocol Property

**URL**: `protocol.veria.cc`

**Target Audience**:
- Blockchain developers
- DeFi protocol teams
- Hackathon participants
- Web3 startups

**Messaging Focus**:
- SDK integration speed
- Developer experience
- API documentation
- Code examples and tutorials

**Design Language**:
- Dark theme (black background)
- Cyan accent color
- Monospace fonts for code
- Terminal-style UI elements

**Key Pages**:
- Documentation
- API Reference
- SDK Quickstart
- Playground/Sandbox

## 2. Tax Property

**URL**: `tax.veria.cc`

**Target Audience**:
- Chief Financial Officers
- Tax accountants
- FinTech companies
- Crypto funds

**Messaging Focus**:
- Regulatory compliance
- Tax reporting accuracy
- Audit readiness
- Time/cost savings

**Design Language**:
- Light theme (white background)
- Navy accent color
- Professional, corporate aesthetic
- Data visualization emphasis

**Key Pages**:
- Solutions overview
- Tax reporting features
- Integration guides
- Pricing for enterprises

## 3. Gateway Property

**URL**: `veria.cc`

**Target Audience**:
- First-time visitors
- Mixed audience
- General discovery

**Messaging Focus**:
- Platform overview
- Value proposition
- Use case discovery
- Conversion to specific property

**Design Language**:
- Dark theme (black background)
- White text, minimal accents
- Clean, modern aesthetic
- Clear CTAs to Protocol or Tax

**Key Pages**:
- Landing page
- About/Company
- Careers
- Contact

## Implementation Notes

### Routing Structure

The platform uses Next.js app router with subdomain-based routing:

```
src/app/
├── (marketing)/     # Gateway pages
├── protocol/        # Protocol-specific pages
├── (dashboards)/    # Authenticated dashboards
└── api/             # Shared API routes
```

### Theme Switching

Each property has its own CSS variables defined in `brand.css`:

```css
/* Protocol theme */
.protocol {
  --bg-primary: #020617;
  --accent: #22d3ee;
}

/* Tax theme */
.tax {
  --bg-primary: #ffffff;
  --accent: #0f172a;
}
```

### Navigation

The header component (`src/components/Header.tsx`) adapts based on the current property:

```typescript
// Different navigation items per property
const protocolNav = ['Docs', 'API', 'Playground', 'Pricing'];
const taxNav = ['Solutions', 'Features', 'Resources', 'Pricing'];
```
