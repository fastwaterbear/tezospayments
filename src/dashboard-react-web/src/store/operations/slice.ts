import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ServiceOperation, Network, optimization } from '@tezospayments/common';

import { AppThunkAPI } from '../thunk';

export interface OperationsState {
  readonly operations: readonly ServiceOperation[];
  readonly initialized: boolean;
}

const initialState: OperationsState = {
  operations: optimization.emptyArray,
  initialized: false
};

const namespace = 'operations';

export const loadOperations = createAsyncThunk<ServiceOperation[], { servicesAddresses: string[], network: Network }, AppThunkAPI>(
  `${namespace}/loadOperations`,
  async ({ servicesAddresses, network }, { extra: app }) => {
    const operationsPromises = servicesAddresses.map(s => app.services.servicesService.getOperations(network, s));
    const operations = (await Promise.all(operationsPromises)).flat();

    return operations;
  }
);

export const operationsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearOperations: state => {
      state.operations = optimization.emptyArray;
      state.initialized = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadOperations.fulfilled, (state, action) => {
      state.operations = action.payload;
      state.initialized = true;
    });
  }
});

export const { clearOperations } = operationsSlice.actions;
