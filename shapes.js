import { easeInOutCubic } from './easing.js';

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
  .map(n => [{from: n, to: (n + 1) % sides}]);

export function drawShape(ctx, progress, options) {
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

  let easedProgress = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  const dotRadius = dotSize * (1 - easedProgress);

  let overProgress = 0;
  if (progress > 1) {
    overProgress = easeInOutCubic(Math.max(0, Math.min(1, progress - 1)));
  }

  ctx.save();
  ctx.translate(Math.round(cX), Math.round(cY));
  ctx.rotate(startAngle);
  ctx.scale(1 + 0.5 * overProgress, 1 + 0.5 * overProgress);
  ctx.globalAlpha = 1 - overProgress;
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

      let sideProgress = easedProgress * Math.abs(direction);
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
