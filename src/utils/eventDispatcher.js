class Event {
    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }
    on(cb) {
        this.callbacks.push(cb);
    }
    off(cb) {
        const idx = this.callbacks.findIndex((callback) => callback === cb);
        this.callbacks.splice(idx, 1);
    }
    toString() {
        return this.name;
    }
}
export default class EventDispatcher {
    constructor() {
        this.events = {};
    }
    emit(name, ...args) {
        if (!this.events[name]) {
            return;
        }
        this.events[name].callbacks.forEach((cb) => {
            cb(...args);
        });
    }
    addEventListener(name, cb) {
        if (!this.events[name]) {
            this.events[name] = new Event(name);
        }
        this.events[name].on(cb);
    }
    removeEventListener(name, cb) {
        if (!cb) {
            delete this.events[name];
            return;
        }
        this.events[name].off(cb);
    }
}