
import PDFDocument from 'pdfkit';
import BaseContext from './ctx-base';
import { debug } from 'debug';
console.log(debug);
const log = debug('PDF');

class ContextPDF extends BaseContext {
    constructor(options) {
        super();
        this.options = options;

        const doc = new PDFDocument({
            autoFirstPage: false
        });

        doc.pipe(options.stream);

        doc.addPage({
            size: [options.width, options.height],
            margin: 0
        });

        Object.defineProperty(this, 'ctx', {
            value: doc
        });
    }

    get width() {
        return this.width;
    }

    get height() {
        return this.height;
    }

    end() {
        this.ctx.end();
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
        log(`moveTo ${p}`);
        this.ctx.moveTo(p.x, p.y);
    }

    lineTo(p) {
        log(`lineTo ${p}`);
        this.ctx.lineTo(p.x, p.y);
    }

    cubicTo(c1, c2, p) {
        log(`cubicTo ${c1} ${c2} ${p}`);
        this.ctx.bezierCurveTo(c1.x, c1.y,
            c2.x, c2.y,
            p.x, p.y);
    }

    quadraticTo(c1, p) {
        log(`quadraticTo ${c1} ${p}`);
        this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
    }

    closePath() {
        this.ctx.closePath();
    }

    set(k, v) {
        log(`set ${k} ${v}`);
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

    transform(a, b, c, d, e, f) {
        log(`transform ${a} ${b} ${c} ${d} ${e} ${f}`);
        try {
            this.ctx.transform(a, b, c, d, e, f);
        }
        catch (e) {
            console.error('PDF failed to transform', a, b, c, d, e, f);
            console.error(e);
        }
    }
}

export default ContextPDF;
