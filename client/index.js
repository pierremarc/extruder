

import config from './config';
import { init as initState, setState } from '../lib/state';
import message, { ERROR } from '../lib/message';
import { loadFonts } from './font';
import tools from './tools';
import extruder from './extruder';

/**
 * polyfills go here
 */

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value(callback, type, quality) {
            const binStr = atob(this.toDataURL(type, quality).split(',')[1]);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i += 1) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
        },
    });
}


initState(config.initialState);

function main(configOpt) {
    loadFonts(configOpt.fonts)
        .then((names) => {
            tools(names);
            extruder();
            message('fonts loaded, application is ready');
            setState('appReady', true);
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
