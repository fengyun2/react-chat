import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import platform from 'platform';
import 'normalize.css';

import notification from './utils/notification';
import App from './App';
import store from './store/store';

import './style/iconfont.css';
import './style/main.css';

let windowStatus = 'focus';
window.onfocus = () => (windowStatus = 'focus');
window.onblur = () => (windowStatus = 'blur');

// if (windowStatus === 'blur') {
// }

// function App() {
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   );
// }

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement,
);
