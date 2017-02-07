
import 'whatwg-fetch';
import { saveAs } from 'file-saver';
import ContextCanvas from '../lib/ctx-canvas';
import ContextStore from '../lib/ctx-store';
import { setState, getState, onStateChange } from '../lib/state';
import {
    body,
    createElement,
    appendText,
    addClass,
    removeClass
} from '../lib/dom';
import extrude from './extrude';


function createfontItem(font) {
    const currentFont = getState('font', '');

    const elem = createElement('div', { class: 'tool-font-item clickable' });
    if (font.identifier === currentFont) {
        addClass(elem, 'tool-font-item-selected');
    }
    elem.addEventListener('click', () => {
        const nodeList = document.querySelectorAll('.tool-font-item-selected');
        const selected = Array.prototype.slice.call(nodeList, 0);
        selected.forEach((node) => {
            removeClass(node, 'tool-font-item-selected');
        });
        addClass(elem, 'tool-font-item-selected');
        setState('font', font.identifier);
    });
    const label = createElement('span');
    appendText(label, font.subFamily);
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
        const family = font.family;
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


function exportButton(label, handler) {
    const button = createElement('button', {
        class: 'button',
        type: 'button'
    });
    appendText(button, label);
    button.addEventListener('click', handler);
    return button;
}

function exportTool(box) {
    const wrap0 = createElement('div', { class: 'tool-export-button-wrapper' });
    const wrap1 = createElement('div', { class: 'tool-export-button-wrapper' });


    box.appendChild(wrap0);
    box.appendChild(wrap1);

    const offScreen = createElement('canvas');
    let localState = null;
    onStateChange((state) => {
        localState = state;
    });

    wrap0.appendChild(exportButton('PNG', () => {
        if (localState) {
            offScreen.width = localState.width;
            offScreen.height = localState.height;
            const ctx = new ContextCanvas(offScreen);
            ctx.clear();
            if (extrude(ctx, localState)) {
                offScreen.toBlob((blob) => {
                    saveAs(blob, 'extruder.png');
                });
            }
        }
    }));

    const pdfHandler = (knockout) => (e) => {
        if (localState) {
            const ctx = new ContextStore(localState.width, localState.height);
            if (extrude(ctx, localState, knockout)) {
                const data = {
                    width: localState.width,
                    height: localState.height,
                    operations: ctx.operations,
                }
                fetch('/pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then((response) => {
                    return response.blob();
                })
                .then((blob) => {
                    const fn = knockout ? 'extruder-knockout.pdf' : 'extruder.pdf';
                    saveAs(blob, fn);
                });
                // exportPDF.href = offScreen.toDataURL('image/png');
            }
        }
    };

    wrap1.appendChild(exportButton('PDF', pdfHandler(false)));
    wrap1.appendChild(exportButton('PDF (knockout)', pdfHandler(true)));
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
