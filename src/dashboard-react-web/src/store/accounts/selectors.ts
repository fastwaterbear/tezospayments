import { createSelector } from 'reselect';

import type { AppState } from '../index';

export const selectAccountsState = (state: AppState) => state.accountsState;
export const getCurrentAccount = createSelector(
  selectAccountsState,
  accountsState => accountsState.currentAccountAddress
    ? (accountsState.connectedAccounts.find(account => account.address === accountsState.currentAccountAddress) || null)
    : null
);
