export function drawSquare(ctx, color, scale, translate, progress) {
  const size = 100;
  const radius = Math.max(0, (0.8 - progress) * 4 / scale);

  ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
  ctx.strokeStyle = `rgba(${color}, ${color}, ${color}, ${Math.min(1, 1.5 * progress)})`;

  ctx.save();

  ctx.translate(
    Math.round(translate.x - scale * size / 2) + 0.5,
    Math.round(translate.y - scale * size / 2) + 0.5
  );
  ctx.scale(scale, scale);
  ctx.lineWidth = 1 / scale;

  // Stroke lines
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, size * progress);

  ctx.moveTo(0, size);
  ctx.lineTo(size * progress, size);

  ctx.moveTo(size, size);
  ctx.lineTo(size, size * (1 - progress));

  ctx.moveTo(size, 0);
  ctx.lineTo(size * (1 - progress), 0);

  ctx.closePath();
  ctx.stroke();

  // Fill circles
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, size * progress, radius, 0, Math.PI * 2, true);

  ctx.moveTo(0, size);
  ctx.arc(size * progress, size, radius, 0, Math.PI * 2, true);

  ctx.moveTo(size, size);
  ctx.arc(size, size * (1 - progress), radius, 0, Math.PI * 2, true);

  ctx.moveTo(size, 0);
  ctx.arc(size * (1 - progress), 0, radius, 0, Math.PI * 2, true);

  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
