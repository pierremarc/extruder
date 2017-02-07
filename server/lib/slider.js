'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = slider;

var _fp = require('lodash/fp');

var _dom = require('./dom');

var _state = require('./state');

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('extruder');

function name(key) {
    return 'slider-' + key;
}

var Projection = function () {
    function Projection(source, target) {
        _classCallCheck(this, Projection);

        Object.defineProperty(this, 'source', { value: source });
        Object.defineProperty(this, 'target', { value: target });
    }

    _createClass(Projection, [{
        key: 'forward',
        value: function forward(value) {
            var _source = _slicedToArray(this.source, 2),
                sMin = _source[0],
                sMax = _source[1];

            var _target = _slicedToArray(this.target, 2),
                tMin = _target[0],
                tMax = _target[1];

            var sourceInterval = sMax - sMin;
            var targetInterval = tMax - tMin;
            var sourceValue = value - sMin;
            var result = tMin + sourceValue / sourceInterval * targetInterval;

            return result;
        }
    }, {
        key: 'inverse',
        value: function inverse(value) {
            var _source2 = _slicedToArray(this.source, 2),
                sMin = _source2[0],
                sMax = _source2[1];

            var _target2 = _slicedToArray(this.target, 2),
                tMin = _target2[0],
                tMax = _target2[1];

            var sourceInterval = sMin + (sMax - sMin);
            var targetInterval = tMin + (tMax - tMin);
            var targetValue = value - tMin;
            var result = sMin + targetValue / targetInterval * sourceInterval;

            return result;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _source3 = _slicedToArray(this.source, 2),
                sMin = _source3[0],
                sMax = _source3[1];

            var _target3 = _slicedToArray(this.target, 2),
                tMin = _target3[0],
                tMax = _target3[1];

            return '[' + sMin + ', ' + sMax + '] [' + tMin + ', ' + tMax + ']';
        }
    }]);

    return Projection;
}();

(function testProj() {
    var assert = function assert(a, b) {
        if (!a) {
            // throw (new Error(b));
            console.error(b);
        }
    };

    var target = [-1000, 1000];
    var source = [-100, 100];
    var p = new Projection(source, target);

    assert(p.forward(source[0]) === target[0], 'p.forward(' + source[0] + ') !== ' + target[0] + ' (' + p.forward(source[0]) + ')');
    assert(p.forward(42) === 420, 'p.forward(42) !== 420 (' + p.forward(42) + ')');
    assert(p.forward(source[1]) === target[1], 'p.forward(' + source[1] + ') !== ' + target[1] + ' (' + p.forward(source[0]) + ')');

    assert(p.inverse(target[0]) === source[0], 'p.inverse(' + target[0] + ') !== ' + source[0] + ' (' + p.inverse(target[0]) + ')');
    assert(p.inverse(target[1]) === source[1], 'p.inverse(' + target[1] + ') !== ' + source[1] + ' (' + p.inverse(target[0]) + ')');
})();

// function getValue(line, square, min, max) {
//     const lineRect = line.getBoundingClientRect();
//     const proj = new Projection([lineRect.left, lineRect.right], [min, max]);
//     const squareRect = square.getBoundingClientRect();
//     const squareCenter = squareRect.left + (squareRect.width / 2);
//     const value = proj.forward(squareCenter);
//
//     return value;
// }

function mouseEventPos(e) {
    var ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!ref) {
        ref = e.currentTarget;
    }
    var rect = ref.getBoundingClientRect();
    var p = (0, _point2.default)(e.clientX - rect.left, e.clientY - rect.top);
    return p;
}

function updateSlider(key, line, square, input) {
    var value = (0, _state.getState)(key);
    var state = (0, _state.getState)(name(key));
    var squareRect = square.getBoundingClientRect();
    var lineRect = line.getBoundingClientRect();
    var targetRange = [0, lineRect.width];
    var sourceRange = [state.min, state.max];
    var proj = new Projection(sourceRange, targetRange);
    var x = proj.forward(value);
    square.style.left = (0, _dom.px)(x - squareRect.width / 2);
    input.value = value;
}

function startHandler(key, parser, line) {
    return function () {
        var state = (0, _state.getState)(name(key));
        var lineRect = line.getBoundingClientRect();
        state.started = true;
        state.sourceRange = [0, lineRect.width];
        (0, _state.setState)(name(key), state);
    };
}

function stopHandler(key, parser, line) {
    return function (e) {
        var state = (0, _state.getState)(name(key));
        if (state.started) {
            var targetRange = [state.min, state.max];
            var proj = new Projection(state.sourceRange, targetRange);
            var pos = mouseEventPos(e, line);
            var value = parser(proj.forward(pos.x));
            state.started = false;
            (0, _state.setState)([key, name(key)], [value, state]);
        }
    };
}

function moveHandler(key, parser, line) {
    return function (e) {
        var state = (0, _state.getState)(name(key));
        if (state.started) {
            var targetRange = [state.min, state.max];
            var proj = new Projection(state.sourceRange, targetRange);
            var pos = mouseEventPos(e, line);
            var value = parser(proj.forward(pos.x));
            (0, _state.setState)(key, value);
        }
    };
}

function cancelHandler(key) {
    return function () {
        var state = (0, _state.getState)(name(key));
        if (state.started) {
            state.started = false;
            (0, _state.setState)(name(key), state);
        }
    };
}

var styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: (0, _dom.px)(24)
    },

    label: {
        // flex: 2
    },

    wrapper: {
        flex: 6,
        position: 'relative'
        // height: px(12),
        // backgroundColor: 'green'
    },

    line: {
        // position: 'relative',
        top: (0, _dom.px)(0)
    },

    square: {
        position: 'absolute'
    },

    input: {
        // flex: 1,
        // top: px(28)
    }
};

function applyStyle(styleName, elem) {
    Object.keys(styles[styleName]).forEach(function (k) {
        if (elem.style[k] === '') {
            elem.style[k] = styles[styleName][k];
        }
    });
}

/**
 * [slider description]
 * @method slider
 * @param  {[type]} options           [description]
 * @param  {[type]} min               [description]
 * @param  {[type]} max               [description]
 * @param  {[type]} [parser=identity] [description]
 * @return {[type]}                   [description]
 */
function slider(options) {
    var key = options.key,
        label = options.label,
        unit = options.unit,
        parser = options.parser,
        min = options.min,
        max = options.max;

    (0, _state.setState)(name(key), {
        started: false,
        startPos: 0,
        min: min,
        max: max
    });
    var container = (0, _dom.createElement)('div', { class: 'slider ' + name(key) });
    var lineWrapper = (0, _dom.createElement)('div');
    var line = (0, _dom.createElement)('div', { class: 'slider-line' });
    var square = (0, _dom.createElement)('div', { class: 'slider-square' });
    var input = (0, _dom.createElement)('input', {
        class: 'slider-input',
        type: 'number',
        value: (0, _state.getState)(key)
    });
    var labelBox = (0, _dom.createElement)('div', { class: 'slider-label' });

    (0, _dom.appendText)(labelBox, label || key);
    applyStyle('container', container);
    applyStyle('wrapper', lineWrapper);
    applyStyle('line', line);
    applyStyle('square', square);
    applyStyle('input', input);
    applyStyle('label', labelBox);

    var start = startHandler(key, parser || _fp.identity, lineWrapper);
    var stop = stopHandler(key, parser || _fp.identity, lineWrapper, square);
    var move = moveHandler(key, parser || _fp.identity, lineWrapper, square);
    var cancel = cancelHandler(key, parser || _fp.identity);

    lineWrapper.addEventListener('mousedown', start);
    lineWrapper.addEventListener('mouseup', stop);
    lineWrapper.addEventListener('mousemove', move);
    lineWrapper.addEventListener('mouseleave', cancel);

    input.addEventListener('change', function () {
        (0, _state.setState)(key, Number(input.value));
    });

    lineWrapper.appendChild(line);
    lineWrapper.appendChild(square);
    container.appendChild(labelBox);
    container.appendChild(lineWrapper);
    container.appendChild(input);

    var updateInit = function updateInit(previousWidth, t) {
        var lr = line.getBoundingClientRect();
        if (lr.width !== previousWidth) {
            var proj = new Projection([min, max], [0, lr.width]);
            var initPos = proj.forward((0, _state.getState)(key));
            square.style.left = (0, _dom.px)(initPos);
            setTimeout(function () {
                return updateInit(lr.width);
            }, t);

            // debug('slider', initPos, proj.toString());
        } else {
            setTimeout(function () {
                return updateInit(lr.width);
            }, t * 2);
        }
    };
    updateInit(0, 500);

    (0, _state.onStateChange)(function () {
        updateSlider(key, line, square, input);
    }, [key]);
    return container;
}