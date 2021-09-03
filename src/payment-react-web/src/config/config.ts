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
    defaultNetwork: 'edo2net',
    networks: {
      granadanet: {
        title: 'Granada Testnet',
        color: '#667eea',
        default: {
          rpc: 'smartpy',
          indexer: 'tzKT',
          explorer: 'tzStats'
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
          tzStats: { baseUrl: 'https://granada.tzstats.com', title: 'TzStats' },
          betterCallDev: { baseUrl: 'https://better-call.dev', title: 'Better Call Dev' }
        },
        servicesFactoryContractAddress: 'KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda'
      },
      edo2net: {
        title: 'Edo2 Testnet',
        color: '#fbbf24',
        default: {
          rpc: 'smartpy',
          indexer: 'tzKT',
          explorer: 'tzStats'
        },
        rpcUrls: {
          smartpy: 'https://edonet.smartpy.io'
        },
        indexerUrls: {
          betterCallDev: 'https://api.better-call.dev',
          tzKT: 'https://api.edo2net.tzkt.io',
          tzStats: 'https://api.edo.tzstats.com'
        },
        explorers: {
          tzStats: { baseUrl: 'https://edo.tzstats.com', title: 'TzStats' },
          betterCallDev: { baseUrl: 'https://better-call.dev', title: 'Better Call Dev' }
        },
        servicesFactoryContractAddress: 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU'
      }
    }
  }
};
