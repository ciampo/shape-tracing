/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shapes_js__ = __webpack_require__(3);


class Sketch {
  constructor(rootEl, options = {}) {
    // From arguments
    this._root = rootEl;

    // Bind
    this.drawFrame = this.drawFrame.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    // Rendering
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._root.appendChild(this._canvas);

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._root.addEventListener('pointermove', this._onPointerMove);
    this._root.addEventListener('pointerup', this._onPointerUp);

    this._animActive = false;
    this._animCounter = 0;
    this._animCounterOffset = 100;
    this._animCounterEnd = 300;

    this.onResize();
  }

  get shapes() {
    const screenCenter = {
      x: this._viewportSize.w / 2,
      y: this._viewportSize.h / 2,
    };
    const outerRadius = Math.round(Math.min(screenCenter.x, screenCenter.y) * 0.9);

    return [
      {
        cX: screenCenter.x,
        cY: screenCenter.y,
        outerRadius,
        sides: 0,
        startAngle: Math.PI,
        dots: [
          {antiClockwise: true},
          {antiClockwise: false},
        ],
      },
      {
        cX: screenCenter.x,
        cY: screenCenter.y,
        outerRadius,
        sides: 3,
        startAngle: Math.PI / 6,
        dots: [
          { from: 0, direction: +1, },
          { from: 1, direction: +1, },
          { from: 2, direction: +1, },
        ],
      },
      {
        cX: screenCenter.x,
        cY: screenCenter.y,
        outerRadius,
        sides: 4,
        startAngle: Math.PI / 4,
        dots: [
          { from: 0, direction: +1, },
          { from: 4, direction: -1, },
          { from: 2, direction: -1, },
          { from: 2, direction: +1, },
        ],
      },
      {
        cX: screenCenter.x,
        cY: screenCenter.y,
        outerRadius,
        sides: 5,
        dots: [
          { from: 0, direction: +1, },
          { from: 1, direction: +1, },
          { from: 3, direction: -1, },
          { from: 3, direction: +1, },
          { from: 4, direction: +1, },
        ],
      },
      {
        cX: screenCenter.x,
        cY: screenCenter.y,
        outerRadius,
        sides: 6,
        dots: [
          { from: 0, direction: +1, },
          { from: 1, direction: +1, },
          { from: 3, direction: -1, },
          { from: 3, direction: +1, },
          { from: 5, direction: -1, },
          { from: 6, direction: -1, },
        ],
      },
      // {
      //   cX: screenCenter.x,
      //   cY: screenCenter.y,
      //   outerRadius,
      //   sides: 7,
      // },
      // {
      //   cX: screenCenter.x,
      //   cY: screenCenter.y,
      //   outerRadius,
      //   sides: 8,
      // },
    ]
  }

  startDrawing() {
    this._drawing = true;
    requestAnimationFrame(this.drawFrame);
  }

  stopDrawing() {
    this._drawing = false;
  }

  onResize() {
    const {innerWidth, innerHeight} = window;
    this._viewportSize = {w: innerWidth, h: innerHeight};

    this._canvas.style.width = `${innerWidth}px`;
    this._canvas.style.height = `${innerHeight}px`;
    this._canvas.setAttribute('width', `${innerWidth * this._DPR}px`);
    this._canvas.setAttribute('height', `${innerHeight * this._DPR}px`);
  }

  _onPointerMove(evt) {

  }

  _onPointerUp() {
    if (!this._animActive) {
      this._animActive = true;
    }
  }

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    this._ctx.fillStyle = '#e4e3e5';
    this._ctx.fillRect(0, 0, this._viewportSize.w, this._viewportSize.h);

    let progress = 0;
    if (this._animActive) {
      progress = this._animCounter / this._animCounterEnd;
    }

    this._ctx.fillStyle = 'rgb(30, 30, 30)';
    this._ctx.strokeStyle = `rgba(30, 30, 30, ${1})`;
    this.shapes.forEach((shapeOpts, i) => {
      const progressOffset = i * this._animCounterOffset / this._animCounterEnd;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shapes_js__["a" /* drawShape */])(this._ctx, progress - progressOffset, shapeOpts);
    });

    if (this._animActive) {
      this._animCounter += 1;

      // if (this._animCounter > this._animCounterEnd) {
      //   this._animActive = false;
      //   this._animCounter = 0;
      // }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sketch;
;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sketch_js__ = __webpack_require__(0);


let sketch;
let datGui;

// Draw entry point
function start() {
  // Start sketch.
  sketch = new __WEBPACK_IMPORTED_MODULE_0__sketch_js__["a" /* default */](document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', _ => {sketch.onResize()}, false);

  // dat.gui
  // datGui = new dat.GUI();
  // datGui.add(sketch, 'u', 20, 260, 1);
  // datGui.addColor(sketch, 'fillBg');
  // datGui.addColor(sketch, 'fillA');
  // datGui.addColor(sketch, 'fillB');
}

// Start sketch
start();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export linear */
/* unused harmony export easeInQuad */
/* unused harmony export easeOutQuad */
/* unused harmony export easeInOutQuad */
/* unused harmony export easeInCubic */
/* unused harmony export easeOutCubic */
/* harmony export (immutable) */ __webpack_exports__["a"] = easeInOutCubic;
/* unused harmony export easeInQuart */
/* unused harmony export easeOutQuart */
/* unused harmony export easeInOutQuart */
/* unused harmony export easeInQuint */
/* unused harmony export easeOutQuint */
/* unused harmony export easeInOutQuint */
function linear(t) {
  return t;
}

// accelerating from zero velocity
function easeInQuad(t) {
  return t * t;
}

// decelerating to zero velocity
function easeOutQuad(t) {
  return t * (2 - t);
}

// acceleration until halfway, then deceleration
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// accelerating from zero velocity
function easeInCubic(t) {
  return t * t * t;
}

// decelerating to zero velocity
function easeOutCubic(t) {
  return --t * t * t + 1;
}

// acceleration until halfway, then deceleration
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// accelerating from zero velocity
function easeInQuart(t) {
  return t * t * t * t;
}

// decelerating to zero velocity
function easeOutQuart(t) {
  return 1 - --t * t * t * t;
}

// acceleration until halfway, then deceleration
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

// accelerating from zero velocity
function easeInQuint(t) {
  return t * t * t * t * t;
}

// decelerating to zero velocity
function easeOutQuint(t) {
  return 1 + --t * t * t * t * t;
}

// acceleration until halfway, then deceleration
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = drawShape;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__easing_js__ = __webpack_require__(2);


const defaultOptions = {
  cX: 0,
  cY: 0,
  outerRadius: 50,
  sides: 4,
  startAngle: 0,
  dotSize: 6,
  dots: [],
};

const computeDefaultDots = (sides) => [...Array(sides).keys()]
  .map(n => [{from: n, to: (n + 1) % sides}]);

function drawShape(ctx, progress, options) {
  if (!ctx || progress < 0) {
    return;
  }

  const parsedOptions = Object.assign({}, defaultOptions, options);
  const {
    cX,
    cY,
    outerRadius,
    sides,
    startAngle,
    dotSize,
  } = parsedOptions;
  const dots = options.dots || computeDefaultDots(sides);

  if (sides !== 0 && sides < 3) {
    return;
  }

  const easedProgress = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__easing_js__["a" /* easeInOutCubic */])(Math.max(0, Math.min(1, progress)));
  const dotRadius = dotSize * (1 - easedProgress);

  ctx.save();
  ctx.translate(Math.round(cX), Math.round(cY));
  ctx.rotate(startAngle);
  ctx.lineWidth = 1;

  if (sides === 0) {
    // Circle
    dots.forEach(({antiClockwise}, dotIndex) => {
      // Compute angles. Keeping in mind that we already rotated by startAngle.
      const offsetAngle = antiClockwise ?
          2 * Math.PI * (dotIndex - dots.length + 1) / dots.length :
          2 * Math.PI * dotIndex / dots.length;
      const progressAngle = 2 * Math.PI * easedProgress * (antiClockwise ? -1 : 1) / dots.length;

      const pArcStart = {
        x: outerRadius * Math.cos(offsetAngle),
        y: outerRadius * Math.sin(offsetAngle),
      };
      const pDot = {
        x: outerRadius * Math.cos(offsetAngle + progressAngle),
        y: outerRadius * Math.sin(offsetAngle + progressAngle),
      };

      // Draw arc.
      ctx.beginPath();
      ctx.moveTo(pArcStart.x, pArcStart.y);
      ctx.arc(0, 0, outerRadius, offsetAngle, offsetAngle + progressAngle, antiClockwise);
      ctx.stroke();

      // Draw dot.
      ctx.beginPath();
      ctx.moveTo(pDot.x, pDot.y);
      ctx.arc(pDot.x, pDot.y, dotRadius, 0, Math.PI * 2, false);
      ctx.fill();
    });

  } else {
    // Regular polygon.
    const angleIncrement = Math.PI * 2 / sides;
    const sideLength = 2 * outerRadius * Math.sin(Math.PI / sides);

    dots.forEach(({from, direction}) => {
      if (direction === 0) {
        return;
      }

      const pSideStart = {
        x: outerRadius * Math.cos(angleIncrement * from),
        y: outerRadius * Math.sin(angleIncrement * from),
      };
      const pSideEnd = {
        x: outerRadius * Math.cos(angleIncrement * (from + Math.sign(direction))),
        y: outerRadius * Math.sin(angleIncrement * (from + Math.sign(direction))),
      };
      const pDot = {
        x: pSideStart.x + (pSideEnd.x - pSideStart.x) * easedProgress,
        y: pSideStart.y + (pSideEnd.y - pSideStart.y) * easedProgress,
      };

      // Draw line (simulate progress through a dashed line).
      ctx.beginPath();
      ctx.setLineDash([sideLength * easedProgress, sideLength]);
      ctx.moveTo(pSideStart.x, pSideStart.y);
      ctx.lineTo(pSideEnd.x, pSideEnd.y);
      ctx.stroke();

      // Draw dot.
      ctx.beginPath();
      ctx.moveTo(pDot.x, pDot.y);
      ctx.arc(pDot.x, pDot.y, dotRadius, 0, Math.PI * 2, false);
      ctx.fill();
    });
  }

  ctx.restore();
}


/***/ })
/******/ ]);