import { common } from './common';
import { overview, createService, connect, header, about, operations, services, settings, } from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    common,
    views: {
      header,
      overview,
      createService,
      connect,
      about,
      operations,
      services,
      settings,
    },
  }
} as const;
