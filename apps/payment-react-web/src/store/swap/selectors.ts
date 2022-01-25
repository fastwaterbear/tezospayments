import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '..';

export const selectSwapState = (state: AppState) => state.swapState;

export const selectCanSwap = createSelector(
  selectSwapState,
  swap => !!swap && !!(swap.tezos || (swap.tokens && Object.keys(swap.tokens).length))
);
