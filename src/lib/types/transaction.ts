export interface TransactionRequest {
  to: string;
  amount: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  address: string;
  timestamp: string;
  hash: string;
  status: 'confirmed' | 'pending' | 'failed';
  gasUsed?: string;
}