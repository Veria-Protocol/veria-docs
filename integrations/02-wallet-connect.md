# Wallet Connect Integration

## Overview

Veria uses RainbowKit and wagmi for Web3 wallet connectivity, enabling users to connect their Ethereum wallets for identity verification and transaction signing.

## Technologies

- **RainbowKit**: Wallet connection UI
- **wagmi**: React hooks for Ethereum
- **viem**: Low-level Ethereum interactions

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx  # From cloud.walletconnect.com
```

### Wagmi Config

**Location**: `src/lib/wagmi.ts`

```typescript
'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { http } from 'wagmi'

export const getWagmiConfig = () => {
  return getDefaultConfig({
    appName: 'Veria',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
    },
  })
}
```

### Supported Chains

| Chain | Chain ID | Purpose |
|-------|----------|---------|
| Ethereum Mainnet | 1 | Primary chain |
| Polygon | 137 | Low-cost transactions |
| Optimism | 10 | L2 scaling |
| Arbitrum | 42161 | L2 scaling |
| Base | 8453 | Coinbase L2 |

## Provider Setup

**Location**: `src/app/providers.tsx`

```typescript
'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getWagmiConfig } from '@/lib/wagmi'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Components

### Connect Button

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletConnect() {
  return <ConnectButton />
}
```

### Custom Connect Button

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function CustomConnect() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain

        return (
          <button onClick={openConnectModal}>
            {connected
              ? `${account.displayName}`
              : 'Connect Wallet'
            }
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
```

## Hooks

### useAccount

Get connected wallet info:

```typescript
import { useAccount } from 'wagmi'

function Component() {
  const { address, isConnected, chain } = useAccount()

  if (!isConnected) {
    return <p>Not connected</p>
  }

  return <p>Connected: {address}</p>
}
```

### useConnect

Trigger wallet connection:

```typescript
import { useConnect } from 'wagmi'

function Component() {
  const { connect, connectors } = useConnect()

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  )
}
```

### useDisconnect

Disconnect wallet:

```typescript
import { useDisconnect } from 'wagmi'

function Component() {
  const { disconnect } = useDisconnect()

  return <button onClick={() => disconnect()}>Disconnect</button>
}
```

### useSignMessage

Sign messages for verification:

```typescript
import { useSignMessage } from 'wagmi'

function Component() {
  const { signMessage, data, isSuccess } = useSignMessage()

  return (
    <button onClick={() => signMessage({ message: 'Verify ownership' })}>
      Sign Message
    </button>
  )
}
```

## ENS Resolution

**Location**: `src/lib/ens-resolver.ts`

```typescript
import { normalize } from 'viem/ens'
import { mainnet } from 'viem/chains'
import { createPublicClient, http } from 'viem'

export async function resolveENS(ensName: string) {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  const address = await client.getEnsAddress({
    name: normalize(ensName),
  })

  return address
}
```

### ENS Resolver Component

**Location**: `src/components/ENSResolver.tsx`

Resolves ENS names to addresses in the UI.

## Chain Detection

**Location**: `src/lib/chain-detection.ts`

```typescript
export function isMainnet(chainId: number): boolean {
  return chainId === 1
}

export function isL2(chainId: number): boolean {
  return [10, 137, 42161, 8453].includes(chainId)
}
```

## Wallet Authentication Flow

### Current Implementation

Wallet authentication currently uses RainbowKit for connection but relies on traditional auth (email/OAuth) for session management.

### Planned: SIWE (Sign-In with Ethereum)

Future implementation will use Sign-In with Ethereum:

```typescript
// Planned implementation
import { SiweMessage } from 'siwe'

async function signIn(address: string) {
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in to Veria',
    uri: window.location.origin,
    version: '1',
    chainId: 1,
    nonce: await fetchNonce(),
  })

  const signature = await signMessage({ message: message.prepareMessage() })

  // Verify on server
  await verifySignature(message, signature)
}
```

## Styling

### RainbowKit Theme

```typescript
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'

<RainbowKitProvider
  theme={darkTheme({
    accentColor: '#22d3ee',  // Cyan accent
    borderRadius: 'medium',
  })}
>
```

### CSS Import

Required in your root layout:

```typescript
import '@rainbow-me/rainbowkit/styles.css'
```

## Security Considerations

### Address Verification

Always verify on-chain ownership:

```typescript
// Don't trust client-side address claims
// Verify with signature on server
const isValid = await verifySignature(address, message, signature)
```

### Chain Switching

Handle chain mismatches:

```typescript
import { useSwitchChain } from 'wagmi'

function Component() {
  const { switchChain } = useSwitchChain()

  const handleChainMismatch = () => {
    switchChain({ chainId: mainnet.id })
  }
}
```

## Troubleshooting

### SSR Issues

wagmi config uses lazy initialization to prevent SSR issues:

```typescript
// Good: Lazy initialization
export const getWagmiConfig = () => {
  if (_wagmiConfig) return _wagmiConfig
  // ...create config
}

// Bad: Direct export causes SSR issues
export const wagmiConfig = getDefaultConfig({...})
```

### IndexedDB Errors

If you see IndexedDB errors, ensure config is only accessed on client:

```typescript
'use client'  // Always add this directive
```
