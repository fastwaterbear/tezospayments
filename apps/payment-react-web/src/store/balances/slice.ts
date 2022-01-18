import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { optimization, Token, tokenWhitelistMap } from '@tezospayments/common';

import { AppThunkAPI } from '../thunk';

export interface BalancesState {
  readonly tezos: BigNumber;
  readonly tokens: { [key: string]: BigNumber };
}

const namespace = 'balances';
const initialState: BalancesState | null = null;

export const loadBalances = createAsyncThunk<Pick<BalancesState, 'tezos' | 'tokens'>, void, AppThunkAPI>(
  `${namespace}/loadBalances`,
  async (_, { extra: app }) => {
    const tezos = await app.services.localPaymentService.getTezosBalance();

    const currentNetworkTokens = tokenWhitelistMap.get(app.network)?.values();
    const acceptedTokens: Token[] = currentNetworkTokens ? Array.from(currentNetworkTokens) : optimization.emptyArray;
    const tokens: { [key: string]: BigNumber } = {};
    const balancesPromises = acceptedTokens.map(t => app.services.localPaymentService.getTokenBalance(t));
    const balances = await Promise.all(balancesPromises);

    balances.forEach((b, i) => {
      const address = acceptedTokens[i]?.contractAddress;
      if (address)
        tokens[address] = b;
    });

    return { tezos, tokens };
  },
);

export const balancesSlice = createSlice({
  name: namespace,
  initialState: initialState as BalancesState | null,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadBalances.fulfilled, (_state, action) => ({ ...action.payload }));
  }
});
