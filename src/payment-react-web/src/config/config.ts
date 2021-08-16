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
          indexer: 'tzkt',
          explorer: 'tzStats'
        },
        rpcUrls: {
          smartpy: 'https://granadanet.smartpy.io/'
        },
        indexerUrls: {
          betterCallDev: 'https://api.better-call.dev/',
          tzkt: 'https://api.granadanet.tzkt.io/'
        },
        explorers: {
          tzStats: { url: 'https://granada.tzstats.com/', title: 'TzStats' },
        },
        servicesFactoryContractAddress: 'KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda'
      },
      edo2net: {
        title: 'Edo2 Testnet',
        color: '#fbbf24',
        default: {
          rpc: 'smartpy',
          indexer: 'tzkt',
          explorer: 'tzStats'
        },
        rpcUrls: {
          smartpy: 'https://edonet.smartpy.io/'
        },
        indexerUrls: {
          betterCallDev: 'https://api.better-call.dev/',
          tzkt: 'https://api.granadanet.tzkt.io/'
        },
        explorers: {
          tzStats: { url: 'https://edo.tzstats.com/', title: 'TzStats' }
        },
        servicesFactoryContractAddress: 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU'
      }
    }
  }
};
