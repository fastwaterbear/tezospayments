import type { DeepReadonly } from '@tezospayments/common';
import type { AppConfig as AppConfigBase } from '@tezospayments/react-web-core';

export type AppConfig = DeepReadonly<AppConfigBase & {
  routers: {
    overview: string;
    operations: string;
    services: string;
    acceptPayments: string;
    connect: string;
    about: string;
  },
  links: {
    tzKT: string;
  }
}>;
