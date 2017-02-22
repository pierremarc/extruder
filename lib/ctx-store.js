
import BaseContext from './ctx-base';

class ContextStore extends BaseContext {

    constructor(width, height) {
        super();
        Object.defineProperty(this, 'operations', { value: [] });
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
    }

    bezierCurveTo(...args) {
        this.curveTo(...args);
    }

    quadraticCurveTo(...args) {
        this.quadraticTo(...args);
    }

    save(op) {
        this.operations.push(op);
    }

    restore(op) {
        this.operations.push(op);
    }

    begin(op) {
        this.operations.push(op);
    }

    moveTo(p, op) {
        this.operations.push(op);
    }

    lineTo(p, op) {
        this.operations.push(op);
    }

    cubicTo(c1, c2, p, op) {
        this.operations.push(op);
    }

    quadraticTo(c1, p, op) {
        this.operations.push(op);
    }

    closePath(op) {
        this.operations.push(op);
    }

    set(k, v, op) {
        this.operations.push(op);
    }

    stroke(op) {
        this.operations.push(op);
    }

    fill(op) {
        this.operations.push(op);
    }

    fillAndStroke(op) {
        this.operations.push(op);
    }

    transform(a, b, c, d, e, f, op) {
        this.operations.push(op);
    }
}


export default ContextStore;
