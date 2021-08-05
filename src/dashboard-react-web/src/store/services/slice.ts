import { CombinedState, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TransactionWalletOperation } from '@taquito/taquito';

import { networks } from '@tezospayments/common/dist/models/blockchain';
import { Service } from '@tezospayments/common/dist/models/service';
import { optimization } from '@tezospayments/common/dist/utils';

import { AppDispatch } from '..';
import { AccountsState } from '../accounts/slice';
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
    const services = await app.services.servicesService.getServices(networks.edo2net, address);

    if (services.length) {
      dispatch(loadBalances(address));
      dispatch(loadOperations(services.map(s => s.contractAddress)));
    }

    return services;
  }
);

export const updateService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/updateService`,
  async (service, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.updateService(service);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => getWaitOperationCallback(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  }
);

export const createService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/createService`,
  async (service, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.createService(service);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => getWaitOperationCallback(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const setPaused = createAsyncThunk<void, { contractAddress: string, paused: boolean }, AppThunkAPI>(
  `${namespace}/setPaused`,
  async ({ contractAddress, paused: isPaused }, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.setPaused(contractAddress, isPaused);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => getWaitOperationCallback(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const setDeleted = createAsyncThunk<void, { contractAddress: string, deleted: boolean }, AppThunkAPI>(
  `${namespace}/setDeleted`,
  async ({ contractAddress, deleted }, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.setDeleted(contractAddress, deleted);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => getWaitOperationCallback(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const clearServices = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/clearServices`,
  async (_, { dispatch }) => {
    dispatch(clearBalances());
  }
);

const getWaitOperationCallback = (dispatch: AppDispatch, getState: () => CombinedState<{ accountsState: AccountsState }>) => {
  const accountAddress = getState().accountsState.currentAccountAddress;
  if (accountAddress) {
    dispatch(loadServices(accountAddress));
  }
};

const setOperation = createAsyncThunk<void, { operation: TransactionWalletOperation, callback: () => void }, AppThunkAPI>(
  `${namespace}/setOperation`,
  async ({ operation, callback }) => {
    const promise = new Promise<void>((resolve, reject) => {
      operation.confirmationObservable(1)
        .subscribe(undefined, reject, resolve);
    });

    await promise;
    callback();
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

    for (const action of [createService, updateService, setPaused, setDeleted]) {
      builder.addCase(action.pending, state => {
        state.initialized = false;
      });
      builder.addCase(action.rejected, state => {
        state.initialized = true;
      });
    }
  }
});
