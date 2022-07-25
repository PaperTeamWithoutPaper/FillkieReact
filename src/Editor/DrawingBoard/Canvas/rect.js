import { cloneBox } from './utils';
/**
 * Create the basic object of the rect with point.
 */
export function createRect(point, options) {
    return {
        type: 'rect',
        color: options.color,
        box: {
            x: point.x,
            y: point.y,
            width: 0,
            height: 0,
        },
        points: [{ x: point.x, y: point.y }],
    };
}
/**
 * Draw a rect on the canvas.
 */
export function drawRect(context, rect) {
    context.save();
    context.strokeStyle = rect.color;
    context.strokeRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
    context.restore();
}
/**
 * Adjust the box according to the incoming point.
 */
export function adjustRectBox(shape, point) {
    const box = cloneBox(shape.box);
    const rectPoint = shape.points[0];
    const width = point.x - rectPoint.x;
    const height = point.y - rectPoint.y;
    const aWidth = Math.abs(width);
    const aHeight = Math.abs(height);
    box.x = rectPoint.x - (width > 0 ? 0 : -width);
    box.y = rectPoint.y - (height > 0 ? 0 : -height);
    box.width = aWidth;
    box.height = aHeight;
    return box;
}
