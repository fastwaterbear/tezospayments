import { combineReducers, EnhancedStore } from '@reduxjs/toolkit';

import { applicationErrorReducer } from './applicationError';
import { currentPaymentSlice } from './currentPayment';
import { AppThunkDispatch } from './thunk';

export const appReducer = combineReducers({
  currentPaymentState: currentPaymentSlice.reducer,
  applicationError: applicationErrorReducer
});

export type AppState = ReturnType<typeof appReducer>;
export type AppStore = EnhancedStore<AppState>;
export type AppDispatch = AppThunkDispatch & AppStore['dispatch'];
