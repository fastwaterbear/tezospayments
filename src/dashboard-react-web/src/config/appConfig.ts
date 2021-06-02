import type { DeepReadonly } from '@tezos-payments/common/dist/models/core';

export type AppConfig = DeepReadonly<{
  app: {
    publicUrl: string;
    name: string;
    title: string;
    buildInfo: {
      commitShortSha: string;
    }
  },
  routers: {
    overview: string;
    connect: string;
  },
  links: {
    tzStats: string;
  }
}>;
