import { AppConfig } from './appConfig';

const commitShortSha = process.env.REACT_APP_COMMIT_SHORT_SHA || '';

export const config: AppConfig = {
  app: {
    publicUrl: process.env.PUBLIC_URL || '/',
    name: 'Tezos Payments',
    title: 'Tezos Payments',
    version: {
      name: 'Dev Version',
      link: 'https://github.com/fastwaterbear/tezospayments/tree/master'
    },
    buildInfo: {
      commitShortSha,
      link: `https://github.com/fastwaterbear/tezospayments/tree/${commitShortSha}`
    }
  },
  routers: {
    overview: '/',
    operations: '/operations',
    services: '/services',
    acceptPayments: '/accept',
    connect: '/connect',
    about: '/about'
  },
  links: {
    tzktIo: 'https://tzkt.io',
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
    networks: {
      main: {
        title: 'Tezos Mainnet',
        color: '#83b300',
        default: {
          rpc: 'smartpy',
          indexer: 'tzkt',
          explorer: 'tzkt'
        },
        rpcUrls: {
          smartpy: 'https://mainnet.smartpy.io/'
        },
        indexerUrls: {
          tzkt: 'https://api.mainnet.tzkt.io/'
        },
        explorers: {
          tzkt: {
            url: 'https://mainnet.tzkt.io/', title: 'TzKT'
          }
        },
        servicesFactoryContractAddress: ''
      },
      granadanet: {
        title: 'Granada Testnet',
        color: '#667eea',
        default: {
          rpc: 'smartpy',
          indexer: 'tzkt',
          explorer: 'tzkt'
        },
        rpcUrls: {
          smartpy: 'https://granadanet.smartpy.io/'
        },
        indexerUrls: {
          tzkt: 'https://api.granadanet.tzkt.io/'
        },
        explorers: {
          tzkt: { url: 'https://granadanet.tzkt.io/', title: 'TzKT' }
        },
        servicesFactoryContractAddress: 'KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda'
      },
      florence: {
        title: 'Florence Testnet',
        color: '#ffd88a',
        default: {
          rpc: 'smartpy',
          indexer: 'tzkt',
          explorer: 'tzkt'
        },
        rpcUrls: {
          smartpy: 'https://florencenet.smartpy.io/'
        },
        indexerUrls: {
          tzkt: 'https://api.florencenet.tzkt.io/'
        },
        explorers: {
          tzkt: { url: 'https://florencenet.tzkt.io/', title: 'TzKT' }
        },
        servicesFactoryContractAddress: ''
      },
      edo2net: {
        title: 'Edo2 Testnet',
        color: '#fbbf24',
        default: {
          rpc: 'smartpy',
          indexer: 'tzkt',
          explorer: 'tzkt'
        },
        rpcUrls: {
          smartpy: 'https://edonet.smartpy.io/'
        },
        indexerUrls: {
          tzkt: 'https://api.edo2net.tzkt.io/'
        },
        explorers: {
          tzkt: { url: 'https://edo2net.tzkt.io/', title: 'TzKT' }
        },
        servicesFactoryContractAddress: 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU'
      }
    }
  }
};
