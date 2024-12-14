import { ethers } from 'ethers';
import { ProviderService } from './provider';
import type { TransactionRequest } from '../types/transaction';

export class TransactionService {
  static async send(request: TransactionRequest): Promise<ethers.providers.TransactionReceipt> {
    const provider = ProviderService.getProvider();
    if (!provider) throw new Error('Provider not initialized');

    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: request.to,
      value: ethers.utils.parseEther(request.amount)
    });
    
    return await tx.wait();
  }

  static async getBalance(address: string): Promise<string> {
    const provider = ProviderService.getProvider();
    if (!provider) throw new Error('Provider not initialized');

    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
}