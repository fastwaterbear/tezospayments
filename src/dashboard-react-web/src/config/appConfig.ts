import type { DeepReadonly } from '@tezospayments/common/dist/models/core';

export type AppConfig = DeepReadonly<{
  app: {
    publicUrl: string;
    name: string;
    title: string;
    version: {
      name: string;
      link: string;
    }
    buildInfo: {
      commitShortSha: string;
      link: string;
    }
  },
  routers: {
    overview: string;
    operations: string;
    services: string;
    connect: string;
    about: string;
  },
  links: {
    tzStats: string;
    tzktIo: string;
    tezosPayments: {
      webSite: string;
      gitHub: string;
      telegram: string;
      twitter: string;
      reddit: string;
    }
  }
}>;
