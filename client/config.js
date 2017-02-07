
export default {
    initialState: {
        x: 64,
        y: 64,
        offset: {x:0, y: 0},
        knockout: false,
        width: 3000,
        height: 2000,
        text: 'aie',
        font: null,
        margin: 0.05,
        isMoving: false,
        startPos: null,
        numSplit: 24,
        colorExtrusion: 'rgba(0, 0, 0, 1)'
    },
    fonts: [
        '/fonts/Volkart/Volkart-BlackItalic.otf',
        '/fonts/Volkart/Volkart-Black.otf',
        '/fonts/Volkart/Volkart-BoldItalic.otf',
        '/fonts/Volkart/Volkart-Bold.otf',
        '/fonts/Volkart/Volkart-ExtraboldItalic.otf',
        '/fonts/Volkart/Volkart-Extrabold.otf',
        '/fonts/Volkart/Volkart-ExtralightItalic.otf',
        '/fonts/Volkart/Volkart-Extralight.otf',
        '/fonts/Volkart/Volkart-HairlineItalic.otf',
        '/fonts/Volkart/Volkart-Hairline.otf',
        '/fonts/Volkart/Volkart-Italic.otf',
        '/fonts/Volkart/Volkart-LightItalic.otf',
        '/fonts/Volkart/Volkart-Light.otf',
        '/fonts/Volkart/Volkart-MediumItalic.otf',
        '/fonts/Volkart/Volkart-Medium.otf',
        '/fonts/Volkart/Volkart-Regular.otf',
        '/fonts/Volkart/Volkart-ThinItalic.otf',
        '/fonts/Volkart/Volkart-Thin.otf',
    ]
};