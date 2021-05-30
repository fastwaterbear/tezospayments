import { AppConfig } from './appConfig';

export const config: AppConfig = {
  app: {
    publicUrl: process.env.PUBLIC_URL || '/',
    name: 'Tezos Payments',
    title: 'Tezos Payments'
  },
  routers: {
    overview: '/',
    connect: '/connect'
  },
  links: {
    tzStats: 'https://tzstats.com'
  }
};
