'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        Object.defineProperty(this, 'x', { value: x });
        Object.defineProperty(this, 'y', { value: y });
    }

    _createClass(Point, [{
        key: 'toObject',
        value: function toObject() {
            return { x: this.x, y: this.y };
        }
    }, {
        key: 'plus',
        value: function plus(p) {
            return new Point(this.x + p.x, this.y + p.y);
        }
    }, {
        key: 'minus',
        value: function minus(p) {
            return new Point(this.x - p.x, this.y - p.y);
        }
    }, {
        key: 'mul',
        value: function mul(p) {
            return new Point(this.x * p.x, this.y * p.y);
        }
    }, {
        key: 'div',
        value: function div(p) {
            return new Point(this.x / p.x, this.y / p.y);
        }
    }, {
        key: 'equals',
        value: function equals(p) {
            if (Math.abs(p.x - this.x) > Number.EPSILON) return false;
            if (Math.abs(p.y - this.y) > Number.EPSILON) return false;
            return true;
        }
    }, {
        key: 'lerp',
        value: function lerp(p, t) {
            var rx = this.x + (p.x - this.x) * t;
            var ry = this.y + (p.y - this.y) * t;
            return new Point(rx, ry);
        }
    }, {
        key: 'coordinates',
        value: function coordinates() {
            return [this.x, this.y];
        }
    }, {
        key: 'scaled',
        value: function scaled(sx, sy) {
            var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var m = _glMatrix.mat3.create();
            if (origin) {
                _glMatrix.mat3.translate(m, m, [origin.x, origin.y]);
                _glMatrix.mat3.scale(m, m, [sx, sy]);
                _glMatrix.mat3.translate(m, m, [-origin.x, -origin.y]);
            } else {
                _glMatrix.mat3.scale(m, m, [sx, sy]);
            }
            var input = _glMatrix.vec2.fromValues(this.x, this.y);
            var output = _glMatrix.vec2.create();
            _glMatrix.vec2.transformMat3(output, input, m);
            return new Point(output[0], output[1]);
        }

        // translated(v) {
        //     const mat = mat3.fromTranslation(mat3.create(), v);
        //     const input = vec2.fromValues(this.x, this.y);
        //     const output = vec2.create();
        //     vec2.transformMat3(output, input, mat);
        //     return (new Point(output[0], output[1]));
        // }

    }], [{
        key: 'fromObject',
        value: function fromObject(obj) {
            var x = obj.x,
                y = obj.y;

            return new Point(x, y);
        }
    }]);

    return Point;
}();

function point(x, y) {
    if (!x && !y) {
        return new Point(0, 0);
    } else if (Array.isArray(x)) {
        return new Point(x[0], x[1]);
    } else if (y === undefined && 'x' in x && 'y' in x) {
        return new Point(x.x, x.y);
    }
    return new Point(x, y);
}

exports.default = point;