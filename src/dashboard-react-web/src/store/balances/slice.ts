import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppThunkAPI } from '../thunk';

export interface BalancesState {
  readonly tezos: number;
}

const initialState: BalancesState = {
  tezos: 0
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
    }
  },
  extraReducers: builder => {
    builder.addCase(loadBalances.fulfilled, (state, action) => {
      state.tezos = action.payload;
    });
  }
});

export const { clearBalances } = balancesSlice.actions;
