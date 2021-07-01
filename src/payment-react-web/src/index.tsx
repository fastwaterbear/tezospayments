import { configureStore, isPlain } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';

import { App } from './app';
import { App as AppComponent } from './components/App';
import reportWebVitals from './reportWebVitals';
import { appReducer } from './store';
import './index.scss';

const app = new App(app => configureStore({
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
      <AppComponent />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
