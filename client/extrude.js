
import point from '../lib/point';
import { getState } from '../lib/state';
import PaperContext from '../lib/ctx-paper';
import { render, OP_BEGIN } from '../lib/operation';
import draw from './draw';


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


export default function extrude(ctx, state, knockout = false) {
    const { x, y, text, font, margin, width, height } = state;
    const lines = text.split('\n');


    if (!font) {
        return false;
    }

    if (lines.length > 0) {
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

        const scaledMargin = Math.max(margin * adjWidth, margin * adjHeight);
        const innerWidth = adjWidth - (scaledMargin * 2);
        const innerHeight = adjHeight - (scaledMargin * 2);
        const lineHeight = innerHeight / lines.length;
        const baseFactor = 0.8;
        const fontSize = lineHeight;
        const left = offset.x + scaledMargin;
        const top = offset.y + scaledMargin;


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
                extrudeLine(ctx, rect, x * scale, y * scale, line, font, fontSize, knockout);
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

    return true;
}
