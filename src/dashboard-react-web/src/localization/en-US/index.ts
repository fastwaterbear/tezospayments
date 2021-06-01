import { common } from './common';
import { overview, createService, connect, header } from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    common,
    views: {
      header,
      overview,
      createService,
      connect
    },
  }
} as const;
