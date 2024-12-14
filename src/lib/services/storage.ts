import type { Transaction } from '../types/transaction';

export class StorageService {
  private static readonly TRANSACTIONS_KEY = 'bonsai_transactions';

  static saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }

  static loadTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(this.TRANSACTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load transactions:', error);
      return [];
    }
  }
}