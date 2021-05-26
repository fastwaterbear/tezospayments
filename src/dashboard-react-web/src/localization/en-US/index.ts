import { overview, createService, connect } from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    views: {
      overview,
      createService,
      connect
    }
  }
} as const;
