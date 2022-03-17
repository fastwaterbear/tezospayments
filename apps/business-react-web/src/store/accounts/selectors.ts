import { createSelector } from 'reselect';

import { Network } from '@tezospayments/common';

import { config } from '../../config';
import { Account } from '../../models/blockchain';
import type { AppState } from '../index';

export const selectAccountsState = (state: AppState) => state.accountsState;
export const selectCurrentAccount = createSelector(
  selectAccountsState,
  accountsState => accountsState.currentAccount
    ? (accountsState.connectedAccounts.find(account =>
      account.address === accountsState.currentAccount?.address && account.network.id === accountsState.currentAccount.network.id) || null)
    : null
);
export const selectAccountsByNetwork = createSelector(
  selectAccountsState,
  accountsState => accountsState.connectedAccounts.reduce((p, c) => p.set(c.network, [...(p.get(c.network) || []), c]), new Map<Network, Account[]>())
);
export const selectCurrentNetworkConfig = createSelector(
  selectCurrentAccount,
  account => account && config.tezos.networks[account.network.name]
);
