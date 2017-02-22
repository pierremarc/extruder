
import { extrude } from './extruder';
import message from '../lib/message';
import { getState } from '../lib/state';
import { createElement } from '../lib/dom';

const stateKeys = ['x', 'y', 'text', 'font', 'margin', 'width', 'height'];

export default function exporter() {
    const state = stateKeys.reduce(
        (acc, k) => Object.assign({ k: getState(k) }, acc), {});
    const canvas = createElement('canvas', {
        width: state.width,
        height: state.height,
    });

    if (extrude(canvas, state)) {
        const dataURL = canvas.toDataURL('image/png');
        const a = createElement('a', {
            class: 'tool-export-png-link',
            download: 'extruded.png',
            href: dataURL,
        });
        const img = createElement('img', {
            src: dataURL,
        });

        a.appendChild(img);
        return a;
    }
    message('failed to extrude');
    return null;
}
