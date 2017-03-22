
import {
    extrudeLine,
    extrudeBezier,
    extrudeQuadratic,
} from '../lib/extruders';

import {
    begin,
    moveTo,
    lineTo,
    cubicTo,
    quadraticTo,
    closePath,
    gs,
    fill,
    fillAndStroke,
    save,
    restore,
} from '../lib/operation';

import point from '../lib/point';
import { getFont } from './font';


function drawMaskImpl(state, paths) {
    const mask = [];
    const fgColor = state.colorForeground;
    mask.push(save());
    mask.push(gs('fillStyle', fgColor));
    mask.push(gs('strokeStyle', fgColor));
    mask.push(gs('lineWidth', state.maskLineWidth || 2));
    paths.forEach((path) => {
        const commands = path.commands;
        let lastMove = null;
        mask.push(begin());
        for (let i = 0; i < commands.length; i += 1) {
            const cmd = commands[i];
            switch (cmd.type) {
                case 'M':
                    lastMove = point(cmd.x, cmd.y);
                    mask.push(moveTo(lastMove));
                    break;

                case 'L':
                    mask.push(lineTo(point(cmd.x, cmd.y)));
                    break;

                case 'C': {
                    const c1 = point(cmd.x1, cmd.y1);
                    const c2 = point(cmd.x2, cmd.y2);
                    const p2 = point(cmd.x, cmd.y);
                    mask.push(cubicTo(c1, c2, p2));
                    break;
                }

                case 'Q': {
                    const c1 = point(cmd.x1, cmd.y1);
                    const p2 = point(cmd.x, cmd.y);
                    mask.push(quadraticTo(c1, p2));
                    break;
                }

                case 'Z':
                    mask.push(lineTo(lastMove));
                    mask.push(closePath());
                    break;

                default: break;
            }
        }
        mask.push(fillAndStroke());
    });
    mask.push(restore());

    return mask;
}


const simpleWidthCache = {};

export function getWidth(text, font, fontSize) {
    const k = [text, font, fontSize.toString()].join('..');
    if (!(k in simpleWidthCache)) {
        const path = getFont(font).getPath(text, 0, 0, fontSize);
        const bbox = path.getBoundingBox();
        simpleWidthCache[k] = bbox.x1 + (bbox.x2 - bbox.x1);
    }
    return simpleWidthCache[k];
}


export function drawMask(state, text, font, fontSize, anchor = point(0, 0)) {
    const paths = getFont(font).getPaths(text, anchor.x, anchor.y, fontSize);
    return drawMaskImpl(state, paths);
}

export default function draw(state, text, font, fontSize, xOffset, yOffset, anchor = point(0, 0)) {
    const extrusion = [];
    const paths = getFont(font).getPaths(text, anchor.x, anchor.y, fontSize);

    extrusion.push(gs('lineJoin', 'miter'));

    paths.forEach((path) => {
        const commands = path.commands;
        let currentPosition = point(0, 0);
        let firstMove = point(0, 0);
        for (let i = 0; i < commands.length; i += 1) {
            const cmd = commands[i];
            switch (cmd.type) {
                case 'M':
                    currentPosition = point(cmd.x, cmd.y);
                    firstMove = point(cmd.x, cmd.y);
                    break;

                case 'L':
                    extrudeLine(state, extrusion, xOffset, yOffset,
                        currentPosition, point(cmd.x, cmd.y));
                    currentPosition = point(cmd.x, cmd.y);
                    break;

                case 'C': {
                    const c1 = point(cmd.x1, cmd.y1);
                    const c2 = point(cmd.x2, cmd.y2);
                    const p2 = point(cmd.x, cmd.y);
                    extrudeBezier(state, extrusion, xOffset, yOffset, currentPosition, c1, c2, p2);
                    currentPosition = p2;
                    break;
                }

                case 'Q': {
                    const c1 = point(cmd.x1, cmd.y1);
                    const p2 = point(cmd.x, cmd.y);
                    extrudeQuadratic(state, extrusion, xOffset, yOffset, currentPosition, c1, p2);
                    currentPosition = p2;
                    break;
                }

                case 'Z':
                    extrudeLine(state, extrusion, xOffset, yOffset, currentPosition, firstMove);
                    currentPosition = firstMove;
                    break;

                default: break;
            }
        }
    });

    const mask = drawMaskImpl(state, paths);

    return { extrusion, mask };
}


export function drawBackground(min, max, bg) {
    const ops = [];
    if (bg !== 'transparent') {
        ops.push(save());
        ops.push(gs('fillStyle', bg));
        ops.push(moveTo(min));
        ops.push(lineTo(point(max.x, min.y)));
        ops.push(lineTo(point(max.x, max.y)));
        ops.push(lineTo(point(min.x, max.y)));
        ops.push(closePath());
        ops.push(fill());
        ops.push(restore());
    }
    return ops;
}
