
import { identity } from 'lodash/fp';
import { createElement, appendText, px } from './dom';
import { setState, getState, onStateChange } from './state';
import point from './point';

const debug = require('debug')('extruder');

function name(key) {
    return `slider-${key}`;
}

class Projection {
    constructor(source, target) {
        Object.defineProperty(this, 'source', { value: source });
        Object.defineProperty(this, 'target', { value: target });
    }

    forward(value) {
        const [sMin, sMax] = this.source;
        const [tMin, tMax] = this.target;
        const sourceInterval = sMax - sMin;
        const targetInterval = tMax - tMin;
        const sourceValue = value - sMin;
        const result = tMin + ((sourceValue / sourceInterval) * targetInterval);

        return result;
    }

    inverse(value) {
        const [sMin, sMax] = this.source;
        const [tMin, tMax] = this.target;
        const sourceInterval = sMin + (sMax - sMin);
        const targetInterval = tMin + (tMax - tMin);
        const targetValue = value - tMin;
        const result = sMin + ((targetValue / targetInterval) * sourceInterval);

        return result;
    }

    toString() {
        const [sMin, sMax] = this.source;
        const [tMin, tMax] = this.target;
        return `[${sMin}, ${sMax}] [${tMin}, ${tMax}]`;
    }
}

(function testProj() {
    const assert = (a, b) => {
        if (!a) {
            // throw (new Error(b));
            console.error(b);
        }
    };

    const target = [-1000, 1000];
    const source = [-100, 100];
    const p = new Projection(source, target);

    assert(p.forward(source[0]) === target[0], `p.forward(${source[0]}) !== ${target[0]} (${p.forward(source[0])})`);
    assert(p.forward(42) === 420, `p.forward(42) !== 420 (${p.forward(42)})`);
    assert(p.forward(source[1]) === target[1], `p.forward(${source[1]}) !== ${target[1]} (${p.forward(source[0])})`);

    assert(p.inverse(target[0]) === source[0], `p.inverse(${target[0]}) !== ${source[0]} (${p.inverse(target[0])})`);
    assert(p.inverse(target[1]) === source[1], `p.inverse(${target[1]}) !== ${source[1]} (${p.inverse(target[0])})`);


}());

// function getValue(line, square, min, max) {
//     const lineRect = line.getBoundingClientRect();
//     const proj = new Projection([lineRect.left, lineRect.right], [min, max]);
//     const squareRect = square.getBoundingClientRect();
//     const squareCenter = squareRect.left + (squareRect.width / 2);
//     const value = proj.forward(squareCenter);
//
//     return value;
// }

function mouseEventPos(e, ref = null) {
    if (!ref) {
        ref = e.currentTarget;
    }
    const rect = ref.getBoundingClientRect();
    const p = point(e.clientX - rect.left, e.clientY - rect.top);
    return p;
}


function updateSlider(key, line, square, input) {
    const value = getState(key);
    const state = getState(name(key));
    const squareRect = square.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const targetRange = [0, lineRect.width];
    const sourceRange = [state.min, state.max];
    const proj = new Projection(sourceRange, targetRange);
    const x = proj.forward(value);
    square.style.left = px(x - (squareRect.width / 2));
    input.value = value;
}

function startHandler(key, parser, line) {
    return (() => {
        const state = getState(name(key));
        const lineRect = line.getBoundingClientRect();
        state.started = true;
        state.sourceRange = [0, lineRect.width];
        setState(name(key), state);
    });
}


function stopHandler(key, parser, line) {
    return ((e) => {
        const state = getState(name(key));
        if (state.started) {
            const targetRange = [state.min, state.max];
            const proj = new Projection(state.sourceRange, targetRange);
            const pos = mouseEventPos(e, line);
            const value = parser(proj.forward(pos.x));
            state.started = false;
            setState([key, name(key)], [value, state]);
        }
    });
}


function moveHandler(key, parser, line) {
    return ((e) => {
        const state = getState(name(key));
        if (state.started) {
            const targetRange = [state.min, state.max];
            const proj = new Projection(state.sourceRange, targetRange);
            const pos = mouseEventPos(e, line);
            const value = parser(proj.forward(pos.x));
            setState(key, value);
        }
    });
}

function cancelHandler(key) {
    return (() => {
        const state = getState(name(key));
        if (state.started) {
            state.started = false;
            setState(name(key), state);
        }
    });
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: px(24)
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
        top: px(0),
    },

    square: {
        position: 'absolute',
        // top: px(0)
        // backgroundColor: 'red'
    },

    input: {
        flex: '0 10 0%',
        // top: px(28)
    }
};


function applyStyle(styleName, elem) {
    Object.keys(styles[styleName]).forEach((k) => {
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
export default function slider(options) {
    const { key, label, unit, parser, min, max } = options;
    setState(name(key), {
        started: false,
        startPos: 0,
        min,
        max
    });
    const container = createElement('div', { class: `slider ${name(key)}` });
    const lineWrapper = createElement('div');
    const line = createElement('div', { class: 'slider-line' });
    const square = createElement('div', { class: 'slider-square' });
    const input = createElement('input', {
        class: 'slider-input',
        type: 'number',
        value: getState(key)
    });
    const labelBox = createElement('div', { class: 'slider-label' });


    appendText(labelBox, label || key);
    applyStyle('container', container);
    applyStyle('wrapper', lineWrapper);
    applyStyle('line', line);
    applyStyle('square', square);
    applyStyle('input', input);
    applyStyle('label', labelBox);


    const start = startHandler(key, parser || identity, lineWrapper);
    const stop = stopHandler(key, parser || identity, lineWrapper, square);
    const move = moveHandler(key, parser || identity, lineWrapper, square);
    const cancel = cancelHandler(key, parser || identity);

    lineWrapper.addEventListener('mousedown', start);
    lineWrapper.addEventListener('mouseup', stop);
    lineWrapper.addEventListener('mousemove', move);
    lineWrapper.addEventListener('mouseleave', cancel);

    input.addEventListener('change', () => {
        setState(key, Number(input.value));
    });

    lineWrapper.appendChild(line);
    lineWrapper.appendChild(square);
    container.appendChild(labelBox);
    container.appendChild(lineWrapper);
    container.appendChild(input);


    const updateInit = (previousWidth, t) => {
        const lr = line.getBoundingClientRect();
        if (lr.width !== previousWidth) {
            const proj = new Projection([min, max], [0, lr.width]);
            const initPos = proj.forward(getState(key));
            square.style.left = px(initPos);
            setTimeout(() => updateInit(lr.width), t);

        // debug('slider', initPos, proj.toString());
        }
        else {
            setTimeout(() => updateInit(lr.width), t * 2);
        }
    };
    updateInit(0, 500);

    onStateChange(() => {
        updateSlider(key, line, square, input);
    }, [key]);
    return container;
}
