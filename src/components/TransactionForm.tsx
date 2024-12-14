import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useWalletStore } from '../lib/store';
import { ethers } from 'ethers';
import { TokenDisplay } from './TokenDisplay';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function TransactionForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { sendTokens, isSending, error } = useWalletStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!ethers.utils.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      await sendTokens(recipient, amount);
      setRecipient('');
      setAmount('');
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-gray-100">Send BONSAI</h2>
      </div>

      <div className="space-y-4">
        <Input
          label="Recipient Address"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient address"
          disabled={isSending}
          darkMode
        />

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.000001"
              min="0"
              disabled={isSending}
              darkMode
              className="pr-20"
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-400">
              BONSAI
            </span>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSending} className="w-full">
          {isSending ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Transaction'
          )}
        </Button>
      </div>
    </form>
  );
}