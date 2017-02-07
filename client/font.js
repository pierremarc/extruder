
import opentype from 'opentype.js';


const collection = {};

class FontName {
    constructor(font) {
        Object.defineProperty(this, 'names', { value: font.names });
    }

    getName(tag) {
        const obj = this.names[tag];
        if (obj && 'en' in obj) {
            return obj.en;
        }
        return null;
    }

    get identifier() {
        return this.getName('uniqueID');
    }

    get family() {
        return this.getName('preferredFamily') || this.getName('fontFamily');
    }

    get subFamily() {
        return this.getName('preferredSubfamily') || this.getName('fontSubfamily');
    }

    get displayName() {
        return this.getName('fullName');
    }
}

function fetchFont(url) {
    // message(`fetch font: ${url}`, DEBUG);
    return fetch(url, {
        mode: 'no-cors'
    });
}

function makeBuffers(responses) {
    const buffers = responses.map(response => response.arrayBuffer());
    return Promise.all(buffers);
}

function makeFonts(buffers) {
    return buffers.map((buffer) => {
        const font = opentype.parse(buffer);
        if (font.supported) {
            const name = new FontName(font);
            collection[name.identifier] = font;
            return name;
        }
        return null;
    });
}


export function loadFonts(urls) {
    const fontResponses = urls.map(fontUrl => fetchFont(fontUrl));
    return (
        Promise.all(fontResponses)
            .then(makeBuffers)
            .then(makeFonts)
        );
}

export function getFont(name) {
    return collection[name];
}
