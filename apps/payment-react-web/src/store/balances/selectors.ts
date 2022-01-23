import { createSelector } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { AppState } from '..';

export const selectBalancesState = (state: AppState) => state.balancesState;

export const getSelectTokenBalance = (assetAddress: string | undefined) => createSelector(
  selectBalancesState,
  balances => assetAddress ? balances?.tokens[assetAddress] : balances?.tezos
);

export const getSelectTokenBalanceIsEnough = (assetAddress: string | undefined, amount: BigNumber) => createSelector(
  getSelectTokenBalance(assetAddress),
  tokenBalance => tokenBalance && tokenBalance.isGreaterThanOrEqualTo(amount)
);
