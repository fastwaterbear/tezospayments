import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppThunkAPI } from '../thunk';

export interface BalancesState {
  readonly tezos: number;
  readonly initialized: boolean;
}

const initialState: BalancesState = {
  tezos: 0,
  initialized: false
};

const namespace = 'balances';

export const loadBalances = createAsyncThunk<number, string, AppThunkAPI>(
  `${namespace}/loadBalances`,
  async (address, { extra: app, }) => {
    return await app.services.accountsService.getTezosBalance(address);
  }
);

export const balancesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearBalances: state => {
      state.tezos = 0;
      state.initialized = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadBalances.fulfilled, (state, action) => {
      state.tezos = action.payload;
      state.initialized = true;
    });
  }
});

export const { clearBalances } = balancesSlice.actions;
