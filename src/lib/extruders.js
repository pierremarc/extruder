import point from './point';
import op from './operation';


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


function getMarker(p1, c1, c2, p2, t) {
    const q0 = p1.lerp(c1, t);
    const q1 = c1.lerp(c2, t);
    const q2 = c2.lerp(p2, t);
    const r0 = q0.lerp(q1, t);
    const r1 = q1.lerp(q2, t);
    const b = getPoint(p1, c1, c2, p2, t);
    return [b, r0, r1];
}


function extrudeLine(ops, x, y, p1, p2) {
    ops.push(op.save());
    ops.push(op.gs('fillStyle', 'rgba(0,0,0,1)'));
    ops.push(op.gs('strokeStyle', 'rgba(0,0,0,1)'));
    ops.push(op.gs('lineWidth', 0.1));
    ops.push(op.begin());
    ops.push(op.moveTo(p1));
    ops.push(op.lineTo(p2));
    ops.push(op.lineTo(point(p2.x + x, p2.y + y)));
    ops.push(op.lineTo(point(p1.x + x, p1.y + y)));
    ops.push(op.closePath());
    ops.push(op.fillAndStroke());
    ops.push(op.restore());
}


function extrudeBezier(ops, x, y, p1, c1, c2, p2) {
    const points = [p1, c1, c2, p2];
    const extremas = findExtremas(...points);
    const t = extremas[0];
    const marker = getMarker(...points.concat(t));
    const markp = marker[0];
    const mark1 = marker[1];
    const mark2 = marker[2];

    ops.push(op.save());

    ops.push(op.gs('fillStyle', 'rgba(0,0,0,1)'));
    // ops.push(op.gs('strokeStyle', 'rgba(0,0,0,1)'));
    // ops.push(op.gs('lineWidth', 0.1));
    ops.push(op.gs('strokeStyle', 'rgba(0,255,0,1)'));
    ops.push(op.gs('lineWidth', 1));
    ops.push(op.begin());
    let cp = p1.lerp(c1, t);
    ops.push(op.moveTo(p1));
    ops.push(op.cubicTo(cp, mark1, markp));
    ops.push(op.lineTo(point(markp.x + x, markp.y + y)));
    ops.push(op.cubicTo(
        point(mark1.x + x, mark1.y + y),
        point(cp.x + x, cp.y + y),
        point(p1.x + x, p1.y + y)
    ));
    ops.push(op.closePath());
    ops.push(op.fillAndStroke());
    // ops.push(op.fill());

    ops.push(op.begin());
    cp = p2.lerp(c2, t);
    ops.push(op.moveTo(p2));
    ops.push(op.cubicTo(cp, mark2, markp));
    ops.push(op.lineTo(point(markp.x + x, markp.y + y)));
    ops.push(op.cubicTo(
        point(mark2.x + x, mark2.y + y),
        point(cp.x + x, cp.y + y),
        point(p2.x + x, p2.y + y)
    ));
    ops.push(op.closePath());
    ops.push(op.fillAndStroke());
    // ops.push(op.fill());

    ops.push(op.restore());
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
