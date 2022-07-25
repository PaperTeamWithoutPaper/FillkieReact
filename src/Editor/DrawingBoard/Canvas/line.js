import fitCurve from 'fit-curve';
/**
 * Create the basic object of the line with point.
 */
export function createLine(point, color) {
    return {
        type: 'line',
        color,
        points: [point],
    };
}
/**
 * Create the basic object of the line with point.
 */
export function createEraserLine(point) {
    return {
        type: 'eraser',
        points: [point],
    };
}
/**
 * drawLine draws a line with bezier curves.
 */
export function drawLine(context, line) {
   
  
    const points = [];
    for (const p of line.points) {
        points.push([p.x, p.y]);
    }
    const curves = fitCurve(points, 2);
    if (!curves.length) {
        return;
    }
    
    context.save();
    context.beginPath();
    context.strokeStyle = line.color || '#ff7043';
    const firstCurve = curves[0];
    console.log(firstCurve)
    context.moveTo(firstCurve[0][0], firstCurve[0][1]);
    for (const curve of curves) {
        context.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
    }
    context.stroke();
    context.closePath();
    context.restore();
}
/**
 * drawEraser draws the line of the eraser on the canvas.
 */
export function drawEraser(context, line) {
    context.save();
    context.beginPath();
    context.strokeStyle = '#ff7043';
    let isMoved = false;
    for (const p of line.points) {
        if (isMoved === false) {
            isMoved = true;
            context.moveTo(p.x, p.y);
        }
        else {
            context.lineTo(p.x, p.y);
        }
    }
    context.stroke();
    context.closePath();
    context.restore();
}
/**
 * Match the mouse point position for eraser
 */
export function fixEraserPoint(point) {
    const eraserOffsetXSize = 8;
    const eraserOffsetYSize = 6;
    return {
        y: point.y + eraserOffsetXSize,
        x: point.x + eraserOffsetYSize,
    };
}