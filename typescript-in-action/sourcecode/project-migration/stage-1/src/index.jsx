import React from 'react';
import ReactDOM from 'react-dom';

import Hello from './components/Hello';
import Hi from './components/Hi';

import { add } from './utils/a';
import { sub } from './utils/b';

add(1, 1)
sub(1, 1)

ReactDOM.render(
    <div>
        <Hello name="World" />
        <Hi name="World" />
    </div>,
    document.querySelectorAll('.app')[0]
);
