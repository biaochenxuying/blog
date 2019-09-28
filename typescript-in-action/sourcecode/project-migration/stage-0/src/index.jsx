import React from 'react';
import ReactDOM from 'react-dom';

import Hello from './components/Hello';

import { add } from './utils/a';

add(1, 1)

ReactDOM.render(
    <div>
        <Hello name="World" />
    </div>,
    document.querySelectorAll('.app')[0]
);
