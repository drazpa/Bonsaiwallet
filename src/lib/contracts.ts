import { ethers } from 'ethers';

export async function sendTransaction(
  provider: ethers.providers.Web3Provider,
  to: string,
  amount: string
) {
  try {
    const signer = provider.getSigner();
    const parsedAmount = ethers.utils.parseEther(amount);
    
    const tx = await signer.sendTransaction({
      to,
      value: parsedAmount
    });
    
    return await tx.wait();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Transaction failed');
  }
}