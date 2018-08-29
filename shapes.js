export function regPolyPath(cX, cY, r,p,ctx) { //Radius, #points, context
  ctx.save();
  ctx.translate(cX, cY);

  ctx.beginPath();
  //Azurethi was here!
  ctx.moveTo(r,0);
  for(let i=0; i<p; i++){
    ctx.rotate(2*Math.PI/p);
    ctx.lineTo(r,0);
  }
  // ctx.rotate(-2*Math.PI/p);
  ctx.closePath()

  ctx.stroke();

  ctx.restore();
}

export function polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
  if (sides < 3) return;

  var a = (Math.PI * 2)/sides;
  a = anticlockwise?-a:a;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(startAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
    ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
  }
  ctx.closePath();

  ctx.stroke();
  ctx.restore();
}
