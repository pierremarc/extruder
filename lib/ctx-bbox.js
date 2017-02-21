
import { assign } from 'lodash/fp';
import BaseContext from './ctx-base';

const debug = require('debug')('extruder');

const min = Math.min;
const max = Math.max;

class ContextBBox extends BaseContext {

    constructor(width, height) {
        super();
        Object.defineProperty(this, "width", {value: width});
        Object.defineProperty(this, "height", {value: height});
        this.resultObject = {
            minx: Number.POSITIVE_INFINITY,
            miny: Number.POSITIVE_INFINITY,
            maxx: Number.NEGATIVE_INFINITY,
            maxy: Number.NEGATIVE_INFINITY
        };
    }

    get result() {
        return assign(this.resultObject, {});
    }

    get minx() {
        if (this.resultObject.minx === Number.POSITIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.floor(this.resultObject.minx);
    }

    get miny() {
        if (this.resultObject.miny === Number.POSITIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.floor(this.resultObject.miny);
    }

    get maxx() {
        if (this.resultObject.maxx === Number.NEGATIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.ceil(this.resultObject.maxx);
    }

    get maxy() {
        if (this.resultObject.maxy === Number.NEGATIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.ceil(this.resultObject.maxy);
    }


    get rectWidth() {
        const { minx, maxx } = this.resultObject;
        if (minx === Number.INFINITY || maxx === Number.NEGATIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.ceil(maxx - minx);
    }

    get rectHeight() {
        const { miny, maxy } = this.resultObject;
        if (miny === Number.INFINITY || maxy === Number.NEGATIVE_INFINITY) {
            throw (new Error('BoundingBoxNotSet'));
        }
        return Math.ceil(maxy - miny);
    }

    updateRef(...args) {
        args.forEach((p) => {
            this.resultObject.minx = min(p.x, this.resultObject.minx);
            this.resultObject.miny = min(p.y, this.resultObject.miny);

            this.resultObject.maxx = max(p.x, this.resultObject.maxx);
            this.resultObject.maxy = max(p.y, this.resultObject.maxy);
            ['minx', 'miny', 'maxx', 'maxy'].forEach((k) => {
                if (Number.isNaN(this.resultObject[k])) {
                    throw (new Error(`[updateRef] ${k} is  p [${p.x}, ${p.y}]`));
                }
            });
        });
    }

    bezierCurveTo(...args) {
        this.cubicTo(...args);
    }

    quadraticCurveTo(...args) {
        this.quadraticTo(...args);
    }

    moveTo(p) {
        this.updateRef(p);
    }

    lineTo(p) {
        this.updateRef(p);
    }

    cubicTo(c1, c2, p) {
        this.updateRef(c1, c2, p);
    }

    quadraticTo(c1, p) {
        this.updateRef(c1, p);
    }

}


export default ContextBBox;
