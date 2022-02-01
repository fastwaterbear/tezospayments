import BigNumber from 'bignumber.js';

import type { Token } from '@tezospayments/common';

export interface BalancesProvider {
  getTezosBalance(address: string): Promise<BigNumber>;
  getTokenBalance(address: string, token: Token): Promise<BigNumber>;
}
