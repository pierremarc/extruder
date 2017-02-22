'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pdfkit = require('pdfkit');

var _pdfkit2 = _interopRequireDefault(_pdfkit);

var _ctxBase = require('./ctx-base');

var _ctxBase2 = _interopRequireDefault(_ctxBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextPDF = function (_BaseContext) {
    _inherits(ContextPDF, _BaseContext);

    function ContextPDF(options) {
        _classCallCheck(this, ContextPDF);

        var _this = _possibleConstructorReturn(this, (ContextPDF.__proto__ || Object.getPrototypeOf(ContextPDF)).call(this));

        _this.options = options;

        var doc = new _pdfkit2.default({
            autoFirstPage: false
        });

        doc.pipe(options.stream);

        doc.addPage({
            size: [options.width, options.height],
            margin: 0
        });

        Object.defineProperty(_this, 'ctx', {
            value: doc
        });
        return _this;
    }

    _createClass(ContextPDF, [{
        key: 'end',
        value: function end() {
            this.ctx.end();
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
            if (k === 'strokeStyle') {
                this.ctx.strokeColor(v);
            } else if (k === 'fillStyle') {
                this.ctx.fillColor(v);
            } else {
                try {
                    this.ctx[k](v);
                } catch (err) {
                    throw new Error('Wrong: ' + err.toString());
                }
            }
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
            this.ctx.fillAndStroke();
        }
    }, {
        key: 'transform',
        value: function transform(a, b, c, d, e, f) {
            try {
                this.ctx.transform(a, b, c, d, e, f);
            } catch (e) {
                console.error('PDF failed to transform', a, b, c, d, e, f);
                console.error(e);
            }
        }
    }, {
        key: 'width',
        get: function get() {
            return this.width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.height;
        }
    }]);

    return ContextPDF;
}(_ctxBase2.default);

exports.default = ContextPDF;