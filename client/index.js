
import opentype from 'opentype.js';
import config from './config';
import { init as initState, setState } from '../lib/state';
import message, { DEBUG, ERROR } from '../lib/message';
import tools from './tools';
import extruder from './extruder';


initState(config.initialState);


function fetchFont(url) {
    message(`fetch font: ${url}`, DEBUG);
    return fetch(url, {
        mode: 'no-cors'
    });
}

function makeBuffers(responses) {
    const buffers = responses.map(response => response.arrayBuffer());
    return Promise.all(buffers);
}

function makeFonts(buffers) {
    return buffers.map((buffer) => {
        const font = opentype.parse(buffer);
        if (font.supported) {
            return font;
        }
        message('Failed to parse a font', 'ERROR');
        return null;
    });
}


function main(configOpt) {
    const fontResponses = configOpt.fonts.map(fontUrl => fetchFont(fontUrl));
    Promise.all(fontResponses)
        .then(makeBuffers)
        .then(makeFonts)
        .then((fonts) => {
            tools(fonts);
            extruder(fonts);
            setState('font', fonts[0]);
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
