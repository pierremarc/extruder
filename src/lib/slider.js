
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
        const sourceValue = sMax - sMin;
        const targetValue = tMax - tMin;
        const result = tMin + ((value * targetValue) / sourceValue);

        return result;
    }

    inverse(value) {
        const [sMin, sMax] = this.source;
        const [tMin, tMax] = this.target;
        const sourceValue = sMax - sMin;
        const targetValue = tMax - tMin;
        const result = sMin + ((value * sourceValue) / targetValue);

        return result;
    }

    toString() {
        const [sMin, sMax] = this.source;
        const [tMin, tMax] = this.target;
        return `[${sMin}, ${sMax}] [${tMin}, ${tMax}]`;
    }
}

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
    const sourceRange = [lineRect.left, lineRect.right];
    const targetRange = [state.min, state.max];
    const proj = new Projection(sourceRange, targetRange);
    const x = proj.inverse(value);
    square.style.left = px(x - (squareRect.width / 2));
    input.value = value;
}

function startHandler(key, parser, line) {
    return (() => {
        const state = getState(name(key));
        const lineRect = line.getBoundingClientRect();
        state.started = true;
        state.sourceRange = [lineRect.left, lineRect.right];
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
        flex: 2
    },

    line: {
        flex: 6,
        height: px(12),
        backgroundColor: 'green'
    },

    square: {
        position: 'relative',
        width: px(12),
        height: px(12),
        backgroundColor: 'red'
    },

    input: {
        flex: 2,
        top: px(28)
    }
};


function applyStyle(styleName, elem) {
    Object.keys(styles[styleName]).forEach((k) => {
        elem.style[k] = styles[styleName][k];
    });
}



export default function slider(key, min, max, parser = identity) {
    setState(name(key), {
        started: false,
        startPos: 0,
        min,
        max
    });
    const container = createElement('div', { class: `slider ${name(key)}` });
    const line = createElement('div', { class: 'slider-line' });
    const square = createElement('div', { class: 'slider-square' });
    const input = createElement('input', { class: 'slider-input', value: getState(key) });
    const label = createElement('div', { class: 'slider-label' });


    appendText(label, key);
    applyStyle('container', container);
    applyStyle('line', line);
    applyStyle('square', square);
    applyStyle('input', input);
    applyStyle('label', label);


    const start = startHandler(key, parser, line);
    const stop = stopHandler(key, parser, line, square);
    const move = moveHandler(key, parser, line, square);
    const cancel = cancelHandler(key, parser);

    line.addEventListener('mousedown', start);
    line.addEventListener('mouseup', stop);
    line.addEventListener('mousemove', move);
    line.addEventListener('mouseleave', cancel);

    input.addEventListener('change', () => {
        setState(key, Number(input.value));
    });

    line.appendChild(square);
    container.appendChild(label);
    container.appendChild(line);
    container.appendChild(input);


    const updateInit = (previousWidth, t) => {
        const lr = line.getBoundingClientRect();
        if (lr.width !== previousWidth) {
            const proj = new Projection([lr.left, lr.right], [min, max]);
            const initPos = proj.inverse(getState(key));
            square.style.left = px(initPos);
            setTimeout(() => updateInit(lr.width), t);

            debug('slider', initPos, proj.toString());
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
