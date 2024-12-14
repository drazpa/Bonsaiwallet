import { ethers } from 'ethers';
import { chainConfig } from '../config/chain';

export class ProviderService {
  private static provider: ethers.providers.Web3Provider | null = null;

  static async connect(): Promise<ethers.providers.Web3Provider> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    
    const network = await provider.getNetwork();
    if (network.chainId !== chainConfig.id) {
      throw new Error(`Please switch to ${chainConfig.name} (Chain ID: ${chainConfig.id})`);
    }

    this.provider = provider;
    return provider;
  }

  static getProvider(): ethers.providers.Web3Provider | null {
    return this.provider;
  }

  static async getGasPrice(): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    const gasPrice = await this.provider.getGasPrice();
    return ethers.utils.formatEther(gasPrice);
  }
}