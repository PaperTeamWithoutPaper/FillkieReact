"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTranslate3DSupport = exports.make3dTransformValue = exports.make2dTransformValue = exports.isTouch = void 0;
var isSsr = typeof window === 'undefined';
var isTouch = function () {
    return !isSsr && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
};
exports.isTouch = isTouch;
var make2dTransformValue = function (_a) {
    var x = _a.x, y = _a.y, scale = _a.scale;
    return "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)");
};
exports.make2dTransformValue = make2dTransformValue;
var make3dTransformValue = function (_a) {
    var x = _a.x, y = _a.y, scale = _a.scale;
    return "scale3d(".concat(scale, ",").concat(scale, ", 1) translate3d(").concat(x, "px, ").concat(y, "px, 0)");
};
exports.make3dTransformValue = make3dTransformValue;
var hasTranslate3DSupport = function () {
    var css = !isSsr && window.CSS;
    return css && css.supports && css.supports('transform', 'translate3d(0,0,0)');
};
exports.hasTranslate3DSupport = hasTranslate3DSupport;
