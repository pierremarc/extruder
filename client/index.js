

import config from './config';
import { init as initState, setState } from '../lib/state';
import message, { DEBUG, ERROR } from '../lib/message';
import { loadFonts } from './font';
import tools from './tools';
import extruder from './extruder';


initState(config.initialState);

function main(configOpt) {

    loadFonts(configOpt.fonts)
        .then((names) => {
            tools(names);
            extruder();
            setState('font', names[0].identifier);
            message('fonts loaded, application is ready');
        })
        .catch((err) => {
            message(err.toString(), ERROR);
        });
}


document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        main(config);
    }
};
