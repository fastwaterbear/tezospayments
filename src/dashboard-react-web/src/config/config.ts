import { defaultConfig } from '@tezospayments/react-web-core';

import type { AppConfig } from './appConfig';

const commitShortSha = process.env.REACT_APP_COMMIT_SHORT_SHA || '';

export const config: AppConfig = {
  ...defaultConfig,
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
    ...defaultConfig.links,
    tzKT: 'https://tzkt.io'
  }
};
