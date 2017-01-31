
import { setState, getState, onStateChange } from '../lib/state';
import { body, createElement, appendText, addClass, removeClass } from '../lib/dom';
import { extrude } from './extruder';


function fontName(font) {
    return font.names.fullName.en;
}

function createfontItem(font) {
    const name = fontName(font);
    const elem = createElement('div', { class: 'tool-font-item clickable' });
    elem.addEventListener('click', () => {
        const nodeList = document.querySelectorAll('.tool-font-item-selected');
        const selected = Array.prototype.slice.call(nodeList, 0);
        selected.forEach((node) => {
                removeClass(node, 'tool-font-item-selected');
            });
        addClass(elem, 'tool-font-item-selected');
        setState('font', font);
    });
    const label = createElement('span');
    appendText(label, name);
    elem.appendChild(label);
    return elem;
}


function wrapTool(name, fn, ...args) {
    const box = createElement('div', {
        class: `tool tool-${name}`
    });
    const title = createElement('div', {
        class: 'tool-title'
    });
    appendText(title, name);
    box.appendChild(title);
    fn(box, ...args);
    return box;
}

function fontTool(box, fonts) {
    fonts.forEach((font) => {
        const fontItem = createfontItem(font);
        box.appendChild(fontItem);
    });
}

function textTool(box) {
    const textArea = createElement('textarea', { class: 'tool-text-area' });
    textArea.value = getState('text');
    textArea.addEventListener('keyup', () => {
        setState('text', textArea.value);
    });
    box.appendChild(textArea);
}

function xyTool(box) {
    const xBox = createElement('div', { class: 'tool-xy-box tool-xy-x' });
    const yBox = createElement('div', { class: 'tool-xy-box tool-xy-y' });
    const xInput = createElement('input', {
        type: 'number',
        value: getState('x')
    });
    const yInput = createElement('input', {
        type: 'number',
        value: getState('y')
    });

    appendText(xBox, 'x:');
    box.appendChild(xBox);
    appendText(yBox, 'y:');
    box.appendChild(yBox);

    xBox.appendChild(xInput);
    yBox.appendChild(yInput);

    xInput.addEventListener('change', () => {
        setState('x', Number(xInput.value));
    });

    yInput.addEventListener('change', () => {
        setState('y', Number(yInput.value));
    });

    onStateChange((state) => {
        xInput.value = state.x;
        yInput.value = state.y;
    });
}

function extentTool(box) {
    const widthBox = createElement('div', { class: 'tool-extent-box tool-extent-width' });
    const heightBox = createElement('div', { class: 'tool-extent-box tool-extent-height' });
    const widthInput = createElement('input', {
        type: 'number',
        value: getState('width')
    });
    const heightInput = createElement('input', {
        type: 'number',
        value: getState('height')
    });

    appendText(widthBox, 'width:');
    box.appendChild(widthBox);
    appendText(heightBox, 'height:');
    box.appendChild(heightBox);

    widthBox.appendChild(widthInput);
    heightBox.appendChild(heightInput);

    widthInput.addEventListener('change', () => {
        setState('width', Number(widthInput.value));
    });

    heightInput.addEventListener('change', () => {
        setState('height', Number(heightInput.value));
    });

}

function exportTool(box) {
    const exportPNG = createElement('a', {
        class: 'tool-export-button',
        download: 'extruded.png'
     });
    appendText(exportPNG, 'Download PNG');
    box.appendChild(exportPNG);

    const offScreen = createElement('canvas');
    onStateChange((state) => {
        offScreen.width = state.width;
        offScreen.height = state.height;
        if (extrude(offScreen, state)) {
            exportPNG.href = offScreen.toDataURL("image/png");
        }
    });
}

export default function install(fonts) {
    const container = createElement('div', { class: 'tool-box' });
    const fontBox = wrapTool('font', fontTool,fonts);
    const textBox = wrapTool('text', textTool);
    const xyBox = wrapTool('xy', xyTool);
    const extentBox = wrapTool('size', extentTool);
    const exportBox = wrapTool('export', exportTool);


    [fontBox, textBox, xyBox, extentBox, exportBox].forEach(box => container.appendChild(box));
    body().appendChild(container);
}
