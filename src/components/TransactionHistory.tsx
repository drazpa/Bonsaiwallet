import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { TokenDisplay } from './TokenDisplay';
import { AddressDisplay } from './AddressDisplay';
import { formatDate } from '../lib/utils';
import { useWalletStore } from '../lib/store';
import type { Transaction } from '../lib/types';

export function TransactionHistory() {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const transactions = useWalletStore((state) => state.transactions);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Transaction History</h2>
        <div className="flex gap-2">
          <select 
            className="text-sm bg-gray-700 border-gray-600 text-gray-200 rounded-lg px-3 py-1.5"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All Transactions</option>
            <option value="send">Sent</option>
            <option value="receive">Received</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No transactions found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Address</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Gas Used</th>
                <th className="pb-3 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-700/50">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === 'receive' ? (
                        <div className="p-1.5 bg-green-900/50 rounded-full">
                          <ArrowDownLeft className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-blue-900/50 rounded-full">
                          <ArrowUpRight className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-200">
                        {tx.type === 'receive' ? 'Received' : 'Sent'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <TokenDisplay 
                      amount={tx.amount} 
                      className="text-sm font-medium text-gray-200"
                    />
                  </td>
                  <td className="py-4">
                    <AddressDisplay 
                      address={tx.address} 
                      className="text-sm text-gray-400"
                    />
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-400">
                      {formatDate(tx.timestamp)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-700' : 
                        tx.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' : 
                        'bg-red-900/50 text-red-400 border border-red-700'}
                    `}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-400">
                      {tx.gasUsed || '-'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-400">
                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                      </span>
                      <a
                        href={`https://explorer.example.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}