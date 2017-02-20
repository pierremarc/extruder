
import point from '../lib/point';
import { getState } from '../lib/state';
import PaperContext from '../lib/ctx-paper';
import BBoxContext from '../lib/ctx-bbox';
import draw, { getWidth } from './draw';
import {
    render,
    OP_BEGIN,
    save,
    restore,
    moveTo,
    lineTo,
    closePath,
    fill,
    gs
} from '../lib/operation';


function extrudeLine(ctx, rect, x, y, text, font, fontSize, knockout) {
    const anchor = point(rect.minx, rect.miny);
    const { extrusion, mask } = draw(text, font, fontSize, x, y, anchor);
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
        const knockoutOps = paperEx.exportOperations();
        render(ctx, knockoutOps);
    }
    else {
        render(ctx, extrusion.concat(mask));
    }
}


function makeBackground(min, max) {
    const bg = getState('colorBackground', 'none');
    const ops = [];
    if (bg !== 'none') {
        ops.push(save());
        ops.push(gs('fillStyle', bg));
        ops.push(moveTo(min));
        ops.push(lineTo(point(max.x, min.y)));
        ops.push(lineTo(point(max.x, max.y)));
        ops.push(lineTo(point(min.x, max.y)));
        ops.push(closePath());
        ops.push(fill());
        ops.push(restore());
    }
    return ops;
}


function computeLines(lineWidth, text, font, fontSize, x, lines) {
    if (text.length === 0) {
        return;
    }

    const next = (i) => {
        const tail = text.slice(i).trim();
        lines.push(text.slice(0, i));
        return computeLines(lineWidth, tail, font, fontSize, x, lines);
    };

    let i;
    for (i = 1; i < text.length; i += 1) {
        if (text.charAt(i) === '\n') {
                return next(Math.max(1, i + 1));
        }
        else {
            const seq = text.slice(0, i);
            const absX = Math.floor(Math.abs(x));
            const seqWidth = Math.floor(getWidth(seq, font, fontSize)) + absX;
            if (seqWidth > lineWidth) {
                return next(Math.max(1, i - 1));
            }
        }
    }
    lines.push(text);
}

export default function extrude(ctx, state, knockout = false) {
    const { x, y, text, font, fontSize, lineHeightFactor, margin, width, height } = state;
    const hScale = ctx.width / width;
    const vScale = ctx.height / height;
    let scale = 1;
    let offset = point(0, 0);

    if (hScale < vScale) {
        scale = hScale;
        offset = point(0, (ctx.height - (height * scale)) / 2);
    }
    else {
        scale = vScale;
        offset = point((ctx.width - (width * scale)) / 2, 0);
    }
    const adjWidth = width * scale;
    const adjHeight = height * scale;

    const scaledMargin = margin * adjWidth; //Math.max(margin * adjWidth, margin * adjHeight);
    const innerWidth = adjWidth - (scaledMargin); // * 2);
    const innerHeight = adjHeight; // - (scaledMargin * 2);
    const lineHeight = (fontSize * scale) * (lineHeightFactor || 1.2);
    const baseFactor = 0.8;
    const left = offset.x + scaledMargin;
    const top = offset.y;
    
    const lines = []; 
    computeLines(innerWidth, text, font, fontSize * scale, x * scale, lines);


    if (!font) {
        return 0;
    }

    if (lines.length > 0) {
        render(ctx, makeBackground(
            offset,
            point(offset.x + adjWidth, offset.y + adjHeight)
        ));

        const processLine = (line, idx) => {
            if (line.length > 0) {
                const rect = {
                    minx: left,
                    miny: top + (idx * lineHeight) + (baseFactor * lineHeight),
                    maxx: left + innerWidth,
                    maxy: top + (idx * lineHeight),
                    width: innerWidth,
                    height: lineHeight
                };
                extrudeLine(
                    ctx, rect,
                    x * scale, y * scale,
                    `${line} `,
                    font, fontSize * scale,
                    knockout
                );
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

    return (lines.length * (fontSize * scale) * (lineHeightFactor || 1.2));
}
