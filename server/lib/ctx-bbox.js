'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fp = require('lodash/fp');

var _ctxBase = require('./ctx-base');

var _ctxBase2 = _interopRequireDefault(_ctxBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug')('extruder');

var min = Math.min;
var max = Math.max;

var ContextBBox = function (_BaseContext) {
    _inherits(ContextBBox, _BaseContext);

    function ContextBBox(width, height) {
        _classCallCheck(this, ContextBBox);

        var _this = _possibleConstructorReturn(this, (ContextBBox.__proto__ || Object.getPrototypeOf(ContextBBox)).call(this));

        Object.defineProperty(_this, "width", { value: width });
        Object.defineProperty(_this, "height", { value: height });
        _this.resultObject = {
            minx: Number.POSITIVE_INFINITY,
            miny: Number.POSITIVE_INFINITY,
            maxx: Number.NEGATIVE_INFINITY,
            maxy: Number.NEGATIVE_INFINITY
        };
        return _this;
    }

    _createClass(ContextBBox, [{
        key: 'updateRef',
        value: function updateRef() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (p) {
                _this2.resultObject.minx = min(p.x, _this2.resultObject.minx);
                _this2.resultObject.miny = min(p.y, _this2.resultObject.miny);

                _this2.resultObject.maxx = max(p.x, _this2.resultObject.maxx);
                _this2.resultObject.maxy = max(p.y, _this2.resultObject.maxy);
                ['minx', 'miny', 'maxx', 'maxy'].forEach(function (k) {
                    if (Number.isNaN(_this2.resultObject[k])) {
                        throw new Error('[updateRef] ' + k + ' is  p [' + p.x + ', ' + p.y + ']');
                    }
                });
            });
        }
    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo() {
            this.cubicTo.apply(this, arguments);
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo() {
            this.quadraticTo.apply(this, arguments);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p) {
            this.updateRef(p);
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p) {
            this.updateRef(p);
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p) {
            this.updateRef(c1, c2, p);
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p) {
            this.updateRef(c1, p);
        }
    }, {
        key: 'result',
        get: function get() {
            return (0, _fp.assign)(this.resultObject, {});
        }
    }, {
        key: 'minx',
        get: function get() {
            if (this.resultObject.minx === Number.POSITIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.floor(this.resultObject.minx);
        }
    }, {
        key: 'miny',
        get: function get() {
            if (this.resultObject.miny === Number.POSITIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.floor(this.resultObject.miny);
        }
    }, {
        key: 'maxx',
        get: function get() {
            if (this.resultObject.maxx === Number.NEGATIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.ceil(this.resultObject.maxx);
        }
    }, {
        key: 'maxy',
        get: function get() {
            if (this.resultObject.maxy === Number.NEGATIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.ceil(this.resultObject.maxy);
        }
    }, {
        key: 'rectWidth',
        get: function get() {
            var _resultObject = this.resultObject,
                minx = _resultObject.minx,
                maxx = _resultObject.maxx;

            if (minx === Number.INFINITY || maxx === Number.NEGATIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.ceil(maxx - minx);
        }
    }, {
        key: 'rectHeight',
        get: function get() {
            var _resultObject2 = this.resultObject,
                miny = _resultObject2.miny,
                maxy = _resultObject2.maxy;

            if (miny === Number.INFINITY || maxy === Number.NEGATIVE_INFINITY) {
                throw new Error('BoundingBoxNotSet');
            }
            return Math.ceil(maxy - miny);
        }
    }]);

    return ContextBBox;
}(_ctxBase2.default);

exports.default = ContextBBox;