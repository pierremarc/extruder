
import point from './point';

const OP_BEGIN = 'b';
const OP_MOVE = 'm';
const OP_LINE = 'l';
const OP_CUBIC = 'c';
const OP_QUADRATIC = 'q';
const OP_CLOSE = 'z';
const OP_SET = 's';
const OP_STROKE = 'S';
const OP_FILL = 'F';
const OP_FILL_STROKE = 'FS';
const OP_SAVE = 'SA';
const OP_RESTORE = 'R';


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
    return [
        OP_CUBIC,
        c1.coordinates(),
        c2.coordinates(),
        pt.coordinates()
    ];
}

function quadraticTo(c1, pt) {
    return [
        OP_QUADRATIC,
        c1.coordinates(),
        pt.coordinates()
    ];
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
    const p = point(op[1]);
    ctx.moveTo(p, op);
}

function renderLineTo(ctx, op) {
    const p = point(op[1]);
    ctx.lineTo(p, op);
}

function renderCubicTo(ctx, op) {
    const c1 = point(op[1]);
    const c2 = point(op[2]);
    const p = point(op[3]);
    ctx.cubicTo(c1, c2, p, op);
}

function renderQuadraticTo(ctx, op) {
    const c1 = point(op[1]);
    const p = point(op[2]);
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
    operations.forEach((op) => {
        const opCode = op[0];

        if (OP_BEGIN === opCode) {
            renderBegin(ctx, op);
        }
        else if (OP_MOVE === opCode) {
            renderMoveTo(ctx, op);
        }
        else if (OP_LINE === opCode) {
            renderLineTo(ctx, op);
        }
        else if (OP_CUBIC === opCode) {
            renderCubicTo(ctx, op);
        }
        else if (OP_QUADRATIC === opCode) {
            renderQuadraticTo(ctx, op);
        }
        else if (OP_CLOSE === opCode) {
            renderClosePath(ctx, op);
        }
        else if (OP_SET === opCode) {
            renderGS(ctx, op);
        }
        else if (OP_STROKE === opCode) {
            renderStroke(ctx, op);
        }
        else if (OP_FILL === opCode) {
            renderFill(ctx, op);
        }
        else if (OP_FILL_STROKE === opCode) {
            renderFillAndStroke(ctx, op);
        }
        else if (OP_SAVE === opCode) {
            renderSave(ctx, op);
        }
        else if (OP_RESTORE === opCode) {
            renderRestore(ctx, op);
        }
    });
}


export default {
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
    restore,
    render
};
