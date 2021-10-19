import type { DeepReadonly, Network } from '@tezospayments/common';

type RpcProvider = 'smartpy';
type IndexerProvider = 'tzKT' | 'tzStats' | 'betterCallDev';
type ExplorerProvider = 'tzKT' | 'tzStats' | 'betterCallDev';

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
