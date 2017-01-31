
import { assign, isArray, zipObject, last } from 'lodash/fp';

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


function applyHandlers() {
    handlers.forEach((handler) => {
        handler(createState());
    });
}


export function onStateChange(callback) {
    handlers.push(callback);
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
    }

    if (!silent) {
        applyHandlers();
    }

    // debug(`state stack size ${state.length}`);
}
