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
    defaultNetwork: 'hangzhounet',
    networks: {
      mainnet: {
        title: 'Mainnet',
        color: '83b300',
        minimumSupportedServiceVersion: 3,
        default: {
          rpc: 'ecadLabs',
          indexer: 'tzKT',
          explorer: 'tzKT'
        },
        rpcUrls: {
          ecadLabs: 'https://mainnet.api.tez.ie',
          smartPy: 'https://mainnet.smartpy.io'
        },
        indexerUrls: {
          tzKT: 'https://api.tzkt.io',
          betterCallDev: 'https://api.better-call.dev'
        },
        explorers: {
          tzKT: { baseUrl: 'https://tzkt.io', title: 'TzKT' },
          betterCallDev: { baseUrl: 'https://better-call.dev', title: 'Better Call Dev' },
          tzStats: { baseUrl: 'https://tzstats.com', title: 'TzStats' }
        },
        servicesFactoryContractAddress: 'Not implemented'
      },
      hangzhounet: {
        title: 'Hangzhou Testnet',
        color: '#b83280',
        minimumSupportedServiceVersion: 1,
        default: {
          rpc: 'smartPy',
          indexer: 'tzKT',
          explorer: 'tzKT'
        },
        rpcUrls: {
          ecadLabs: 'https://hangzhounet.api.tez.ie',
          smartPy: 'https://hangzhounet.smartpy.io'
        },
        indexerUrls: {
          tzKT: 'https://api.hangzhou2net.tzkt.io',
          betterCallDev: 'https://api.better-call.dev'
        },
        explorers: {
          tzKT: { baseUrl: 'https://hangzhou2net.tzkt.io', title: 'TzKT' },
          betterCallDev: { baseUrl: 'https://better-call.dev', title: 'Better Call Dev' },
          tzStats: { baseUrl: 'https://hangzhou.tzstats.com', title: 'TzStats' }
        },
        servicesFactoryContractAddress: 'KT1BLQ4tfy5iizuCSaR5D8sSDiQSemhvnAif'
      }
    }
  }
};
