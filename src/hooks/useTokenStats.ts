import { useState, useEffect } from 'react';
import { useWalletStore } from '../lib/store';
import { BonsaiTokenContract } from '../lib/contracts/BonsaiToken';
import { BONSAI_ISSUER_ADDRESS } from '../lib/constants';

interface TokenStats {
  totalSupply: string;
  circulatingSupply: string;
  activeWallets: number;
  validatorStatus: {
    active: number;
    pending: number;
    offline: number;
  };
  issuerBalance: string;
  tokenInfo: {
    name: string;
    symbol: string;
    decimals: number;
    owner: string | null;
  };
}

const DEFAULT_STATS: TokenStats = {
  totalSupply: '0',
  circulatingSupply: '0',
  activeWallets: 0,
  validatorStatus: {
    active: 92,
    pending: 5,
    offline: 3
  },
  issuerBalance: '0',
  tokenInfo: {
    name: 'BONSAI Token',
    symbol: 'BONSAI',
    decimals: 18,
    owner: null
  }
};

export function useTokenStats() {
  const [stats, setStats] = useState<TokenStats>(DEFAULT_STATS);
  const provider = useWalletStore((state) => state.provider);

  useEffect(() => {
    if (!provider) return;

    const tokenContract = new BonsaiTokenContract(provider);
    let mounted = true;

    const fetchStats = async () => {
      try {
        const [
          totalSupply,
          issuerBalance,
          name,
          symbol,
          decimals,
          owner
        ] = await Promise.all([
          tokenContract.getTotalSupply(),
          tokenContract.getBalanceOf(BONSAI_ISSUER_ADDRESS),
          tokenContract.getName(),
          tokenContract.getSymbol(),
          tokenContract.getDecimals(),
          tokenContract.getOwner()
        ]);

        if (mounted) {
          const circulatingSupply = (
            Number(totalSupply) - Number(issuerBalance)
          ).toString();

          setStats({
            totalSupply,
            circulatingSupply,
            activeWallets: 1250, // Simulated value
            validatorStatus: {
              active: 92,
              pending: 5,
              offline: 3
            },
            issuerBalance,
            tokenInfo: {
              name,
              symbol,
              decimals,
              owner
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch token stats:', error);
        if (mounted) {
          setStats(DEFAULT_STATS);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    // Listen for Transfer events to update stats
    const unsubscribe = tokenContract.onTransfer(() => {
      if (mounted) {
        fetchStats();
      }
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      unsubscribe();
    };
  }, [provider]);

  return stats;
}