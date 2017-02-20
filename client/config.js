
export default {
    initialState: {
        x: 64,
        y: 64,
        fixedSize: true,
        width: 1920,
        height: 1080,
        text: 'Welcome',
        font: null,
        fontSize: 300,
        lineHeightFactor: 1.16,
        margin: 0.2,
        isMoving: false,
        startPos: null,
        numSplit: 32,
        colorExtrusion: 'black',
        colorBackground: 'white',
        colorForeground: 'white',
        palette: ['black', 'white', 'red', 'green', 'blue']
    },
    fonts: [
        '/fonts/Volkart/Volkart-Light.otf',
        '/fonts/Volkart/Volkart-Regular.otf',
        '/fonts/Volkart/Volkart-Bold.otf',
        '/fonts/Volkart/Volkart-Extrabold.otf',
    ]
};
