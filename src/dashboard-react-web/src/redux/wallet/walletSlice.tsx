import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { WalletService } from './walletService';

export type ConnectionState = 'disconnected' | 'pending' | 'connected';

export interface WalletState {
  connectionState: ConnectionState;
  pkh: string | null;
}

const initialState: WalletState = {
  connectionState: 'disconnected',
  pkh: null
};

const namespace = 'wallet';

export const connectToWallet = createAsyncThunk(`${namespace}/connectToWallet`, () => WalletService.instance.connect());
export const disconnectFromWallet = createAsyncThunk(`${namespace}/disconnectFromWallet`, () => WalletService.instance.disconnect());

export const walletSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setIsConnectedToWallet: (state, action: PayloadAction<WalletState>) => {
      state.connectionState = action.payload.connectionState;
      state.pkh = action.payload.pkh;
    }
  },
});

export const { setIsConnectedToWallet } = walletSlice.actions;

export const selectWalletState = (state: RootState) => state.wallet;

export default walletSlice.reducer;
