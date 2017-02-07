'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.body = body;
exports.setAttributes = setAttributes;
exports.createElement = createElement;
exports.appendText = appendText;
exports.hasClass = hasClass;
exports.removeClass = removeClass;
exports.addClass = addClass;
exports.toggleClass = toggleClass;
exports.removeElement = removeElement;
exports.emptyElement = emptyElement;
exports.px = px;

var _fp = require('lodash/fp');

// DOM

function body() {
    var viewport = document.getElementById('viewport');
    if (!viewport) {
        viewport = document.createElement('div');
        viewport.id = 'viewport';
        document.body.appendChild(viewport);
    }
    return viewport;
}

function setAttributes(elem) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _fp.keys)(attrs).forEach(function (k) {
        elem.setAttribute(k, attrs[k]);
    });
    return elem;
}

function createElement(tag) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var node = document.createElement(tag);
    return setAttributes(node, attrs);
}

function appendText(elem, text) {
    var node = document.createTextNode(text);
    elem.appendChild(node);
    return node;
}

function hasClass(elem, c) {
    var ecStr = elem.getAttribute('class');
    var ec = ecStr ? ecStr.split(' ') : [];
    return !((0, _fp.indexOf)(c, ec) < 0);
}

function removeClass(elem, c) {
    var ecStr = elem.getAttribute('class');
    var ec = ecStr ? ecStr.split(' ') : [];
    var remainings = (0, _fp.filter)(function (cn) {
        return cn !== c;
    }, ec);
    elem.setAttribute('class', remainings.join(' '));
}

function addClass(elem, c) {
    var ecStr = elem.getAttribute('class');
    var ec = ecStr ? ecStr.split(' ') : [];
    ec.push(c);
    elem.setAttribute('class', (0, _fp.uniq)(ec).join(' '));
}

function toggleClass(elem, c) {
    var ecStr = elem.getAttribute('class');
    var ec = ecStr ? ecStr.split(' ') : [];
    if ((0, _fp.indexOf)(c, ec) < 0) {
        addClass(elem, c);
    } else {
        removeClass(elem, c);
    }
}

function removeElement(elem, keepChildren) {
    if (!keepChildren) {
        while (elem.firstChild) {
            removeElement(elem.firstChild);
        }
    }
    var parent = elem.parentNode;
    var evt = document.createEvent('CustomEvent');
    parent.removeChild(elem);
    evt.initCustomEvent('remove', false, false, null);
    elem.dispatchEvent(evt);
    return elem;
}

function emptyElement(elem) {
    while (elem.firstChild) {
        removeElement(elem.firstChild);
    }
    return elem;
}

function px() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    return val.toString() + 'px';
}