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

var ContextStore = function (_BaseContext) {
    _inherits(ContextStore, _BaseContext);

    function ContextStore(width, height) {
        _classCallCheck(this, ContextStore);

        var _this = _possibleConstructorReturn(this, (ContextStore.__proto__ || Object.getPrototypeOf(ContextStore)).call(this));

        Object.defineProperty(_this, 'operations', { value: [] });
        Object.defineProperty(_this, 'width', { value: width });
        Object.defineProperty(_this, 'height', { value: height });
        return _this;
    }

    _createClass(ContextStore, [{
        key: 'bezierCurveTo',
        value: function bezierCurveTo() {
            this.curveTo.apply(this, arguments);
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo() {
            this.quadraticTo.apply(this, arguments);
        }
    }, {
        key: 'save',
        value: function save(op) {
            this.operations.push(op);
        }
    }, {
        key: 'restore',
        value: function restore(op) {
            this.operations.push(op);
        }
    }, {
        key: 'begin',
        value: function begin(op) {
            this.operations.push(op);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p, op) {
            this.operations.push(op);
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p, op) {
            this.operations.push(op);
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p, op) {
            this.operations.push(op);
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p, op) {
            this.operations.push(op);
        }
    }, {
        key: 'closePath',
        value: function closePath(op) {
            this.operations.push(op);
        }
    }, {
        key: 'set',
        value: function set(k, v, op) {
            this.operations.push(op);
        }
    }, {
        key: 'stroke',
        value: function stroke(op) {
            this.operations.push(op);
        }
    }, {
        key: 'fill',
        value: function fill(op) {
            this.operations.push(op);
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke(op) {
            this.operations.push(op);
        }
    }]);

    return ContextStore;
}(_ctxBase2.default);

exports.default = ContextStore;