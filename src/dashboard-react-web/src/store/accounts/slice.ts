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

const namespace = 'accounts';

export const loadActiveAccount = createAsyncThunk<Account | null, void, AppThunkAPI>(
  `${namespace}/loadActiveAccount`,
  async (_, { extra: app }) => {
    const address = await app.services.accountsService.getActiveAccount();

    return address ? { address } : null;
  }
);


export const connectAccount = createAsyncThunk<Account, void, AppThunkAPI>(
  `${namespace}/connect`,
  async (_, { extra: app }) => {
    const address = await app.services.accountsService.connect();

    return {
      address
    };
  }
);

export const accountsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(connectAccount.fulfilled, (state, action) => {
      state.currentAccountAddress = action.payload.address;
      if (!state.connectedAccounts.some(a => a.address === action.payload.address))
        state.connectedAccounts.push(action.payload);
    });

    builder.addCase(loadActiveAccount.fulfilled, (state, action) => {
      const account = action.payload;
      if (account) {
        state.currentAccountAddress = account.address;
        if (!state.connectedAccounts.some(a => a.address === account.address))
          state.connectedAccounts.push(account);
      }
    });
  }
});
