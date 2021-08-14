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
    acceptPayments: string;
    connect: string;
    about: string;
  },
  links: {
    tzStats: string;
    tzktIo: string;
    tezosPayments: {
      webSite: string;
      paymentsApp: string;
      gitHub: string;
      telegram: string;
      twitter: string;
      reddit: string;
    }
  },
  tezos: {
    rpcNodes: {
      granadanet: {
        color: string,
        links: [string, ...string[]]
      },
      florence: {
        color: string,
        links: [string, ...string[]]
      }
      edo2net: {
        color: string,
        links: [string, ...string[]]
      }
    }
  }
}>;
