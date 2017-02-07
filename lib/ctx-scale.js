
import { clone } from 'lodash/fp';
import operation from './operation';
import BaseContext from './ctx-base';


class ContextScale extends BaseContext {

    constructor(sx, sy, origin = null) {
        super();
        Object.defineProperty(this, 'sx', {
            value: sx
        });
        Object.defineProperty(this, 'sy', {
            value: sy
        });
        Object.defineProperty(this, 'origin', {
            value: origin
        });
        this.operationsList = [];
    }

    get operations() {
        return clone(this.operationsList);
    }

    bezierCurveTo(...args) {
        this.cubicTo(...args);
    }

    quadraticCurveTo(...args) {
        this.quadraticTo(...args);
    }

    save(op) {
        this.operationsList.push(op);
    }

    restore(op) {
        this.operationsList.push(op);
    }

    begin(op) {
        this.operationsList.push(op);
    }

    moveTo(p) {
        const sp = p.scaled(this.sx, this.sy, this.origin);
        this.operationsList.push(operation.moveTo(sp));
    }

    lineTo(p) {
        const sp = p.scaled(this.sx, this.sy, this.origin);
        this.operationsList.push(operation.lineTo(sp));
    }

    cubicTo(c1, c2, p) {
        const sc1 = c1.scaled(this.sx, this.sy, this.origin);
        const sc2 = c2.scaled(this.sx, this.sy, this.origin);
        const sp = p.scaled(this.sx, this.sy, this.origin);
        this.operationsList.push(operation.cubicTo(sc1, sc2, sp));
    }

    quadraticTo(c1, p) {
        const sc1 = c1.scaled(this.sx, this.sy, this.origin);
        const sp = p.scaled(this.sx, this.sy, this.origin);
        this.operationsList.push(operation.quadraticTo(sc1, sp));
    }

    closePath(op) {
        this.operationsList.push(op);
    }

    set(k, v, op) {
        this.operationsList.push(op);
    }

    stroke(op) {
        this.operationsList.push(op);
    }

    fill(op) {
        this.operationsList.push(op);
    }

    fillAndStroke(op) {
        this.operationsList.push(op);
    }
}


export default ContextScale;
