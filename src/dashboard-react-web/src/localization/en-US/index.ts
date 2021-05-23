import { overview, createService } from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    views: {
      overview,
      createService
    }
  }
} as const;
