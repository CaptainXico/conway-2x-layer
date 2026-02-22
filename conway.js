// conway.js

AFRAME.registerComponent('conway-layer', {
  schema: {
    size: { type: 'int', default: 20 },        // grid width/height (NxN)
    cellSize: { type: 'number', default: 0.5 },
    yOffset: { type: 'number', default: 0 },   // vertical placement
    tickSpeed: { type: 'number', default: 500 } // ms per generation
  },

  init: function () {
    const data = this.data;

    this.grid = [];
    this.nextGrid = [];
    this.cells = [];

    const half = (data.size * data.cellSize) / 2;

    // Create grid arrays
    for (let y = 0; y < data.size; y++) {
      this.grid[y] = [];
      this.nextGrid[y] = [];
      this.cells[y] = [];

      for (let x = 0; x < data.size; x++) {
        // Random start
        this.grid[y][x] = Math.random() > 0.7 ? 1 : 0;
        this.nextGrid[y][x] = 0;

        // Create visual cell
        const cell = document.createElement('a-box');
        cell.setAttribute('width', data.cellSize * 0.9);
        cell.setAttribute('height', 0.05);
        cell.setAttribute('depth', data.cellSize * 0.9);

        cell.setAttribute('position', {
          x: x * data.cellSize - half + data.cellSize / 2,
          y: data.yOffset,
          z: y * data.cellSize - half + data.cellSize / 2
        });

        cell.setAttribute('color', this.grid[y][x] ? '#00ffcc' : '#111111');

        this.el.appendChild(cell);
        this.cells[y][x] = cell;
      }
    }

    // Start loop
    this.interval = setInterval(() => this.step(), data.tickSpeed);
  },

  countNeighbors(x, y) {
    let sum = 0;
    const size = this.data.size;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = (x + dx + size) % size;
        const ny = (y + dy + size) % size;

        sum += this.grid[ny][nx];
      }
    }
    return sum;
  },

  step() {
    const size = this.data.size;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {

        const alive = this.grid[y][x];
        const neighbors = this.countNeighbors(x, y);

        if (alive) {
          this.nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          this.nextGrid[y][x] = (neighbors === 3) ? 1 : 0;
        }
      }
    }

    // Swap + update visuals
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        this.grid[y][x] = this.nextGrid[y][x];
        this.cells[y][x].setAttribute(
          'color',
          this.grid[y][x] ? '#00ffcc' : '#111111'
        );
      }
    }
  },

  remove: function () {
    clearInterval(this.interval);
  }
});
