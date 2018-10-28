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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shapes_js__ = __webpack_require__(2);


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
    this._darkMode = true;

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._root.addEventListener('pointermove', this._onPointerMove);
    this._root.addEventListener('pointerup', this._onPointerUp);

    this._animActive = true;
    this._animCounter = 0;
    this._animCounterShapeDuration = 200;
    this._animCounterShapeOffset =
      Math.round(this._animCounterShapeDuration * 0.5);

    this._radiusRandomVariationPerc = 0.2;

    this.onResize();

    // Start with two shapes, add more as the
    this.shapes = [];
    this.addShape();
    this.addShape();
  }

  get drawingColors() {
    return this._darkMode ? {
      bg: '#222',
      fg: '#ddd',
    } : {
      bg: '#e4e3e5',
      fg: '#1e1e1e',
    };
  }

  switchColorMode() {
    this._darkMode = !this._darkMode;
  }

  addShape() {
    const screenCenter = {
      x: this._viewportSize.w / 2,
      y: this._viewportSize.h / 2,
    };

    // 60% of vmin
    const radius = Math.round(Math.min(screenCenter.x, screenCenter.y) * 0.6);

    const shapesLength = this.shapes.length;
    const vetoSides = [];
    if (shapesLength > 0) {
      vetoSides.push(this.shapes[shapesLength - 1].sides);
    }
    if (shapesLength > 1) {
      vetoSides.push(this.shapes[shapesLength - 2].sides);
    }

    const previousRadius = shapesLength > 0 ?
    this.shapes[shapesLength - 1].outerRadius : 0;

    this.shapes.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shapes_js__["a" /* generateRandomShape */])(screenCenter, radius,
      previousRadius, vetoSides));
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
    this._ctx.fillStyle = this.drawingColors.bg;
    this._ctx.fillRect(0, 0, this._viewportSize.w, this._viewportSize.h);

    this._ctx.fillStyle = this._ctx.strokeStyle = this.drawingColors.fg;

    let shapeProgress;
    this.shapes.forEach((shapeOpts, i) => {
      shapeProgress = (this._animCounter - (i + 1) * this._animCounterShapeOffset) / this._animCounterShapeDuration;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shapes_js__["b" /* drawShape */])(this._ctx, shapeProgress, shapeOpts);
    });

    if (this._animActive) {
      // Add a shape when the last one has started to be drawn
      if (shapeProgress > 0) {
        this.addShape();
      }

      this._animCounter += 1;
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

// Draw entry point
function start() {
  // Start sketch.
  sketch = new __WEBPACK_IMPORTED_MODULE_0__sketch_js__["a" /* default */](document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', () => {sketch.onResize()}, false);
  window.addEventListener('keyup', (e) => {
    // Letter c
    if (e.keyCode === 67) {
      sketch.switchColorMode();
    }
  }, false);
}

// Start sketch
start();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = drawShape;
/* harmony export (immutable) */ __webpack_exports__["a"] = generateRandomShape;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(3);


const defaultOptions = {
  cX: 0,
  cY: 0,
  outerRadius: 50,
  sides: 4,
  startAngle: 0,
  dotSize: 4,
  dots: [],
};

const computeDefaultDots = (sides) => [...Array(sides).keys()]
  .map(n => ({from: n, direction: +1}));

const easeOutBezier = BezierEasing(0.32, 0, 0.15, 1);
const easeOut = p => easeOutBezier(p);
const easeOutQuart = (t) => 1 - (--t) * t * t * t;
const easeOutQuint = (t) => 1 + (--t) * t * t * t * t;

const computeDotScaleUpSize = (dotSize, progress, dotIndex, numDots) => {
  const staggerStep = 0.3 / numDots;
  const scaleSpeed = 4;

  // [progress] is assumed to be negative at this point.
  const dotDrawingProgress = easeOutQuint(Math.max(0, Math.min(1,
    scaleSpeed * (progress + 0.5 - dotIndex * staggerStep)
  )));

  return dotDrawingProgress * dotSize;
};

function drawShape(ctx, progress, options) {
  if (!ctx) {
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

  // Used to draw the shape
  const drawingProgress = easeOut(Math.max(0, Math.min(1, progress)));

  // Used to make the shape scale up.
  // the "/ 1.5" makes the scale animation takes 1.5 times as long as
  // the time that it takes to draw the shape.
  // The 1.5 multiplier amplifies the scale effect by 150%, thus making the shape
  // grow to 250% its initial size.
  const shapeScale = 1 + 1.5 *
    easeOut(Math.max(0, Math.min(1, (progress - 1) / 1.5)));

  // The opacity is eased with a more agressive easing, so that it becomes
  // semi transparent almost immediately after it's been drawn.
  const shapeAlpha = 1 - easeOutQuart(Math.max(0, Math.min(1, progress - 1)));

  // No need to draw transparent shapes.
  if (shapeAlpha <= 0) {
    return;
  }

  ctx.save();
  ctx.translate(Math.round(cX), Math.round(cY));
  ctx.rotate(startAngle);
  ctx.scale(shapeScale, shapeScale);
  ctx.globalAlpha = shapeAlpha;
  ctx.lineWidth = 1;

  if (sides === 0) {
    // Circle
    dots.forEach(({antiClockwise}, dotIndex) => {
      // Compute angles. Keeping in mind that we already rotated by startAngle.
      const offsetAngle = antiClockwise ?
          2 * Math.PI * (dotIndex - dots.length + 1) / dots.length :
          2 * Math.PI * dotIndex / dots.length;
      const progressAngle = 2 * Math.PI * drawingProgress * (antiClockwise ? -1 : 1) / dots.length;

      const pArcStart = {
        x: outerRadius * Math.cos(offsetAngle),
        y: outerRadius * Math.sin(offsetAngle),
      };
      const pDot = {
        x: outerRadius * Math.cos(offsetAngle + progressAngle),
        y: outerRadius * Math.sin(offsetAngle + progressAngle),
      };

      // Compute dot size
      const dotRadius = progress > 0 ?
        dotSize * Math.min(1, Math.max(0, 1 - progress)) :
        computeDotScaleUpSize(dotSize, progress, dotIndex, dots.length);

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

    dots.forEach(({from, direction}, dotIndex) => {
      if (direction === 0) {
        return;
      }

      let sideProgress = drawingProgress * Math.abs(direction);
      let startingCorner = from;

      // Draw the sides that are already completed.
      ctx.beginPath();
      ctx.moveTo(
        outerRadius * Math.cos(angleIncrement * startingCorner),
        outerRadius * Math.sin(angleIncrement * startingCorner)
      );
      while(sideProgress > 1) {
        ctx.lineTo(
          outerRadius * Math.cos(angleIncrement * (startingCorner + Math.sign(direction))),
          outerRadius * Math.sin(angleIncrement * (startingCorner + Math.sign(direction)))
        );

        sideProgress -= 1;
        startingCorner += Math.sign(direction);
      }

      // Draw the side that is in progress.
      const pSideStart = {
        x: outerRadius * Math.cos(angleIncrement * startingCorner),
        y: outerRadius * Math.sin(angleIncrement * startingCorner),
      };
      const pSideEnd = {
        x: outerRadius * Math.cos(angleIncrement * (startingCorner + Math.sign(direction))),
        y: outerRadius * Math.sin(angleIncrement * (startingCorner + Math.sign(direction))),
      };
      const pDot = {
        x: pSideStart.x + (pSideEnd.x - pSideStart.x) * sideProgress,
        y: pSideStart.y + (pSideEnd.y - pSideStart.y) * sideProgress,
      };

      // Draw line for the side in progress
      ctx.lineTo(pDot.x, pDot.y);
      ctx.stroke();

      // Compute dot size
      const dotRadius = progress > 0 ?
        dotSize * (1 - drawingProgress) :
        computeDotScaleUpSize(dotSize, progress, dotIndex, dots.length);

      // Draw dot.
      ctx.beginPath();
      ctx.moveTo(pDot.x, pDot.y);
      ctx.arc(pDot.x, pDot.y, dotRadius, 0, Math.PI * 2, false);
      ctx.fill();
    });
  }

  ctx.restore();
}

const shapeDotsCombinations = {
  // Circle combinations
  0: [
    [{antiClockwise: true}],
    [{antiClockwise: false}],
    [{antiClockwise: false}, {antiClockwise: true}],
    [{antiClockwise: true}, {antiClockwise: true}],
    [{antiClockwise: false}, {antiClockwise: false}],
    [{antiClockwise: false}, {antiClockwise: false}, {antiClockwise: false}],
    [{antiClockwise: true}, {antiClockwise: true}, {antiClockwise: true}],
    [{antiClockwise: false}, {antiClockwise: true}, {antiClockwise: true}],
    [{antiClockwise: false}, {antiClockwise: false}, {antiClockwise: true}],
  ],
  // Triangle combinations
  3: [
    [
      {from: 0, direction: +1},
      {from: 1, direction: +1},
      {from: 2, direction: +1},
    ],
    [
      {from: 0, direction: -1},
      {from: 1, direction: -1},
      {from: 2, direction: -1},
    ],
    [
      {from: 0, direction: -1},
      {from: 0, direction: +1},
      {from: 2, direction: -1},
    ],
    [
      {from: 0, direction: +2},
      {from: 2, direction: +1},
    ],
    [
      {from: 0, direction: -2},
      {from: 2, direction: -1},
    ],
    [
      {from: 0, direction: +3},
    ],
    [
      {from: 0, direction: -3},
    ],
  ],
  // Square combinations
  4: [
    [
      {from: 0, direction: +1},
      {from: 1, direction: +1},
      {from: 2, direction: +1},
      {from: 3, direction: +1},
    ],
    [
      {from: 0, direction: -1},
      {from: 1, direction: -1},
      {from: 2, direction: -1},
      {from: 3, direction: -1},
    ],
    [
      {from: 0, direction: -1},
      {from: 0, direction: +1},
      {from: 2, direction: -1},
      {from: 2, direction: +1},
    ],
    [
      {from: 0, direction: -1},
      {from: 0, direction: +2},
      {from: 2, direction: +1},
    ],
    [
      {from: 0, direction: -2},
      {from: 0, direction: +1},
      {from: 2, direction: -1},
    ],
    [
      {from: 0, direction: -2},
      {from: 0, direction: +2},
    ],
    [
      {from: 0, direction: +2},
      {from: 0, direction: -2},
    ],
    [
      {from: 0, direction: +2},
      {from: 2, direction: +2},
    ],
    [
      {from: 0, direction: -2},
      {from: 2, direction: -2},
    ],
  ],
  // Hexagon combinations
  6: [
    [
      { from: 1, direction: -1, },
      { from: 1, direction: +1, },
      { from: 3, direction: -1, },
      { from: 4, direction: -1, },
      { from: 4, direction: +2, },
    ],
    [
      { from: 1, direction: -1, },
      { from: 1, direction: +1, },
      { from: 5, direction: +1, },
      { from: 4, direction: +1, },
      { from: 4, direction: -2, },
    ],
    [
      { from: 0, direction: -1, },
      { from: 0, direction: +3, },
      { from: 4, direction: -1, },
      { from: 4, direction: +1, },
    ],
    [
      { from: 0, direction: -3, },
      { from: 0, direction: +1, },
      { from: 2, direction: -1, },
      { from: 2, direction: +1, },
    ],
    [
      { from: 0, direction: -1, },
      { from: 0, direction: +1, },
      { from: 2, direction: -1, },
      { from: 2, direction: +1, },
      { from: 4, direction: -1, },
      { from: 4, direction: +1, },
    ],
    [
      { from: 0, direction: +2, },
      { from: 2, direction: +2, },
      { from: 4, direction: +2, },
    ],
    [
      { from: 0, direction: -2, },
      { from: 2, direction: -2, },
      { from: 4, direction: -2, },
    ],
  ],
  // Octagon combinations
  8: [
    [
      { from: 1, direction: -1, },
      { from: 1, direction: +1, },
      { from: 2, direction: +3, },
      { from: 5, direction: +3, },
    ],
    [
      { from: 2, direction: -2, },
      { from: 2, direction: +1, },
      { from: 3, direction: +3, },
      { from: 6, direction: +2, },
    ],
    [
      { from: 6, direction: +2, },
      { from: 6, direction: -1, },
      { from: 5, direction: -3, },
      { from: 2, direction: -2, },
    ],
    [
      { from: 0, direction: +2, },
      { from: 0, direction: -2, },
      { from: 4, direction: +2, },
      { from: 4, direction: -2, },
    ],
    [
      { from: 1, direction: +2, },
      { from: 1, direction: -2, },
      { from: 5, direction: +2, },
      { from: 5, direction: -2, },
    ],
    [
      { from: 0, direction: +1, },
      { from: 0, direction: -1, },
      { from: 2, direction: +1, },
      { from: 2, direction: -1, },
      { from: 4, direction: +1, },
      { from: 4, direction: -1, },
      { from: 6, direction: +1, },
      { from: 6, direction: -1, },
    ],
    [
      { from: 1, direction: +1, },
      { from: 1, direction: -1, },
      { from: 3, direction: +1, },
      { from: 3, direction: -1, },
      { from: 5, direction: +1, },
      { from: 5, direction: -1, },
      { from: 7, direction: +1, },
      { from: 7, direction: -1, },
    ],
    [
      { from: 0, direction: +3, },
      { from: 0, direction: -3, },
      { from: 3, direction: +1, },
      { from: 4, direction: +1, },
    ],
    [
      { from: 0, direction: +3, },
      { from: 0, direction: -3, },
      { from: 4, direction: -1, },
      { from: 5, direction: -1, },
    ],
  ],
}


function generateRandomShape(center, radius, previousRadius, vetoSides = [],) {
  let sides = -1;

  // Pick only numbers between [minSides] and [maxSides],
  // that are not vetoes (ie. used recently in another shape).
  // Or 0 (aka a circle).
  let isValidSides = false;
  const minSides = 4;
  const maxSides = 8;
  while (!isValidSides) {
    sides = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* randomIntFromZeroTo */])(maxSides);
    isValidSides = (sides === 0 && !vetoSides.includes(sides)) ||
      (sides >= minSides && sides <= maxSides && sides % 2 === 0 && !vetoSides.includes(sides));
  }

  // Add/subtract a random amount to the radius.
  // But never too close to the previous shape (at least 30%)
  let outerRadius = previousRadius;
  while (Math.abs(outerRadius - previousRadius) < radius * 0.1) {
    outerRadius = radius +
      0.4 * (Math.round(Math.random() * 2 * radius) - radius);
  }

  let startAngle;
  if (sides === 0) {
    startAngle = __WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* _360deg */] / 4 * __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* randomIntFromZeroTo */])(3);
  } else {
    let randomAngleMult = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* randomIntFromZeroTo */])(sides - 1);
    // Make octagon always have a flat horizontal edge.
    if (sides === 8 && randomAngleMult % 2 === 0) {
      randomAngleMult -= 1;
    }

    startAngle = __WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* _360deg */] / (2 * sides) * randomAngleMult;
  }

  let dots;
  if (shapeDotsCombinations[sides]) {
    // Get all possible combinations for this amount of dots
    const combinations = shapeDotsCombinations[sides];
    // Pick a random combination.
    dots = combinations[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* randomIntFromZeroTo */])(combinations.length - 1)];
  } else {
    dots = computeDefaultDots(sides);
  }

  return {
    cX: center.x,
    cY: center.y,
    outerRadius,
    sides,
    startAngle,
    dots,
  };
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getMouseCoordinates */
/* unused harmony export getDistance2d */
/* unused harmony export absMax */
/* unused harmony export createCanvasFullScreenBCR */
/* unused harmony export getAngleBetweenPoints */
/* unused harmony export bitwiseRound */
/* unused harmony export stepEasing */
/* harmony export (immutable) */ __webpack_exports__["a"] = randomIntFromZeroTo;
function getMouseCoordinates(evt, canvasBCR, devicePxRatio = 1) {
  let toReturn = {};

  toReturn.x = Math.round(((evt.clientX * devicePxRatio) - canvasBCR.left) /
      (canvasBCR.right - canvasBCR.left) * canvasBCR.width);
  toReturn.y = Math.round(((evt.clientY * devicePxRatio) - canvasBCR.top) /
    (canvasBCR.bottom - canvasBCR.top) * canvasBCR.height);

  return toReturn;
};

function getDistance2d(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

function absMax(x, y) {
  return Math.max(Math.abs(x), Math.abs(y));
};

function createCanvasFullScreenBCR(canvas) {
  return {
    top: 0,
    right: canvas.width,
    bottom: canvas.height,
    left: 0,
    width: canvas.width,
    height: canvas.height
  };
};

function getAngleBetweenPoints(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function bitwiseRound(n) {
  return (0.5 + n) << 0;
}

function stepEasing(n, t = 0.5) {
  const rest = Math.floor(n);
  return rest + Math.min(1, (n - rest) / t);
}

const _360deg = 2 * Math.PI;
/* harmony export (immutable) */ __webpack_exports__["b"] = _360deg;


function randomIntFromZeroTo(upperBound) {
  return Math.floor(Math.random() * (upperBound + 1));
}


/***/ })
/******/ ]);