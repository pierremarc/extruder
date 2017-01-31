
import BaseContext from './ctx-base';

class ContextPDF extends BaseContext {
    constructor(doc) {
        Object.defineProperty(this, 'ctx', {
            value: doc
        });
    }

    bezierCurveTo(...args) {
        this.ctx.bezierCurveTo(...args);
    }

    quadraticCurveTo(...args) {
        this.ctx.quadraticCurveTo(...args);
    }

    save() {
        this.ctx.save();
    }

    restore() {
        this.ctx.restore();
    }

    moveTo(p) {
        this.ctx.moveTo(p.x, p.y);
    }

    lineTo(p) {
        this.ctx.lineTo(p.x, p.y);
    }

    cubicTo(c1, c2, p) {
        this.ctx.bezierCurveTo(c1.x, c1.y,
                               c2.x, c2.y,
                               p.x, p.y);
    }

    quadraticTo(c1, p) {
        this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
    }

    closePath() {
        this.ctx.closePath();
    }

    set(k, v) {
        if (k === 'strokeStyle') {
            this.ctx.strokeColor(v);
        }
        else if (k === 'fillStyle') {
            this.ctx.fillColor(v);
        }
        else {
            try {
                this.ctx[k](v);
            }
            catch (err) {
                throw (new Error(`Wrong: ${err.toString()}`));
            }
        }
    }

    stroke() {
        this.ctx.stroke();
    }

    fill() {
        this.ctx.fill();
    }

    fillAndStroke() {
        this.ctx.fillAndStroke();
    }
}

export default ContextPDF;
