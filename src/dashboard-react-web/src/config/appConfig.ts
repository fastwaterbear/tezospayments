import type { DeepReadonly } from '@tezospayments/common/dist/models/core';

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
    operations: string;
    services: string;
    connect: string;
  },
  links: {
    tzStats: string;
  }
}>;
