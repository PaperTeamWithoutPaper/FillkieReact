
import { createLine } from '../line';
import Worker from './Worker';
import { compressPoints } from '../utils';
import * as scheduler from '../scheduler';
class LineWorker extends Worker {
    constructor(update, board, options) {
        super(options);
        this.update = update;
        this.board = board;
    }
    mousedown(point) {
        let timeTicket;
        this.update((root) => {
            const colorCode  =  this.options?.color
            const shape = createLine(point,colorCode);
            root.shapes.push(shape);
            const lastShape = root.shapes.getLast();
            timeTicket = lastShape.getID();
            this.createID = timeTicket;
        });
        

    }
    mousemove(point) {
        scheduler.reserveTask(point, (tasks) => {
            const points = compressPoints(tasks);
            
            if (tasks.length < 2) {
                return;
            }
            this.update((root) => {
                const lastShape = this.getElementByID(root, this.createID);

                if (!lastShape) {
                    return;
                }
                lastShape.points.push(...points);
                this.board.drawAll(root.shapes);
            });
        });
    }
    mouseup() {
        this.flushTask();
    }
    flushTask() {
        scheduler.flushTask();
        this.update((root) => {
            if (!this.createID) {
                return;
            }
            const shape = this.getElementByID(root, this.createID);
            if (!shape) {
                return;
            }
            // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
            if (shape.points.length < 2) {
                this.deleteByID(root, this.createID);
            }
            this.board.drawAll(root.shapes);
        });
    }
}
export default LineWorker;
