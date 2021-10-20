import type { DeepReadonly, Network } from '@tezospayments/common';

import type { NetworkConfig } from './networkConfig';

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
  links: {
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
    defaultNetwork: Network['name'];
    networks: { [key in Network['name']]: NetworkConfig }
  }
}>;
