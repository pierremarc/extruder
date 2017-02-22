'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paper = require('paper');

var _ctxBase = require('./ctx-base');

var _ctxBase2 = _interopRequireDefault(_ctxBase);

var _operation = require('../lib/operation');

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function p2p(p) {
    return new _paper.Point(p.x, p.y);
}

var paperProject = null;

function setupPaper() {
    if (paperProject === null) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        document.body.appendChild(canvas);
        paperProject = new _paper.Project(canvas);
    }
}

/*
from paperjs
*/
function drawSegments(path, moveTo, lineTo, bezierCurveTo) {
    var segments = path._segments;
    var length = segments.length;
    var first = true;
    var curX = void 0;
    var curY = void 0;
    var prevX = void 0;
    var prevY = void 0;
    var inX = void 0;
    var inY = void 0;
    var outX = void 0;
    var outY = void 0;

    var drawSegment = function drawSegment(segment) {
        var point = segment._point;
        curX = point._x;
        curY = point._y;

        if (first) {
            moveTo(curX, curY);
            first = false;
        } else {
            var _handle = segment._handleIn;
            inX = curX + _handle._x;
            inY = curY + _handle._y;

            if (inX === curX && inY === curY && outX === prevX && outY === prevY) {
                lineTo(curX, curY);
            } else {
                bezierCurveTo(outX, outY, inX, inY, curX, curY);
            }
        }
        prevX = curX;
        prevY = curY;

        var handle = segment._handleOut;
        outX = prevX + handle._x;
        outY = prevY + handle._y;
    };

    for (var i = 0; i < length; i += 1) {
        drawSegment(segments[i]);
    }
    // Close path by drawing first segment again
    if (path._closed && length > 0) {
        drawSegment(segments[0]);
    }
}

var ContextPaper = function (_BaseContext) {
    _inherits(ContextPaper, _BaseContext);

    function ContextPaper() {
        var isMask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _classCallCheck(this, ContextPaper);

        var _this = _possibleConstructorReturn(this, (ContextPaper.__proto__ || Object.getPrototypeOf(ContextPaper)).call(this));

        setupPaper();
        _this.isMask = isMask;
        _this.paths = [];
        _this.operations = {};
        if (isMask) {
            _this.isStarted = false;
        }
        return _this;
    }

    _createClass(ContextPaper, [{
        key: 'substract',
        value: function substract(ref) {
            var subs = [];
            var mask = ref.mask.clone({ insert: false, deep: true });
            this.paths.forEach(function (path) {
                path.closePath();
                var cp = path.clone({ insert: false, deep: true });
                if (mask.intersects(cp)) {
                    subs.push(cp.subtract(mask));
                } else {
                    subs.push(path);
                }
                // const sub = ref.paths.reduce((path, mask) => {
                //     const cp = path.clone({ insert: false, deep: true });
                //     const cm = mask.clone({ insert: false, deep: true });
                //     if (cm.intersects(cp)) {
                //         return cp.subtract(cm);
                //     }
                //     return path;
                // }, p);
                // subs.push(sub);
            });
            this.paths = subs;
        }
    }, {
        key: 'storeOp',
        value: function storeOp(opArg) {
            var idx = this.paths.length;
            if (!(idx in this.operations)) {
                this.operations[idx] = [];
            }
            this.operations[idx].push(opArg);
        }
    }, {
        key: 'exportOperations',
        value: function exportOperations() {
            var ops = [];
            var mt = function mt(x, y) {
                ops.push((0, _operation.moveTo)((0, _point2.default)(x, y)));
            };

            var lt = function lt(x, y) {
                ops.push((0, _operation.lineTo)((0, _point2.default)(x, y)));
            };

            var ct = function ct(cx, cy, ccx, ccy, x, y) {
                ops.push((0, _operation.cubicTo)((0, _point2.default)(cx, cy), (0, _point2.default)(ccx, ccy), (0, _point2.default)(x, y)));
            };

            for (var i = 0; i < this.paths.length; i += 1) {
                if (i in this.operations) {
                    ops = ops.concat(this.operations[i]);
                }
                var path = this.paths[i];
                if (path instanceof _paper.CompoundPath) {
                    console.warn('CompoundPath!');
                    path.children.forEach(function (c) {
                        ops.push((0, _operation.begin)());
                        drawSegments(c, mt, lt, ct);
                        ops.push((0, _operation.closePath)());
                    });
                } else {
                    ops.push((0, _operation.begin)());
                    drawSegments(path, mt, lt, ct);
                    ops.push((0, _operation.closePath)());
                }
            }
            return ops;
        }
    }, {
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
        value: function save(opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'restore',
        value: function restore(opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'begin',
        value: function begin(opArg) {
            if (this.isMask) {
                if (!this.isStarted) {
                    this.storeOp(opArg);
                    this.paths.push(new _paper.CompoundPath());
                    this.isStarted = true;
                } else {
                    this.currentPath.closePath();
                }
            } else {
                this.storeOp(opArg);
                this.paths.push(new _paper.Path());
            }
        }
    }, {
        key: 'moveTo',
        value: function moveTo(p) {
            this.currentPath.moveTo(p2p(p));
        }
    }, {
        key: 'lineTo',
        value: function lineTo(p) {
            this.currentPath.lineTo(p2p(p));
        }
    }, {
        key: 'cubicTo',
        value: function cubicTo(c1, c2, p) {
            this.currentPath.cubicCurveTo(p2p(c1), p2p(c2), p2p(p));
        }
    }, {
        key: 'quadraticTo',
        value: function quadraticTo(c1, p) {
            this.currentPath.quadraticCurveTo(p2p(c1), p2p(p));
        }
    }, {
        key: 'closePath',
        value: function closePath(opArg) {
            this.storeOp(opArg);
            this.currentPath.closePath();
        }
    }, {
        key: 'set',
        value: function set(k, v, opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'stroke',
        value: function stroke(opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'fill',
        value: function fill(opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'fillAndStroke',
        value: function fillAndStroke(opArg) {
            this.storeOp(opArg);
        }
    }, {
        key: 'currentPath',
        get: function get() {
            if (this.paths.length === 0) {
                throw new Error('ThereAintAnyPath');
            }
            return this.paths[this.paths.length - 1];
        }
    }, {
        key: 'mask',
        get: function get() {
            if (!this.isMask) {
                throw new Error('NotAMask');
            }
            return this.currentPath;
        }
    }]);

    return ContextPaper;
}(_ctxBase2.default);

exports.default = ContextPaper;