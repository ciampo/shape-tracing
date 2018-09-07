import { drawShape, generateRandomShape } from './shapes.js';

export default class Sketch {
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
    this._animCounterShapeDuration = 180;
    this._animCounterShapeOffset =
      Math.round(this._animCounterShapeDuration * 0.75);

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
    const outerRadius = Math.round(Math.min(screenCenter.x, screenCenter.y) * 0.7);

    const shapesLength = this.shapes.length;
    const prevSides = shapesLength > 0 && this.shapes[shapesLength - 1].sides;

    this.shapes.push(generateRandomShape(screenCenter, outerRadius, prevSides));

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
    this._ctx.fillStyle = this.drawingColors.bg;
    this._ctx.fillRect(0, 0, this._viewportSize.w, this._viewportSize.h);

    this._ctx.fillStyle = this._ctx.strokeStyle = this.drawingColors.fg;

    let shapeProgress;
    this.shapes.forEach((shapeOpts, i) => {
      shapeProgress = (this._animCounter - (i + 1) * this._animCounterShapeOffset) / this._animCounterShapeDuration;
      drawShape(this._ctx, shapeProgress, shapeOpts);
    });

    if (this._animActive) {
      // Add a shape when the last one has started to be drawn
      if (shapeProgress > 0) {
        this.addShape();
      }

      this._animCounter += 1;
    }
  }
};
