import type { DeepReadonly, Network } from '@tezospayments/common';

import type { NetworkConfig } from './networkConfig';

type DefaultAppConfig = DeepReadonly<{
  links: {
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

export const defaultConfig: DefaultAppConfig = {
  links: {
    tezosPayments: {
      webSite: 'https://tezospayments.com',
      paymentsApp: 'https://payment.tezospayments.com',
      gitHub: 'https://github.com/fastwaterbear/tezospayments',
      telegram: 'https://t.me/fastwaterbear',
      twitter: 'https://twitter.com/fastwaterbear',
      reddit: 'https://www.reddit.com/user/fastwaterbear'
    }
  },
  tezos: {
    defaultNetwork: 'granadanet',
    networks: {
      granadanet: {
        title: 'Granada Testnet',
        color: '#667eea',
        minimumSupportedServiceVersion: 3,
        default: {
          rpc: 'smartPy',
          indexer: 'tzKT',
          explorer: 'tzKT'
        },
        rpcUrls: {
          smartPy: 'https://granadanet.smartpy.io'
        },
        indexerUrls: {
          tzKT: 'https://api.granadanet.tzkt.io',
          betterCallDev: 'https://api.better-call.dev'
        },
        explorers: {
          tzKT: { baseUrl: 'https://granadanet.tzkt.io', title: 'TzKT' },
          betterCallDev: { baseUrl: 'https://better-call.dev', title: 'Better Call Dev' },
          tzStats: { baseUrl: 'https://granada.tzstats.com', title: 'TzStats' }
        },
        servicesFactoryContractAddress: 'KT1NxBzCJtvHFLKfiSAX3PGxdiJMAC8CtSZV'
      }
    }
  }
};
