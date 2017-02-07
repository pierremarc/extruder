
import { constant, assign, isArray, zipObject, last, intersection } from 'lodash/fp';

const debug = require('debug')('extruder');

const EXTR_STORAGE_ID = '__extruder__';

const stateStack = [];

const handlers = [];


function getLocaleStorage() {
    try {
        const storage = window.localStorage,
        x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage;
    }
    catch(e) {
        return false;
    }
}



export function init(initialState) {
    if (stateStack.length > 0) {
        throw (new Error('[state.init] state not empty'));
    }
    const storage = getLocaleStorage();
    if (storage) {
        if (storage.getItem(EXTR_STORAGE_ID)) {
            // we've been there once
            const state = {};
            Object.keys(initialState).forEach((key) => {
                const val = JSON.parse(storage.getItem(key));
                if (val === void 0) {
                    state[key] = initialState[key];
                }
                else {
                    state[key] = val;
                }
            });
            stateStack.push(state);

        }
        else {
            storage.setItem(EXTR_STORAGE_ID, true);
            Object.keys(initialState).forEach((key) => {
                    storage.setItem(key, JSON.stringify(initialState[key]));
            });
            stateStack.push(initialState);
        }
    }
    else {
        stateStack.push(initialState);
    }
}

function createState() {
    return assign(last(stateStack), {});
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


export function getState(k, dflt = null) {
    if (stateStack.length === 0) {
        throw (new Error('[state.init] state not initialised'));
    }
    const ls = last(stateStack);
    if (k in ls) {
        return ls[k];
    }
    debug(`getState reached default for ${k}`);
    return dflt;
}

export function getStateFactory(k, factory) {
    return factory(getState(k));
}


export function setState(key, value, silent = false) {
    if (stateStack.length === 0) {
        throw (new Error('[state.init] state not initialised'));
    }
    if (isArray(key)) {
        if (!isArray(value)) {
            throw (new Error('[tools.setState] if key argument is an array, so shall be value'));
        }
        stateStack.push(assign(createState(), zipObject(key, value)));
    }
    else {
        stateStack.push(assign(createState(), { [key]: value }));
        key = [key];
        value = [value];
    }

    if (!silent) {
        applyHandlers(key);
    }

    const storage = getLocaleStorage();
    if (storage) {
        key.forEach((k, idx) => {
            storage.setItem(k, JSON.stringify(value[idx]));
        });
    }
}
