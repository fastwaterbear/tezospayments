import { createSelector } from '@reduxjs/toolkit';

import { optimization, Token, tokenWhitelistMap } from '@tezospayments/common';

import { AppState } from '..';

export const selectPaymentState = (state: AppState) => state.currentPaymentState;

export const selectTokensState = createSelector(
  selectPaymentState,
  paymentState => {
    const network = paymentState?.service?.network;
    return (network && tokenWhitelistMap.get(network)) || optimization.emptyMap as Map<string, Token>;
  }
);
