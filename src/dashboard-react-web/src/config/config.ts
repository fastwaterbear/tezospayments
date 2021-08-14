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
    rpcNodes: {
      granadanet: {
        links: ['https://granadanet.smartpy.io/'],
        color: 'rgb(102, 126, 234)'
      },
      florence: {
        links: ['https://florencenet.smartpy.io/'],
        color: 'rgb(255, 216, 138)'
      },
      edo2net: {
        links: ['https://edonet.smartpy.io/'],
        color: 'rgb(251, 191, 36)'
      }
    }
  }
};
