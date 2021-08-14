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
    tzStats: 'https://edo.tzstats.com',
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
        name: 'Tezos Mainnet',
        color: '#83b300',
        rpcUrls: ['https://mainnet.smartpy.io/'],
        explorerUrl: 'https://api.mainnet.tzkt.io/',
        servicesFactoryContractAddress: ''
      },
      granadanet: {
        name: 'Granada Testnet',
        color: '#667eea',
        rpcUrls: ['https://granadanet.smartpy.io/'],
        explorerUrl: 'https://api.granadanet.tzkt.io/',
        servicesFactoryContractAddress: 'KT1TsixZzkALSuJhzKkyCDgyJxQCbHsGoqda'
      },
      florence: {
        name: 'Florence Testnet',
        color: '#ffd88a',
        rpcUrls: ['https://florencenet.smartpy.io/'],
        explorerUrl: 'https://api.florencenet.tzkt.io/',
        servicesFactoryContractAddress: ''
      },
      edo2net: {
        name: 'Edo2 Testnet',
        color: '#fbbf24',
        rpcUrls: ['https://edonet.smartpy.io/'],
        explorerUrl: 'https://api.edo2net.tzkt.io/',
        servicesFactoryContractAddress: 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU'
      }
    }
  }
};
