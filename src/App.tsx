import React from 'react';
import { WalletCard } from './components/WalletCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionHistory } from './components/TransactionHistory';
import { ConnectButton } from './components/ConnectButton';
import { NetworkStats } from './components/NetworkStats';
import { ExplorerCard } from './components/Explorer/ExplorerCard';
import { useWalletStore } from './lib/store';
import { useWalletEvents } from './hooks/useWalletEvents';

export default function App() {
  const { address, balance, isConnected } = useWalletStore();
  useWalletEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-100 mb-6">
            BONSAI Wallet Companion
          </h1>
          <ConnectButton />
        </div>
        
        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <TransactionForm />
              <WalletCard address={address!} balance={balance} />
              <NetworkStats />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <TransactionHistory />
              <ExplorerCard />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Please connect your wallet to continue
          </div>
        )}
      </div>
    </div>
  );
}