import type { DeepReadonly } from '@tezospayments/common';

export type AppConfig = DeepReadonly<{
  app: {
    publicUrl: string;
    sourcesUrl: string;
    name: string;
    title: string;
    buildInfo: {
      commitShortSha: string;
    }
  },
  tezos: {
    officialSiteUrl: string;
    rpcNodes: {
      edo2net: [string, ...string[]]
    }
  }
}>;
