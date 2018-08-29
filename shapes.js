import { easeInOutCubic } from './easing.js';

const defaultOptions = {
  cX: 0,
  cY: 0,
  outerRadius: 50,
  sides: 4,
  startAngle: 0,
  antiClockwise: false,
}

export function polygon(ctx, progress, options) {
  if (!ctx || progress < 0) {
    return;
  }

  const {
    cX,
    cY,
    outerRadius,
    sides,
    startAngle,
    antiClockwise,
  } = Object.assign({}, defaultOptions, options);

  // TODO: if sides 0, it's a circle!
  if (sides < 3) return;

  const angleIncrement = Math.PI * 2 / sides * (antiClockwise ? -1 : 1);
  const sideLength = 2 * outerRadius * Math.sin(Math.PI / sides);
  const easedProgress = easeInOutCubic(Math.min(1, progress));

  ctx.save();
  ctx.translate(Math.round(cX) + 0.5, Math.round(cY) + 0.5);
  ctx.rotate(startAngle);
  ctx.lineWidth = 1;

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

    ctx.beginPath();

    const pDot = {
      x: p0.x + (p1.x - p0.x) * easedProgress,
      y: p0.y + (p1.y - p0.y) * easedProgress,
    }
    ctx.moveTo(pDot.x, pDot.y);
    ctx.arc(pDot.x, pDot.y, 4 * (1 - easedProgress), 0, Math.PI * 2, false);

    ctx.fill();
  }
  ctx.restore();
}
