import { NetworkType } from '@airgap/beacon-sdk';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezospayments/common/dist/utils';

import type { Account } from '../../models/blockchain';
import { clearServices, loadServices } from '../services/slice';
import { AppThunkAPI } from '../thunk';

export interface AccountsState {
  readonly currentAccountAddress: string | null;
  readonly connectedAccounts: readonly Account[];
  readonly initialized: boolean;
}

const initialState: AccountsState = {
  currentAccountAddress: null,
  connectedAccounts: optimization.emptyArray,
  initialized: false
};

const namespace = 'accounts';

export const loadActiveAccount = createAsyncThunk<Account | null, void, AppThunkAPI>(
  `${namespace}/loadActiveAccount`,
  async (_, { extra: app, dispatch }) => {
    const address = await app.services.accountsService.getActiveAccount();

    if (address) {
      dispatch(loadServices(address));
    }

    return address ? { address } : null;
  }
);

export const connectAccount = createAsyncThunk<Account | null, NetworkType, AppThunkAPI>(
  `${namespace}/connect`,
  async (networkType: NetworkType, { extra: app, dispatch }) => {
    const address = await app.services.accountsService.connect(networkType);

    if (address) {
      dispatch(loadServices(address));
    }

    return address ? { address } : null;
  }
);

export const disconnectAccount = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/disconnect`,
  async (_, { extra: app, dispatch }) => {
    const result = await app.services.accountsService.disconnect();
    dispatch(clearServices());

    return result;
  }
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
        state.currentAccountAddress = account.address;
        if (!state.connectedAccounts.some(a => a.address === account.address))
          state.connectedAccounts.push(account);
      }
      state.initialized = true;
    });

    builder.addCase(connectAccount.fulfilled, (state, action) => {
      const account = action.payload;
      if (account) {
        state.currentAccountAddress = account.address;
        if (!state.connectedAccounts.some(a => a.address === account.address))
          state.connectedAccounts.push(account);
      }
    });

    builder.addCase(disconnectAccount.fulfilled, state => {
      state.connectedAccounts = state.connectedAccounts.filter(a => a.address !== state.currentAccountAddress);
      state.currentAccountAddress = state.connectedAccounts[0] ? state.connectedAccounts[0].address : null;
    });
  }
});
