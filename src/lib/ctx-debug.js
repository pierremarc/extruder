
import BaseContext from './ctx-base';

const debug = require('debug')('extruder');

class ContextDebug extends BaseContext {

    bezierCurveTo(...args) {
        debug('bezierCurveTo', ...args);
    }

    quadraticCurveTo(...args) {
        debug('quadraticCurveTo', ...args);
    }

    save() {
        debug('save');
    }

    restore() {
        debug('restore');
    }

    begin() {
        debug('begin');
    }

    moveTo(p) {
        debug('moveTo', p.x, p.y);
    }

    lineTo(p) {
        debug('lineTo', p.x, p.y);
    }

    cubicTo(c1, c2, p) {
        debug('cubicTo', c1.x, c1.y,
                               c2.x, c2.y,
                               p.x, p.y);
    }

    quadraticTo(c1, p) {
        debug('quadraticTo', c1.x, c1.y, p.x, p.y);
    }

    closePath() {
        debug('closePath');
    }

    set(k, v) {
        debug('set', k, v);
    }

    stroke() {
        debug('stroke');
    }

    fill() {
        debug('fill');
    }

    fillAndStroke() {
        debug('fillAndStroke');
    }
}


export default ContextDebug;
