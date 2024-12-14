import { ethers } from 'ethers';
import { BONSAI_TOKEN_ADDRESS } from '../constants';

const TOKEN_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function owner() view returns (address)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

export class BonsaiTokenContract {
  private contract: ethers.Contract;

  constructor(provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(BONSAI_TOKEN_ADDRESS, TOKEN_ABI, provider);
  }

  async getTotalSupply(): Promise<string> {
    try {
      const totalSupply = await this.contract.totalSupply();
      return ethers.utils.formatEther(totalSupply);
    } catch (error) {
      console.error('Failed to fetch total supply:', error);
      return '0';
    }
  }

  async getBalanceOf(address: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  }

  async getOwner(): Promise<string | null> {
    try {
      return await this.contract.owner();
    } catch (error) {
      console.error('Failed to fetch owner:', error);
      return null;
    }
  }

  async getDecimals(): Promise<number> {
    try {
      return await this.contract.decimals();
    } catch (error) {
      console.error('Failed to fetch decimals:', error);
      return 18; // Default to 18 decimals
    }
  }

  async getSymbol(): Promise<string> {
    try {
      return await this.contract.symbol();
    } catch (error) {
      console.error('Failed to fetch symbol:', error);
      return 'BONSAI';
    }
  }

  async getName(): Promise<string> {
    try {
      return await this.contract.name();
    } catch (error) {
      console.error('Failed to fetch name:', error);
      return 'BONSAI Token';
    }
  }

  onTransfer(callback: (from: string, to: string, value: ethers.BigNumber) => void): () => void {
    const filter = this.contract.filters.Transfer();
    this.contract.on(filter, callback);
    return () => this.contract.off(filter, callback);
  }
}