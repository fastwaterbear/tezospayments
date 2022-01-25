import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { optimization, Token, tokenWhitelistMap } from '@tezospayments/common';

import { AppThunkAPI } from '../thunk';

export interface SwapState {
  readonly tezos: BigNumber | null;
  readonly tokens: { [key: string]: BigNumber } | null;
}

const namespace = 'swap';
const initialState: SwapState | null = null;

export const loadSwapTokens = createAsyncThunk<Pick<SwapState, 'tezos' | 'tokens'>, { amount: BigNumber, assetAddress: string | null, tokenId: number | null }, AppThunkAPI>(
  `${namespace}/loadSwapTokens`,
  async (payload, { getState, extra: app }) => {
    const balances = getState().balancesState;
    if (!balances)
      return { tezos: null, tokens: null };

    const tezos = payload.assetAddress && balances.tezos.isGreaterThan(0)
      ? await app.services.tokenSwapService.getTokenPriceInTez(payload.amount, payload.assetAddress, payload.tokenId)
      : null;

    let tokens: { [key: string]: BigNumber } | null;

    if (payload.assetAddress) {
      tokens = null;
    } else {
      const currentNetworkTokens = tokenWhitelistMap.get(app.network)?.values();
      const acceptedTokens: Token[] = currentNetworkTokens ? Array.from(currentNetworkTokens) : optimization.emptyArray;
      const tokensWithBalance = acceptedTokens.filter(t => {
        const tokenBalance = balances.tokens[t.contractAddress];
        return tokenBalance && tokenBalance.isGreaterThan(0);
      });

      const tezosPricesInTokensPromises = tokensWithBalance.map(t =>
        app.services.tokenSwapService.getTezPriceInToken(
          payload.amount,
          t.contractAddress,
          t.type === 'fa2' ? t.id : null
        ));

      const tezosPricesInTokens = await Promise.all(tezosPricesInTokensPromises);

      tokens = {};
      tezosPricesInTokens.forEach((b, i) => {
        const address = acceptedTokens[i]?.contractAddress;
        if (tokens && address && b)
          tokens[address] = b;
      });
    }

    return { tezos, tokens };
  },
);

export const swapSlice = createSlice({
  name: namespace,
  initialState: initialState as SwapState | null,
  reducers: {
    clearSwapTokens: () => null
  },
  extraReducers: builder => {
    builder.addCase(loadSwapTokens.fulfilled, (_state, action) => ({ ...action.payload }));
  }
});

export const { clearSwapTokens } = swapSlice.actions;
