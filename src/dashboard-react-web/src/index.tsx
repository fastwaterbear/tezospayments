import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { WebApp } from './app';
import { App } from './components/App/App';
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
      }
    }),
});
export type AppDispatch = typeof store.dispatch;

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

reportWebVitals();
