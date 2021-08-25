import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TransactionWalletOperation } from '@taquito/taquito';

import { Service, optimization, ServiceSigningKey } from '@tezospayments/common';

import { AppDispatch, AppState } from '..';
import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../accounts/selectors';
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

export const loadServices = createAsyncThunk<Service[], Account, AppThunkAPI>(
  `${namespace}/loadServices`,
  async (account, { extra: app, dispatch }) => {
    const services = await app.services.servicesService.getServices(account);

    if (services.length) {
      dispatch(loadBalances(account));
      dispatch(loadOperations({ servicesAddresses: services.map(s => s.contractAddress), network: account.network }));
    }

    return services;
  }
);

export const updateService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/updateService`,
  async (service, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.updateService(service);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => reloadServices(dispatch, getState) }));
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
      dispatch(setOperation({ operation, callback: () => reloadServices(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const setPaused = createAsyncThunk<void, { service: Service, paused: boolean }, AppThunkAPI>(
  `${namespace}/setPaused`,
  async ({ service, paused: isPaused }, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.setPaused(service, isPaused);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => reloadServices(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const setDeleted = createAsyncThunk<void, { service: Service, deleted: boolean }, AppThunkAPI>(
  `${namespace}/setDeleted`,
  async ({ service, deleted }, { extra: app, dispatch, getState, rejectWithValue }) => {
    const operation = await app.services.servicesService.setDeleted(service, deleted);

    if (operation) {
      dispatch(setOperation({ operation, callback: () => reloadServices(dispatch, getState) }));
    } else {
      return rejectWithValue(null);
    }
  },
);

export const addApiKey = createAsyncThunk<void, { service: Service, signingKey: ServiceSigningKey }, AppThunkAPI>(
  `${namespace}/addApiKey`,
  async ({ service, signingKey }, { extra: app, dispatch, getState }) => {
    await app.services.servicesService.addApiKey(service, signingKey);
    reloadServices(dispatch, getState);
  },
);

export const deleteApiKey = createAsyncThunk<void, { service: Service, publicKey: string }, AppThunkAPI>(
  `${namespace}/deleteApiKey`,
  async ({ service, publicKey }, { extra: app, dispatch, getState }) => {
    await app.services.servicesService.deleteApiKey(service, publicKey);
    reloadServices(dispatch, getState);
  },
);

export const clearServices = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/clearServices`,
  async (_, { dispatch }) => {
    dispatch(clearBalances());
  }
);

const reloadServices = (dispatch: AppDispatch, getState: () => AppState) => {
  const account = getCurrentAccount(getState());
  if (account) {
    dispatch(loadServices(account));
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

    for (const action of [createService, updateService, setPaused, setDeleted, addApiKey, deleteApiKey]) {
      builder.addCase(action.pending, state => {
        state.initialized = false;
      });
      builder.addCase(action.rejected, state => {
        state.initialized = true;
      });
    }
  }
});
