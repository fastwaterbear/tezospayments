import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletOperation } from '@taquito/taquito';

import { Service, optimization, ServiceSigningKey, wait } from '@tezospayments/common';

import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../accounts/selectors';
import { AppDispatch, AppState } from '../index';
import { clearOperations, loadOperations } from '../operations/slice';
import { AppThunkAPI } from '../thunk';

export enum PendingOperationStatus { loading, success, error }

export interface PendingOperation {
  readonly hash: string;
  readonly serviceAddress: string;
  readonly action: string;
  readonly confirmationCount: number;
  readonly targetConfirmationCount: number;
  readonly status: PendingOperationStatus;
}

export interface ServicesState {
  readonly services: readonly Service[];
  readonly initialized: boolean;
  readonly pendingOperations: PendingOperation[];
}

const initialState: ServicesState = {
  services: optimization.emptyArray,
  initialized: false,
  pendingOperations: optimization.emptyArray
};

const namespace = 'services';

export const loadServices = createAsyncThunk<readonly Service[], Account, AppThunkAPI>(
  `${namespace}/loadServices`,
  async (account, { extra: app, dispatch }) => {
    const services = await app.services.servicesService.getServices(account);

    if (services.length) {
      dispatch(loadOperations({ servicesAddresses: services.map(s => s.contractAddress), network: account.network }));
    }

    return services;
  }
);

export const updateService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/updateService`,
  async (service, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.updateService(service);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, 'updating');
    reloadServices(dispatch, getState);
  }
);

export const createService = createAsyncThunk<void, Service, AppThunkAPI>(
  `${namespace}/createService`,
  async (service, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.createService(service);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, 'creating new service');
    reloadServices(dispatch, getState);
  }
);

export const setPaused = createAsyncThunk<void, { service: Service, paused: boolean }, AppThunkAPI>(
  `${namespace}/setPaused`,
  async ({ service, paused }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.setPaused(service, paused);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, paused ? 'pausing' : 'unpausing');
    reloadServices(dispatch, getState);
  }
);

export const setDeleted = createAsyncThunk<void, { service: Service, deleted: boolean }, AppThunkAPI>(
  `${namespace}/setDeleted`,
  async ({ service, deleted }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.setDeleted(service, deleted);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, deleted ? 'deleting' : 'undeleting');
    reloadServices(dispatch, getState);
  }
);

export const addApiKey = createAsyncThunk<void, { service: Service, signingKey: ServiceSigningKey }, AppThunkAPI>(
  `${namespace}/addApiKey`,
  async ({ service, signingKey }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.addApiKey(service, signingKey);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, 'adding API key');
    reloadServices(dispatch, getState);
  }
);

export const deleteApiKey = createAsyncThunk<void, { service: Service, publicKey: string }, AppThunkAPI>(
  `${namespace}/deleteApiKey`,
  async ({ service, publicKey }, { extra: app, dispatch, getState }) => {
    const operation = await app.services.servicesService.deleteApiKey(service, publicKey);
    await waitOperationConfirmation(dispatch, operation, service.contractAddress, 'deleting API key');
    reloadServices(dispatch, getState);
  }
);

export const clearServices = createAsyncThunk<void, void, AppThunkAPI>(
  `${namespace}/clearServices`,
  async (_, { dispatch }) => {
    dispatch(clearOperations());
  }
);

const createPendingOperation = (hash: string, serviceAddress: string, action: string, targetConfirmationCount: number): PendingOperation => ({
  hash,
  action,
  serviceAddress,
  targetConfirmationCount,
  confirmationCount: 0,
  status: PendingOperationStatus.loading,
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
  serviceAddress: string,
  operationName: string,
  confirmationsNumber = 2
): Promise<void> => {
  const pendingOperation = createPendingOperation(operation.opHash, serviceAddress, operationName, confirmationsNumber);
  dispatch(addPendingOperation(pendingOperation));

  return new Promise<void>((resolve, reject) => {
    operation.confirmationObservable(confirmationsNumber)
      .subscribe(
        confirmation => dispatch(setPendingOperationConfirmationCount(
          { hash: pendingOperation.hash, confirmationCount: confirmation.currentConfirmation })
        ),
        async error => {
          dispatch(setPendingOperationStatus({ hash: pendingOperation.hash, status: PendingOperationStatus.error }));
          reject(error);
          await wait(1000);
          dispatch(deletePendingOperation(pendingOperation.hash));
        },
        async () => {
          dispatch(setPendingOperationStatus({ hash: pendingOperation.hash, status: PendingOperationStatus.success }));
          resolve();
          await wait(1000);
          dispatch(deletePendingOperation(pendingOperation.hash));
        }
      );
  });
};

export const servicesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    addPendingOperation: (state, action: PayloadAction<PendingOperation>) => {
      const operation = action.payload;
      state.pendingOperations.push(operation);
    },
    setPendingOperationStatus: (state, action: PayloadAction<{ hash: string, status: PendingOperationStatus }>) => {
      const operation = state.pendingOperations.find(o => o.hash === action.payload.hash);
      if (operation)
        operation.status = action.payload.status;
    },
    setPendingOperationConfirmationCount: (state, action: PayloadAction<{ hash: string, confirmationCount: number }>) => {
      const operation = state.pendingOperations.find(o => o.hash === action.payload.hash);
      if (operation)
        operation.confirmationCount = action.payload.confirmationCount;
    },
    deletePendingOperation: (state, action: PayloadAction<string>) => {
      state.pendingOperations = state.pendingOperations.filter(o => o.hash !== action.payload);
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

export const { addPendingOperation, setPendingOperationStatus, setPendingOperationConfirmationCount, deletePendingOperation } = servicesSlice.actions;
