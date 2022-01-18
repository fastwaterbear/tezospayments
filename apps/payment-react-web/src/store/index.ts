import { combineReducers, EnhancedStore } from '@reduxjs/toolkit';

import { applicationErrorReducer } from './applicationError';
import { balancesSlice } from './balances';
import { currentPaymentSlice } from './currentPayment';
import { AppThunkDispatch } from './thunk';

export const appReducer = combineReducers({
  currentPaymentState: currentPaymentSlice.reducer,
  balancesState: balancesSlice.reducer,
  applicationError: applicationErrorReducer
});

export type AppState = ReturnType<typeof appReducer>;
export type AppStore = EnhancedStore<AppState>;
export type AppDispatch = AppThunkDispatch & AppStore['dispatch'];
