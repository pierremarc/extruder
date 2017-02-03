
import { setState, getState, onStateChange } from '../lib/state';
import { body, createElement, appendText, addClass, removeClass } from '../lib/dom';
import { extrude } from './extruder';


function fontName(font) {
    return font.names.fullName.en;
}

function createfontItem(font) {
    const name = font.names.fontSubfamily.en;
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
    const groups = {};
    const getGroup = (font) => {
        const family = font.names.fontFamily.en;
        if (!(family in groups)) {
            const element = createElement('div', { class: 'font-family' });
            const title = createElement('span', { class: 'font-family-title' });
            appendText(title, family);
            element.appendChild(title);
            box.appendChild(element);
            groups[family] = element;
        }
        return groups[family];
    };
    fonts.forEach((font) => {
        const fontItem = createfontItem(font);
        const group = getGroup(font);
        group.appendChild(fontItem);
    });
}

function textTool(box) {
    const textArea = createElement('textarea', { class: 'tool-text-area' });
    let text = getState('text');
    textArea.value = text;
    textArea.addEventListener('keyup', () => {
        if (textArea.value !== text) {
            text = textArea.value;
            setState('text', text);
        }
    });
    box.appendChild(textArea);
}


function exportTool(box) {
    const knockout = createElement('input', {
        type: 'checkbox'
    });
    const exportPNG = createElement('a', {
        class: 'tool-export-button',
        download: 'extruded.png'
     });
     appendText(knockout, 'knockout')
    appendText(exportPNG, 'Download PNG');
    box.appendChild(knockout);
    box.appendChild(exportPNG);

    const offScreen = createElement('canvas');
    let localState = null;
    onStateChange((state) => {
        localState = state;
    });


    knockout.addEventListener('change', () => {
        setState('knockout', knockout.checked);
    });

    box.addEventListener('mouseenter', () => {
        if (localState) {
            offScreen.width = localState.width;
            offScreen.height = localState.height;
            if (extrude(offScreen, localState)) {
                exportPNG.href = offScreen.toDataURL("image/png");
            }
        }
    });
}

export default function install(fonts) {
    const sidebar = createElement('div', { class: 'tool-box' });
    const fontBox = wrapTool('font', fontTool, fonts);
    const textBox = wrapTool('text', textTool);
    const exportBox = wrapTool('export', exportTool);
    // const xyBox = wrapTool('xy', xyTool);
    // const extentBox = wrapTool('size', extentTool);


    [textBox, fontBox, exportBox].forEach(box => sidebar.appendChild(box));
    body().appendChild(sidebar);
    // body().appendChild(xyBox);
    // body().appendChild(extentBox);
}
