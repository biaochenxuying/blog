import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Root from './routers';
import store from './redux/store';

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.querySelectorAll('.app')[0]
);
