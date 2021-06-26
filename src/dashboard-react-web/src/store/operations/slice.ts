import { NetworkType } from '@airgap/beacon-sdk';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ServiceOperation } from '@tezos-payments/common/dist/models/service';
import { optimization } from '@tezos-payments/common/dist/utils';

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
    const operationsPromises = contracts.map(c => app.services.servicesService.getOperations(NetworkType.EDONET, c));
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
