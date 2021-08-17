import React from 'react';

import type { BetterCallDevBlockchainUrlExplorer, TzStatsBlockchainUrlExplorer } from './explorers';

interface AppView {
  readonly betterCallDevBlockchainUrlExplorer: BetterCallDevBlockchainUrlExplorer;
  readonly tzStatsUrlBlockchainExplorer: TzStatsBlockchainUrlExplorer;
}

export const AppViewContext = React.createContext<AppView>({} as AppView);
