import { ethers } from 'ethers';
import { chainConfig } from '../config/chain';

interface ValidatorInfo {
  nodeID: string;
  startTime: string;
  endTime: string;
  stakeAmount: string;
  connected: boolean;
  delegationFee: number;
}

interface NetworkStats {
  blockHeight: number;
  gasPrice: string;
  tps: number;
  validators: {
    active: number;
    pending: number;
    offline: number;
    total: number;
  };
}

export class NetworkService {
  private static provider: ethers.providers.JsonRpcProvider | null = null;

  private static async getProvider(): Promise<ethers.providers.JsonRpcProvider> {
    if (!this.provider) {
      this.provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
    }
    return this.provider;
  }

  static async getNetworkStats(): Promise<NetworkStats> {
    const provider = await this.getProvider();

    try {
      // Get basic blockchain info
      const [blockNumber, gasPrice] = await Promise.all([
        provider.getBlockNumber(),
        provider.getGasPrice(),
      ]);

      // Get validator info using platform API
      const validatorResponse = await fetch(
        chainConfig.rpcUrl.replace('/ext/bc/', '/ext/platform/'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'platform.getCurrentValidators',
            params: {}
          })
        }
      );

      const validatorData = await validatorResponse.json();
      const validators: ValidatorInfo[] = validatorData.result?.validators || [];

      // Calculate validator statistics
      const validatorStats = validators.reduce(
        (acc, validator) => {
          if (validator.connected) {
            acc.active++;
          } else {
            acc.offline++;
          }
          const now = Date.now();
          const startTime = new Date(validator.startTime).getTime();
          if (startTime > now) {
            acc.pending++;
          }
          return acc;
        },
        { active: 0, pending: 0, offline: 0, total: validators.length }
      );

      // Calculate TPS using recent blocks
      const recentBlocks = await Promise.all(
        Array.from({ length: 10 }, (_, i) => 
          provider.getBlock(blockNumber - i)
        )
      );

      const txCount = recentBlocks.reduce(
        (sum, block) => sum + (block?.transactions.length || 0), 
        0
      );
      const timeSpan = (
        recentBlocks[0]?.timestamp - recentBlocks[recentBlocks.length - 1]?.timestamp
      ) || 1;
      const tps = Math.round((txCount / timeSpan) * 10) / 10;

      return {
        blockHeight: blockNumber,
        gasPrice: ethers.utils.formatEther(gasPrice),
        tps,
        validators: validatorStats
      };
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
      return {
        blockHeight: 0,
        gasPrice: '0',
        tps: 0,
        validators: {
          active: 0,
          pending: 0,
          offline: 0,
          total: 0
        }
      };
    }
  }
}