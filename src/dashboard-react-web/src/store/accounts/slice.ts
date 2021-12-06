import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization, Network } from '@tezospayments/common';

import type { Account, CurrentAccountInfo } from '../../models/blockchain';
import { AppThunkAPI } from '../thunk';

export interface AccountsState {
  readonly currentAccount: CurrentAccountInfo | null;
  readonly connectedAccounts: readonly Account[];
  readonly initialized: boolean;
}

const initialState: AccountsState = {
  currentAccount: null,
  connectedAccounts: optimization.emptyArray,
  initialized: false
};

const namespace = 'accounts';

export const loadActiveAccount = createAsyncThunk<Account | null, void, AppThunkAPI>(
  `${namespace}/loadActiveAccount`,
  async (_, { extra: app }) => {
    const account = await app.services.accountsService.getActiveAccount();

    return account || null;
  }
);

export const connectAccount = createAsyncThunk<Account | null, Network, AppThunkAPI>(
  `${namespace}/connect`,
  (network: Network, { extra: app }) => app.services.accountsService.connect(network)
);

export const disconnectAccount = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/disconnect`,
  (_, { extra: app }) => app.services.accountsService.disconnect()
);

export const accountsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(loadActiveAccount.fulfilled, (state, action) => {
      const account = action.payload;
      if (account) {
        state.currentAccount = {
          address: account.address,
          network: account.network
        };

        if (!state.connectedAccounts.some(a => a.address === account.address)) {
          state.connectedAccounts.push(account);
        }
      }
      state.initialized = true;
    });

    builder.addCase(connectAccount.fulfilled, (state, action) => {
      const account = action.payload;
      if (account) {
        state.currentAccount = {
          address: account.address,
          network: account.network
        };

        if (!state.connectedAccounts.some(a => a.address === account.address)) {
          state.connectedAccounts.push(account);
        }
      }
    });

    builder.addCase(disconnectAccount.fulfilled, state => {
      state.connectedAccounts = state.connectedAccounts.filter(a =>
        a.address !== state.currentAccount?.address || a.network.id !== state.currentAccount?.network.id
      );

      const nextAccount = state.connectedAccounts[0];
      state.currentAccount = nextAccount ? { address: nextAccount.address, network: nextAccount.network } : null;
    });
  }
});
