
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

export default function render(text, font, fontSize, xOffset, yOffset, anchor = point(0, 0)) {
    const extrusion = [];

    const paths = font.getPaths(text, anchor.x, anchor.y, fontSize);


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

    const mask = [];
    mask.push(save());
    mask.push(gs('fillStyle', 'white'));
    mask.push(gs('strokeStyle', 'white'));
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
        mask.push(fill());
    });
    mask.push(restore());

    return { extrusion, mask };
}
