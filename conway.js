// conway.js - interactive Conway with PC + VR controls

AFRAME.registerComponent('conway-layer', {
  schema: {
    size: { type: 'int', default: 30 },        // number of cells per side
    worldSize: { type: 'number', default: 30 }, // grid width/depth in scene units
    yOffset: { type: 'number', default: 0 },    // vertical position
    tickSpeed: { type: 'number', default: 800 }, // slower ticks for manual setup
    colorAlive: { type: 'color', default: '#00ffcc' },
    colorDead: { type: 'color', default: '#111111' },
    layerId: { type: 'string', default: 'layer1' }
  },

  init: function () {
    const d = this.data;

    this.running = false; // simulation starts paused
    this.cellSize = d.worldSize / d.size;
    this.grid = [];
    this.nextGrid = [];
    this.cells = [];
    const half = d.worldSize / 2;

    // Function to toggle running
    this.toggleRun = () => {
      this.running = !this.running;
      console.log("Conway running:", this.running);
    };

    // --- CREATE INFO OVERLAY ---
    const info = document.createElement('div');
    info.innerHTML = `
Pause / Play<br>
PC: SPACEBAR<br>
VR: A
`;
    info.style.position = 'fixed';
    info.style.bottom = '20px';
    info.style.right = '20px';
    info.style.color = 'white';
    info.style.fontFamily = 'monospace';
    info.style.fontSize = '14px';
    info.style.background = 'rgba(0,0,0,0.6)';
    info.style.padding = '10px';
    info.style.borderRadius = '8px';
    info.style.zIndex = '9999';
    info.style.pointerEvents = 'none';
    document.body.appendChild(info);

    // --- BUILD GRID ---
    for (let y = 0; y < d.size; y++) {
      this.grid[y] = [];
      this.nextGrid[y] = [];
      this.cells[y] = [];

      for (let x = 0; x < d.size; x++) {
        this.grid[y][x] = 0;      // start empty
        this.nextGrid[y][x] = 0;

        const cell = document.createElement('a-box');
        cell.classList.add('interactive');

        cell.setAttribute('width', this.cellSize);
        cell.setAttribute('depth', this.cellSize);
        cell.setAttribute('height', 0.15);

        cell.setAttribute('position', {
          x: x * this.cellSize - half + this.cellSize / 2,
          y: d.yOffset,
          z: y * this.cellSize - half + this.cellSize / 2
        });

        cell.setAttribute('color', d.colorDead);

        // Store coordinates
        cell.dataset.x = x;
        cell.dataset.y = y;

        // Click to toggle alive/dead
        cell.addEventListener('click', (evt) => {
          const cx = parseInt(evt.target.dataset.x);
          const cy = parseInt(evt.target.dataset.y);

          this.grid[cy][cx] = this.grid[cy][cx] ? 0 : 1;
          evt.target.setAttribute(
            'color',
            this.grid[cy][cx] ? d.colorAlive : d.colorDead
          );
        });

        this.el.appendChild(cell);
        this.cells[y][x] = cell;
      }
    }

    // --- REGISTER LAYER GLOBALLY FOR BEAMS ---
    window.conwayLayers = window.conwayLayers || {};
    window.conwayLayers[d.layerId] = this;

    // --- KEYBOARD INPUT: SPACEBAR TOGGLE ---
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.toggleRun();
      }
    });

    // --- VR CONTROLLER INPUT: Pico 4 A BUTTON ---
    this.el.sceneEl.addEventListener('loaded', () => {
      const controllers = document.querySelectorAll('[tracked-controls]');
      controllers.forEach(controller => {
        controller.addEventListener('abuttondown', () => {
          this.toggleRun();
        });
      });
    });

    // --- SIMULATION LOOP ---
    this.interval = setInterval(() => {
      if (this.running) this.step();
    }, d.tickSpeed);
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

    // Calculate next generation
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const alive = this.grid[y][x];
        const n = this.countNeighbors(x, y);
        this.nextGrid[y][x] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }

    // Update grid & colors
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        this.grid[y][x] = this.nextGrid[y][x];
        this.cells[y][x].setAttribute(
          'color',
          this.grid[y][x] ? this.data.colorAlive : this.data.colorDead
        );
      }
    }

    // Emit event for beam detection
    this.el.sceneEl.emit('conway-step');
  }
});
