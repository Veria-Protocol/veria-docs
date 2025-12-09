// React hook for screening connected wallet
// Works with wagmi/RainbowKit

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

interface ScreenResult {
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  details: {
    sanctions_hit: boolean;
    pep_hit: boolean;
    watchlist_hit: boolean;
  };
}

export function useVeriaScreen() {
  const { address, isConnected } = useAccount();
  const [result, setResult] = useState<ScreenResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Call your backend which proxies to Veria
    // Never expose API keys in frontend code
    fetch('/api/screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [address, isConnected]);

  const isAllowed = result?.risk === 'low' || result?.risk === 'medium';
  const isBlocked = result?.risk === 'high' || result?.risk === 'critical';

  return {
    result,
    isLoading,
    error,
    isAllowed,
    isBlocked,
  };
}
