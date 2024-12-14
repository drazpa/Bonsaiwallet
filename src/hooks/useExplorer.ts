import { useState } from 'react';
import { useWalletStore } from '../lib/store';
import { ethers } from 'ethers';

export function useExplorer() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const provider = useWalletStore((state) => state.provider);

  const searchBlockchain = async (query: string) => {
    if (!provider) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      if (ethers.utils.isAddress(query)) {
        // Search for address
        const [balance, code] = await Promise.all([
          provider.getBalance(query),
          provider.getCode(query),
        ]);

        setSearchResult({
          type: 'address',
          address: query,
          balance: ethers.utils.formatEther(balance),
          isContract: code !== '0x',
        });
      } else if (query.startsWith('0x') && query.length === 66) {
        // Search for transaction
        const tx = await provider.getTransaction(query);
        if (tx) {
          const receipt = await provider.getTransactionReceipt(query);
          setSearchResult({
            type: 'transaction',
            ...tx,
            ...receipt,
          });
        } else {
          setError('Transaction not found');
        }
      } else if (!isNaN(Number(query))) {
        // Search for block
        const block = await provider.getBlock(Number(query));
        if (block) {
          setSearchResult({
            type: 'block',
            ...block,
          });
        } else {
          setError('Block not found');
        }
      } else {
        setError('Invalid search query');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResult,
    isLoading,
    error,
    searchBlockchain,
  };
}