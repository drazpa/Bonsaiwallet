export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: NativeCurrency;
}