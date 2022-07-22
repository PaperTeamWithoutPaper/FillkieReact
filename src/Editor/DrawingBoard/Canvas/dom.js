export function addEvent(el, type, fn, capturing) {
    return el.addEventListener(type, fn, capturing);
}
export function removeEvent(el, type, fn, capturing) {
    return el.removeEventListener(type, fn, capturing);
}
const touch = {
    mouseup: 'touchend',
    mouseout: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove',
};
const pointers = {
    mouseup: 'pointerup',
    mouseout: 'pointerup',
    mousedown: 'pointerdown',
    mousemove: 'pointermove',
};
const microsoft = {
    mouseup: 'MSPointerUp',
    mouseout: 'MSPointerUp',
    mousedown: 'MSPointerDown',
    mousemove: 'MSPointerMove',
};
/**
 * {@linkcode https://github.com/bevacqua/dragula/blob/e0bcdc72ae8e0b85e17f154957bdd0cc2e2e35db/dragula.js#L498}
 */
export function touchy(el, event, type, fn) {
    if (global.navigator.pointerEnabled) {
        
        event(el, pointers[type], fn);
    }
    else if (global.navigator.msPointerEnabled) {
   
        event(el, microsoft[type], fn);
    }
    else {
        event(el, touch[type], fn);
        event(el, type, fn);
    }
}