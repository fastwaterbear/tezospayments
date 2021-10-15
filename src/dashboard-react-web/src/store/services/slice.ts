import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletOperation } from '@taquito/taquito';

import { Service, optimization, ServiceSigningKey } from '@tezospayments/common';

import { AppDispatch, AppState } from '..';
import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../accounts/selectors';
import { clearBalances, loadBalances } from '../balances/slice';
import { loadOperations } from '../operations/slice';
import { AppThunkAPI } from '../thunk';

export interface PendingOperation {
  readonly hash: string;
  readonly serviceAddress: string;
  readonly action: string;
  readonly confirmationCount: number;
}

export interface ServicesState {
  readonly services: readonly Service[];
  readonly initialized: boolean;
  readonly pendingOperation: PendingOperation | null;
}

const initialState: ServicesState = {
  services: optimization.emptyArray,
  initialized: false,
  pendingOperation: null
};

const namespace = 'services';

export const loadServices = createAsyncThunk<readonly Service[], Account, AppThunkAPI>(
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
  async (service, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.updateService(service);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, updateService.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const createService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/createService`,
  async (service, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.createService(service);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, createService.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const setPaused = createAsyncThunk<void, { service: Service, paused: boolean }, AppThunkAPI>(
  `${namespace}/setPaused`,
  async ({ service, paused: isPaused }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.setPaused(service, isPaused);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, setPaused.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const setDeleted = createAsyncThunk<void, { service: Service, deleted: boolean }, AppThunkAPI>(
  `${namespace}/setDeleted`,
  async ({ service, deleted }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.setDeleted(service, deleted);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, setDeleted.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const addApiKey = createAsyncThunk<void, { service: Service, signingKey: ServiceSigningKey }, AppThunkAPI>(
  `${namespace}/addApiKey`,
  async ({ service, signingKey }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.addApiKey(service, signingKey);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, addApiKey.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const deleteApiKey = createAsyncThunk<void, { service: Service, publicKey: string }, AppThunkAPI>(
  `${namespace}/deleteApiKey`,
  async ({ service, publicKey }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.deleteApiKey(service, publicKey);
    await waitOperationConfirmation(
      dispatch,
      operation,
      createPendingOperation(operation.opHash, service.contractAddress, deleteApiKey.typePrefix)
    );
    reloadServices(dispatch, getState);
  }
);

export const clearServices = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/clearServices`,
  async (_, { dispatch }) => {
    dispatch(clearBalances());
  }
);

const createPendingOperation = (hash: string, serviceAddress: string, action: string): PendingOperation => ({
  hash, serviceAddress, action,
  confirmationCount: 0,
});

const reloadServices = (dispatch: AppDispatch, getState: () => AppState) => {
  const account = getCurrentAccount(getState());
  if (account) {
    dispatch(loadServices(account));
  }
};

const waitOperationConfirmation = (
  dispatch: AppDispatch,
  operation: WalletOperation,
  pendingOperation: PendingOperation,
  confirmationsNumber = 1
): Promise<void> => {
  dispatch(addPendingOperation(pendingOperation));

  return new Promise<void>((resolve, reject) => {
    operation.confirmationObservable(confirmationsNumber)
      .subscribe(
        confirmation => dispatch(setOperationConfirmation({ opHash: operation.opHash, confirmationCount: confirmation.currentConfirmation })),
        error => {
          dispatch(rejectOperation(pendingOperation.hash));
          reject(error);
        },
        () => {
          dispatch(confirmOperation(pendingOperation.hash));
          resolve();
        }
      );
  });
};

export const servicesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    addPendingOperation: (state, action: PayloadAction<PendingOperation>) => {
      state.pendingOperation = action.payload;
      state.initialized = false;
    },
    confirmOperation: (state, action: PayloadAction<string>) => {
      if (state.pendingOperation?.hash === action.payload)
        state.pendingOperation = null;
    },
    rejectOperation: (state, action: PayloadAction<string>) => {
      state.initialized = true;
      if (state.pendingOperation?.hash === action.payload)
        state.pendingOperation = null;
    },
    setOperationConfirmation: (state, action: PayloadAction<{ opHash: string, confirmationCount: number }>) => {
      if (state.pendingOperation)
        state.pendingOperation.confirmationCount = action.payload.confirmationCount;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadServices.fulfilled, (state, action) => ({
      ...state,
      services: action.payload,
      initialized: true
    }));

    builder.addCase(clearServices.fulfilled, state => ({
      ...state,
      services: optimization.emptyArray,
      initialized: false
    }));
  }
});

export const { addPendingOperation, confirmOperation, rejectOperation, setOperationConfirmation } = servicesSlice.actions;
