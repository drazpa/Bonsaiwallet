import React from 'react';
import { Wallet } from 'lucide-react';
import { useWalletStore } from '../lib/store';

export function ConnectButton() {
  const { isConnected, isConnecting, connect, disconnect, error } = useWalletStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isConnected ? disconnect : connect}
        disabled={isConnecting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${isConnected
            ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50 border border-red-700'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }
          disabled:opacity-50
        `}
      >
        <Wallet className="w-5 h-5" />
        {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect Wallet'}
      </button>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}