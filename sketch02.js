/** @type {HTMLCanvasElement} */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const params = {
  cols: 50,
  rows: 50,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  bgColor: '#666666',
  dotColor: '#000000'
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    const ctx = context;
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridW = width;
    const gridH = height;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = (width - gridW) * 0.5;
    const margY = (height - gridH) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellW + margX + cellW * 0.5;
      const y = row * cellH + margY + cellH * 0.5;
      const w = cellW * 0.8;
      const h = cellH * 0.8;

      const n = random.noise3D(x, y, frame * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.lineWidth = scale;
      ctx.strokeStyle = params.dotColor
      ctx.beginPath();
      ctx.arc(0, 0, 0.01, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();

  const folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'cols', { min: 20, max: 100, step: 1 });
  folder.addInput(params, 'rows', { min: 20, max: 100, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 25 });
  folder.addInput(params, 'scaleMax', { min: 1, max: 100 });
  folder.addInput(params, 'bgColor', { picker: 'inline', expanded: false });

  const folder2 = pane.addFolder({ title: 'Noise' });
  folder2.addInput(params, 'freq', { min: -0.01, max: 0.01 });
  folder2.addInput(params, 'amp', { min: 0, max: 5 });
  folder2.addInput(params, 'dotColor', { picker: 'inline', expanded: false });

};
createPane();
canvasSketch(sketch, settings);