'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.init = init;
exports.onStateChange = onStateChange;
exports.getState = getState;
exports.getStateFactory = getStateFactory;
exports.setState = setState;

var _fp = require('lodash/fp');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = require('debug')('extruder');

var EXTR_STORAGE_ID = '__extruder__';
// I keep it low for the case where one would own a Cray
// On my laptop the average frame takes 100ms, we're not gaming :/
var STATE_RATE = 20;

var stateStack = [];
var handlers = [];

var pendings = function () {
    var keys = [];
    var refTime = null;

    var push = function push(ks) {
        keys = (0, _fp.uniq)(keys.concat(ks));
    };

    var popKeys = function popKeys() {
        var ks = keys;
        keys = [];
        return ks;
    };

    var applyHandlers = function applyHandlers() {
        var localKeys = popKeys();
        if (localKeys.length > 0) {
            handlers.forEach(function (handler) {
                var _handler = _slicedToArray(handler, 2),
                    callback = _handler[0],
                    checkKeys = _handler[1];

                if (checkKeys) {
                    if (checkKeys(localKeys).length > 0) {
                        callback(createState(), localKeys);
                    }
                } else {
                    callback(createState(), localKeys);
                }
            });
        }
    };

    var checkTime = function checkTime(ts) {
        if (refTime === null) {
            refTime = ts;
            return false;
        }
        return ts - refTime > STATE_RATE;
    };

    var frame = function frame(ts) {
        if (checkTime(ts)) {
            applyHandlers();
            refTime = ts;
        }
        requestAnimationFrame(frame);
    };

    var start = function start() {
        requestAnimationFrame(frame);
    };

    return { start: start, push: push };
}();

function getLocaleStorage() {
    try {
        var storage = window.localStorage,
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage;
    } catch (e) {
        return false;
    }
}

function init(initialState) {
    if (stateStack.length > 0) {
        throw new Error('[state.init] state not empty');
    }
    var storage = getLocaleStorage();
    if (storage) {
        var localStateVersion = storage.getItem('version');
        var initialStateVersion = initialState.version.toString();
        if (storage.getItem(EXTR_STORAGE_ID) && localStateVersion === initialStateVersion) {
            (function () {
                // we've been there once
                var state = {};
                Object.keys(initialState).forEach(function (key) {
                    var val = JSON.parse(storage.getItem(key));
                    if (val === void 0) {
                        state[key] = initialState[key];
                    } else {
                        state[key] = val;
                    }
                });
                stateStack.push(state);
            })();
        } else {
            storage.setItem(EXTR_STORAGE_ID, true);
            Object.keys(initialState).forEach(function (key) {
                storage.setItem(key, JSON.stringify(initialState[key]));
            });
            stateStack.push(initialState);
        }
    } else {
        stateStack.push(initialState);
    }

    pendings.start();
}

function createState() {
    return (0, _fp.assign)((0, _fp.last)(stateStack), {});
}

function onStateChange(callback) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (keys) {
        handlers.push([callback, (0, _fp.intersection)(keys)]);
    } else {
        handlers.push([callback, false]);
    }
}

function getState(k) {
    var dflt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (stateStack.length === 0) {
        throw new Error('[state.init] state not initialised');
    }
    var ls = (0, _fp.last)(stateStack);
    if (k in ls) {
        return ls[k];
    }
    debug('getState reached default for ' + k);
    return dflt;
}

function getStateFactory(k, factory) {
    return factory(getState(k));
}

function setStateNext(key, value, silent) {
    if (stateStack.length === 0) {
        throw new Error('[state.init] state not initialised');
    }
    if ((0, _fp.isArray)(key)) {
        if (!(0, _fp.isArray)(value)) {
            throw new Error('[tools.setState] if key argument is an array, so shall be value');
        }
        stateStack.push((0, _fp.assign)(createState(), (0, _fp.zipObject)(key, value)));
    } else {
        stateStack.push((0, _fp.assign)(createState(), _defineProperty({}, key, value)));
        key = [key];
        value = [value];
    }

    var storage = getLocaleStorage();
    if (storage) {
        key.forEach(function (k, idx) {
            storage.setItem(k, JSON.stringify(value[idx]));
        });
    }

    if (!silent) {
        pendings.push(key);
    }
}

function setState(key, value) {
    var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    setStateNext(key, value, silent);
}