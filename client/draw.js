
import {
    extrudeLine,
    extrudeBezier,
    extrudeQuadratic
} from '../lib/extruders';

import {
    begin,
    moveTo,
    lineTo,
    cubicTo,
    quadraticTo,
    closePath,
    gs,
    stroke,
    fill,
    fillAndStroke,
    save,
    restore
} from '../lib/operation';

import point from '../lib/point';
import { getState } from '../lib/state';
import { getFont } from './font';


function drawMaskImpl(paths) {
    const mask = [];
    const fgColor = getState('colorForeground', 'white');
    mask.push(save());
    mask.push(gs('fillStyle', fgColor));
    mask.push(gs('strokeStyle', fgColor));
    mask.push(gs('lineWidth', 2));
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


export function getWidth(text, font, fontSize) {
    const path = getFont(font).getPath(text, 0, 0, fontSize);
    const bbox = path.getBoundingBox();
    return (bbox.x2 - bbox.x1);
}


export function drawMask(text, font, fontSize, anchor = point(0, 0)) {
    const paths = getFont(font).getPaths(text, anchor.x, anchor.y, fontSize);
    return drawMaskImpl(paths);
}

export default function draw(text, font, fontSize, xOffset, yOffset, anchor = point(0, 0)) {
    const extrusion = [];

    const paths = getFont(font).getPaths(text, anchor.x, anchor.y, fontSize);


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
                extrudeLine(extrusion, xOffset, yOffset, currentPosition, point(cmd.x, cmd.y));
                currentPosition = point(cmd.x, cmd.y);
                break;

            case 'C': {
                const c1 = point(cmd.x1, cmd.y1);
                const c2 = point(cmd.x2, cmd.y2);
                const p2 = point(cmd.x, cmd.y);
                extrudeBezier(extrusion, xOffset, yOffset, currentPosition, c1, c2, p2);
                currentPosition = p2;
                break;
            }

            case 'Q': {
                const c1 = point(cmd.x1, cmd.y1);
                const p2 = point(cmd.x, cmd.y);
                extrudeQuadratic(extrusion, xOffset, yOffset, currentPosition, c1, p2);
                currentPosition = p2;
                break;
            }

            case 'Z':
                extrudeLine(extrusion, xOffset, yOffset, currentPosition, firstMove);
                currentPosition = firstMove;
                break;

            default: break;
            }
        }
    });

    const mask = drawMaskImpl(paths);
    
    return { extrusion, mask };
}
