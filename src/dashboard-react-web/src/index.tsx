import { configureStore, isPlain } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { WebApp } from './app';
import { App } from './components/App';
import { AppConfig, config } from './config';
import reportWebVitals from './reportWebVitals';
import { appReducer } from './store';
import './index.scss';

enableMapSet();

const webApp = new WebApp();
const store = configureStore({
  reducer: appReducer,
  devTools: {
    serialize: true
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: webApp,
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
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={webApp.history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
webApp.start(store).catch(error => console.error(error));

(window as unknown as { webApp: WebApp }).webApp = webApp;
(window as unknown as { config: AppConfig }).config = config;

reportWebVitals();
