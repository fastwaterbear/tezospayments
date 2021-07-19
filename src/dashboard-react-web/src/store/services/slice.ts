import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { networks } from '@tezospayments/common/dist/models/blockchain';
import { Service } from '@tezospayments/common/dist/models/service';
import { optimization } from '@tezospayments/common/dist/utils';

import { clearBalances, loadBalances } from '../balances/slice';
import { loadOperations } from '../operations/slice';
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
    const services = await app.services.servicesService.getServices(networks.edo2net);

    if (services.length) {
      dispatch(loadBalances(address));
      dispatch(loadOperations(services.map(s => s.contractAddress)));
    }

    return services;
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
      (state.services as Service[]) = action.payload;
      state.initialized = true;
    });
    builder.addCase(clearServices.fulfilled, state => {
      state.services = optimization.emptyArray;
      state.initialized = false;
    });
  }
});
