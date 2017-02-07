
import point from '../lib/point';
import ContextCanvas from '../lib/ctx-canvas';
import message from '../lib/message';
import { body, createElement, px } from '../lib/dom';
import { onStateChange, getState, setState } from '../lib/state';
import slider from '../lib/slider';
import extrude from './extrude';

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


function withContext(canvas, state, fn) {
    var context = new ContextCanvas(canvas);
    const bg = getState('backgroundColor', 'white');
    const { width, height, offset } = state;
    const ss = getScaledSize(canvas, { width, height });

    context.clear();
    // few visual niceties for on screen rendering
    const rawCtx = context.ctx;
    rawCtx.setTransform(0.9, 0, 0, 0.9, canvas.width * 0.05, canvas.height * 0.05);
    rawCtx.save();

    rawCtx.strokeStyle = '#60A8FF';
    rawCtx.fillStyle = bg;
    rawCtx.lineWidth = 0.5;
    rawCtx.strokeRect(offset.x, offset.y, ss.width, ss.height);
    rawCtx.fillRect(offset.x, offset.y, ss.width, ss.height);


    fn(context, state, ss.scale);
    rawCtx.restore();

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
        withContext(canvas, state, extrude);
    }, keys);

    xyLay(xyBox, rect);
    sizeLay(sizeBox, rect);
}
