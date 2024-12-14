import React, { useState } from 'react';
import { Wallet, Copy, QrCode } from 'lucide-react';
import { TokenDisplay } from './TokenDisplay';
import { AddressDisplay } from './AddressDisplay';
import { Button } from './ui/Button';
import { ReceiveModal } from './ReceiveModal';

interface WalletCardProps {
  address: string;
  balance: string;
}

export function WalletCard({ address, balance }: WalletCardProps) {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-gray-100">BONSAI Wallet</h2>
          </div>
          <span className="text-sm font-medium text-gray-400">Chain ID: 948345</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Address</span>
              <button 
                onClick={copyToClipboard}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <AddressDisplay address={address} className="font-mono text-sm mt-1 text-gray-100" />
          </div>

          <div className="bg-gray-700/50 rounded-xl p-4">
            <span className="text-sm text-emerald-400">Balance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-semibold text-gray-100">
                {Number(balance).toFixed(4)}
              </span>
              <span className="text-sm font-medium text-gray-400">BONSAI</span>
            </div>
          </div>

          <Button
            onClick={() => setIsReceiveModalOpen(true)}
            variant="secondary"
            className="w-full"
          >
            <QrCode className="w-4 h-4" />
            Receive BONSAI
          </Button>
        </div>
      </div>

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      />
    </>
  );
}