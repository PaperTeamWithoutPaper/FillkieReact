
import EventDispatcher from '../../../utils/eventDispatcher';
import { drawLine, drawEraser } from './line';
import { drawRect } from './rect';
import { addEvent, removeEvent, touchy } from './dom';
import {  LineWorker } from './Worker';
var DragStatus;
(function (DragStatus) {
    DragStatus[DragStatus["Drag"] = 0] = "Drag";
    DragStatus[DragStatus["Stop"] = 1] = "Stop";
})(DragStatus || (DragStatus = {}));

class CanvasWrapper {
    constructor(canvas) {
        this.width = 0;
        this.height = 0;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.canvas.className = 'canvas';
        this.setWidth(canvas.width);
        this.setHeight(canvas.height);
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setWidth(width, devicePixelRatio) {
        this.width = width;
        this.canvas.width = devicePixelRatio ? width * devicePixelRatio : width;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.backgroundColor='yellow';
    }
    setHeight(height, devicePixelRatio) {
        this.height = height;
        this.canvas.height = devicePixelRatio ? height * devicePixelRatio : height;
        this.canvas.style.height = `${height}px`;
    }
    setSize(width, height, devicePixelRatio) {
        this.setWidth(width, devicePixelRatio);
        this.setHeight(height, devicePixelRatio);
    }
    clear() {
        this.getContext().clearRect(0, 0, this.getWidth(), this.getHeight());
    }
    resize() {
        const { devicePixelRatio } = window;
        if (devicePixelRatio) {
            this.setSize(this.width, this.height, devicePixelRatio);
            this.context.scale(devicePixelRatio, devicePixelRatio);
        }
        else {
            this.setSize(this.width, this.height);
        }
    }
}



export default class Board extends EventDispatcher {
    constructor(el, update) {
        super();
        this.worker='';
        this.offsetY = 0;
        this.offsetX = 0;
        this.color = 'black'
        this.dragStatus = DragStatus.Stop;
        this.metadataMap = new Map();
        this.lowerWrapper = new CanvasWrapper(el);
        this.upperWrapper = this.createUpperWrapper();
        this.update = update;
        this.initialize();
    }
    initialize() {
        this.worker = new LineWorker(this.update,this);
        this.initializeSize();
        this.initializeOffset();
        this.emit = this.emit.bind(this);
        this.drawAll = this.drawAll.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseup', this.onMouseUp);
        touchy(this.upperWrapper.getCanvas(), addEvent, 'mouseout', this.onMouseOut);
        touchy(this.upperWrapper.getCanvas(), addEvent, 'mousedown', this.onMouseDown);
        this.addEventListener('renderAll', this.drawAll);
    }
    destroy() {
        touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseup', this.onMouseUp);
        touchy(this.upperWrapper.getCanvas(), removeEvent, 'mouseout', this.onMouseOut);
        touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousedown', this.onMouseDown);
        this.destroyUpperCanvas();
        this.removeEventListener('renderAll');
    }
    initializeOffset() {
        const { y, x } = this.lowerWrapper.getCanvas().getBoundingClientRect();
        this.offsetY = y;
        this.offsetX = x;
    }
    initializeSize() {
        this.lowerWrapper.resize();
        this.upperWrapper.resize();
    }
    createUpperWrapper() {
        var _a;
        const canvas = document.createElement('canvas');
        const wrapper = new CanvasWrapper(canvas);
        wrapper.setWidth(this.lowerWrapper.getWidth());
        wrapper.setHeight(this.lowerWrapper.getHeight());
        (_a = this.lowerWrapper.getCanvas().parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
        return wrapper;
    }
    destroyUpperCanvas() {
        var _a, _b;
        const upperCanvas = (_a = this.upperWrapper) === null || _a === void 0 ? void 0 : _a.getCanvas();
        if (upperCanvas) {
            (_b = upperCanvas.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(upperCanvas);
        }
    }
    setColor(color) {
        this.color = color;
        this.worker.setOption({ color });
    }
    setWidth(width) {
        this.lowerWrapper.setWidth(width);
        this.upperWrapper.setWidth(width);
        this.resize();
    }
    setHeight(height) {
        this.lowerWrapper.setHeight(height);
        this.upperWrapper.setHeight(height);
        this.resize();
    }
    resize() {
        this.lowerWrapper.resize();
        this.upperWrapper.resize();
    }
    setTool(tool) {
        this.setMouseClass(tool);
        if (this.worker.type === tool) {
            return;
        }
        this.worker.flushTask();
        this.worker = this.createWorker(tool);
    }
    createWorker() {

        return new LineWorker(this.update, this, { color: this.color });
        

    }

    getPointFromTouchyEvent(evt) {
        let originY;
        let originX;
        if (window.TouchEvent && evt instanceof TouchEvent) {
            originY = evt.touches[0].clientY;
            originX = evt.touches[0].clientX;
        }
        else {
            originY = evt.clientY;
            originX = evt.clientX;
        }
        originY += window.scrollY;
        originX += window.scrollX;
        return {
            y: originY - this.offsetY,
            x: originX - this.offsetX,
        };
    }
    onMouseDown(evt) {
        console.log('down')
        touchy(this.lowerWrapper.getCanvas(), addEvent, 'mousemove', this.onMouseMove);
        this.dragStatus = DragStatus.Drag;
        const point = this.getPointFromTouchyEvent(evt);
        this.worker.mousedown(point, (boardMetadata) => {
            this.emit('mousedown', boardMetadata);
        });
    }
    onMouseMove(evt) {
        console.log('move')
        const point = this.getPointFromTouchyEvent(evt);
        if (this.isOutside(point)) {
            this.onMouseUp();
            return;
        }
        if (this.dragStatus === DragStatus.Stop) {
            return;
        }
        this.worker.mousemove(point, (boardMetadata) => {
            this.emit('mousemove', boardMetadata);
        });
    }
    onMouseUp() {
        touchy(this.upperWrapper.getCanvas(), removeEvent, 'mousemove', this.onMouseMove);
        this.dragStatus = DragStatus.Stop;
        this.worker.mouseup();
        this.emit('mouseup');
    }
    onMouseOut() {
        this.dragStatus = DragStatus.Stop;
        this.worker.flushTask();
        this.emit('mouseout');
    }
    updateMetadata(peerKey, metadata) {
 
        this.clear(this.lowerWrapper);
        this.update((root) => {
           
            this.drawAll(root.shapes);
        });
        this.metadataMap.set(peerKey, JSON.parse(metadata.board || '{}'));
        for (const boardMetadata of this.metadataMap.values()) {
            const { eraserPoints } = boardMetadata;
            if (eraserPoints && eraserPoints.length > 0) {
                drawEraser(this.lowerWrapper.getContext(), {
                    type: 'eraser',
                    points: eraserPoints,
                });
            }
        }
    }
    isOutside(point) {
        if (point.y < 0 ||
            point.x < 0 ||
            point.y > this.lowerWrapper.getHeight() ||
            point.x > this.lowerWrapper.getWidth()) {
            return true;
        }
        return false;
    }
    drawAll(shapes, wrapper) {
        this.clear(wrapper);
        if(shapes==undefined) return {}
        for (const shape of shapes) {
            drawLine(this.lowerWrapper.getContext(), shape);

        }
    }
    clear(wrapper = this.lowerWrapper)
    {
        wrapper.clear();
    }
    
    clearBoard() {
    this.clear(this.lowerWrapper);
    this.clear(this.upperWrapper);
    this.worker.clearAll();
    }
}