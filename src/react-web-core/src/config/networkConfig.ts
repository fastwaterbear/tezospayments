import { DeepReadonly } from '@tezospayments/common';

type RpcProvider = 'smartPy';
type IndexerProvider = 'tzKT' | 'betterCallDev';
type ExplorerProvider = 'tzKT' | 'tzStats' | 'betterCallDev';

export type NetworkConfig = DeepReadonly<{
  title: string;
  color: string;
  servicesFactoryContractAddress: string;
  default: {
    rpc: RpcProvider;
    indexer: IndexerProvider;
    explorer: ExplorerProvider;
  },
  rpcUrls: { [key in RpcProvider]: string };
  indexerUrls: { [key in IndexerProvider]: string };
  explorers: { [key in ExplorerProvider]: { baseUrl: string; title: string } };
}>;
