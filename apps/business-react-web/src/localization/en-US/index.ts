import { common } from './common';
import {
  overview, createService, connect, header, about, operations,
  services, settings, acceptPayments, analytics
} from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    common,
    views: {
      header,
      overview,
      analytics,
      createService,
      connect,
      about,
      operations,
      services,
      settings,
      acceptPayments,
    },
  }
} as const;
