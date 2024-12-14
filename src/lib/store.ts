import create from 'zustand';
import { ethers } from 'ethers';
import { CHAIN_ID } from './constants';
import { sendTransaction } from './contracts';
import { saveTransactions, loadTransactions } from './storage';
import type { Transaction } from './types';

interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  isSending: boolean;
  provider: ethers.providers.Web3Provider | null;
  error: string | null;
  transactions: Transaction[];
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
  sendTokens: (to: string, amount: string) => Promise<void>;
  addTransaction: (tx: Transaction) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
  isSending: false,
  provider: null,
  error: null,
  transactions: loadTransactions(),

  connect: async () => {
    try {
      set({ isConnecting: true, error: null });

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const network = await provider.getNetwork();
      if (network.chainId !== CHAIN_ID) {
        throw new Error(`Please switch to chain ID: ${CHAIN_ID}`);
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      set({
        provider,
        address,
        balance: ethers.utils.formatEther(balance),
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
      transactions: loadTransactions(), // Reload transactions on disconnect
    });
  },

  updateBalance: async () => {
    const { provider, address } = get();
    if (!provider || !address) return;

    try {
      const balance = await provider.getBalance(address);
      set({ balance: ethers.utils.formatEther(balance) });
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  },

  addTransaction: (tx: Transaction) => {
    set((state) => {
      const newTransactions = [tx, ...state.transactions];
      saveTransactions(newTransactions); // Save to localStorage
      return { transactions: newTransactions };
    });
  },

  sendTokens: async (to: string, amount: string) => {
    const { provider, address } = get();
    if (!provider || !address) throw new Error('Wallet not connected');

    set({ isSending: true, error: null });
    try {
      const receipt = await sendTransaction(provider, to, amount);
      
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