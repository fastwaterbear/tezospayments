import { createSelector } from '@reduxjs/toolkit';

import { optimization, Token, tokenWhitelistMap } from '@tezospayments/common';

import { PaymentStatus } from '../../models/payment';
import type { AppState } from '../index';

export const selectPaymentState = (state: AppState) => state.currentPaymentState;

export const selectTokensState = createSelector(
  selectPaymentState,
  paymentState => {
    const network = paymentState?.service?.network;
    return (network && tokenWhitelistMap.get(network)) || optimization.emptyMap as Map<string, Token>;
  }
);

export const selectPaymentStatus = createSelector(selectPaymentState, paymentState => paymentState?.status);

export const selectUserConnected = createSelector(
  selectPaymentStatus,
  status => status !== PaymentStatus.Initial && status !== PaymentStatus.UserConnecting
);
