import BigNumber from 'bignumber.js';

import { BalancesState } from './slice';

export const getTokenBalance = (assetAddress: string | undefined, balances: BalancesState | null) => {
  return assetAddress ? balances?.tokens[assetAddress] : balances?.tezos;
};

const zeroAmount = new BigNumber(0);
export const getTokenBalanceDiff = (assetAddress: string | undefined, amount: BigNumber, balances: BalancesState | null) => {
  const tokenBalance = getTokenBalance(assetAddress, balances);
  return (tokenBalance || zeroAmount).minus(amount);
};

export const getTokenBalanceIsEnough = (assetAddress: string | undefined, amount: BigNumber, balances: BalancesState | null) => {
  const diff = getTokenBalanceDiff(assetAddress, amount, balances);
  return diff.isGreaterThanOrEqualTo(0);
};
