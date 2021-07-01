
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import type { App } from '../app';

import type { AppState, AppDispatch } from './index';

export type AppThunkAPI = {
  state: AppState;
  dispatch: AppDispatch;
  extra: App;
};

export type AppThunkDispatch = ThunkDispatch<AppState, App, AnyAction>;
