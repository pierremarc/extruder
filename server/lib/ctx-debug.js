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

var debug = require('debug')('extruder');

var ContextDebug = function (_BaseContext) {
    _inherits(ContextDebug, _BaseContext);

    function ContextDebug() {
        _classCallCheck(this, ContextDebug);

        return _possibleConstructorReturn(this, (ContextDebug.__proto__ || Object.getPrototypeOf(ContextDebug)).apply(this, arguments));
    }

    _createClass(ContextDebug, [{
        key: 'bezierCurveTo',
        value: function bezierCurveTo() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            debug.apply(undefined, ['bezierCurveTo'].concat(args));
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            debug.apply(undefined, ['quadraticCurveTo'].concat(args));
        }
    }, {
        key: 'save',
        value: function save() {
            debug('save');
        }
    }, {
        key: 'restore',
        value: function restore() {
            debug('restore');
        }
    }, {
        key: 'begin',
        value: function begin() {
            debug('begin');
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p) {
            debug('moveTo', p.x, p.y);
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p) {
            debug('lineTo', p.x, p.y);
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p) {
            debug('cubicTo', c1.x, c1.y, c2.x, c2.y, p.x, p.y);
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p) {
            debug('quadraticTo', c1.x, c1.y, p.x, p.y);
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            debug('closePath');
        }
    }, {
        key: 'set',
        value: function set(k, v) {
            debug('set', k, v);
        }
    }, {
        key: 'stroke',
        value: function stroke() {
            debug('stroke');
        }
    }, {
        key: 'fill',
        value: function fill() {
            debug('fill');
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke() {
            debug('fillAndStroke');
        }
    }]);

    return ContextDebug;
}(_ctxBase2.default);

exports.default = ContextDebug;