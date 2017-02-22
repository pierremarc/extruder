
import { setState } from '../lib/state';
import { createElement, appendText, px } from '../lib/dom';
import config from './config';

function paletteItem(keys, color) {
    const item = createElement('div', { class: 'palette-item' });
    item.style.width = px(24);
    item.style.height = px(24);
    item.style.backgroundColor = color;
    const values = new Array(keys.length);
    values.fill(color);
    item.addEventListener('click', () => {
        setState(keys, values);
    });
    return item;
}

function paletteItemNone(keys) {
    const item = createElement('div', { class: 'palette-item palette-item-none' });
    item.style.width = px(24);
    item.style.height = px(24);
    const values = new Array(keys.length);
    values.fill('transparent');
    item.addEventListener('click', () => {
        setState(keys, values);
    });
    return item;
}

export default function palette(options) {
    const { label, keys } = options;
    const colorList = config.palette;
    const container = createElement('div', { class: 'palette' });
    const labelElement = createElement('div', { class: 'palette-title' });
    appendText(labelElement, label);
    container.appendChild(labelElement);
    container.appendChild(paletteItemNone(keys));
    colorList.forEach((color) => {
        container.appendChild(paletteItem(keys, color));
    });
    return container;
}
