import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Payment } from '@tezospayments/common/dist/models/payment';
import type { Service } from '@tezospayments/common/dist/models/service';

import { PaymentInfo, PaymentStatus } from '../../models/payment';
import { UnknownApplicationError } from '../../models/system';
import { AppThunkAPI } from '../thunk';

interface CurrentPaymentState {
  readonly status: PaymentStatus;
  readonly initialPayment: Payment;
  readonly payment: Payment;
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

export const loadCurrentPayment = createAsyncThunk<PaymentInfo, void, AppThunkAPI>(
  `${namespace}/loadCurrentPay`,
  async (_, { extra: app, rejectWithValue }) => {
    const result = await app.localPaymentService.getCurrentPaymentInfo();

    return !result.isServiceError
      ? result
      : rejectWithValue({ message: result.error } as UnknownApplicationError);
  },
);

export const pay = createAsyncThunk<boolean, { updatedPayment: Payment } | void, AppThunkAPI>(
  `${namespace}/pay`,
  async (payload, { extra: app, getState, rejectWithValue }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentPaymentState = getState().currentPaymentState!;

    const result = await app.localPaymentService.pay(payload?.updatedPayment || currentPaymentState.payment);

    return !result.isServiceError
      ? result
      : rejectWithValue({ message: result.error } as UnknownApplicationError);
  },
  {
    condition: (_payload, { getState }) => {
      const currentPaymentState = getState().currentPaymentState;

      return currentPaymentState?.status === PaymentStatus.Initial;
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
          initialPayment: state.initialPayment,
          payment: state.payment,
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
          initialPayment: action.payload.payment,
          payment: action.payload.payment,
          service: action.payload.service
        };
      });

    builder
      .addCase(pay.pending, (state, action) => {
        return state
          ? {
            status: PaymentStatus.UserProcessing,
            initialPayment: state.initialPayment,
            payment: (action.meta.arg?.updatedPayment as unknown as (typeof state.payment | undefined)) ?? state.payment,
            service: state.service
          }
          : null;
      })
      .addCase(pay.fulfilled, (state, action) => {
        return state
          ? {
            status: action.payload ? PaymentStatus.Succeeded : PaymentStatus.Initial,
            initialPayment: state.initialPayment,
            payment: state.payment,
            service: state.service,
            operation: action.payload ? state.operation : undefined,
          }
          : null;
      })
      .addCase(pay.rejected, (state, _action) => {
        return state
          ? {
            status: PaymentStatus.Initial,
            initialPayment: state.initialPayment,
            payment: state.payment,
            service: state.service,
            operation: undefined
          }
          : null;
      });
  }
});

export const { confirmPayment } = currentPaymentSlice.actions;
