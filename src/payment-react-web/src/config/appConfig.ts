import type { DeepReadonly } from '@tezos-payments/common/dist/models/core';

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
