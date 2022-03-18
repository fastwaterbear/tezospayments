import { getParameterizedRoute } from '@tezospayments/common';
import { defaultConfig } from '@tezospayments/react-web-core';

import type { AppConfig } from './appConfig';

const commitShortSha = process.env.REACT_APP_COMMIT_SHORT_SHA || '';

export const config: AppConfig = {
  ...defaultConfig,
  app: {
    publicUrl: process.env.PUBLIC_URL || '/',
    name: 'Tezos Payments Business',
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
    analytics: '/analytics',
    operations: '/operations',
    services: '/services',
    service: getParameterizedRoute((address, isEdit) => isEdit ? `/services/${address}?edit=true` : `/services/${address}`, '/services/:address'),
    createService: '/services/create',
    acceptPayments: '/accept',
    acceptServicePayments: getParameterizedRoute(address => `/accept/${address}`, '/accept/:address'),
    connect: '/connect',
    about: '/about'
  },
  links: {
    ...defaultConfig.links,
    tzKT: 'https://tzkt.io'
  }
};
