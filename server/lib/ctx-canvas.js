'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ctxBase = require('./ctx-base');

var _ctxBase2 = _interopRequireDefault(_ctxBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextCanvas = function (_BaseContext) {
    _inherits(ContextCanvas, _BaseContext);

    function ContextCanvas(canvasElement) {
        _classCallCheck(this, ContextCanvas);

        var _this = _possibleConstructorReturn(this, (ContextCanvas.__proto__ || Object.getPrototypeOf(ContextCanvas)).call(this));

        Object.defineProperty(_this, 'ctx', {
            value: canvasElement.getContext('2d')
        });
        Object.defineProperty(_this, 'canvasElement', {
            value: canvasElement
        });
        return _this;
    }

    _createClass(ContextCanvas, [{
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        }
    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo() {
            var _ctx;

            (_ctx = this.ctx).bezierCurveTo.apply(_ctx, arguments);
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo() {
            var _ctx2;

            (_ctx2 = this.ctx).quadraticCurveTo.apply(_ctx2, arguments);
        }
    }, {
        key: 'save',
        value: function save() {
            this.ctx.save();
        }
    }, {
        key: 'restore',
        value: function restore() {
            this.ctx.restore();
        }
    }, {
        key: 'begin',
        value: function begin() {
            this.ctx.beginPath();
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p) {
            this.ctx.moveTo(p.x, p.y);
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p) {
            this.ctx.lineTo(p.x, p.y);
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p) {
            this.ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p) {
            this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            this.ctx.closePath();
        }
    }, {
        key: 'set',
        value: function set(k, v) {
            this.ctx[k] = v;
        }
    }, {
        key: 'stroke',
        value: function stroke() {
            this.ctx.stroke();
        }
    }, {
        key: 'fill',
        value: function fill() {
            this.ctx.fill();
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke() {
            this.fill();
            this.stroke();
        }
    }, {
        key: 'width',
        get: function get() {
            return this.canvasElement.width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.canvasElement.height;
        }
    }]);

    return ContextCanvas;
}(_ctxBase2.default);

exports.default = ContextCanvas;