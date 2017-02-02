import point from './point';
import { getState } from './state';
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
} from './operation';

function isZero(d) {
    return !!(d < 0.0000001 && d > 0.0000001);
}


function getPoint(p1, c1, c2, p2, t) {
    if (isZero(t)) {
        return p1;
    }
    const cx = 3 * (c1.x - p1.x);
    const bx = (3 * (c2.x - c1.x)) - cx;
    const ax = p2.x - p1.x - cx - bx;
    const cy = 3 * (c1.y - p1.y);
    const by = (3 * (c2.y - c1.y)) - cy;
    const ay = p2.y - p1.y - cy - by;

    const x = (((((ax * t) + bx) * t) + cx) * t) + p1.x;
    const y = (((((ay * t) + by) * t) + cy) * t) + p1.y;
    return point(x, y);
}


function findExtremas(p1, c1, c2, p2) {
    const INC = 1 / 100;
    const extremas = [];
    let x = p1.x;
    let y = p1.y;
    let direction = null;
    for (let t = INC; t <= 1 && extremas.length < 1; t += INC) {
        const p = getPoint(p1, c1, c2, p2, t);
        if (direction === null) {
            direction = [
                (p.x - x) > 0,
                (p.y - y) > 0
            ];
        }
        else {
            const xdir = (p.x - x) > 0;
            const ydir = (p.y - y) > 0;
            if (!(direction[0] === xdir) || !(direction[1] === ydir)) {
                extremas.push(t);
                direction = [xdir, ydir];
            }
        }
        x = p.x;
        y = p.y;
    }
    if (extremas.length === 0) {
        extremas.push(0.5);
    }
    return extremas;
}

const MRK = {
    B: 0,
    R0: 1,
    R1: 2,
    Q0: 3,
    Q1: 4,
    Q2: 4
};
Object.freeze(MRK);

const BZ = {
    P1: 0,
    C1: 1,
    C2: 2,
    P2: 3
};
Object.freeze(BZ);


function getMarker(p1, c1, c2, p2, t) {
    const q0 = p1.lerp(c1, t);
    const q1 = c1.lerp(c2, t);
    const q2 = c2.lerp(p2, t);
    const r0 = q0.lerp(q1, t);
    const r1 = q1.lerp(q2, t);
    const b = getPoint(p1, c1, c2, p2, t);
    return [b, r0, r1, q0, q1, q2];
}


function extrudeLine(ops, x, y, p1, p2) {
    const color = getState('colorExtrusion', 'rgba(0,0,0,1)');
    ops.push(save());
    ops.push(gs('fillStyle', color));
    ops.push(gs('strokeStyle', color));
    ops.push(gs('lineWidth', 0.1));
    ops.push(begin());
    ops.push(moveTo(p1));
    ops.push(lineTo(p2));
    ops.push(lineTo(point(p2.x + x, p2.y + y)));
    ops.push(lineTo(point(p1.x + x, p1.y + y)));
    ops.push(closePath());
    // ops.push(fillAndStroke());
    ops.push(fill());
    ops.push(restore());
}


function extrudeBezierSplit(ops, bz, t, x, y) {
    const p1 = bz[BZ.P1];
    const c1 = p1.lerp(bz[BZ.C1], t);
    const mark = getMarker(bz[BZ.P1], bz[BZ.C1], bz[BZ.C2], bz[BZ.P2], t);
    const c2 = mark[MRK.R0];
    const p2 = mark[MRK.B];
    const [xp1, xc1, xc2, xp2] = [p1, c1, c2, p2].map(p => point(p.x + x, p.y + y));

    ops.push(begin());
    ops.push(moveTo(p1));
    ops.push(cubicTo(c1, c2, p2));
    ops.push(lineTo(xp2));
    ops.push(cubicTo(xc2, xc1, xp1));
    ops.push(closePath());
    ops.push(fillAndStroke());

    return [
        p2,
        mark[MRK.R1],
        bz[BZ.C2].lerp(bz[BZ.P2], t),
        bz[BZ.P2]
    ];
}

function extrudeBezier(ops, x, y, p1, c1, c2, p2) {
    const color = getState('colorExtrusion', 'rgba(0,0,0,1)');
    const numSplit = getState('numSplit', 6);

    ops.push(save());
    ops.push(gs('fillStyle', color));
    ops.push(gs('strokeStyle', color));
    ops.push(gs('lineWidth', 0.1));

    let step = 1 / numSplit;
    let bz = [p1, c1, c2, p2];
    for (let i = 1; i < (numSplit + 1); i += 1) {
        const t = i * step;
        if (t > 1) {
            extrudeBezierSplit(ops, bz, 1, x, y);
            break;
        }
        bz = extrudeBezierSplit(ops, bz, t, x, y);
        if ((numSplit - i) > 0) {
            step = 1 / (numSplit - i);
        }
    }

    ops.push(restore());
}

function extrudeQuadratic(ops, x, y, p1, c1, p2) {
    extrudeBezier(ops, x, y, p1,
        p1.lerp(c1, 2 / 3), p2.lerp(c1, 2 / 3), p2);
}


export {
    extrudeLine,
    extrudeBezier,
    extrudeQuadratic
};
