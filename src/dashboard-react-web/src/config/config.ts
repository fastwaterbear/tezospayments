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
    defaultNetwork: 'granadanet',
    networks: {
      granadanet: {
        title: 'Granada Testnet',
        color: '#667eea',
        default: {
          rpc: 'smartPy',
          indexer: 'tzKT',
          explorer: 'tzKT'
        },
        rpcUrls: {
          smartPy: 'https://granadanet.smartpy.io'
        },
        indexerUrls: {
          tzKT: 'https://api.granadanet.tzkt.io'
        },
        explorers: {
          tzKT: { url: 'https://granadanet.tzkt.io', title: 'TzKT' }
        },
        servicesFactoryContractAddress: 'KT1Ja5k4rv85fiJPJ5jR1vpmCzoSzsyuW5kP'
      }
    }
  }
};
