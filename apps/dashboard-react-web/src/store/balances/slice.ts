import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { optimization } from '@tezospayments/common';

import { Account } from '../../models/blockchain';
import { selectAllAcceptedTokens } from '../services/selectors';
import { AppThunkAPI } from '../thunk';

export interface BalancesState {
  readonly tezos: BigNumber;
  readonly tokens: { [key: string]: BigNumber };
  readonly initialized: boolean;
}

const initialState: BalancesState = {
  tezos: optimization.zeroBigNumber,
  tokens: optimization.emptyObject,
  initialized: false
};

const namespace = 'balances';

export const loadBalances = createAsyncThunk<Pick<BalancesState, 'tezos' | 'tokens'>, Account, AppThunkAPI>(
  `${namespace}/loadBalances`,
  async (account, { extra: app, getState }) => {
    const tezos = await app.services.accountsService.getTezosBalance(account);

    const acceptedTokens = selectAllAcceptedTokens(getState());
    const tokens: { [key: string]: BigNumber } = {};
    const balancesPromises = acceptedTokens.map(t => app.services.accountsService.getTokenBalance(account, t));
    const balances = await Promise.all(balancesPromises);

    balances.forEach((b, i) => {
      const address = acceptedTokens[i]?.contractAddress;
      if (address) {
        tokens[address] = b;
      }
    });

    return { tezos, tokens };
  }
);

export const balancesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearBalances: state => {
      state.tezos = optimization.zeroBigNumber;
      state.tokens = optimization.emptyObject;
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
