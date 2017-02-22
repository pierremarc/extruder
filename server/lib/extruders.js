'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extrudeQuadratic = exports.extrudeBezier = exports.extrudeLine = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

var _state = require('./state');

var _operation = require('./operation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isZero(d) {
    return !!(d < 0.0000001 && d > -0.0000001);
}

function getPoint(p1, c1, c2, p2, t) {
    if (isZero(t)) {
        return p1;
    }
    var cx = 3 * (c1.x - p1.x);
    var bx = 3 * (c2.x - c1.x) - cx;
    var ax = p2.x - p1.x - cx - bx;
    var cy = 3 * (c1.y - p1.y);
    var by = 3 * (c2.y - c1.y) - cy;
    var ay = p2.y - p1.y - cy - by;

    var x = ((ax * t + bx) * t + cx) * t + p1.x;
    var y = ((ay * t + by) * t + cy) * t + p1.y;
    return (0, _point2.default)(x, y);
}

function findExtremas(p1, c1, c2, p2) {
    var INC = 1 / 100;
    var extremas = [];
    var x = p1.x;
    var y = p1.y;
    var direction = null;
    for (var t = INC; t <= 1 && extremas.length < 1; t += INC) {
        var p = getPoint(p1, c1, c2, p2, t);
        if (direction === null) {
            direction = [p.x - x > 0, p.y - y > 0];
        } else {
            var xdir = p.x - x > 0;
            var ydir = p.y - y > 0;
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

var MRK = {
    B: 0,
    R0: 1,
    R1: 2,
    Q0: 3,
    Q1: 4,
    Q2: 4
};
Object.freeze(MRK);

var BZ = {
    P1: 0,
    C1: 1,
    C2: 2,
    P2: 3
};
Object.freeze(BZ);

function getMarker(p1, c1, c2, p2, t) {
    var q0 = p1.lerp(c1, t);
    var q1 = c1.lerp(c2, t);
    var q2 = c2.lerp(p2, t);
    var r0 = q0.lerp(q1, t);
    var r1 = q1.lerp(q2, t);
    var b = getPoint(p1, c1, c2, p2, t);
    return [b, r0, r1, q0, q1, q2];
}

function extrudeLine(state, ops, x, y, p1, p2) {
    var color = state.colorExtrusion;
    ops.push((0, _operation.save)());
    ops.push((0, _operation.gs)('fillStyle', color));
    ops.push((0, _operation.gs)('strokeStyle', color));
    ops.push((0, _operation.gs)('lineWidth', state.extrusionLineWidth || 0.5));
    ops.push((0, _operation.begin)());
    ops.push((0, _operation.moveTo)(p1));
    ops.push((0, _operation.lineTo)(p2));
    ops.push((0, _operation.lineTo)((0, _point2.default)(p2.x + x, p2.y + y)));
    ops.push((0, _operation.lineTo)((0, _point2.default)(p1.x + x, p1.y + y)));
    ops.push((0, _operation.closePath)());
    if (isZero(state.extrusionLineWidth)) {
        ops.push((0, _operation.fill)());
    } else {
        ops.push((0, _operation.fillAndStroke)());
    }
    ops.push((0, _operation.restore)());
}

function extrudeBezierSplit(state, ops, bz, t, x, y) {
    var p1 = bz[BZ.P1];
    var c1 = p1.lerp(bz[BZ.C1], t);
    var mark = getMarker(bz[BZ.P1], bz[BZ.C1], bz[BZ.C2], bz[BZ.P2], t);
    var c2 = mark[MRK.R0];
    var p2 = mark[MRK.B];

    var _map = [p1, c1, c2, p2].map(function (p) {
        return (0, _point2.default)(p.x + x, p.y + y);
    }),
        _map2 = _slicedToArray(_map, 4),
        xp1 = _map2[0],
        xc1 = _map2[1],
        xc2 = _map2[2],
        xp2 = _map2[3];

    ops.push((0, _operation.begin)());
    ops.push((0, _operation.moveTo)(p1));
    ops.push((0, _operation.cubicTo)(c1, c2, p2));
    ops.push((0, _operation.lineTo)(xp2));
    ops.push((0, _operation.cubicTo)(xc2, xc1, xp1));
    ops.push((0, _operation.closePath)());
    if (isZero(state.extrusionLineWidth)) {
        ops.push((0, _operation.fill)());
    } else {
        ops.push((0, _operation.fillAndStroke)());
    }

    return [p2, mark[MRK.R1], bz[BZ.C2].lerp(bz[BZ.P2], t), bz[BZ.P2]];
}

function extrudeBezier(state, ops, x, y, p1, c1, c2, p2) {
    var color = state.colorExtrusion;
    var numSplit = state.numSplit;

    ops.push((0, _operation.save)());
    ops.push((0, _operation.gs)('fillStyle', color));
    ops.push((0, _operation.gs)('strokeStyle', color));
    ops.push((0, _operation.gs)('lineWidth', state.extrusionLineWidth || 0.5));

    var step = 1 / numSplit;
    var bz = [p1, c1, c2, p2];
    for (var i = 1; i < numSplit + 1; i += 1) {
        var t = i * step;
        if (t > 1) {
            extrudeBezierSplit(state, ops, bz, 1, x, y);
            break;
        }
        extrudeBezierSplit(state, ops, bz, t * 1.2, x, y);
        bz = extrudeBezierSplit(state, [], bz, t, x, y);
        if (numSplit - i > 0) {
            step = 1 / (numSplit - i);
        }
    }

    ops.push((0, _operation.restore)());
}

function extrudeQuadratic(state, ops, x, y, p1, c1, p2) {
    extrudeBezier(state, ops, x, y, p1, p1.lerp(c1, 2 / 3), p2.lerp(c1, 2 / 3), p2);
}

exports.extrudeLine = extrudeLine;
exports.extrudeBezier = extrudeBezier;
exports.extrudeQuadratic = extrudeQuadratic;