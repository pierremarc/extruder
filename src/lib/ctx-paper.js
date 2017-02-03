
import { Project, Path, CompoundPath, Point } from 'paper';
import BaseContext from './ctx-base';
import {
    begin,
    moveTo,
    lineTo,
    cubicTo,
    closePath
} from '../lib/operation';

import point from './point';

function p2p(p) {
    return (new Point(p.x, p.y));
}

const canvas = document.createElement('canvas');
canvas.width = 1;
canvas.height = 1;
document.body.appendChild(canvas);
const prj = new Project(canvas);


/*
from paperjs
*/
function drawSegments(path, moveTo, lineTo, bezierCurveTo) {
    const segments = path._segments;
    const length = segments.length;
    let first = true;
    let curX;
    let curY;
    let prevX;
    let prevY;
    let inX;
    let inY;
    let outX;
    let outY;

    const drawSegment = function (segment) {
        let point = segment._point;
        curX = point._x;
        curY = point._y;

        if (first) {
            moveTo(curX, curY);
            first = false;
        }
        else {
            const handle = segment._handleIn;
            inX = curX + handle._x;
            inY = curY + handle._y;

            if (inX === curX && inY === curY
                && outX === prevX && outY === prevY) {
                lineTo(curX, curY);
            }
            else {
                bezierCurveTo(outX, outY, inX, inY, curX, curY);
            }
        }
        prevX = curX;
        prevY = curY;

        const handle = segment._handleOut;
        outX = prevX + handle._x;
        outY = prevY + handle._y;
    };

    for (let i = 0; i < length; i += 1) {
        drawSegment(segments[i]);
    }
    // Close path by drawing first segment again
    if (path._closed && length > 0) {
        drawSegment(segments[0]);
    }
}


class ContextPaper extends BaseContext {

    constructor(isMask = false) {
        super();
        this.isMask = isMask;
        this.paths = [];
        this.operations = {};
        if (isMask) {
            this.isStarted = false;
        }
    }

    get currentPath() {
        if (this.paths.length === 0) {
            throw (new Error('ThereAintAnyPath'));
        }
        return this.paths[this.paths.length - 1];
    }

    get mask() {
        if (!this.isMask) {
            throw (new Error('NotAMask'));
        }
        return this.currentPath;
    }

    substract(ref) {
        const subs = [];
        const mask = ref.mask.clone({ insert: false, deep: true });
        this.paths.forEach((path) => {
            const cp = path.clone({ insert: false, deep: true });
            if (mask.intersects(cp)) {
                subs.push(cp.subtract(mask));
            }
            else {
                subs.push(path);
            }
            // const sub = ref.paths.reduce((path, mask) => {
            //     const cp = path.clone({ insert: false, deep: true });
            //     const cm = mask.clone({ insert: false, deep: true });
            //     if (cm.intersects(cp)) {
            //         return cp.subtract(cm);
            //     }
            //     return path;
            // }, p);
            // subs.push(sub);
        });
        this.paths = subs;
    }


    storeOp(opArg) {
        const idx = this.paths.length;
        if (!(idx in this.operations)) {
            this.operations[idx] = [];
        }
        this.operations[idx].push(opArg);
    }

    exportOperations() {
        let ops = [];
        const mt = (x, y) => {
            ops.push(moveTo(point(x, y)));
        };

        const lt = (x, y) => {
            ops.push(lineTo(point(x, y)));
        };

        const ct = (cx, cy, ccx, ccy, x, y) => {
            ops.push(cubicTo(
                point(cx, cy),
                point(ccx, ccy),
                point(x, y)
            ));
        };

        for (let i = 0; i < this.paths.length; i += 1) {
            if (i in this.operations) {
                ops = ops.concat(this.operations[i]);
            }
            const path = this.paths[i];
            if (path instanceof CompoundPath) {
                console.warn('CompoundPath!');
                path.children.forEach((c) => {
                    ops.push(begin());
                    drawSegments(c, mt, lt, ct);
                    ops.push(closePath());
                });
            }
            else {
                ops.push(begin());
                drawSegments(path, mt, lt, ct);
                ops.push(closePath());
            }
        }
        return ops;
    }

    bezierCurveTo(...args) {
        this.curveTo(...args);
    }

    quadraticCurveTo(...args) {
        this.quadraticTo(...args);
    }

    save(opArg) {
        this.storeOp(opArg);
    }

    restore(opArg) {
        this.storeOp(opArg);
    }

    begin(opArg) {
        if (this.isMask && !this.isStarted) {
            this.storeOp(opArg);
            this.paths.push(new CompoundPath());
            this.isStarted = true;
        }
        else {
            this.storeOp(opArg);
            this.paths.push(new Path());
        }
    }

    moveTo(p) {
        this.currentPath.moveTo(p2p(p));
    }

    lineTo(p) {
        this.currentPath.lineTo(p2p(p));
    }

    cubicTo(c1, c2, p) {
        this.currentPath.cubicCurveTo(p2p(c1), p2p(c2), p2p(p));
    }

    quadraticTo(c1, p) {
        this.currentPath.quadraticCurveTo(p2p(c1), p2p(p));
    }

    closePath(opArg) {
        this.storeOp(opArg);
        this.currentPath.closePath();
    }

    set(k, v, opArg) {
        this.storeOp(opArg);
    }

    stroke(opArg) {
        this.storeOp(opArg);
    }

    fill(opArg) {
        this.storeOp(opArg);
    }

    fillAndStroke(opArg) {
        this.storeOp(opArg);
    }
}

export default ContextPaper;
