import { indexOf, filter, uniq, keys } from 'lodash/fp';

// DOM

export function body() {
    let viewport = document.getElementById('viewport');
    if (!viewport) {
        viewport = document.createElement('div');
        viewport.id = 'viewport';
        document.body.appendChild(viewport);
    }
    return viewport;
}

export function setAttributes(elem, attrs = {}) {
    keys(attrs).forEach((k) => {
        elem.setAttribute(k, attrs[k]);
    });
    return elem;
}

export function createElement(tag, attrs = {}) {
    const node = document.createElement(tag);
    return setAttributes(node, attrs);
}

export function appendText(elem, text) {
    const node = document.createTextNode(text);
    elem.appendChild(node);
    return node;
}

export function hasClass(elem, c) {
    const ecStr = elem.getAttribute('class');
    const ec = ecStr ? ecStr.split(' ') : [];
    return !(indexOf(c, ec) < 0);
}

export function removeClass(elem, c) {
    const ecStr = elem.getAttribute('class');
    const ec = ecStr ? ecStr.split(' ') : [];
    const remainings = filter(cn => cn !== c, ec);
    elem.setAttribute('class', remainings.join(' '));
}

export function addClass(elem, c) {
    const ecStr = elem.getAttribute('class');
    const ec = ecStr ? ecStr.split(' ') : [];
    ec.push(c);
    elem.setAttribute('class', uniq(ec).join(' '));
}

export function toggleClass(elem, c) {
    const ecStr = elem.getAttribute('class');
    const ec = ecStr ? ecStr.split(' ') : [];
    if (indexOf(c, ec) < 0) {
        addClass(elem, c);
    }
    else {
        removeClass(elem, c);
    }
}

export function removeElement(elem, keepChildren) {
    if (!keepChildren) {
        while (elem.firstChild) {
            removeElement(elem.firstChild);
        }
    }
    const parent = elem.parentNode;
    const evt = document.createEvent('CustomEvent');
    parent.removeChild(elem);
    evt.initCustomEvent('remove', false, false, null);
    elem.dispatchEvent(evt);
    return elem;
}

export function emptyElement(elem) {
    while (elem.firstChild) {
        removeElement(elem.firstChild);
    }
    return elem;
}

export function px(val = 0) {
    return `${val.toString()}px`;
}
