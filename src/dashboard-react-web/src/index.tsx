import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { App } from './components/App/App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

const history = createBrowserHistory();
ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();

