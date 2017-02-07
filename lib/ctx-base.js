

import { noop, constant } from 'lodash/fp';

const zero = constant(0);
const one = constant(1);

class BaseContext {
    /* eslint-disable */

    get width() { return zero; }

    get height() { return zero; }

    get scale() { return one; }

    save() { noop(); }

    restore() { noop(); }

    begin() { noop(); }

    moveTo() { noop(); }

    lineTo() { noop(); }

    cubicTo() { noop(); }

    quadraticTo() { noop(); }

    bezierCurveTo() { noop(); }

    quadraticCurveTo() { noop(); }

    closePath() { noop(); }

    set() { noop(); }

    stroke() { noop(); }

    fill() { noop(); }

    fillAndStroke() { noop(); }

    /* eslint-enable */
}

export default BaseContext;
