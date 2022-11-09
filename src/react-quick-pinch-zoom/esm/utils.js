var isSsr = typeof window === 'undefined';
export var isTouch = function () {
    return !isSsr && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
};
export var make2dTransformValue = function (_a) {
    var x = _a.x, y = _a.y, scale = _a.scale;
    return "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)");
};
export var make3dTransformValue = function (_a) {
    var x = _a.x, y = _a.y, scale = _a.scale;
    return "scale3d(".concat(scale, ",").concat(scale, ", 1) translate3d(").concat(x, "px, ").concat(y, "px, 0)");
};
export var hasTranslate3DSupport = function () {
    var css = !isSsr && window.CSS;
    return css && css.supports && css.supports('transform', 'translate3d(0,0,0)');
};
