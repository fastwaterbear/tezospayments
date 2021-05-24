import { overview, createService, connectWallet } from './views';

export const enUS = {
  id: 'en-US',
  resources: {
    views: {
      overview,
      createService,
      connectWallet
    }
  }
} as const;
