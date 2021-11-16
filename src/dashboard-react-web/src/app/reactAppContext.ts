import type { BeaconWallet } from '@taquito/beacon-wallet';
import React from 'react';

import type { BlockchainUrlExplorer } from '@tezospayments/react-web-core';

export interface ReactAppContext {
  readonly tezosWallet: BeaconWallet;
  readonly tezosExplorer: BlockchainUrlExplorer;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ReactAppContext = React.createContext<ReactAppContext>({} as ReactAppContext);
