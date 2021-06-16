import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezos-payments/common/dist/utils';

import { getAllAcceptedTokens } from '../services/selectors';
import { AppThunkAPI } from '../thunk';

export interface BalancesState {
  readonly tezos: number;
  readonly tokens: { [key: string]: number };
  readonly initialized: boolean;
}

const initialState: BalancesState = {
  tezos: 0,
  tokens: optimization.emptyObject,
  initialized: false
};

const namespace = 'balances';

export const loadBalances = createAsyncThunk<Pick<BalancesState, 'tezos' | 'tokens'>, string, AppThunkAPI>(
  `${namespace}/loadBalances`,
  async (address, { extra: app, getState }) => {
    const tezos = await app.services.accountsService.getTezosBalance(address);

    const acceptedTokens = getAllAcceptedTokens(getState());
    const tokens: { [key: string]: number } = {};
    acceptedTokens.forEach(async t => {
      const balance = await app.services.accountsService.getTokenBalance(address, t);
      tokens[t.contractAddress] = balance;
    });

    return { tezos, tokens };
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
      const { tezos, tokens } = action.payload;
      state.tezos = tezos;
      state.tokens = tokens;
      state.initialized = true;
    });
  }
});

export const { clearBalances } = balancesSlice.actions;
