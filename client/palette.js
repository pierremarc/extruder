
import { getState, setState } from '../lib/state';
import { createElement, appendText, px } from '../lib/dom';

function paletteItem(key, color) {
    const item = createElement('div', { class: 'palette-item' });
    item.style.width = px(24);
    item.style.height = px(24);
    item.style.backgroundColor = color;
    item.addEventListener('click', () => {
        setState(key, color);
    });
    return item;
}

function paletteItemNone(key) {
    const item = createElement('div', { class: 'palette-item palette-item-none' });
    item.style.width = px(24);
    item.style.height = px(24);
    item.addEventListener('click', () => {
        setState(key, 'none');
    });
    return item;
}

export default function palette(options) {
    const { label, key } = options;
    const colorList = getState('palette');
    const container = createElement('div', { class: 'palette' });
    const labelElement = createElement('div', { class: 'palette-title' });
    appendText(labelElement, label);
    container.appendChild(labelElement);
    container.appendChild(paletteItemNone(key));
    colorList.forEach((color) => {
        container.appendChild(paletteItem(key, color));
    });
    return container;
}
