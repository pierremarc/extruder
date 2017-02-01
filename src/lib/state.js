
import { assign, isArray, zipObject, last, intersection } from 'lodash/fp';

// const debug = require('debug')('extruder');

const state = [];

const handlers = [];


export function init(initialState) {
    if (state.length > 0) {
        throw (new Error('[state.init] state not empty'));
    }
    state.push(initialState);
}

function createState() {
    return assign(last(state), {});
}


function applyHandlers(keys) {
    handlers.forEach((handler) => {
        const [callback, checkKeys] = handler;
        if (checkKeys) {
            if (checkKeys(keys).length > 0) {
                callback(createState(), keys);
            }
        }
        else {
            callback(createState(), keys);
        }
    });
}


export function onStateChange(callback, keys = null) {
    if (keys) {
        handlers.push([callback, intersection(keys)]);
    }
    else {
        handlers.push([callback, false]);
    }
}



export function getState(k) {
    if (state.length === 0) {
        throw (new Error('[state.init] state not initialised'));
    }
    return last(state)[k];
}


export function setState(key, value, silent = false) {
    if (state.length === 0) {
        throw (new Error('[state.init] state not initialised'));
    }
    if (isArray(key)) {
        if (!isArray(value)) {
            throw (new Error('[tools.setState] if key argument is an array, so shall be value'));
        }
        state.push(assign(createState(), zipObject(key, value)));
    }
    else {
        state.push(assign(createState(), { [key]: value }));
        key = [key];
    }

    if (!silent) {
        applyHandlers(key);
    }

    // debug(`state stack size ${state.length}`);
}
