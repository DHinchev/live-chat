import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';
import './styles/styles.css';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
