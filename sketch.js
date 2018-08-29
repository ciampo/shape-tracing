import { easeInOutCubic } from './easing.js';
import { drawSquare } from './square.js';
import { regPolyPath, polygon } from './shapes.js';

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
    this._animCounterEnd = 150;

    this.onResize();
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
      progress = easeInOutCubic(this._animCounter / this._animCounterEnd);
    }

    const scaleFactor = 4;
    const translateX = this._viewportSize.w / 2;
    const translateY = this._viewportSize.h / 2;
    drawSquare(this._ctx, 80, scaleFactor, {x: translateX, y: translateY}, progress);

    regPolyPath(200, 200, 50, 6, this._ctx);
    polygon(this._ctx, 300, 200, 50, 6, Math.PI / 2, true);

    if (this._animActive) {
      this._animCounter += 1;

      if (this._animCounter > this._animCounterEnd) {
        this._animActive = false;
        this._animCounter = 0;
      }
    }
  }
};
