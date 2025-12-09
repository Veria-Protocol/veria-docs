// Block high-risk wallets from accessing features
// Wrap any component that requires compliance checks

import { useVeriaScreen } from './useVeriaScreen';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface Props {
  children: React.ReactNode;
}

export function ComplianceGate({ children }: Props) {
  const { isConnected } = useAccount();
  const { isAllowed, isBlocked, isLoading, result } = useVeriaScreen();

  if (!isConnected) {
    return (
      <div>
        <p>Connect your wallet to continue</p>
        <ConnectButton />
      </div>
    );
  }

  if (isLoading) {
    return <p>Checking compliance...</p>;
  }

  if (isBlocked) {
    return (
      <div>
        <p>Access denied: Wallet flagged for compliance review</p>
        <p>Risk level: {result?.risk}</p>
      </div>
    );
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  return <p>Unable to verify wallet</p>;
}
