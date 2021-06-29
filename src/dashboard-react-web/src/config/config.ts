import { AppConfig } from './appConfig';

export const config: AppConfig = {
  app: {
    publicUrl: process.env.PUBLIC_URL || '/',
    name: 'Tezos Payments',
    title: 'Tezos Payments',
    buildInfo: {
      commitShortSha: process.env.REACT_APP_COMMIT_SHORT_SHA || ''
    }
  },
  routers: {
    overview: '/',
    operations: '/operations',
    services: '/services',
    connect: '/connect'
  },
  links: {
    tzStats: 'https://tzstats.com'
  }
};
