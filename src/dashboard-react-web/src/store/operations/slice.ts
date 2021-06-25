import { NetworkType } from '@airgap/beacon-sdk';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { optimization } from '@tezos-payments/common/dist/utils';

import { Operation } from '../../models/blockchain';
import { AppThunkAPI } from '../thunk';

export interface OperationsState {
  readonly operations: Operation[];
  readonly initialized: boolean;
}

const initialState: OperationsState = {
  operations: optimization.emptyArray,
  initialized: false
};

const namespace = 'operations';

export const loadOperations = createAsyncThunk<Operation[], string[], AppThunkAPI>(
  `${namespace}/loadOperations`,
  async (contracts, { extra: app }) => {
    const operations: Operation[] = [];

    const operationsPromises = contracts.map(c => app.services.servicesService.getOperations(NetworkType.EDONET, c));
    const operationsArray = await Promise.all(operationsPromises);

    operationsArray.forEach(o => operations.push(...o));

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
