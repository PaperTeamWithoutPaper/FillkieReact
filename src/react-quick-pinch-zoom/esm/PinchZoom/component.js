import { __assign, __extends } from 'tslib';
import * as React from 'react';
import { styleRoot, styleChild, styles } from './styles.css';
import { isTouch } from '../utils';
var classnames = function (base, other) {
  return other ? ''.concat(base, ' ').concat(other) : base;
};
var abs = Math.abs,
  max = Math.max,
  min = Math.min,
  sqrt = Math.sqrt;
var isSsr = typeof window === 'undefined';
var isMac = isSsr ? false : /(Mac)/i.test(navigator.platform);
var isDragInteraction = function (i) {
  return i === 'drag';
};
var isZoomInteraction = function (i) {
  return i === 'zoom';
};
var isZoomGesture = function (wheelEvent) {
  return isMac && wheelEvent.ctrlKey;
};
var cancelEvent = function (event) {
  event.stopPropagation();
  event.preventDefault();
};
var getDistance = function (a, b) {
  var x = a.x - b.x;
  var y = a.y - b.y;
  return sqrt(x * x + y * y);
};
var calculateScale = function (startTouches, endTouches) {
  var startDistance = getDistance(startTouches[0], startTouches[1]);
  var endDistance = getDistance(endTouches[0], endTouches[1]);
  return endDistance / startDistance;
};
var isCloseTo = function (value, expected) {
  return value > expected - 0.01 && value < expected + 0.01;
};
var swing = function (p) {
  return -Math.cos(p * Math.PI) / 2 + 0.5;
};
var getPointByPageCoordinates = function (touch) {
  return {
    x: touch.pageX,
    y: touch.pageY,
  };
};
var getPageCoordinatesByTouches = function (touches) {
  return Array.from(touches).map(getPointByPageCoordinates);
};
var sum = function (a, b) {
  return a + b;
};
var getVectorAvg = function (vectors) {
  return {
    x:
      vectors
        .map(function (_a) {
          var x = _a.x;
          return x;
        })
        .reduce(sum, 0) / vectors.length,
    y:
      vectors
        .map(function (_a) {
          var y = _a.y;
          return y;
        })
        .reduce(sum, 0) / vectors.length,
  };
};
var clamp = function (min, max, value) {
  return value < min ? min : value > max ? max : value;
};
var shouldInterceptWheel = function (event) {
  return !(event.ctrlKey || event.metaKey);
};
var getElementSize = function (element) {
  if (element) {
    var offsetWidth = element.offsetWidth,
      offsetHeight = element.offsetHeight;
    // Any DOMElement
    if (offsetWidth && offsetHeight) {
      return { width: offsetWidth, height: offsetHeight };
    }
    // Svg support
    var style = getComputedStyle(element);
    var width = parseFloat(style.width);
    var height = parseFloat(style.height);
    if (height && width) {
      return { width: width, height: height };
    }
  }
  return { width: 0, height: 0 };
};
var calculateVelocity = function (startPoint, endPoint) {
  return {
    x: endPoint.x - startPoint.x,
    y: endPoint.y - startPoint.y,
  };
};
var comparePoints = function (p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
};
var noup = function () {};
var zeroPoint = { x: 0, y: 0 };
var PinchZoom = /** @class */ (function (_super) {
  __extends(PinchZoom, _super);
  function PinchZoom() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this._prevDragMovePoint = null;
    _this._containerObserver = null;
    _this._fingers = 0;
    _this._firstMove = true;
    _this._initialOffset = __assign({}, zeroPoint);
    _this._interaction = null;
    _this._isDoubleTap = false;
    _this._isOffsetsSet = false;
    _this._lastDragPosition = null;
    _this._lastScale = 1;
    _this._lastTouchStart = 0;
    _this._lastZoomCenter = null;
    _this._listenMouseMove = false;
    _this._nthZoom = 0;
    _this._offset = __assign({}, zeroPoint);
    _this._startOffset = __assign({}, zeroPoint);
    _this._startTouches = null;
    _this._updatePlaned = false;
    _this._wheelTimeOut = null;
    _this._zoomFactor = 1;
    _this._initialZoomFactor = 1;
    _this._draggingPoint = __assign({}, zeroPoint);
    // It help reduce behavior difference between touch and mouse events
    _this._ignoreNextClick = false;
    // @ts-ignore
    _this._containerRef = React.createRef();
    _this._handleClick = function (clickEvent) {
      if (_this._ignoreNextClick) {
        _this._ignoreNextClick = false;
        clickEvent.stopPropagation();
      }
    };
    _this._onResize = function () {
      var _a;
      if (
        (_a = _this._containerRef) === null || _a === void 0
          ? void 0
          : _a.current
      ) {
        _this._updateInitialZoomFactor();
        _this._setupOffsets();
        _this._update();
      }
    };
    _this._handlerOnTouchEnd = _this._handlerIfEnable(function (touchEndEvent) {
      _this._fingers = touchEndEvent.touches.length;
      if (
        _this.props.shouldCancelHandledTouchEndEvents &&
        (isZoomInteraction(_this._interaction) ||
          (isDragInteraction(_this._interaction) &&
            (_this._startOffset.x !== _this._offset.x ||
              _this._startOffset.y !== _this._offset.y)))
      ) {
        cancelEvent(touchEndEvent);
      }
      if (isDragInteraction(_this._interaction) && !_this._enoughToDrag()) {
        _this._handleClick(touchEndEvent);
      }
      _this._updateInteraction(touchEndEvent);
    });
    _this._handlerOnTouchStart = _this._handlerIfEnable(function (
      touchStartEvent,
    ) {
      _this._firstMove = true;
      _this._fingers = touchStartEvent.touches.length;
      _this._detectDoubleTap(touchStartEvent);
    });
    _this._handlerOnTouchMove = _this._handlerIfEnable(function (
      touchMoveEvent,
    ) {
      if (_this._isDoubleTap) {
        return;
      }
      _this._collectInertia(touchMoveEvent);
      if (_this._firstMove) {
        _this._updateInteraction(touchMoveEvent);
        if (_this._interaction) {
          cancelEvent(touchMoveEvent);
        }
        _this._startOffset = __assign({}, _this._offset);
        _this._startTouches = getPageCoordinatesByTouches(
          touchMoveEvent.touches,
        );
      } else {
        if (isZoomInteraction(_this._interaction)) {
          if (
            _this._startTouches &&
            _this._startTouches.length === 2 &&
            touchMoveEvent.touches.length === 2
          ) {
            _this._handleZoom(
              touchMoveEvent,
              calculateScale(
                _this._startTouches,
                getPageCoordinatesByTouches(touchMoveEvent.touches),
              ),
            );
          }
        } else if (isDragInteraction(_this._interaction)) {
          _this._handleDrag(touchMoveEvent);
        }
        if (_this._interaction) {
          cancelEvent(touchMoveEvent);
          _this._update();
        }
      }
      _this._firstMove = false;
    });
    
    _this._handlerWheel = function (wheelEvent) {
      if (_this.props.shouldInterceptWheel(wheelEvent)) {
        _this._handleScroll(wheelEvent);
        return;
      }
      cancelEvent(wheelEvent);
      var pageX = wheelEvent.pageX,
        pageY = wheelEvent.pageY,
        deltaY = wheelEvent.deltaY,
        deltaMode = wheelEvent.deltaMode;
      var scaleDelta = 1;
      if (isZoomGesture(wheelEvent) || deltaMode === 1) {
        scaleDelta = 15;
      }
      var likeTouchEvent = {
        touches: [
          // @ts-ignore
          { pageX: pageX, pageY: pageY },
        ],
      };
      var center = _this._getOffsetByFirstTouch(likeTouchEvent);
      var dScale = deltaY * scaleDelta;
      _this._stopAnimation();
      _this._scaleTo(
        _this._zoomFactor - dScale / _this.props.wheelScaleFactor,
        center,
      );
      _this._update();
      clearTimeout(
        // @ts-ignore
        _this._wheelTimeOut,
      );
      _this._wheelTimeOut = setTimeout(function () {
        return _this._sanitize();
      }, 100);
    };
    // @ts-ignore
    _this._handlers = _this.props.isTouch()
      ? [
          ['touchstart', _this._handlerOnTouchStart],
          ['touchend', _this._handlerOnTouchEnd],
          ['touchmove', _this._handlerOnTouchMove],
        ]
      : [
          [
            'mousemove',
            _this.simulate(_this._handlerOnTouchMove),
            _this.props._document,
          ],
          [
            'mouseup',
            _this.simulate(_this._handlerOnTouchEnd),
            _this.props._document,
          ],
          ['mousedown', _this.simulate(_this._handlerOnTouchStart)],
          ['click', _this._handleClick],
          ['wheel', _this._handlerWheel],
        ];
    return _this;
  }
  PinchZoom.prototype._handleDragStart = function (event) {
    this._ignoreNextClick = true;
    this.props.onDragStart();
    this._stopAnimation();
    this._resetInertia();
    this._lastDragPosition = null;
    this._hasInteraction = true;
    this._draggingPoint = this._offset;
    this._handleDrag(event);
  };
  PinchZoom.prototype._handleScroll= function(wheelEvent)
    {
      const deltaY = wheelEvent.deltaY;
      const deltaX = wheelEvent.deltaX;
  
      this._addOffset({
        x: deltaX,
        y: deltaY
      });
  
      this._offset = this._sanitizeOffset(this._offset);
      this._update();
    }
  
  
  PinchZoom.prototype._handleDrag = function (event) {
    var touch = this._getOffsetByFirstTouch(event);
    if (this._enoughToDrag()) {
      this._drag(touch, this._lastDragPosition);
    } else {
      this._virtualDrag(touch, this._lastDragPosition);
    }
    this._offset = this._sanitizeOffset(this._offset);
    this._lastDragPosition = touch;
  };
  PinchZoom.prototype._resetInertia = function () {
    this._velocity = null;
    this._prevDragMovePoint = null;
  };
  PinchZoom.prototype._realizeInertia = function () {
    var _this = this;
    var _a = this.props,
      inertiaFriction = _a.inertiaFriction,
      inertia = _a.inertia;
    if (!inertia || !this._velocity) {
      return;
    }
    var _b = this._velocity,
      x = _b.x,
      y = _b.y;
    if (x || y) {
      this._stopAnimation();
      this._resetInertia();
      var renderFrame = function () {
        x *= inertiaFriction;
        y *= inertiaFriction;
        if (!x && !y) {
          return _this._stopAnimation();
        }
        var prevOffset = __assign({}, _this._offset);
        _this._addOffset({ x: x, y: y });
        _this._offset = _this._sanitizeOffset(_this._offset);
        if (comparePoints(prevOffset, _this._offset)) {
          return _this._stopAnimation();
        }
        _this._update({ isAnimation: true });
      };
      this._animate(renderFrame, { duration: 9999 });
    }
  };
  PinchZoom.prototype._collectInertia = function (_a) {
    var touches = _a.touches;
    if (!this.props.inertia) {
      return;
    }
    var currentCoordinates = getPageCoordinatesByTouches(touches)[0];
    var prevPoint = this._prevDragMovePoint;
    if (prevPoint) {
      this._velocity = calculateVelocity(currentCoordinates, prevPoint);
    }
    this._prevDragMovePoint = currentCoordinates;
  };
  PinchZoom.prototype._handleDragEnd = function () {
    this.props.onDragEnd();
    this._end();
    this._realizeInertia();
  };
  PinchZoom.prototype._handleZoomStart = function () {
    this.props.onZoomStart();
    this._stopAnimation();
    this._lastScale = 1;
    this._nthZoom = 0;
    this._lastZoomCenter = null;
    this._hasInteraction = true;
  };
  PinchZoom.prototype._handleZoom = function (event, newScale) {
    var touchCenter = getVectorAvg(this._getOffsetTouches(event));
    var scale = newScale / this._lastScale;
    this._lastScale = newScale;
    // The first touch events are thrown away since they are not precise
    this._nthZoom += 1;
    if (this._nthZoom > 3) {
      this._scale(scale, touchCenter);
      this._drag(touchCenter, this._lastZoomCenter);
    }
    this._lastZoomCenter = touchCenter;
  };
  PinchZoom.prototype._handleZoomEnd = function () {
    this.props.onZoomEnd();
    this._end();
  };
  PinchZoom.prototype._handleDoubleTap = function (event) {
    var _this = this;
    if (this._hasInteraction || this.props.tapZoomFactor === 0) {
      return;
    }
    this.props.onDoubleTap();
    this._ignoreNextClick = true;
    var zoomFactor = this._zoomFactor + this.props.tapZoomFactor;
    var startZoomFactor = this._zoomFactor;
    var updateProgress = function (progress) {
      _this._scaleTo(
        startZoomFactor + progress * (zoomFactor - startZoomFactor),
        center,
      );
    };
    var center = this._getOffsetByFirstTouch(event);
    this._isDoubleTap = true;
    if (startZoomFactor > zoomFactor) {
      center = this._getCurrentZoomCenter();
    }
    this._animate(updateProgress);
  };
  PinchZoom.prototype._computeInitialOffset = function () {
    var rect = this._getContainerRect();
    var _a = this._getChildSize(),
      width = _a.width,
      height = _a.height;
    var x = -abs(width * this._getInitialZoomFactor() - rect.width) / 2;
    var y = -abs(height * this._getInitialZoomFactor() - rect.height) / 2;
    this._initialOffset = { x: x, y: y };
  };
  PinchZoom.prototype._resetOffset = function () {
    this._offset = __assign({}, this._initialOffset);
  };
  PinchZoom.prototype._setupOffsets = function () {
    if (this.props.setOffsetsOnce && this._isOffsetsSet) {
      return;
    }
    this._isOffsetsSet = true;
    this._computeInitialOffset();
    this._resetOffset();
  };
  PinchZoom.prototype._sanitizeOffset = function (offset) {
    var rect = this._getContainerRect();
    var _a = this._getChildSize(),
      width = _a.width,
      height = _a.height;
    var elWidth = width * this._getInitialZoomFactor() * this._zoomFactor;
    var elHeight = height * this._getInitialZoomFactor() * this._zoomFactor;
    var maxX = elWidth - rect.width + this.props.horizontalPadding;
    var maxY = elHeight - rect.height + this.props.verticalPadding;
    var maxOffsetX = max(maxX, 0);
    var maxOffsetY = max(maxY, 0);
    var minOffsetX = min(maxX, 0) - this.props.horizontalPadding;
    var minOffsetY = min(maxY, 0) - this.props.verticalPadding;
    return {
      x: clamp(minOffsetX, maxOffsetX, offset.x),
      y: clamp(minOffsetY, maxOffsetY, offset.y),
    };
  };
  PinchZoom.prototype.alignCenter = function (options) {
    var _this = this;
    var _a = __assign({ duration: 250, animated: true }, options),
      x = _a.x,
      y = _a.y,
      scale = _a.scale,
      animated = _a.animated,
      duration = _a.duration;
    var startZoomFactor = this._zoomFactor;
    var startOffset = __assign({}, this._offset);
    var rect = this._getContainerRect();
    var containerCenter = { x: rect.width / 2, y: rect.height / 2 };
    this._zoomFactor = 1;
    this._offset = { x: -(containerCenter.x - x), y: -(containerCenter.y - y) };
    this._scaleTo(scale, containerCenter);
    this._stopAnimation();
    if (!animated) {
      return this._update();
    }
    var diffZoomFactor = this._zoomFactor - startZoomFactor;
    var diffOffset = {
      x: this._offset.x - startOffset.x,
      y: this._offset.y - startOffset.y,
    };
    this._zoomFactor = startZoomFactor;
    this._offset = __assign({}, startOffset);
    var updateFrame = function (progress) {
      var x = startOffset.x + diffOffset.x * progress;
      var y = startOffset.y + diffOffset.y * progress;
      _this._zoomFactor = startZoomFactor + diffZoomFactor * progress;
      _this._offset = _this._sanitizeOffset({ x: x, y: y });
      _this._update();
    };
    this._animate(updateFrame, {
      callback: function () {
        return _this._sanitize();
      },
      duration: duration,
    });
  };
  PinchZoom.prototype.scaleTo = function (options) {
    var _this = this;
    var _a = __assign({ duration: 250, animated: true }, options),
      x = _a.x,
      y = _a.y,
      scale = _a.scale,
      animated = _a.animated,
      duration = _a.duration;
    var startZoomFactor = this._zoomFactor;
    var startOffset = __assign({}, this._offset);
    this._zoomFactor = 1;
    this._offset = { x: 0, y: 0 };
    this._scaleTo(scale, { x: x, y: y });
    this._stopAnimation();
    if (!animated) {
      return this._update();
    }
    var diffZoomFactor = this._zoomFactor - startZoomFactor;
    var diffOffset = {
      x: this._offset.x - startOffset.x,
      y: this._offset.y - startOffset.y,
    };
    this._zoomFactor = startZoomFactor;
    this._offset = __assign({}, startOffset);
    var updateFrame = function (progress) {
      var x = startOffset.x + diffOffset.x * progress;
      var y = startOffset.y + diffOffset.y * progress;
      _this._zoomFactor = startZoomFactor + diffZoomFactor * progress;
      _this._offset = { x: x, y: y };
      _this._update();
    };
    this._animate(updateFrame, {
      callback: function () {
        return _this._sanitize();
      },
      duration: duration,
    });
  };
  PinchZoom.prototype._scaleTo = function (zoomFactor, center) {
    this._scale(zoomFactor / this._zoomFactor, center);
  };
  PinchZoom.prototype._scale = function (scale, center) {
    scale = this._scaleZoomFactor(scale);
    this._addOffset({
      x: (scale - 1) * (center.x + this._offset.x),
      y: (scale - 1) * (center.y + this._offset.y),
    });
    this.props.onZoomUpdate();
  };
  PinchZoom.prototype._scaleZoomFactor = function (scale) {
    var originalZoomFactor = this._zoomFactor;
    this._zoomFactor *= scale;
    this._zoomFactor = clamp(
      this.props.minZoom,
      this.props.maxZoom,
      this._zoomFactor,
    );
    return this._zoomFactor / originalZoomFactor;
  };
  PinchZoom.prototype._canDrag = function () {
    return this.props.draggableUnZoomed || !isCloseTo(this._zoomFactor, 1);
  };
  PinchZoom.prototype._drag = function (center, lastCenter) {
    if (lastCenter) {
      var y = -(center.y - lastCenter.y);
      var x = -(center.x - lastCenter.x);
      if (!this.props.lockDragAxis) {
        this._addOffset({
          x: x,
          y: y,
        });
      } else {
        // lock scroll to position that was changed the most
        if (abs(x) > abs(y)) {
          this._addOffset({
            x: x,
            y: 0,
          });
        } else {
          this._addOffset({
            y: y,
            x: 0,
          });
        }
      }
      this.props.onDragUpdate();
    }
  };
  PinchZoom.prototype._virtualDrag = function (center, lastCenter) {
    if (lastCenter) {
      var y = -(center.y - lastCenter.y);
      var x = -(center.x - lastCenter.x);
      this._draggingPoint = {
        x: x + this._draggingPoint.x,
        y: y + this._draggingPoint.y,
      };
    }
  };
  PinchZoom.prototype._addOffset = function (offset) {
    var _a = this._offset,
      x = _a.x,
      y = _a.y;
    this._offset = {
      x: x + offset.x,
      y: y + offset.y,
    };
  };
  PinchZoom.prototype._sanitize = function () {
    if (this._zoomFactor < this.props.zoomOutFactor) {
      this._zoomOutAnimation();
    } else if (this._isInsaneOffset()) {
      this._sanitizeOffsetAnimation();
    }
  };
  PinchZoom.prototype._isInsaneOffset = function () {
    var offset = this._offset;
    var sanitizedOffset = this._sanitizeOffset(offset);
    return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
  };
  PinchZoom.prototype._sanitizeOffsetAnimation = function () {
    var _this = this;
    var targetOffset = this._sanitizeOffset(this._offset);
    var startOffset = __assign({}, this._offset);
    var updateProgress = function (progress) {
      var x = startOffset.x + progress * (targetOffset.x - startOffset.x);
      var y = startOffset.y + progress * (targetOffset.y - startOffset.y);
      _this._offset = { x: x, y: y };
      _this._update();
    };
    this._animate(updateProgress);
  };
  PinchZoom.prototype._zoomOutAnimation = function () {
    var _this = this;
    if (this._zoomFactor === 1) {
      return;
    }
    var startZoomFactor = this._zoomFactor;
    var zoomFactor = 1;
    var center = this._getCurrentZoomCenter();
    var updateProgress = function (progress) {
      var scaleFactor =
        startZoomFactor + progress * (zoomFactor - startZoomFactor);
      _this._scaleTo(scaleFactor, center);
    };
    this._animate(updateProgress);
  };
  PinchZoom.prototype._getInitialZoomFactor = function () {
    return this._initialZoomFactor;
  };
  PinchZoom.prototype._getCurrentZoomCenter = function () {
    var _a = this._offset,
      x = _a.x,
      y = _a.y;
    var offsetLeft = x - this._initialOffset.x;
    var offsetTop = y - this._initialOffset.y;
    return {
      x: -1 * x - offsetLeft / (1 / this._zoomFactor - 1),
      y: -1 * y - offsetTop / (1 / this._zoomFactor - 1),
    };
  };
  PinchZoom.prototype._getOffsetByFirstTouch = function (event) {
    return this._getOffsetTouches(event)[0];
  };
  PinchZoom.prototype._getOffsetTouches = function (event) {
    var _document = this.props._document;
    var _html = _document.documentElement;
    var _body = _document.body;
    var _a = this._getContainerRect(),
      top = _a.top,
      left = _a.left;
    var scrollTop = _html.scrollTop || _body.scrollTop;
    var scrollLeft = _html.scrollLeft || _body.scrollLeft;
    var posTop = top + scrollTop;
    var posLeft = left + scrollLeft;
    return getPageCoordinatesByTouches(event.touches).map(function (_a) {
      var x = _a.x,
        y = _a.y;
      return {
        x: x - posLeft,
        y: y - posTop,
      };
    });
  };
  PinchZoom.prototype._animate = function (frameFn, options) {
    var _this = this;
    var startTime = new Date().getTime();
    var _a = __assign(
        {
          timeFn: swing,
          callback: function () {},
          duration: this.props.animationDuration,
        },
        options,
      ),
      timeFn = _a.timeFn,
      callback = _a.callback,
      duration = _a.duration;
    var renderFrame = function () {
      if (!_this._inAnimation) {
        return;
      }
      var frameTime = new Date().getTime() - startTime;
      var progress = frameTime / duration;
      if (frameTime >= duration) {
        frameFn(1);
        _this._stopAnimation();
        callback();
        _this._update();
      } else {
        progress = timeFn(progress);
        frameFn(progress);
        _this._update({ isAnimation: true });
        requestAnimationFrame(renderFrame);
      }
    };
    this._inAnimation = true;
    requestAnimationFrame(renderFrame);
  };
  PinchZoom.prototype._stopAnimation = function () {
    this._inAnimation = false;
  };
  PinchZoom.prototype._end = function () {
    this._hasInteraction = false;
    this._sanitize();
    this._update();
  };
  PinchZoom.prototype._getContainerRect = function () {
    var div = this._containerRef.current;
    return div.getBoundingClientRect();
  };
  PinchZoom.prototype._getChildSize = function () {
    var div = this._containerRef.current;
    return getElementSize(
      div === null || div === void 0 ? void 0 : div.firstElementChild,
    );
  };
  PinchZoom.prototype._updateInitialZoomFactor = function () {
    var rect = this._getContainerRect();
    var size = this._getChildSize();
    var xZoomFactor = rect.width / size.width;
    var yZoomFactor = rect.height / size.height;
    this._initialZoomFactor = min(xZoomFactor, yZoomFactor);
  };
  PinchZoom.prototype._bindEvents = function () {
    var _this = this;
    var div = this._containerRef.current;
    if (window.ResizeObserver) {
      this._containerObserver = new ResizeObserver(this._onResize);
      this._containerObserver.observe(div);
    } else {
      window.addEventListener('resize', this._onResize);
    }
    this._handlers.forEach(function (_a) {
      var eventName = _a[0],
        fn = _a[1],
        target = _a[2];
      (target || div).addEventListener(eventName, fn, true);
    });
    Array.from(div.querySelectorAll('img')).forEach(function (img) {
      return img.addEventListener('load', _this._onResize);
    });
  };
  PinchZoom.prototype._unSubscribe = function () {
    var _this = this;
    var div = this._containerRef.current;
    if (this._containerObserver) {
      this._containerObserver.disconnect();
      this._containerObserver = null;
    }
    window.removeEventListener('resize', this._onResize);
    this._handlers.forEach(function (_a) {
      var eventName = _a[0],
        fn = _a[1],
        target = _a[2];
      (target || div).removeEventListener(eventName, fn, true);
    });
    Array.from(div.querySelectorAll('img')).forEach(function (img) {
      return img.removeEventListener('load', _this._onResize);
    });
  };
  PinchZoom.prototype._update = function (options) {
    var _this = this;
    if (this._updatePlaned) {
      return;
    }
    var updateFrame = function () {
      var scale = _this._getInitialZoomFactor() * _this._zoomFactor;
      var x = -_this._offset.x / scale;
      var y = -_this._offset.y / scale;
      _this.props.onUpdate({ scale: scale, x: x, y: y });
    };
    if (options === null || options === void 0 ? void 0 : options.isAnimation) {
      return updateFrame();
    }
    this._updatePlaned = true;
    requestAnimationFrame(function () {
      _this._updatePlaned = false;
      updateFrame();
    });
  };
  PinchZoom.prototype._handlerIfEnable = function (fn) {
    var _this = this;
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (_this.props.enabled) {
        fn.apply(void 0, args);
      }
    };
  };
  PinchZoom.prototype._setInteraction = function (newInteraction, event) {
    var interaction = this._interaction;
    if (interaction !== newInteraction) {
      if (interaction && !newInteraction) {
        if (isZoomInteraction(interaction)) {
          this._handleZoomEnd();
        } else if (isDragInteraction(interaction)) {
          this._handleDragEnd();
        }
      }
      if (isZoomInteraction(newInteraction)) {
        this._handleZoomStart();
      } else if (isDragInteraction(newInteraction)) {
        this._handleDragStart(event);
      }
    }
    this._interaction = newInteraction;
  };
  PinchZoom.prototype._distanceBetweenNumbers = function (a, b) {
    return a > b ? a - b : b - a;
  };
  PinchZoom.prototype._enoughToDrag = function () {
    if (
      this._distanceBetweenNumbers(this._startOffset.x, this._draggingPoint.x) >
        5 ||
      this._distanceBetweenNumbers(this._startOffset.y, this._draggingPoint.y) >
        5
    )
      return true;
    return false;
  };
  PinchZoom.prototype._updateInteraction = function (event) {
    var fingers = this._fingers;
    if (fingers === 2) {
      return this._setInteraction('zoom', event);
    }
   
    this._setInteraction(null, event);
  };
 
  PinchZoom.prototype.simulate = function (fn) {
    var _this = this;
    return function (mouseEvent) {
      var pageX = mouseEvent.pageX,
        pageY = mouseEvent.pageY,
        type = mouseEvent.type;
      var isEnd = type === 'mouseup';
      var isStart = type === 'mousedown';
      if (isStart) {
        mouseEvent.preventDefault();
        _this._listenMouseMove = true;
      }
      if (_this._listenMouseMove) {
        // @ts-ignore
        mouseEvent.touches = isEnd ? [] : [{ pageX: pageX, pageY: pageY }];
        fn(
          // @ts-ignore
          mouseEvent,
        );
      }
      if (isEnd) {
        _this._listenMouseMove = false;
      }
    };
  };
  PinchZoom.prototype.componentDidMount = function () {
    this._bindEvents();
    this._update();
  };
  PinchZoom.prototype.componentWillUnmount = function () {
    this._stopAnimation();
    this._unSubscribe();
  };
  PinchZoom.prototype.render = function () {
    var _a = this.props,
      children = _a.children,
      containerProps = _a.containerProps;
    var child = React.Children.only(children);
    var props = containerProps || {};
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, styles),
      React.createElement(
        'div',
        __assign({}, props, {
          ref: this._containerRef,
          className: classnames(styleRoot, props.className),
        }),
        React.cloneElement(child, {
          className: classnames(styleChild, child.props.className),
        }),
      ),
    );
  };
  PinchZoom.defaultProps = {
    animationDuration: 250,
    draggableUnZoomed: true,
    enabled: true,
    inertia: true,
    inertiaFriction: 0.96,
    horizontalPadding: 0,
    isTouch: isTouch,
    lockDragAxis: false,
    maxZoom: 5,
    minZoom: 0.5,
    onDoubleTap: noup,
    onDragEnd: noup,
    onDragStart: noup,
    onDragUpdate: noup,
    onZoomEnd: noup,
    onZoomStart: noup,
    onZoomUpdate: noup,
    setOffsetsOnce: false,
    shouldInterceptWheel: shouldInterceptWheel,
    shouldCancelHandledTouchEndEvents: false,
    tapZoomFactor: 1,
    verticalPadding: 0,
    wheelScaleFactor: 1500,
    zoomOutFactor: 1.3,
    // @ts-expect-error
    _document: isSsr ? null : window.document,
  };
  return PinchZoom;
})(React.Component);
if (process.env.NODE_ENV !== 'production') {
  var _a = require('prop-types'),
    any = _a.any,
    element = _a.element,
    object = _a.object,
    number = _a.number,
    func = _a.func,
    bool = _a.bool;
  // @ts-ignore
  PinchZoom.propTypes = {
    children: element,
    containerProps: object,
    wheelScaleFactor: number,
    animationDuration: number,
    draggableUnZoomed: bool,
    enabled: bool,
    horizontalPadding: number,
    lockDragAxis: bool,
    onUpdate: func.isRequired,
    maxZoom: number,
    minZoom: number,
    onDoubleTap: func,
    onDragEnd: func,
    onDragStart: func,
    onDragUpdate: func,
    onZoomEnd: func,
    onZoomStart: func,
    onZoomUpdate: func,
    setOffsetsOnce: bool,
    tapZoomFactor: number,
    verticalPadding: number,
    zoomOutFactor: number,
    isTouch: func,
    _document: any,
  };
}
export default PinchZoom;
