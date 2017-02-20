
import point from '../lib/point';
import ContextCanvas from '../lib/ctx-canvas';
import message from '../lib/message';
import { body, createElement, px } from '../lib/dom';
import { onStateChange, getState, setState } from '../lib/state';
import slider from '../lib/slider';
import palette from './palette';
import extrude from './extrude';
import ContextStore from '../lib/ctx-store';
import { OP_SAVE, OP_RESTORE } from '../lib/operation';
const debug = require('debug')('extruder');


function mouseEventPos(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = point(e.clientX - rect.left, e.clientY - rect.top);
    return p;
}

function startMoving(e) {
    const current = point(getState('x'), getState('y'));
    setState(
        ['isMoving', 'startPos'],
        [true, mouseEventPos(e).minus(current).toObject()]
    );
}

function isMoving(e) {
    const startPos = point(getState('startPos'));
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
    const startPos = point(getState('startPos'));
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
    const fsBox = createElement('div', { class: 'tool-xy-box tool-xy-fs' });

    xBox.appendChild(slider({
        key: 'x',
        label: 'horizontal',
        min: -300,
        max: 300,
        parser: Math.ceil
    }));
    yBox.appendChild(slider({
        key: 'y',
        label: 'vertical',
        min: -300,
        max: 300,
        parser: Math.ceil
    }));
    fsBox.appendChild(slider({
        key: 'fontSize',
        label: 'font size',
        min: 70,
        max: 700,
        parser: Math.ceil
    }));
    box.appendChild(fsBox);
    // box.appendChild(xBox);
    // box.appendChild(yBox);
    return box;
}

function extentTool() {
    const box = createElement('div', { class: 'tool-size' });
    if(!getState('fixedSize', false)) {

        const widthBox = createElement('div', { class: 'tool-extent-box tool-extent-width' });
        const heightBox = createElement('div', { class: 'tool-extent-box tool-extent-height' });

        widthBox.appendChild(slider({
            key: 'width',
            label: 'page width',
            min: 100,
            max: 4000,
            parser: Math.ceil
        }));
        heightBox.appendChild(slider({
            key: 'height',
            label: 'page height',
            min: 100,
            max: 4000,
            parser: Math.ceil
        }));
        box.appendChild(widthBox);
        box.appendChild(heightBox);
    }
    const marginBox = createElement('div', { class: 'tool-extent-box tool-extent-margin' });

    marginBox.appendChild(slider({
        key: 'margin',
        label: 'left margin',
        min: 0,
        max: 0.2,
        parser: (v) => v.toFixed(2)
    }));
    box.appendChild(marginBox);
    return box;
}

function colorTool() {
    const box = createElement('div', { class: 'tool-color' });
    const labels = ['Background', 'Extrusion', 'Foreground'];

    labels.forEach((label) => {
        const key = `color${label}`;
        box.appendChild(palette({ label, key }));
    });
    return box;
}


function xyLay(box, rect) {
    const s = box.style;
    s.position = 'absolute';
    s.top = px(0);
    s.left = px(rect.left);
    s.width = px(rect.width * 0.5);
}


function sizeLay(box, rect) {
    const s = box.style;
    s.position = 'absolute';
    s.bottom = px(0);
    s.right = px(0);
    s.width = px(rect.width * 0.5);
}

function colorLay(box, rect) {
    const s = box.style;
    s.position = 'absolute';
    s.top = px(0);
    s.right = px(0);
    s.width = px(rect.width * 0.2);
}


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


function withContext(canvas, ss, fn) {
    var context = new ContextCanvas(canvas);

    context.clear();
    // few visual niceties for on screen rendering
    const rawCtx = context.ctx;
    rawCtx.save();
    rawCtx.setTransform(0.9, 0, 0, 0.9, canvas.width * 0.05, canvas.height * 0.05);
    // rawCtx.strokeStyle = '#60A8FF';
    // rawCtx.lineWidth = 0.5;
    rawCtx.beginPath();
    rawCtx.moveTo(ss.offset.x, ss.offset.y);
    rawCtx.lineTo(ss.offset.x + ss.width, ss.offset.y);
    rawCtx.lineTo(ss.offset.x + ss.width, ss.offset.y + ss.height);
    rawCtx.lineTo(ss.offset.x, ss.offset.y + ss.height);
    rawCtx.closePath();
    // rawCtx.rect(ss.offset.x, ss.offset.y, ss.width, ss.height);
    rawCtx.clip();

    fn(context);
    rawCtx.restore();

}

export default function main() {
    const container = createElement('div', { class: 'extruder-box' });
    const canvas = createElement('canvas');
    const xyBox = xyTool();
    const sizeBox = extentTool();
    const colorBox = colorTool();
    container.appendChild(canvas);
    container.appendChild(xyBox);
    // container.appendChild(sizeBox);
    container.appendChild(colorBox);
    body().appendChild(container);

    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.addEventListener('mousedown', startMoving, false);
    canvas.addEventListener('mouseup', stopMoving, false);
    canvas.addEventListener('mousemove', isMoving, false);

    const keys = [
        'appReady',
        'x', 'y',
        'width', 'height', 'margin',
        'font', 'fontSize', 'text',
        'colorBackground', 'colorExtrusion', 'colorForeground'
    ];
    onStateChange((state) => {
        
        canvas.style.backgroundColor = state.colorBackground;

        const { width, height, offset } = state;
        const ss = getScaledSize(canvas, { width, height });

        withContext(canvas, ss, (ctx) => {
            const h = extrude(ctx, state, false);
            const diff = Math.abs(h - ss.height);
            if ((h > 0) && (diff > 12)) {
                console.log(ss.height, h, diff);
                setState('height', Math.ceil(h / ss.scale));
            }
        });
    }, keys);


    xyLay(xyBox, rect);
    sizeLay(sizeBox, rect);
    colorLay(colorBox, rect);
}
