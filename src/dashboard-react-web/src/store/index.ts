import { combineReducers, EnhancedStore } from '@reduxjs/toolkit';

import { accountsSlice } from './accounts/slice';
import { AppThunkDispatch } from './thunk';

export const appReducer = combineReducers({
  accountsState: accountsSlice.reducer
});

export type AppStore = EnhancedStore<AppState>;
export type AppState = ReturnType<typeof appReducer>;
export type AppDispatch = AppThunkDispatch & AppStore['dispatch'];
