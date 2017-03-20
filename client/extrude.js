
import point from '../lib/point';
import PaperContext from '../lib/ctx-paper';
import draw, { getWidth, drawBackground } from './draw';
import {
    render,
    OP_BEGIN,
} from '../lib/operation';


function extrudeLine(state, ctx, anchor, x, y, text, font, fontSize, knockout) {
    const { extrusion, mask } = draw(state, text, font, fontSize, x, y, anchor);
    let ops = extrusion.concat(mask);
    if (knockout) {
        const paperEx = new PaperContext();
        const maskOps = [];
        mask.forEach((operation) => {
            const opCode = operation[0];
            if (opCode === OP_BEGIN) {
                maskOps.push([]);
            }
            if (maskOps.length > 0) {
                maskOps[maskOps.length - 1].push(operation);
            }
        });
        const masks = [];
        maskOps.forEach((maskOp) => {
            const m = new PaperContext(true);
            render(m, maskOp);
            masks.push(m);
        });

        render(paperEx, extrusion);
        masks.forEach((m) => {
            paperEx.substract(m);
        });
        ops = paperEx.exportOperations();
    }
    render(ctx, ops);
}


function computeLines(lineWidth, text, font, fontSize, lines) {
    if (text.length === 0) {
        return;
    }

    const next = (width, i) => {
        const tail = text.slice(i).trim();
        lines.push({
            width,
            text: text.slice(0, i),
        });
        return computeLines(lineWidth, tail, font, fontSize, lines);
    };

    let i;
    for (i = 1; i <= text.length; i += 1) {
        if (text.charAt(i) === '\n') {
            next(Math.floor(getWidth(text.slice(0, i), font, fontSize)),
                Math.max(1, i));
            return;
        }
        const seq = text.slice(0, i);
        const seqWidth = Math.floor(getWidth(seq, font, fontSize));
        // console.log(`seq ${seq}; seqWidth ${seqWidth}; lineWidth ${lineWidth}`);
        if (seqWidth > lineWidth) {
            const idx = Math.max(1, i - 1);
            const prevSeq = text.slice(0, idx);
            const prevSeqWidth = Math.floor(getWidth(prevSeq, font, fontSize));
            next(prevSeqWidth, idx);
            return;
        }
    }
    lines.push({
        text,
        width: Math.floor(getWidth(text, font, fontSize)),
    });
}

export default function extrude(ctx, state, knockout = false) {
    const { x, y, text, font, fontSize, lineHeightFactor,
        width, height, margin, colorBackground } = state;

    // const fontObj = getFont(font);
    // const ascent = fontObj.ascender / fontObj.unitsPerEm;
    // opentype.js reports wrong values
    // (which led me to see there were some other options for types in the browsers (typr, etc.))
    const marginValue = margin;
    const ascent = 0.8;
    const offset = point(0, 0);
    const lineHeight = fontSize * lineHeightFactor;
    const left = offset.x;
    const top = offset.y;
    const lines = [];
    const unionBox = {
        width: 0,
        height: 0,
    };
    computeLines(width - marginValue, text, font, fontSize, lines);


    if (!font) {
        return null;
    }
    console.log(`width: ${width}; height ${height}`);
    lines.forEach((l, idx) => {
        console.log(`line(${idx + 1}/${lines.length}): ${l.text} [${l.width}]`);
    });

    if (lines.length > 0) {
        render(ctx, drawBackground(
            offset,
            point(offset.x + width, offset.y + height),
            colorBackground,
        ));

        const processLine = (line, idx) => {
            if (line.text.length > 0) {
                // const rect = {
                //     width,
                //     height,
                //     minx: left,
                //     miny: top + (idx * lineHeight) + (ascent * lineHeight),
                //     maxx: left + width,
                //     maxy: top + (idx * lineHeight),
                // };

                const anchor = point(
                    left + marginValue,
                    top + (idx * lineHeight) + (ascent * lineHeight),
                );

                extrudeLine(
                    state, ctx, anchor, x, y,
                    `${line.text} `,
                    font, fontSize,
                    knockout,
                );

                unionBox.width = Math.max(line.width + marginValue, unionBox.width);
                unionBox.height = Math.max((idx + 1) * lineHeight, unionBox.height);
            }
        };

        if (y < 0) {
            for (let idx = lines.length - 1; idx >= 0; idx -= 1) {
                processLine(lines[idx], idx);
            }
        }
        else {
            lines.forEach(processLine);
        }
    }

    return unionBox;
}
