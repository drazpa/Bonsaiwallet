import React from 'react';
import { Activity, Wallet, Database, Server } from 'lucide-react';
import { useNetworkStats } from '../hooks/useNetworkStats';
import { useTokenStats } from '../hooks/useTokenStats';

export function NetworkStats() {
  const { stats: networkStats, isLoading, error } = useNetworkStats();
  const tokenStats = useTokenStats();

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-gray-100">Network Stats</h2>
      </div>
      
      <div className="space-y-6">
        {/* Token Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            BONSAI Token
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400">Total Supply</span>
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {Number(tokenStats.totalSupply).toLocaleString()} <span className="text-sm text-gray-400">BONSAI</span>
              </p>
            </div>
            
            <div className="bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400">Active Wallets</span>
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {tokenStats.activeWallets.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Blockchain Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Chain Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400">Block Height</span>
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {networkStats.blockHeight.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400">Gas Price</span>
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {Number(networkStats.gasPrice).toFixed(9)} <span className="text-sm text-gray-400">BONSAI</span>
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400">TPS</span>
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {networkStats.tps}
              </p>
            </div>
          </div>
        </div>

        {/* Validator Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Validator Status ({networkStats.validators.total} total)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
              <span className="text-sm text-emerald-400">Active</span>
              <p className="text-lg font-semibold text-emerald-100 mt-1">
                {networkStats.validators.active}
              </p>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
              <span className="text-sm text-yellow-400">Pending</span>
              <p className="text-lg font-semibold text-yellow-100 mt-1">
                {networkStats.validators.pending}
              </p>
            </div>
            
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4">
              <span className="text-sm text-red-400">Offline</span>
              <p className="text-lg font-semibold text-red-100 mt-1">
                {networkStats.validators.offline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}