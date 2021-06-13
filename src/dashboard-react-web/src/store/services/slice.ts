import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezos-payments/common/dist/utils';

import type { Service } from '../../models/blockchain';
import { AppThunkAPI } from '../thunk';

export interface ServicesState {
  readonly services: readonly Service[];
}

const initialState: ServicesState = {
  services: optimization.emptyArray
};

const namespace = 'services';

export const loadServices = createAsyncThunk<Service[], void, AppThunkAPI>(
  `${namespace}/loadServices`,
  async (_, { extra: app }) => {
    return await app.services.servicesService.getServices();
  }
);

export const servicesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearServices: state => {
      state.services = optimization.emptyArray;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadServices.fulfilled, (state, action) => {
      state.services = action.payload;
    });
  }
});

export const { clearServices } = servicesSlice.actions;
