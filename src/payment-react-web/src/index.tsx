import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
