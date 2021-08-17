import { configureStore, isPlain } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';

import { AppViewContext, WebApp } from './app';
import { App as AppComponent } from './components/App';
import { AppConfig, config } from './config';
import reportWebVitals from './reportWebVitals';
import { appReducer } from './store';
import './index.scss';

const app = new WebApp(app => configureStore({
  reducer: appReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: app,
      },
      serializableCheck: {
        isSerializable: (value: unknown) => isPlain(value)
          || BigNumber.isBigNumber(value)
          || value instanceof Date
          || value instanceof URL
      }
    }),
}));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={app.store}>
      <AppViewContext.Provider value={app.services}>
        <AppComponent />
      </AppViewContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

(window as unknown as { config: AppConfig }).config = config;

reportWebVitals();
