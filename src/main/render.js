
import {
    extrudeLine,
    extrudeBezier,
    extrudeQuadratic
} from '../lib/extruders';
import op from '../lib/operation';
import point from '../lib/point';

export default function render(text, font, fontSize, xOffset, yOffset, anchor = point(0, 0)) {
    const ops = [];

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
                extrudeLine(ops, xOffset, yOffset, currentPosition, point(cmd.x, cmd.y));
                currentPosition = point(cmd.x, cmd.y);
                break;

            case 'C': {
                const c1 = point(cmd.x1, cmd.y1);
                const c2 = point(cmd.x2, cmd.y2);
                const p2 = point(cmd.x, cmd.y);
                extrudeBezier(ops, xOffset, yOffset, currentPosition, c1, c2, p2);
                currentPosition = p2;
                break;
            }

            case 'Q': {
                const c1 = point(cmd.x1, cmd.y1);
                const p2 = point(cmd.x, cmd.y);
                extrudeQuadratic(ops, xOffset, yOffset, currentPosition, c1, p2);
                currentPosition = p2;
                break;
            }

            case 'Z':
                extrudeLine(ops, xOffset, yOffset, currentPosition, firstMove);
                currentPosition = firstMove;
                break;

            default: break;
            }
        }
    });

    ops.push(op.save());
    ops.push(op.gs('fillStyle', 'white'));
    ops.push(op.gs('strokeStyle', 'white'));
    ops.push(op.gs('lineWidth', 2));
    paths.forEach((path) => {
        ops.push(op.begin());
        const commands = path.commands;
        for (let i = 0; i < commands.length; i += 1) {
            const cmd = commands[i];
            switch (cmd.type) {
            case 'M':
                ops.push(op.moveTo(point(cmd.x, cmd.y)));
                break;

            case 'L':
                ops.push(op.lineTo(point(cmd.x, cmd.y)));
                break;

            case 'C': {
                const c1 = point(cmd.x1, cmd.y1);
                const c2 = point(cmd.x2, cmd.y2);
                const p2 = point(cmd.x, cmd.y);
                ops.push(op.cubicTo(c1, c2, p2));
                break;
            }

            case 'Q': {
                const c1 = point(cmd.x1, cmd.y1);
                const p2 = point(cmd.x, cmd.y);
                ops.push(op.quadraticTo(c1, p2));
                break;
            }

            case 'Z':
                ops.push(op.closePath());
                break;

            default: break;
            }
        }
        ops.push(op.fillAndStroke());
    });
    ops.push(op.restore());
    return ops;
}
