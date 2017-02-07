'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fp = require('lodash/fp');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var zero = (0, _fp.constant)(0);
var one = (0, _fp.constant)(1);

var BaseContext = function () {
    function BaseContext() {
        _classCallCheck(this, BaseContext);
    }

    _createClass(BaseContext, [{
        key: 'save',
        value: function save() {
            (0, _fp.noop)();
        }
    }, {
        key: 'restore',
        value: function restore() {
            (0, _fp.noop)();
        }
    }, {
        key: 'begin',
        value: function begin() {
            (0, _fp.noop)();
        }
    }, {
        key: 'moveTo',
        value: function moveTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'lineTo',
        value: function lineTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo() {
            (0, _fp.noop)();
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            (0, _fp.noop)();
        }
    }, {
        key: 'set',
        value: function set() {
            (0, _fp.noop)();
        }
    }, {
        key: 'stroke',
        value: function stroke() {
            (0, _fp.noop)();
        }
    }, {
        key: 'fill',
        value: function fill() {
            (0, _fp.noop)();
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke() {
            (0, _fp.noop)();
        }

        /* eslint-enable */

    }, {
        key: 'width',

        /* eslint-disable */

        get: function get() {
            return zero;
        }
    }, {
        key: 'height',
        get: function get() {
            return zero;
        }
    }, {
        key: 'scale',
        get: function get() {
            return one;
        }
    }]);

    return BaseContext;
}();

exports.default = BaseContext;