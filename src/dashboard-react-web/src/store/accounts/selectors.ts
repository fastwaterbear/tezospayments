import { NetworkType } from '@airgap/beacon-sdk';
import { createSelector } from 'reselect';

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
  accountsState => accountsState.connectedAccounts.reduce((p, c) => p.set(c.networkType, [...(p.get(c.networkType) || []), c]), new Map<NetworkType, Account[]>())
);
