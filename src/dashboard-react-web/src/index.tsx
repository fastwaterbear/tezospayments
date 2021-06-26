import { configureStore, isPlain } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { WebApp } from './app';
import { App } from './components/App/App';
import { AppConfig, config } from './config';
import reportWebVitals from './reportWebVitals';
import { appReducer } from './store';
import './index.scss';

enableMapSet();

const webApp = new WebApp();
const store = configureStore({
  reducer: appReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: webApp,
      },
      serializableCheck: {
        isSerializable: (value: unknown) => isPlain(value)
          || BigNumber.isBigNumber(value)
          || value instanceof Date
      }
    }),
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
