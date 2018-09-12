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

  let drawingProgress = easeOut(Math.max(0, Math.min(1, progress)));
  let beforeDrawingProgress = 0;
  if (progress < 0) {
    // 2 * progress makes sure beforeDrawingProgress is twice as fast as
    // the time that it takes to draw the shape (quicker fade in)
    beforeDrawingProgress = easeOutQuart(Math.max(0, Math.min(1,
      - 8 * progress - 0.6
    )));
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
      { from: 0, direction: +1, },
      { from: 0, direction: -1, },
      { from: 2, direction: +1, },
      { from: 2, direction: -1, },
      { from: 4, direction: +1, },
      { from: 4, direction: -1, },
      { from: 6, direction: +1, },
      { from: 6, direction: -1, },
    ],
  ],
}


export function generateRandomShape(center, radius, vetoSides = -1) {
  // Possible values: 0 - 4 - 6 - 8.
  let sides = -1;
  const maxSides = 8;
  while(sides < 0 ||
        sides > maxSides ||
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

  if (shapeDotsCombinations[sides]) {
    const combinations = shapeDotsCombinations[sides];
    toReturn.dots = combinations[Math.floor(Math.random() * combinations.length)];
  } else {
    toReturn.dots = computeDefaultDots(sides);
  }

  return toReturn;
}

