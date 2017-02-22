'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OP_RESTORE = exports.OP_SAVE = exports.OP_FILL_STROKE = exports.OP_FILL = exports.OP_STROKE = exports.OP_SET = exports.OP_CLOSE = exports.OP_QUADRATIC = exports.OP_CUBIC = exports.OP_LINE = exports.OP_MOVE = exports.OP_BEGIN = undefined;
exports.begin = begin;
exports.moveTo = moveTo;
exports.lineTo = lineTo;
exports.cubicTo = cubicTo;
exports.quadraticTo = quadraticTo;
exports.closePath = closePath;
exports.gs = gs;
exports.stroke = stroke;
exports.fill = fill;
exports.fillAndStroke = fillAndStroke;
exports.save = save;
exports.restore = restore;
exports.render = render;

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OP_BEGIN = exports.OP_BEGIN = 'b';
var OP_MOVE = exports.OP_MOVE = 'm';
var OP_LINE = exports.OP_LINE = 'l';
var OP_CUBIC = exports.OP_CUBIC = 'c';
var OP_QUADRATIC = exports.OP_QUADRATIC = 'q';
var OP_CLOSE = exports.OP_CLOSE = 'z';
var OP_SET = exports.OP_SET = 's';
var OP_STROKE = exports.OP_STROKE = 'S';
var OP_FILL = exports.OP_FILL = 'F';
var OP_FILL_STROKE = exports.OP_FILL_STROKE = 'FS';
var OP_SAVE = exports.OP_SAVE = 'SA';
var OP_RESTORE = exports.OP_RESTORE = 'R';

function begin() {
    return [OP_BEGIN];
}

function moveTo(pt) {
    return [OP_MOVE, pt.coordinates()];
}

function lineTo(pt) {
    return [OP_LINE, pt.coordinates()];
}

function cubicTo(c1, c2, pt) {
    return [OP_CUBIC, c1.coordinates(), c2.coordinates(), pt.coordinates()];
}

function quadraticTo(c1, pt) {
    return [OP_QUADRATIC, c1.coordinates(), pt.coordinates()];
}

function closePath() {
    return [OP_CLOSE];
}

function gs(k, v) {
    return [OP_SET, k, v];
}

function stroke() {
    return [OP_STROKE];
}

function fill() {
    return [OP_FILL];
}

function fillAndStroke() {
    return [OP_FILL_STROKE];
}

function save() {
    return [OP_SAVE];
}

function restore() {
    return [OP_RESTORE];
}

// rendering

function renderBegin(ctx, op) {
    ctx.begin(op);
}

function renderMoveTo(ctx, op) {
    var coordinates = op[1];
    var p = (0, _point2.default)(coordinates);
    ctx.moveTo(p, op);
}

function renderLineTo(ctx, op) {
    var p = (0, _point2.default)(op[1]);
    ctx.lineTo(p, op);
}

function renderCubicTo(ctx, op) {
    var c1 = (0, _point2.default)(op[1]);
    var c2 = (0, _point2.default)(op[2]);
    var p = (0, _point2.default)(op[3]);
    ctx.cubicTo(c1, c2, p, op);
}

function renderQuadraticTo(ctx, op) {
    var c1 = (0, _point2.default)(op[1]);
    var p = (0, _point2.default)(op[2]);
    ctx.quadraticTo(c1, p, op);
}

function renderClosePath(ctx, op) {
    ctx.closePath(op);
}

function renderGS(ctx, op) {
    ctx.set(op[1], op[2], op);
}

function renderStroke(ctx, op) {
    ctx.stroke(op);
}

function renderFill(ctx, op) {
    ctx.fill(op);
}

function renderFillAndStroke(ctx, op) {
    ctx.fillAndStroke(op);
}

function renderSave(ctx, op) {
    ctx.save(op);
}

function renderRestore(ctx, op) {
    ctx.restore(op);
}

function render(ctx, operations) {
    operations.forEach(function (op) {
        var opCode = op[0];

        if (OP_BEGIN === opCode) {
            renderBegin(ctx, op);
        } else if (OP_MOVE === opCode) {
            renderMoveTo(ctx, op);
        } else if (OP_LINE === opCode) {
            renderLineTo(ctx, op);
        } else if (OP_CUBIC === opCode) {
            renderCubicTo(ctx, op);
        } else if (OP_QUADRATIC === opCode) {
            renderQuadraticTo(ctx, op);
        } else if (OP_CLOSE === opCode) {
            renderClosePath(ctx, op);
        } else if (OP_SET === opCode) {
            renderGS(ctx, op);
        } else if (OP_STROKE === opCode) {
            renderStroke(ctx, op);
        } else if (OP_FILL === opCode) {
            renderFill(ctx, op);
        } else if (OP_FILL_STROKE === opCode) {
            renderFillAndStroke(ctx, op);
        } else if (OP_SAVE === opCode) {
            renderSave(ctx, op);
        } else if (OP_RESTORE === opCode) {
            renderRestore(ctx, op);
        }
    });
}

exports.default = {
    begin: begin,
    moveTo: moveTo,
    lineTo: lineTo,
    cubicTo: cubicTo,
    quadraticTo: quadraticTo,
    closePath: closePath,
    gs: gs,
    stroke: stroke,
    fill: fill,
    fillAndStroke: fillAndStroke,
    save: save,
    restore: restore,
    render: render
};