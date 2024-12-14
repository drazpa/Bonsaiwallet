import { useState, useEffect } from 'react';
import { NetworkService } from '../lib/services/network';

interface NetworkStats {
  blockHeight: number;
  gasPrice: string;
  tps: number;
  validators: {
    active: number;
    pending: number;
    offline: number;
    total: number;
  };
}

const DEFAULT_STATS: NetworkStats = {
  blockHeight: 0,
  gasPrice: '0',
  tps: 0,
  validators: {
    active: 0,
    pending: 0,
    offline: 0,
    total: 0
  }
};

export function useNetworkStats() {
  const [stats, setStats] = useState<NetworkStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const networkStats = await NetworkService.getNetworkStats();
        if (mounted) {
          setStats(networkStats);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch network stats:', err);
        if (mounted) {
          setError('Failed to fetch network stats');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { stats, isLoading, error };
}