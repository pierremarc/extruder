
import BaseContext from './ctx-base';

class ContextNull extends BaseContext {

    constructor(width, height) {
        super();
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
    }
}


export default ContextNull;
