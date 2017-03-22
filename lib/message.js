
import { createElement, removeElement, body } from './dom';

export const ERROR = 'error';
export const WARNING = 'warning';
export const INFO = 'info';
export const DEBUG = 'debug';


let timeoutId = null;
let box = null;

const endMessage = (element) => () => {
    removeElement(element);
}


export default function message(text, type = INFO) {
    // if (timeoutId !== null) {
    //     clearTimeout(timeoutId);
    //     removeElement(box);
    // }

    box = createElement('div', {
        class: `message-box message-${type}`
    });
    box.appendChild(document.createTextNode(text));

    body().appendChild(box);
    // const msgDuration = text.length * 24;

    // timeoutId = setTimeout(() => {
    //     timeoutId = null;
    //     removeElement(box);
    // }, msgDuration);

    return endMessage(box);
}
