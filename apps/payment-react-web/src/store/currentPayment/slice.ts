import { TransferParams } from '@quipuswap/sdk';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Service, Donation, Payment, PaymentType, tokenWhitelistMap } from '@tezospayments/common';

import { NetworkDonation, NetworkPayment, PaymentInfo, PaymentStatus } from '../../models/payment';
import { clearBalances, loadBalances } from '../balances';
import { getTokenBalanceDiff, getTokenBalanceIsEnough } from '../balances/helpers';
import { AppState } from '../index';
import { clearSwapTokens, loadSwapTokens } from '../swap';
import { selectSwapState } from '../swap/selectors';
import { AppThunkAPI } from '../thunk';

interface CurrentPaymentState {
  readonly status: PaymentStatus;
  readonly payment: Payment | Donation;
  readonly networkPayment: NetworkPayment | NetworkDonation | null;
  readonly service: Service;
  readonly operation?: OperationState;
}

interface OperationState {
  readonly hash: string;
  readonly blockHash: string | undefined;
  readonly confirmationCount: number;
}

const namespace = 'currentPayment';
const initialState: CurrentPaymentState | null = null;

const canPaymentBeProcessedDirectly = (state: AppState, networkPayment: NetworkPayment) => {
  return state.currentPaymentState?.status === PaymentStatus.UserConnected
    && state.currentPaymentState.payment.type === PaymentType.Payment
    && networkPayment.amount.isGreaterThan(0)
    && getTokenBalanceIsEnough(networkPayment.asset?.address, networkPayment.amount, state.balancesState);
};

const canPaymentBeProcessedWithSwap = (state: AppState, networkPayment: NetworkPayment, swapAsset: string) => {
  return state.currentPaymentState?.status === PaymentStatus.UserConnected
    && state.currentPaymentState.payment.type === PaymentType.Payment
    && networkPayment.amount.isGreaterThan(0)
    && !!(swapAsset === '' ? state.swapState?.tezos : state.swapState?.tokens?.[swapAsset]);
};

const canDonationBeProcessedDirectly = (state: AppState, networkDonation: NetworkDonation) => {
  return state.currentPaymentState?.status === PaymentStatus.UserConnected
    && state.currentPaymentState.payment.type === PaymentType.Donation
    && networkDonation.amount.isGreaterThan(0)
    && getTokenBalanceIsEnough(networkDonation.assetAddress, networkDonation.amount, state.balancesState);
};

export const loadCurrentPayment = createAsyncThunk<PaymentInfo, void, AppThunkAPI>(
  `${namespace}/loadCurrentPay`,
  async (_, { extra: app }) => {
    return app.services.localPaymentService.getCurrentPaymentInfo();
  },
);

export const connectWalletAndTryToPay = createAsyncThunk<void, NetworkPayment | NetworkDonation, AppThunkAPI>(
  `${namespace}/connectWalletAndTryToPay`,
  async (networkPayment, { dispatch, getState }) => {
    await dispatch(connectWallet());

    if (networkPayment.type === PaymentType.Payment && canPaymentBeProcessedDirectly(getState(), networkPayment))
      dispatch(pay({ payment: networkPayment }));
    else if (networkPayment.type === PaymentType.Donation && canDonationBeProcessedDirectly(getState(), networkPayment))
      dispatch(donate({ payment: networkPayment }));
  }
);

export const connectWallet = createAsyncThunk<boolean, void, AppThunkAPI>(
  `${namespace}/connectWallet`,
  async (_, { dispatch, getState, extra: app }) => {
    dispatch(clearBalances());
    dispatch(clearSwapTokens());
    const connected = await app.services.localPaymentService.connectWallet();
    if (connected) {
      await dispatch(loadBalances());

      const state = getState();
      const payment = state.currentPaymentState?.payment;
      if (payment && payment.type === PaymentType.Payment && !getTokenBalanceIsEnough(payment.asset?.address, payment.amount, state.balancesState)) {
        const amount = getTokenBalanceDiff(payment.asset?.address, payment.amount, state.balancesState).abs();

        await dispatch(loadSwapTokens({
          amount,
          assetAddress: payment.asset?.address || null,
          tokenId: payment.asset?.id !== undefined ? payment.asset?.id : null
        }));
      }
    }

    return connected;
  },
);

export const pay = createAsyncThunk<boolean, { payment: NetworkPayment, swapAsset?: string }, AppThunkAPI>(
  `${namespace}/pay`,
  async (payload, { extra: app, getState }) => {
    let initialTransfers: TransferParams[] | undefined = undefined;
    if (payload.swapAsset !== undefined) {
      const state = getState();
      const swapState = selectSwapState(state);
      const inputAmount = payload.swapAsset === '' ? swapState?.tezos : swapState?.tokens?.[payload.swapAsset];
      const outputAmount = getTokenBalanceDiff(payload.payment.asset?.address, payload.payment.amount, state.balancesState,).abs();

      if (inputAmount) {
        if (payload.payment.asset)
          initialTransfers = await app.services.tokenSwapService.swapTezToToken(inputAmount, outputAmount, payload.payment.asset.address, payload.payment.asset.id);
        else {
          const token = tokenWhitelistMap.get(app.network)?.get(payload.swapAsset);
          if (token)
            initialTransfers = await app.services.tokenSwapService.swapTokenToTez(inputAmount, outputAmount, token.contractAddress, token.type === 'fa1.2' ? null : token.id);
        }
      }
    }
    return app.services.localPaymentService.pay(payload.payment, initialTransfers);
  },
  {
    condition: (payload, { getState }) => {
      const state = getState();
      return canPaymentBeProcessedDirectly(state, payload.payment)
        || (payload.swapAsset !== undefined && canPaymentBeProcessedWithSwap(state, payload.payment, payload.swapAsset));
    },
    dispatchConditionRejection: true
  }
);

export const donate = createAsyncThunk<boolean, { payment: NetworkDonation, swapAsset?: string }, AppThunkAPI>(
  `${namespace}/donate`,
  async (payload, { extra: app }) => {
    return app.services.localPaymentService.donate(payload.payment);
  },
  {
    condition: (payload, { getState }) => canDonationBeProcessedDirectly(getState(), payload.payment),
    dispatchConditionRejection: true
  }
);

export const currentPaymentSlice = createSlice({
  name: namespace,
  initialState: (initialState as CurrentPaymentState | null),
  reducers: {
    confirmPayment: (state, action: PayloadAction<OperationState>) => {
      return state
        ? {
          status: PaymentStatus.NetworkProcessing,
          payment: state.payment,
          networkPayment: state.networkPayment,
          service: state.service,
          operation: action.payload,
        }
        : null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCurrentPayment.fulfilled, (_state, action) => {
        return {
          status: PaymentStatus.Initial,
          payment: action.payload.payment,
          networkPayment: null,
          service: action.payload.service
        };
      })
      .addCase(connectWallet.pending, state => {
        if (state)
          state.status = PaymentStatus.UserConnecting;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        if (state)
          state.status = action.payload ? PaymentStatus.UserConnected : PaymentStatus.Initial;
      })
      .addCase(connectWallet.rejected, state => {
        if (state)
          state.status = PaymentStatus.Initial;
      });

    for (const action of [pay, donate]) {
      builder
        .addCase(action.pending, (state, action) => {
          return state
            ? {
              status: PaymentStatus.UserProcessing,
              payment: state.payment,
              networkPayment: action.meta.arg.payment,
              service: state.service
            }
            : null;
        })
        .addCase(action.fulfilled, (state, action) => {
          return state
            ? {
              status: action.payload ? PaymentStatus.Succeeded : PaymentStatus.UserConnected,
              payment: state.payment,
              networkPayment: state.networkPayment,
              service: state.service,
              operation: action.payload ? state.operation : undefined,
            }
            : null;
        })
        .addCase(action.rejected, (state, _action) => {
          return state
            ? {
              status: PaymentStatus.UserConnected,
              payment: state.payment,
              networkPayment: state.networkPayment,
              service: state.service,
              operation: undefined
            }
            : null;
        });
    }
  }
});

export const { confirmPayment } = currentPaymentSlice.actions;
