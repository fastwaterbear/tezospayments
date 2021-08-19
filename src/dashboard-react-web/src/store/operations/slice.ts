import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { networks, ServiceOperation, optimization } from '@tezospayments/common';

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

export const loadOperations = createAsyncThunk<ServiceOperation[], string[], AppThunkAPI>(
  `${namespace}/loadOperations`,
  async (contracts, { extra: app }) => {
    const operationsPromises = contracts.map(c => app.services.servicesService.getOperations(networks.edo2net, c));
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
