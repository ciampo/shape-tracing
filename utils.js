export function getMouseCoordinates(evt, canvasBCR, devicePxRatio = 1) {
  let toReturn = {};

  toReturn.x = Math.round(((evt.clientX * devicePxRatio) - canvasBCR.left) /
      (canvasBCR.right - canvasBCR.left) * canvasBCR.width);
  toReturn.y = Math.round(((evt.clientY * devicePxRatio) - canvasBCR.top) /
    (canvasBCR.bottom - canvasBCR.top) * canvasBCR.height);

  return toReturn;
};

export function getDistance2d(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export function absMax(x, y) {
  return Math.max(Math.abs(x), Math.abs(y));
};

export function createCanvasFullScreenBCR(canvas) {
  return {
    top: 0,
    right: canvas.width,
    bottom: canvas.height,
    left: 0,
    width: canvas.width,
    height: canvas.height
  };
};

export function getAngleBetweenPoints(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

export function bitwiseRound(n) {
  return (0.5 + n) << 0;
}

export function stepEasing(n, t = 0.5) {
  const rest = Math.floor(n);
  return rest + Math.min(1, (n - rest) / t);
}

export const _360deg = 2 * Math.PI;

export function randomIntFromZeroTo(upperBound) {
  return Math.floor(Math.random() * (upperBound + 1));
}
