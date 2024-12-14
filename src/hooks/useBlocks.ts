import { useState, useEffect } from 'react';
import { useWalletStore } from '../lib/store';
import { ethers } from 'ethers';

interface Block {
  number: number;
  timestamp: string;
  transactions: string[];
  gasUsed: ethers.BigNumber;
}

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const provider = useWalletStore((state) => state.provider);

  useEffect(() => {
    if (!provider) return;

    const fetchBlocks = async () => {
      try {
        const latestBlock = await provider.getBlockNumber();
        const blockPromises = [];

        // Fetch last 5 blocks
        for (let i = 0; i < 5; i++) {
          if (latestBlock - i >= 0) {
            blockPromises.push(provider.getBlock(latestBlock - i));
          }
        }

        const fetchedBlocks = await Promise.all(blockPromises);
        setBlocks(
          fetchedBlocks.map((block) => ({
            number: block.number,
            timestamp: new Date(block.timestamp * 1000).toISOString(),
            transactions: block.transactions,
            gasUsed: block.gasUsed,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch blocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 10000);

    return () => clearInterval(interval);
  }, [provider]);

  return { blocks, isLoading };
}