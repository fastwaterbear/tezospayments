import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Service, Donation, Payment, PaymentType } from '@tezospayments/common';

import { NetworkDonation, NetworkPayment, PaymentInfo, PaymentStatus } from '../../models/payment';
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
const checkSendPaymentCondition = (
  currentPaymentState: CurrentPaymentState | null
): currentPaymentState is CurrentPaymentState & { readonly status: PaymentStatus.Initial } => {
  return currentPaymentState?.status === PaymentStatus.Initial;
};

export const loadCurrentPayment = createAsyncThunk<PaymentInfo, void, AppThunkAPI>(
  `${namespace}/loadCurrentPay`,
  async (_, { extra: app }) => {
    return app.services.localPaymentService.getCurrentPaymentInfo();
  },
);

export const pay = createAsyncThunk<boolean, NetworkPayment, AppThunkAPI>(
  `${namespace}/pay`,
  async (networkPayment, { extra: app }) => {
    return app.services.localPaymentService.pay(networkPayment);
  },
  {
    condition: (_payload, { getState }) => {
      const currentPaymentState = getState().currentPaymentState;

      return checkSendPaymentCondition(currentPaymentState) && currentPaymentState.payment.type === PaymentType.Payment;
    },
    dispatchConditionRejection: true
  }
);

export const donate = createAsyncThunk<boolean, NetworkDonation, AppThunkAPI>(
  `${namespace}/donate`,
  async (networkDonation, { extra: app }) => {
    return app.services.localPaymentService.donate(networkDonation);
  },
  {
    condition: (_payload, { getState }) => {
      const currentPaymentState = getState().currentPaymentState;

      return checkSendPaymentCondition(currentPaymentState) && currentPaymentState.payment.type === PaymentType.Donation;
    },
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
              status: action.payload ? PaymentStatus.Succeeded : PaymentStatus.Initial,
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
              status: PaymentStatus.Initial,
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
