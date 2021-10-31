import { configureStore, isPlain } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';

import { ReactAppContext, WebApp } from './app';
import { App as AppComponent } from './components/App';
import { AppConfig, config } from './config';
import reportWebVitals from './reportWebVitals';
import { appReducer } from './store';
import './index.scss';

const app = new WebApp(app => configureStore({
  reducer: appReducer,
  devTools: {
    serialize: true
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: app,
      },
      serializableCheck: {
        isSerializable: (value: unknown) => isPlain(value)
          || value instanceof Map
          || value instanceof Set
          || BigNumber.isBigNumber(value)
          || value instanceof Date,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getEntries: (value: any) => value instanceof Map || value instanceof Set
          ? [...value.entries()]
          : Object.entries(value)
      }
    })
}));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={app.store}>
      <ReactAppContext.Provider value={app.reactAppContext}>
        <AppComponent />
      </ReactAppContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

(window as unknown as { config: AppConfig }).config = config;

reportWebVitals();
