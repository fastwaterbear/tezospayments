import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezos-payments/common/dist/utils';

import type { Account } from '../../models/blockchain';
import { AppThunkAPI } from '../thunk';

export interface AccountsState {
  readonly currentAccountAddress: string | null;
  readonly connectedAccounts: readonly Account[];
}

const initialState: AccountsState = {
  currentAccountAddress: null,
  connectedAccounts: optimization.emptyArray
};

export const connectAccount = createAsyncThunk<Account, void, AppThunkAPI>(
  'accounts/connect',
  async (_, { extra: app }) => {
    const address = await app.services.accountsService.connect();

    return {
      address
    };
  }
);

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(connectAccount.fulfilled, (state, action) => {
      state.currentAccountAddress = action.payload.address;
      if (!state.connectedAccounts.some(account => account.address === action.payload.address))
        state.connectedAccounts.push(action.payload);
    });
  }
});
