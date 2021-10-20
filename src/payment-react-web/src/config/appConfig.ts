import type { DeepReadonly } from '@tezospayments/common';
import type { AppConfig as AppConfigBase } from '@tezospayments/react-web-core';

export type AppConfig = DeepReadonly<AppConfigBase & {
  links: {
    tezos: string
  }
}>;
