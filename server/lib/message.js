'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEBUG = exports.INFO = exports.WARNING = exports.ERROR = undefined;
exports.default = message;

var _dom = require('./dom');

var ERROR = exports.ERROR = 'error';
var WARNING = exports.WARNING = 'warning';
var INFO = exports.INFO = 'info';
var DEBUG = exports.DEBUG = 'debug';

var timeoutId = null;
var box = null;

var endMessage = function endMessage(element) {
    return function () {
        (0, _dom.removeElement)(element);
    };
};

function message(text) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INFO;

    // if (timeoutId !== null) {
    //     clearTimeout(timeoutId);
    //     removeElement(box);
    // }

    box = (0, _dom.createElement)('div', {
        class: 'message-box message-' + type
    });
    box.appendChild(document.createTextNode(text));

    (0, _dom.body)().appendChild(box);
    // const msgDuration = text.length * 24;

    // timeoutId = setTimeout(() => {
    //     timeoutId = null;
    //     removeElement(box);
    // }, msgDuration);

    return endMessage(box);
}