

import { difference } from 'lodash/fp';
import message from '../lib/message';
import point from '../lib/point';
import Context from '../lib/ctx-canvas';
import PaperContext from '../lib/ctx-paper';
import op, { OP_BEGIN } from '../lib/operation';
import { body, createElement, px } from '../lib/dom';
import render from './render';
import { onStateChange, getState, setState } from '../lib/state';
import slider from '../lib/slider';

const debug = require('debug')('extruder');

function getScaledSize(rect, bbox) {
    const hScale = rect.width / bbox.width;
    const vScale = rect.height / bbox.height;
    let scale = 1;
    let offset = point(0, 0);

    if (hScale < vScale) {
        scale = hScale;
        offset = point(0, (rect.height - (bbox.height * scale)) / 2);
    }
    else {
        scale = vScale;
        offset = point((rect.width - (bbox.width * scale)) / 2, 0);
    }

    return {
        width: bbox.width * scale,
        height: bbox.height * scale,
        offset,
        scale
    };
}

function extrudeLine(ctx, rect, x, y, text, font, fontSize) {
    const anchor = point(rect.minx, rect.miny);
    const knockout = getState('knockout', false);
    const { extrusion, mask } = render(text, font, fontSize, x, y, anchor);
    if (knockout) {
        // op.render(ctx, extrusion);
        // return;
        const paperEx = new PaperContext();
        let maskOps = [];
        mask.forEach((operation) => {
            const opCode = operation[0];
            if (opCode === OP_BEGIN) {
                maskOps.push([]);
            }
            if (maskOps.length > 0) {
                maskOps[maskOps.length - 1].push(operation);
            }
        });
        const masks = [];
        maskOps.forEach((maskOp) => {
            const m = new PaperContext(true);
            op.render(m, maskOp);
            masks.push(m);
        });

        op.render(paperEx, extrusion);
        masks.forEach((m) => {
            paperEx.substract(m);
        });
        const knockoutOps = paperEx.exportOperations();
        // const a = knockoutOps.map((o) => o.join(':'));
        // const b = extrusion.map((o) => o.join(':'));
        // console.log('assert', a.length === b.length, difference(a, b));
        op.render(ctx, knockoutOps);
    }
    else {
        op.render(ctx, extrusion.concat(mask));
    }
}


export function extrude(canvas, state) {
    const { x, y, text, font, margin, width, height } = state;
    const lines = text.split('\n');
    const ctx = new Context(canvas);
    const ss = getScaledSize(canvas, { width, height });

    // clear canvas
    const rawCtx = ctx.ctx;
    rawCtx.save();
    rawCtx.clearRect(0, 0, canvas.width, canvas.height);
    // rawCtx.fillStyle = '#DCDCDC';
    // rawCtx.fillRect(0, 0, canvas.width, canvas.height);

    if (!font) {
        message('you should select a font first');
    }
    else {
        if (lines.length > 0) {
            const scaledMargin = Math.max(margin * ss.width, margin * ss.height);
            const innerWidth = ss.width - (scaledMargin * 2);
            const innerHeight = ss.height - (scaledMargin * 2);
            const lineHeight = innerHeight / lines.length;
            const baseFactor = 0.8;
            const fontSize = lineHeight;
            const left = ss.offset.x + scaledMargin;
            const top = ss.offset.y + scaledMargin;

            if (canvas.width !== ss.width || canvas.height !== ss.height) {
                rawCtx.setTransform(0.9, 0, 0, 0.9, canvas.width * 0.05, canvas.height * 0.05);
                rawCtx.save();
                rawCtx.strokeStyle = '#60A8FF';
                rawCtx.fillStyle = 'white';
                rawCtx.lineWidth = 0.5;
                rawCtx.strokeRect(ss.offset.x, ss.offset.y, ss.width, ss.height);
                rawCtx.fillRect(ss.offset.x, ss.offset.y, ss.width, ss.height);
                rawCtx.restore();
            }

            lines.forEach((line, idx) => {
                if (line.length > 0) {
                    const rect = {
                        minx: left,
                        miny: top + (idx * lineHeight) + (baseFactor * lineHeight),
                        maxx: left + innerWidth,
                        maxy: top + (idx * lineHeight),
                        width: innerWidth,
                        height: lineHeight
                    };
                    // debug('line-rect', rect);
                    extrudeLine(ctx, rect, x * ss.scale, y * ss.scale, line, font, fontSize);
                }
            });
        }
    }

    rawCtx.restore();
    return true;
}


function mouseEventPos(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = point(e.clientX - rect.left, e.clientY - rect.top);
    // debug('mouseEventPos', p);
    return p;
}

function startMoving(e) {
    const current = point(getState('x'), getState('y'));
    setState(
        ['isMoving', 'startPos'],
        [true, mouseEventPos(e).minus(current)]
    );
}

function isMoving(e) {
    const startPos = getState('startPos');
    const isMovingState = getState('isMoving');

    if (isMovingState && (startPos !== null)) {
        // console.log('isMoving', e.clientX, e.clientY);
        const move = mouseEventPos(e).minus(startPos);
        setState(
            ['x', 'y'],
            [move.x, move.y]
        );
    }
}

function stopMoving(e) {
    // console.log('stopMoving', e.clientX, e.clientY);
    const startPos = getState('startPos');
    const isMovingState = getState('isMoving');
    const move = mouseEventPos(e).minus(startPos);

    if (isMovingState && (startPos !== null) && (move.x !== 0 || move.y !== 0)) {
        setState(
            ['x', 'y', 'isMoving', 'startPos'],
            [move.x, move.y, false, null]
        );
    }
}


function xyTool() {
    const box = createElement('div', { class: 'tool-xy' });
    const xBox = createElement('div', { class: 'tool-xy-box tool-xy-x' });
    const yBox = createElement('div', { class: 'tool-xy-box tool-xy-y' });
    xBox.appendChild(slider('x', -300, 300, Math.ceil));
    yBox.appendChild(slider('y', -300, 300, Math.ceil));
    box.appendChild(xBox);
    box.appendChild(yBox);
    return box;
}

function extentTool() {
    const box = createElement('div', { class: 'tool-size' });
    const widthBox = createElement('div', { class: 'tool-extent-box tool-extent-width' });
    const heightBox = createElement('div', { class: 'tool-extent-box tool-extent-height' });

    widthBox.appendChild(slider('width', 100, 4000, Math.ceil));
    heightBox.appendChild(slider('height', 100, 4000, Math.ceil));
    box.appendChild(widthBox);
    box.appendChild(heightBox);
    return box;
}


function xyLay(box, rect) {
    const s = box.style;
    s.position = 'absolute';
    s.top = px(0);
    s.left = px(rect.left)// + (rect.width * 0.2));
    s.width = px(rect.width * 0.5);
}


function sizeLay(box, rect) {
    const s = box.style;
    s.position = 'absolute';
    s.bottom = px(0);
    s.right = px(0)// + (rect.width * 0.2));
    s.width = px(rect.width * 0.5);
}
export default function main() {
    const container = createElement('div', { class: 'extruder-box' });
    const canvas = createElement('canvas');
    const xyBox = xyTool();
    const sizeBox = extentTool();
    container.appendChild(canvas);
    container.appendChild(xyBox);
    container.appendChild(sizeBox);
    body().appendChild(container);

    const rect = container.getBoundingClientRect();



    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.addEventListener('mousedown', startMoving, false);
    canvas.addEventListener('mouseup', stopMoving, false);
    canvas.addEventListener('mousemove', isMoving, false);

    const keys = ['x', 'y', 'width', 'height', 'font', 'text', 'knockout'];
    onStateChange((state) => {
        extrude(canvas, state);
    }, keys);

    xyLay(xyBox, rect);
    sizeLay(sizeBox, rect);
}
