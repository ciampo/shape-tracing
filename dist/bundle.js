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

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._root.addEventListener('pointermove', this._onPointerMove);
    this._root.addEventListener('pointerup', this._onPointerUp);

    this._animActive = true;
    this._animCounter = 0;
    this._animCounterShapeDuration = 180;
    this._animCounterShapeOffset = Math.round(this._animCounterShapeDuration * 0.75);

    this.onResize();

    this.shapes = this.generateShapes();
    console.log(this.shapes);
  }

  generateShapes() {
    const screenCenter = {
      x: this._viewportSize.w / 2,
      y: this._viewportSize.h / 2,
    };
    const outerRadius = Math.round(Math.min(screenCenter.x, screenCenter.y) * 0.7);

    const toReturn = [];

    for (let i = 0; i < 100; i++) {
      const prevSides = i > 0 && toReturn[i - 1].sides;
      toReturn.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shapes_js__["a" /* generateRandomShape */])(screenCenter, outerRadius, prevSides));
    }


    return toReturn;


    // return [
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 4,
    //     startAngle: Math.PI / 4,
    //     dots: [
    //       { from: 0, direction: +1, },
    //       { from: 1, direction: +1, },
    //       { from: 2, direction: +1, },
    //       { from: 3, direction: +1, },
    //     ],
    //   },
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 8,
    //     startAngle: Math.PI / 8 * 3,
    //     dots: [
    //       { from: 1, direction: -1, },
    //       { from: 1, direction: +1, },
    //       { from: 2, direction: +3, },
    //       { from: 5, direction: +3, },
    //     ],
    //   },
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 4,
    //     startAngle: Math.PI / 2,
    //     dots: [
    //       { from: 0, direction: +1, },
    //       { from: 0, direction: -1, },
    //       { from: 2, direction: +1, },
    //       { from: 2, direction: -1, },
    //     ],
    //   },
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 6,
    //     dots: [
    //       { from: 1, direction: -1, },
    //       { from: 1, direction: +1, },
    //       { from: 3, direction: -1, },
    //       { from: 4, direction: -1, },
    //       { from: 4, direction: +2, },
    //     ],
    //   },
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 0,
    //     startAngle: Math.PI / 2,
    //     dots: [
    //       {antiClockwise: true},
    //     ],
    //   },
    //   {
    //     cX: screenCenter.x,
    //     cY: screenCenter.y,
    //     outerRadius,
    //     sides: 8,
    //     startAngle: Math.PI / 8 * 3,
    //     dots: [
    //       { from: 2, direction: -2, },
    //       { from: 2, direction: +1, },
    //       { from: 3, direction: +3, },
    //       { from: 6, direction: +2, },
    //     ],
    //   },
    // ]
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

    this._ctx.fillStyle = '#222';
    this._ctx.fillRect(0, 0, this._viewportSize.w, this._viewportSize.h);

    this._ctx.fillStyle = 'rgb(200, 200, 200)';
    this._ctx.strokeStyle = `rgba(200, 200, 200, ${1})`;
    this.shapes.forEach((shapeOpts, i) => {
      const progress = (this._animCounter - (i + 1) * this._animCounterShapeOffset) / this._animCounterShapeDuration;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shapes_js__["b" /* drawShape */])(this._ctx, progress, shapeOpts);
    });

    if (this._animActive) {
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
/* harmony export (immutable) */ __webpack_exports__["b"] = drawShape;
/* harmony export (immutable) */ __webpack_exports__["a"] = generateRandomShape;
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

  let drawingProgress = easeOut(Math.max(0, Math.min(1, progress)));
  let beforeDrawingProgress = 0;
  if (progress < 0) {
    // 2 + progress makes sure beforeDrawingProgress is twice as fast as
    // the time that it takes to draw the shape (quicker fade in)
    beforeDrawingProgress = easeOut(Math.max(0, Math.min(1, - 2 * progress)));
  }
  let afterDrawingProgress = 0;
  if (progress > 1) {
    // progress / 2 makes sure afterDrawingProgress takes twice as long as
    // the time that it takes to draw the shape (smoother fade out)
    afterDrawingProgress = easeOut(Math.max(0, Math.min(1, (progress - 1) / 2)));
  }

  const dotRadius = beforeDrawingProgress > 0 ?
    dotSize * (1 - beforeDrawingProgress) :
    dotSize * (1 - drawingProgress);

  ctx.save();
  ctx.translate(Math.round(cX), Math.round(cY));
  ctx.rotate(startAngle);
  ctx.scale(1 + 1.5 * afterDrawingProgress, 1 + 1.5 * afterDrawingProgress);
  ctx.globalAlpha = 1 - afterDrawingProgress;
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

      let sideProgress = drawingProgress * Math.abs(direction);
      let startingCorner = from;

      ctx.beginPath();
      ctx.setLineDash([]);
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
      ctx.stroke();


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

      // Draw line (simulate progress through a dashed line).
      ctx.beginPath();
      ctx.setLineDash([sideLength * sideProgress, sideLength]);
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


function generateRandomShape(center, radius, vetoSides = -1) {
  // Possible values: 0 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10.
  let sides = -1;
  while(sides < 0 ||
        sides > 8 ||
        sides === 2 ||
        sides % 2 !== 0 ||
        sides === vetoSides
  ) {
    sides = Math.floor(Math.random() * 11);
  }

  const toReturn = {
    cX: center.x,
    cY: center.y,
    outerRadius: radius,
    sides,
    startAngle: Math.PI / (sides || 1) * Math.floor(Math.random() * (sides + 1)),
  };

  if (sides === 0) {
    toReturn.dots = [];

    const howManyDots = 1 + Math.floor(Math.random() * 4)
    for (let i = 0; i < howManyDots; i++) {
      toReturn.dots.push({
        antiClockwise: Math.random() > 0.5
      });
    }

  } else {
    toReturn.dots = computeDefaultDots(sides);
  }

  return toReturn;
}



/***/ })
/******/ ]);