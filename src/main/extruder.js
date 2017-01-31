
import message from '../lib/message';
import point from '../lib/point';
import Context from '../lib/ctx-canvas';
// import ContextBBox from '../lib/ctx-bbox';
// import ContextScale from '../lib/ctx-scale';
// import DebugContext from '../lib/ctx-debug';
import op from '../lib/operation';
import { body, createElement } from '../lib/dom';
import render from './render';
import { onStateChange, getState, setState } from '../lib/state';

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
    // const bboxContext = new ContextBBox();
    const anchor = point(rect.minx, rect.miny);

    // { // debug
    //     const rawCtx = ctx.ctx;
    //     rawCtx.save();
    //     rawCtx.strokeStyle = 'green';
    //     rawCtx.fillStyle = 'white';
    //     rawCtx.lineWidth = 0.5;
    //     rawCtx.fillRect(rect.minx, rect.maxy, rect.width, rect.height);
    //     rawCtx.strokeRect(rect.minx, rect.maxy, rect.width, rect.height);
    //     rawCtx.restore();
    // }

    // pass #1 get glyphs
    const baseOperations = render(text, font, fontSize, x, y, anchor);
    op.render(ctx, baseOperations);
    //
    // // pass #2 get a bounding box
    // op.render(bboxContext, baseOperations);
    // {
    //     const bb = bboxContext;
    //     debug('bbox', bb.minx, bb.miny, bb.maxx, bb.maxy);
    // }
    //
    // // pass #3 get scaled glyphs
    // const cz = getScaledSize(rect, bboxContext);
    // debug('scale', cz.scale);
    // const scaler = new ContextScale(cz.scale, cz.scale, anchor);
    // op.render(scaler, baseOperations);
    //
    //
    // // finally render on canvas
    // {
    //     const dbg = new ContextBBox();
    //     op.render(dbg, scaler.operations);
    //     debug('scaled bbox', dbg.minx, dbg.miny, dbg.maxx, dbg.maxy);
    // }
    // op.render(ctx, scaler.operations);
}


export function extrude(canvas, state) {
    const { x, y, text, font, margin, width, height } = state;
    const lines = text.split('\n');
    const ctx = new Context(canvas);
    const ss = getScaledSize(canvas, { width, height });

    // clear canvas
    ctx.ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.ctx.fillStyle = 'white';
    ctx.ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!font) {
        message('you should select a font first');
        return false;
    }

    debug('scale', ss);
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
            const rawCtx = ctx.ctx;
            rawCtx.save();
            rawCtx.strokeStyle = '#60A8FF';
            rawCtx.lineWidth = 0.5;
            rawCtx.strokeRect(ss.offset.x, ss.offset.y, ss.width, ss.height);
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

    return true;
}


function mouseEventPos(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = point(e.clientX - rect.left, e.clientY - rect.top);
    debug('mouseEventPos', p);
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

export default function main() {
    const container = createElement('div', { class: 'extruder-box' });
    const canvas = createElement('canvas');
    container.appendChild(canvas);
    body().appendChild(container);
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.addEventListener('mousedown', startMoving, false);
    canvas.addEventListener('mouseup', stopMoving, false);
    canvas.addEventListener('mousemove', isMoving, false);


    onStateChange((state) => {
        // debug(`xy [${state.x}, ${state.y}]`);
        extrude(canvas, state);
    });
}
