import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import walletReducer from './wallet/walletSlice';
import { WalletService } from './wallet/walletService';

export const store = configureStore({
  reducer: {
    wallet: walletReducer
  }
});

WalletService.instance.initialize();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
