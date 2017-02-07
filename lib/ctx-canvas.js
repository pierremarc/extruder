
import BaseContext from './ctx-base';

class ContextCanvas extends BaseContext {

    constructor(canvasElement) {
        super();
        Object.defineProperty(this, 'ctx', {
            value: canvasElement.getContext('2d')
        });
        Object.defineProperty(this, 'canvasElement', {
            value: canvasElement
        });
    }

    clear() {
        this.ctx.clearRect(0, 0,
            this.canvasElement.width, this.canvasElement.height);
    }

    get width() {
        return this.canvasElement.width;
    }

    get height() {
        return this.canvasElement.height;
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

    begin() {
        this.ctx.beginPath();
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
        this.ctx[k] = v;
    }

    stroke() {
        this.ctx.stroke();
    }

    fill() {
        this.ctx.fill();
    }

    fillAndStroke() {
        this.fill();
        this.stroke();
    }
}

export default ContextCanvas;
