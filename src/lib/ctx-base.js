

import { noop } from 'lodash';

class BaseContext {
    /* eslint-disable  class-methods-use-this, brace-style */

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
