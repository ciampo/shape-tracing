import Sketch from './sketch.js';

let sketch;
let datGui;

// Draw entry point
function start() {
  // Start sketch.
  sketch = new Sketch(document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', _ => {sketch.onResize()}, false);

  // dat.gui
  // datGui = new dat.GUI();
  // datGui.add(sketch, 'u', 20, 260, 1);
  // datGui.addColor(sketch, 'fillBg');
  // datGui.addColor(sketch, 'fillA');
  // datGui.addColor(sketch, 'fillB');
}

// Start sketch
start();
