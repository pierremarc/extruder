
import 'whatwg-fetch';
import { saveAs } from 'file-saver';
import { assign } from 'lodash/fp';
import point from '../lib/point';
import ContextCanvas from '../lib/ctx-canvas';
import ContextStore from '../lib/ctx-store';
import ContextNull from '../lib/ctx-null';
import { drawBackground } from './draw';
import { setState, getState, onStateChange } from '../lib/state';
import { transform } from '../lib/operation';
import {
    body,
    createElement,
    appendText,
    addClass,
    removeClass,
} from '../lib/dom';
import palette from './palette';
import extrude from './extrude';
import message, { ERROR } from '../lib/message';


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
        class: `tool tool-${name}`,
    });
    const title = createElement('div', {
        class: 'tool-title',
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

function colorTool(box) {
    const options = [
        {
            label: 'Text',
            keys: ['colorExtrusion'],
        },
        {
            label: 'Background',
            keys: ['colorBackground', 'colorForeground'],
        },
    ];

    options.forEach((option) => {
        box.appendChild(palette(option));
    });
    return box;
}


function exportButton(label, handler) {
    const button = createElement('button', {
        class: 'button',
        type: 'button',
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
            const state = assign(localState, {});
            const nc = new ContextNull(state.width, state.height);
            const { width, height } = extrude(nc, state);

            const margin = 100;
            const fullWidth = (width + (margin * 2));
            const fullHeight = (height + (margin * 2));
            offScreen.width = fullWidth;
            offScreen.height = fullHeight;

            // console.log(`union ${width}x${height} full ${fullWidth}x${fullHeight}`);

            const ctx = new ContextCanvas(offScreen);
            const rawCtx = ctx.ctx;
            rawCtx.fillStyle = state.colorBackground;
            rawCtx.fillRect(0, 0, fullWidth, fullHeight);
            rawCtx.setTransform(1, 0, 0, 1, margin, margin);

            state.extrusionLineWidth = 1;
            state.maskLineWidth = 6;
            state.width = width;
            state.height = height;

            if (extrude(ctx, state)) {
                offScreen.toBlob((blob) => {
                    saveAs(blob, 'shadowtype.png');
                });
            }
        }
    }));

    const pdfHandler = knockout => () => {
        if (localState) {
            const patience = knockout ? ', it might take long, please be patient' : '';
            const endMessage = message(`preparing PDF file ${patience}`);
            const state = assign(localState, {});
            const nc = new ContextNull(state.width, state.height);
            const { width, height } = extrude(nc, state);

            const margin = 100;
            const fullWidth = (width + (margin * 2));
            const fullHeight = (height + (margin * 2));

            const ctx = new ContextStore(state.width, state.height);
            drawBackground(point(0, 0), point(fullWidth, fullHeight),
                state.colorBackground)
                .forEach((op) => {
                    ctx.operations.push(op);
                });
            ctx.operations.push(transform(1, 0, 0, 1, margin, margin));
            state.extrusionLineWidth = 0;
            state.maskLineWidth = 0.1;
            state.colorBackground = 'transparent';

            const extResult = extrude(ctx, state, knockout);
            if (extResult !== null) {
                const data = {
                    width: fullWidth,
                    height: fullHeight,
                    operations: ctx.operations,
                };
                fetch('/pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.blob();
                        }
                        throw (new Error(response.statusText));
                    })
                    .then((blob) => {
                        const fn = knockout ? 'shadowtype-knockout.pdf' : 'shadowtype.pdf';
                        saveAs(blob, fn);
                        endMessage();
                    })
                    .catch((err) => {
                        endMessage();
                        setTimeout(message(`PDF generation failed: ${err}`, ERROR), 10000);
                    });
            }
        }
    };

    wrap0.appendChild(exportButton('PDF', pdfHandler(false)));

    const experimentalTitle = createElement('div', { class: 'tool-title-experimental' });

    const experimentalBody = createElement('div', { class: 'tool-body-experimental' });

    const experimentalButton = exportButton('Download PDF', pdfHandler(true));
    addClass(experimentalButton, 'experimental');

    experimentalTitle.appendChild(document.createTextNode('Experimental export'));
    experimentalBody.appendChild(document.createTextNode(`
PDF containing type knocked out of the shadow. Can deliver unexpected output. Please check output before using.
    `));

    wrap1.appendChild(experimentalTitle);
    wrap1.appendChild(experimentalBody);
    wrap1.appendChild(experimentalButton);
}

export default function install(fonts) {
    const sidebar = createElement('div', { class: 'tool-box' });
    const textBox = wrapTool('Type your text', textTool);
    const fontBox = wrapTool('Choose font style', fontTool, fonts);
    const colorBox = wrapTool('Choose colors', colorTool);
    const exportBox = wrapTool('Download', exportTool);
    // const xyBox = wrapTool('xy', xyTool);
    // const extentBox = wrapTool('size', extentTool);


    [textBox, fontBox, colorBox, exportBox].forEach(box => sidebar.appendChild(box));
    body().appendChild(sidebar);
    // body().appendChild(xyBox);
    // body().appendChild(extentBox);
}
