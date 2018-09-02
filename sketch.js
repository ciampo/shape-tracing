import { drawShape } from './shapes.js';

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
      drawShape(this._ctx, progress - progressOffset, shapeOpts);
    });

    if (this._animActive) {
      this._animCounter += 1;

      // if (this._animCounter > this._animCounterEnd) {
      //   this._animActive = false;
      //   this._animCounter = 0;
      // }
    }
  }
};
