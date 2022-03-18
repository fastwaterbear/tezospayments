
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import type { WebApp } from '../app/webApp';

import type { AppState, AppDispatch } from './index';

export type AppThunkAPI = {
  state: AppState;
  dispatch: AppDispatch;
  extra: WebApp;
};

export type AppThunkDispatch = ThunkDispatch<AppState, WebApp, AnyAction>;
