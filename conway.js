// conway.js

AFRAME.registerComponent('conway-layer', {
  schema: {
    size: { type: 'int', default: 100 },        // must match grid divisions
    worldSize: { type: 'number', default: 100 }, // must match grid size
    yOffset: { type: 'number', default: 0 },
    tickSpeed: { type: 'number', default: 300 },
    colorAlive: { type: 'color', default: '#00ffcc' },
    colorDead: { type: 'color', default: '#111111' },
    layerId: { type: 'string', default: 'layer1' }
  },

  init: function () {
    const d = this.data;

    this.cellSize = d.worldSize / d.size;
    this.grid = [];
    this.nextGrid = [];
    this.cells = [];

    const half = d.worldSize / 2;

    for (let y = 0; y < d.size; y++) {
      this.grid[y] = [];
      this.nextGrid[y] = [];
      this.cells[y] = [];

      for (let x = 0; x < d.size; x++) {

        this.grid[y][x] = Math.random() > 0.75 ? 1 : 0;
        this.nextGrid[y][x] = 0;

        const cell = document.createElement('a-box');
        cell.setAttribute('width', this.cellSize);
        cell.setAttribute('depth', this.cellSize);
        cell.setAttribute('height', 0.1);

        cell.setAttribute('position', {
          x: x * this.cellSize - half + this.cellSize / 2,
          y: d.yOffset,
          z: y * this.cellSize - half + this.cellSize / 2
        });

        cell.setAttribute('color',
          this.grid[y][x] ? d.colorAlive : d.colorDead
        );

        this.el.appendChild(cell);
        this.cells[y][x] = cell;
      }
    }

    // Register globally for beam detection
    window.conwayLayers = window.conwayLayers || {};
    window.conwayLayers[d.layerId] = this;

    this.interval = setInterval(() => this.step(), d.tickSpeed);
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
        const n = this.countNeighbors(x, y);

        this.nextGrid[y][x] =
          alive
            ? (n === 2 || n === 3 ? 1 : 0)
            : (n === 3 ? 1 : 0);
      }
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {

        this.grid[y][x] = this.nextGrid[y][x];

        this.cells[y][x].setAttribute(
          'color',
          this.grid[y][x]
            ? this.data.colorAlive
            : this.data.colorDead
        );
      }
    }
  }
});
