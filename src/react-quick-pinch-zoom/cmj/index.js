"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTouch = exports.make3dTransformValue = exports.make2dTransformValue = exports.hasTranslate3DSupport = void 0;
var tslib_1 = require("tslib");
var component_1 = tslib_1.__importDefault(require("./PinchZoom/component"));
exports.default = component_1.default;
var utils_1 = require("./utils");
Object.defineProperty(exports, "hasTranslate3DSupport", { enumerable: true, get: function () { return utils_1.hasTranslate3DSupport; } });
Object.defineProperty(exports, "make2dTransformValue", { enumerable: true, get: function () { return utils_1.make2dTransformValue; } });
Object.defineProperty(exports, "make3dTransformValue", { enumerable: true, get: function () { return utils_1.make3dTransformValue; } });
Object.defineProperty(exports, "isTouch", { enumerable: true, get: function () { return utils_1.isTouch; } });
