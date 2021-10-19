import { AppConfig } from './appConfig';

export const config: AppConfig = {
  app: {
    publicUrl: process.env.PUBLIC_URL || 'https://github.com/fastwaterbear/',
    sourcesUrl: 'https://github.com/fastwaterbear/',
    name: 'Tezos Payments',
    title: 'Tezos Payments',
    buildInfo: {
      commitShortSha: process.env.REACT_APP_COMMIT_SHORT_SHA || ''
    }
  },
  tezos: {
    officialSiteUrl: 'https://tezos.com/',
    defaultNetwork: 'granadanet',
    networks: {
      granadanet: {
        title: 'Granada Testnet',
        color: '#667eea',
        default: {
          rpc: 'smartpy',
          indexer: 'tzKT',
          explorer: 'tzKT'
        },
        rpcUrls: {
          smartpy: 'https://granadanet.smartpy.io'
        },
        indexerUrls: {
          betterCallDev: 'https://api.better-call.dev',
          tzKT: 'https://api.granadanet.tzkt.io',
          tzStats: 'https://api.granada.tzstats.com'
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
