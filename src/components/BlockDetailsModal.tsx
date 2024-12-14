import React from 'react';
import { Modal } from './ui/Modal';
import { formatDate } from '../lib/utils';
import { ethers } from 'ethers';

interface BlockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: {
    number: number;
    timestamp: string;
    transactions: string[];
    gasUsed: ethers.BigNumber;
    hash?: string;
    parentHash?: string;
    miner?: string;
    nonce?: string;
    difficulty?: string;
  } | null;
}

export function BlockDetailsModal({ isOpen, onClose, block }: BlockDetailsModalProps) {
  if (!block) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Block #${block.number} Details`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Timestamp</p>
            <p className="text-gray-200">{formatDate(block.timestamp)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Transactions</p>
            <p className="text-gray-200">{block.transactions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Gas Used</p>
            <p className="text-gray-200">{block.gasUsed.toString()}</p>
          </div>
          {block.miner && (
            <div>
              <p className="text-sm text-gray-400">Miner</p>
              <p className="text-gray-200 font-mono text-sm">
                {block.miner.slice(0, 8)}...{block.miner.slice(-6)}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">Block Hash</p>
          <p className="text-gray-200 font-mono text-sm break-all bg-gray-700/50 p-3 rounded-lg">
            {block.hash}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">Parent Hash</p>
          <p className="text-gray-200 font-mono text-sm break-all bg-gray-700/50 p-3 rounded-lg">
            {block.parentHash}
          </p>
        </div>

        {block.transactions.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Transaction Hashes</p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {block.transactions.map((hash, index) => (
                <p key={hash} className="text-gray-200 font-mono text-sm break-all bg-gray-700/50 p-2 rounded-lg">
                  {hash}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}