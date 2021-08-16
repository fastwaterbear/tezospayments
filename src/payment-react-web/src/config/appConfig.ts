import type { Network } from '@tezospayments/common/dist/models/blockchain';
import type { DeepReadonly } from '@tezospayments/common/dist/models/core';

type RpcProvider = 'smartpy';
type IndexerProvider = 'betterCallDev' | 'tzKT' | 'tzStats';
type ExplorerProvider = 'betterCallDev' | 'tzStats';

interface NetworkConfig {
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
}

export type AppConfig = DeepReadonly<{
  app: {
    publicUrl: string;
    sourcesUrl: string;
    name: string;
    title: string;
    buildInfo: {
      commitShortSha: string;
    }
  },
  tezos: {
    officialSiteUrl: string;
    defaultNetwork: Network['name'];
    networks: { [key in Network['name']]: NetworkConfig }
  }
}>;
