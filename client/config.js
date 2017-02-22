
export default {
    initialState: {
        x: 16,
        y: 16,
        fixedSize: true,
        width: 1920,
        height: 1080,
        text: 'Welcome',
        font: 'Volkart-Light:JeremieHornus:1.200',
        fontSize: 300,
        lineHeightFactor: 1.16,
        margin: 0,
        isMoving: false,
        startPos: null,
        numSplit: 32,
        colorExtrusion: 'black',
        colorBackground: 'white',
        colorForeground: 'white',
    },
    fonts: [
        '/fonts/Volkart/Volkart-Light.otf',
        '/fonts/Volkart/Volkart-Regular.otf',
        '/fonts/Volkart/Volkart-Bold.otf',
        '/fonts/Volkart/Volkart-Extrabold.otf',
    ],
    palette: ['#da291c', '#ffffff', '#dde1e4', '#768692', '#000000'],
};
