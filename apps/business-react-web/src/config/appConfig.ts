import type { DeepReadonly, ParameterizedRoute } from '@tezospayments/common';
import type { AppConfig as AppConfigBase } from '@tezospayments/react-web-core';

export type AppConfig = DeepReadonly<AppConfigBase & {
  routers: {
    overview: string;
    analytics: string;
    operations: string;
    service: ParameterizedRoute<(address: string, isEdit?: boolean) => string>;
    createService: string,
    services: string;
    acceptPayments: string;
    acceptServicePayments: ParameterizedRoute<(address: string) => string>;
    connect: string;
    about: string;
  },
  links: {
    tzKT: string;
  }
}>;
