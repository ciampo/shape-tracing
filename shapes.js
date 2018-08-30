import { easeInOutCubic } from './easing.js';

const defaultOptions = {
  cX: 0,
  cY: 0,
  outerRadius: 50,
  sides: 4,
  startAngle: 0,
  antiClockwise: false,
  dotSize: 6,
};

const computeDefaultDots = (sides) => [...Array(sides).keys()]
  .map(n => [{from: n, to: (n + 1) % sides}]);

export function polygon(ctx, progress, options) {
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
    antiClockwise,
    dotSize,
  } = parsedOptions;
  const dots = options.dots || computeDefaultDots(sides);

  if (sides !== 0 && sides < 3) {
    return;
  }

  const easedProgress = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  const angleMult = antiClockwise ? -1 : 1;
  const dotRadius = dotSize * (1 - easedProgress);

  ctx.save();
  ctx.translate(Math.round(cX) + 0.5, Math.round(cY) + 0.5);
  ctx.rotate(startAngle);
  ctx.lineWidth = 1;

  if (sides === 0) {
    // The angle that te arc is drawn to.
    const progressAngle = 2 * Math.PI * easedProgress * angleMult;

    ctx.beginPath();
    // Because we rotated the ctx by startAngle, we can always assume
    // to start drawing from (outerRadius, 0).
    ctx.moveTo(outerRadius, 0);
    ctx.arc(0, 0, outerRadius, 0, progressAngle, antiClockwise);
    ctx.stroke();

    // pDot is the point where the "plotting" dot is drawn
    const pDot = {
      x: outerRadius * Math.cos(progressAngle),
      y: outerRadius * Math.sin(progressAngle),
    };
    ctx.beginPath();
    ctx.moveTo(pDot.x, pDot.y);
    ctx.arc(pDot.x, pDot.y, dotRadius, 0, Math.PI * 2, false);

    ctx.fill();

  } else {
    const angleIncrement = Math.PI * 2 / sides * angleMult;
    const sideLength = 2 * outerRadius * Math.sin(Math.PI / sides);

    // Draw.
    for (let i = 1; i <= sides; i++) {
      // P0 is where the line starts from
      const p0 = {
        x: outerRadius * Math.cos(angleIncrement * (i - 1)),
        y: outerRadius * Math.sin(angleIncrement * (i - 1)),
      };
      // P1 is where the line goes to
      const p1 = {
        x: outerRadius * Math.cos(angleIncrement * i),
        y: outerRadius * Math.sin(angleIncrement * i),
      };

      ctx.beginPath();

      ctx.setLineDash([sideLength * easedProgress, sideLength * (1 - easedProgress)]);

      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);

      ctx.stroke();

      const pDot = {
        x: p0.x + (p1.x - p0.x) * easedProgress,
        y: p0.y + (p1.y - p0.y) * easedProgress,
      }

      ctx.beginPath();

      ctx.moveTo(pDot.x, pDot.y);
      ctx.arc(pDot.x, pDot.y, dotRadius, 0, Math.PI * 2, false);

      ctx.fill();
    }
  }

  ctx.restore();
}
