import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Service, Donation, Payment, PaymentType } from '@tezospayments/common';

import { AppState } from '..';
import { NetworkDonation, NetworkPayment, PaymentInfo, PaymentStatus } from '../../models/payment';
import { clearBalances, loadBalances } from '../balances';
import { getSelectTokenBalanceIsEnough } from '../balances/selectors';
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

const canPaymentBeProcessed = (state: AppState, networkPayment: NetworkPayment) => {
  return state.currentPaymentState?.status === PaymentStatus.UserConnected
    && state.currentPaymentState.payment.type === PaymentType.Payment
    && networkPayment.amount.isGreaterThan(0)
    && getSelectTokenBalanceIsEnough(networkPayment.asset?.address, networkPayment.amount)(state);
};

const canDonationBeProcessed = (state: AppState, networkDonation: NetworkDonation) => {
  return state.currentPaymentState?.status === PaymentStatus.UserConnected
    && state.currentPaymentState.payment.type === PaymentType.Donation
    && networkDonation.amount.isGreaterThan(0)
    && getSelectTokenBalanceIsEnough(networkDonation.assetAddress, networkDonation.amount)(state);
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

    if (networkPayment.type === PaymentType.Payment && canPaymentBeProcessed(getState(), networkPayment))
      dispatch(pay(networkPayment));
    else if (networkPayment.type === PaymentType.Donation && canDonationBeProcessed(getState(), networkPayment))
      dispatch(donate(networkPayment));
  }
);

export const connectWallet = createAsyncThunk<boolean, void, AppThunkAPI>(
  `${namespace}/connectWallet`,
  async (_, { dispatch, extra: app }) => {
    dispatch(clearBalances());
    const connected = await app.services.localPaymentService.connectWallet();
    if (connected) {
      await dispatch(loadBalances());
    }

    return connected;
  },
);

export const pay = createAsyncThunk<boolean, NetworkPayment, AppThunkAPI>(
  `${namespace}/pay`,
  async (networkPayment, { extra: app }) => {
    return app.services.localPaymentService.pay(networkPayment);
  },
  {
    condition: (networkPayment, { getState }) => canPaymentBeProcessed(getState(), networkPayment),
    dispatchConditionRejection: true
  }
);

export const donate = createAsyncThunk<boolean, NetworkDonation, AppThunkAPI>(
  `${namespace}/donate`,
  async (networkDonation, { extra: app }) => {
    return app.services.localPaymentService.donate(networkDonation);
  },
  {
    condition: (networkDonation, { getState }) => canDonationBeProcessed(getState(), networkDonation),
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
              networkPayment: action.meta.arg,
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
