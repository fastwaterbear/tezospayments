import { createSelector } from 'reselect';

import { Network } from '@tezospayments/common/dist/models/blockchain';

import { Account } from '../../models/blockchain';
import type { AppState } from '../index';

export const selectAccountsState = (state: AppState) => state.accountsState;
export const getCurrentAccount = createSelector(
  selectAccountsState,
  accountsState => accountsState.currentAccountAddress
    ? (accountsState.connectedAccounts.find(account => account.address === accountsState.currentAccountAddress) || null)
    : null
);
export const getAccountsByNetwork = createSelector(
  selectAccountsState,
  accountsState => accountsState.connectedAccounts.reduce((p, c) => p.set(c.network, [...(p.get(c.network) || []), c]), new Map<Network, Account[]>())
);
