import type { DeepReadonly, Network } from '@tezospayments/common';

type RpcProvider = 'smartpy';
type IndexerProvider = 'tzkt';
type ExplorerProvider = 'tzkt';

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
  explorers: { [key in ExplorerProvider]: { url: string; title: string } };
}

export type AppConfig = DeepReadonly<{
  app: {
    publicUrl: string;
    name: string;
    title: string;
    version: {
      name: string;
      link: string;
    }
    buildInfo: {
      commitShortSha: string;
      link: string;
    }
  },
  routers: {
    overview: string;
    operations: string;
    services: string;
    acceptPayments: string;
    connect: string;
    about: string;
  },
  links: {
    tzktIo: string;
    tezosPayments: {
      webSite: string;
      paymentsApp: string;
      gitHub: string;
      telegram: string;
      twitter: string;
      reddit: string;
    }
  },
  tezos: {
    defaultNetwork: Network['name'];
    networks: { [key in Network['name']]: NetworkConfig }
  }
}>;
