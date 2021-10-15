import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletOperation } from '@taquito/taquito';
import { message } from 'antd';

import { Service, optimization, ServiceSigningKey } from '@tezospayments/common';

import { AppDispatch, AppState } from '..';
import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../accounts/selectors';
import { clearBalances, loadBalances } from '../balances/slice';
import { loadOperations } from '../operations/slice';
import { AppThunkAPI } from '../thunk';

enum OperationNotificationType { loading, success, error }

export interface PendingOperation {
  readonly hash: string;
  readonly serviceAddress: string;
  readonly action: string;
  readonly confirmationCount: number;
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
  confirmationsNumber = 2
): Promise<void> => {
  dispatch(addPendingOperation(pendingOperation));

  return new Promise<void>((resolve, reject) => {
    operation.confirmationObservable(confirmationsNumber)
      .subscribe(
        confirmation => dispatch(setOperationConfirmation({ operation: pendingOperation, confirmationCount: confirmation.currentConfirmation })),
        error => {
          dispatch(rejectOperation(pendingOperation));
          reject(error);
        },
        () => {
          dispatch(confirmOperation(pendingOperation));
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
      const operation = action.payload;
      state.pendingOperations.push(operation);
      const service = state.services.find(s => s.contractAddress === operation.serviceAddress);
      if (service)
        showOperationNotification(service, operation, OperationNotificationType.loading);
    },
    confirmOperation: (state, action: PayloadAction<PendingOperation>) => {
      const operation = action.payload;
      state.pendingOperations = state.pendingOperations.filter(o => o.hash !== operation.hash);
      const service = state.services.find(s => s.contractAddress === operation.serviceAddress);
      if (service)
        showOperationNotification(service, operation, OperationNotificationType.success);
    },
    rejectOperation: (state, action: PayloadAction<PendingOperation>) => {
      const operation = action.payload;
      state.pendingOperations = state.pendingOperations.filter(o => o.hash !== operation.hash);
      const service = state.services.find(s => s.contractAddress === operation.serviceAddress);
      if (service)
        showOperationNotification(service, operation, OperationNotificationType.error);
    },
    setOperationConfirmation: (state, action: PayloadAction<{ operation: PendingOperation, confirmationCount: number }>) => {
      const operation = state.pendingOperations.find(o => o.hash === action.payload.operation.hash);
      const confirmationCount = action.payload.confirmationCount;
      if (operation) {
        operation.confirmationCount = confirmationCount;
      }
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

const showOperationNotification = (service: Service, operation: PendingOperation, type: OperationNotificationType) => {
  //TODO it seems it is not good place for ui updates, we will refactor this with new ui
  const contentPostfix = `${operation.action.split('/').pop()} for service: ${service.name}`;
  const key = operation.hash;

  switch (type) {
    case OperationNotificationType.loading:
      message.loading({ content: `Executing operation: ${contentPostfix}`, key, duration: 0 });
      break;

    case OperationNotificationType.success:
      message.success({ content: `Finished operation: ${contentPostfix}`, key, duration: 4 });
      break;

    case OperationNotificationType.error:
      message.error({ content: `Failed operation: ${contentPostfix}`, key, duration: 4 });
      break;
  }
};

export const { addPendingOperation, confirmOperation, rejectOperation, setOperationConfirmation } = servicesSlice.actions;
