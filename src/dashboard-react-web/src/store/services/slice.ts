import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezos-payments/common/dist/utils';

import type { Service } from '../../models/blockchain';
import { clearBalances, loadBalances } from '../balances/slice';
import { AppThunkAPI } from '../thunk';

export interface ServicesState {
  readonly services: readonly Service[];
  readonly initialized: boolean;
}

const initialState: ServicesState = {
  services: optimization.emptyArray,
  initialized: false
};

const namespace = 'services';

export const loadServices = createAsyncThunk<Service[], string, AppThunkAPI>(
  `${namespace}/loadServices`,
  async (address, { extra: app, dispatch }) => {
    const result = await app.services.servicesService.getServices();

    if (result.length) {
      dispatch(loadBalances(address));
    }

    return result;
  }
);

export const clearServices = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/clearServices`,
  async (_, { dispatch }) => {
    dispatch(clearBalances());
  }
);

export const servicesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(loadServices.fulfilled, (state, action) => {
      state.services = action.payload;
      state.initialized = true;
    });
    builder.addCase(clearServices.fulfilled, state => {
      state.services = optimization.emptyArray;
      state.initialized = false;
    });
  }
});
