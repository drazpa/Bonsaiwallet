import { ethers } from 'ethers';
import type { Transaction } from './transaction';

export interface WalletState {
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