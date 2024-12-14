import create from 'zustand';
import { ProviderService } from '../services/provider';
import { TransactionService } from '../services/transaction';
import { StorageService } from '../services/storage';
import type { Transaction } from '../types/transaction';
import type { WalletState } from '../types/wallet';

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
  isSending: false,
  provider: null,
  error: null,
  transactions: StorageService.loadTransactions(),

  connect: async () => {
    try {
      set({ isConnecting: true, error: null });
      const provider = await ProviderService.connect();
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await TransactionService.getBalance(address);

      set({
        provider,
        address,
        balance,
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
        isConnecting: false,
      });
    }
  },

  disconnect: () => {
    set({
      address: null,
      balance: '0',
      isConnected: false,
      provider: null,
      error: null,
      transactions: StorageService.loadTransactions(),
    });
  },

  updateBalance: async () => {
    const { address } = get();
    if (!address) return;

    try {
      const balance = await TransactionService.getBalance(address);
      set({ balance });
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  },

  addTransaction: (tx: Transaction) => {
    set((state) => {
      const newTransactions = [tx, ...state.transactions];
      StorageService.saveTransactions(newTransactions);
      return { transactions: newTransactions };
    });
  },

  sendTokens: async (to: string, amount: string) => {
    set({ isSending: true, error: null });
    try {
      const receipt = await TransactionService.send({ to, amount });
      
      const newTx: Transaction = {
        id: receipt.transactionHash,
        type: 'send',
        amount,
        address: to,
        timestamp: new Date().toISOString(),
        hash: receipt.transactionHash,
        status: 'confirmed',
        gasUsed: receipt.gasUsed.toString()
      };
      
      get().addTransaction(newTx);
      await get().updateBalance();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Transaction failed' });
    } finally {
      set({ isSending: false });
    }
  },
}));