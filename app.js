import Sketch from './sketch.js';

let sketch;

// Draw entry point
function start() {
  // Start sketch.
  sketch = new Sketch(document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', () => {sketch.onResize()}, false);
  window.addEventListener('keyup', (e) => {
    // Letter c
    if (e.keyCode === 67) {
      sketch.switchColorMode();
    }
  }, false);
}

// Start sketch
start();
