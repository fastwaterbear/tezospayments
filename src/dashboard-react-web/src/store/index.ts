import { combineReducers, EnhancedStore } from '@reduxjs/toolkit';

import { accountsSlice } from './accounts/slice';
import { balancesSlice } from './balances/slice';
import { operationsSlice } from './operations/slice';
import { servicesSlice } from './services/slice';
import { AppThunkDispatch } from './thunk';

export const appReducer = combineReducers({
  accountsState: accountsSlice.reducer,
  servicesState: servicesSlice.reducer,
  balancesState: balancesSlice.reducer,
  operationsState: operationsSlice.reducer,
});

export type AppStore = EnhancedStore<AppState>;
export type AppState = ReturnType<typeof appReducer>;
export type AppDispatch = AppThunkDispatch & AppStore['dispatch'];
