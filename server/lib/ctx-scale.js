'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fp = require('lodash/fp');

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

var _ctxBase = require('./ctx-base');

var _ctxBase2 = _interopRequireDefault(_ctxBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextScale = function (_BaseContext) {
    _inherits(ContextScale, _BaseContext);

    function ContextScale(sx, sy) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, ContextScale);

        var _this = _possibleConstructorReturn(this, (ContextScale.__proto__ || Object.getPrototypeOf(ContextScale)).call(this));

        Object.defineProperty(_this, 'sx', {
            value: sx
        });
        Object.defineProperty(_this, 'sy', {
            value: sy
        });
        Object.defineProperty(_this, 'origin', {
            value: origin
        });
        _this.operationsList = [];
        return _this;
    }

    _createClass(ContextScale, [{
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
        key: 'save',
        value: function save(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'restore',
        value: function restore(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'begin',
        value: function begin(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p) {
            var sp = p.scaled(this.sx, this.sy, this.origin);
            this.operationsList.push(_operation2.default.moveTo(sp));
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p) {
            var sp = p.scaled(this.sx, this.sy, this.origin);
            this.operationsList.push(_operation2.default.lineTo(sp));
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p) {
            var sc1 = c1.scaled(this.sx, this.sy, this.origin);
            var sc2 = c2.scaled(this.sx, this.sy, this.origin);
            var sp = p.scaled(this.sx, this.sy, this.origin);
            this.operationsList.push(_operation2.default.cubicTo(sc1, sc2, sp));
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p) {
            var sc1 = c1.scaled(this.sx, this.sy, this.origin);
            var sp = p.scaled(this.sx, this.sy, this.origin);
            this.operationsList.push(_operation2.default.quadraticTo(sc1, sp));
        }
    }, {
        key: 'closePath',
        value: function closePath(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'set',
        value: function set(k, v, op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'stroke',
        value: function stroke(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'fill',
        value: function fill(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke(op) {
            this.operationsList.push(op);
        }
    }, {
        key: 'operations',
        get: function get() {
            return (0, _fp.clone)(this.operationsList);
        }
    }]);

    return ContextScale;
}(_ctxBase2.default);

exports.default = ContextScale;