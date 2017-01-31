
import './index.html';
import './style.css';

import { init as initState } from './lib/state';
import main from './main';
import config from './config';

initState(config.initialState);

document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        main(config);
    }
};
