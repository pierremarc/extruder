
import { mat3, vec2 } from 'gl-matrix';

class Point {
    constructor(x, y) {
        Object.defineProperty(this, 'x', { value: x });
        Object.defineProperty(this, 'y', { value: y });
    }

    static fromObject(obj) {
        const { x, y } = obj;
        return (new Point(x, y));
    }

    toObject() {
        return {x: this.x, y: this.y};
    }

    plus(p) {
        return (new Point(this.x + p.x, this.y + p.y));
    }

    minus(p) {
        return (new Point(this.x - p.x, this.y - p.y));
    }

    mul(p) {
        return (new Point(this.x * p.x, this.y * p.y));
    }

    div(p) {
        return (new Point(this.x / p.x, this.y / p.y));
    }

    equals(p) {
        if (Math.abs(p.x - this.x) > Number.EPSILON) return false;
        if (Math.abs(p.y - this.y) > Number.EPSILON) return false;
        return true;
    }

    lerp(p, t) {
        const rx = this.x + ((p.x - this.x) * t);
        const ry = this.y + ((p.y - this.y) * t);
        return (new Point(rx, ry));
    }

    coordinates() {
        return [this.x, this.y];
    }

    scaled(sx, sy, origin = null) {
        const m = mat3.create();
        if (origin) {
            mat3.translate(m, m, [origin.x, origin.y]);
            mat3.scale(m, m, [sx, sy]);
            mat3.translate(m, m, [-origin.x, -origin.y]);
        }
        else {
            mat3.scale(m, m, [sx, sy]);
        }
        const input = vec2.fromValues(this.x, this.y);
        const output = vec2.create();
        vec2.transformMat3(output, input, m);
        return (new Point(output[0], output[1]));
    }

    // translated(v) {
    //     const mat = mat3.fromTranslation(mat3.create(), v);
    //     const input = vec2.fromValues(this.x, this.y);
    //     const output = vec2.create();
    //     vec2.transformMat3(output, input, mat);
    //     return (new Point(output[0], output[1]));
    // }
}

function point(x, y) {
    if (!x && !y) {
        return (new Point(0, 0));
    }
    else if (Array.isArray(x)) {
        return (new Point(x[0], x[1]));
    }
    else if (y === undefined && 'x' in x && 'y' in x) {
        return (new Point(x.x, x.y));
    }
    return (new Point(x, y));
}

export default point;
