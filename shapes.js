import { _360deg, randomIntFromZeroTo } from './utils.js';

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

export function drawShape(ctx, progress, options) {
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

  // Used to make the shape scale up / fade out after it's been drawn.
  // [(progress - 1) / 2] makes sure afterDrawingProgress takes twice as long as
  // the time that it takes to draw the shape (smoother fade out)
  const afterDrawingProgress =
    easeOut(Math.max(0, Math.min(1, (progress - 1) / 2)));
  const shapeScale = 1 + 1.5 * afterDrawingProgress;
  const shapeAlpha = 1 - afterDrawingProgress;

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
        dotSize * (1 - drawingProgress) :
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
    const sideLength = 2 * outerRadius * Math.sin(Math.PI / sides);

    dots.forEach(({from, direction}, dotIndex) => {
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

      // Compute dot size
      const dotRadius = progress > 0 ?
        dotSize * (1 - drawingProgress) :
        computeDotScaleUpSize(dotSize, progress, dotIndex, dots.length);

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


export function generateRandomShape(center, radius, vetoSides = []) {
  // Pick only even numbers between 4 and [maxSides], plus 0 (aka a circle).
  let sides = -1;
  const maxSides = 8;
  while(sides < 0 ||
        sides > maxSides ||
        sides === 2 ||
        sides % 2 !== 0 ||
        vetoSides.includes(sides)
  ) {
    sides = randomIntFromZeroTo(maxSides);
  }

  // Add/subtract a random amount to the radius.
  const outerRadius = radius +
    0.3 * (Math.round(Math.random() * 2 * radius) - radius);

  let startAngle;
  if (sides === 0) {
    startAngle = _360deg / 4 * randomIntFromZeroTo(3);
  } else {
    let randomAngleMult = randomIntFromZeroTo(sides - 1);
    // Make octagon always have a flat horizontal edge.
    if (sides === 8 && randomAngleMult % 2 === 0) {
      randomAngleMult -= 1;
    }

    startAngle = _360deg / (2 * sides) * randomAngleMult;
  }

  let dots;
  if (shapeDotsCombinations[sides]) {
    // Get all possible combinations for this amount of dots
    const combinations = shapeDotsCombinations[sides];
    // Pick a random combination.
    dots = combinations[randomIntFromZeroTo(combinations.length - 1)];
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

