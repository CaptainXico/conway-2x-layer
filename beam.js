// beam.js

AFRAME.registerComponent('beam-system', {

  init: function () {
    // Wait until scene is fully loaded
    this.el.sceneEl.addEventListener('loaded', () => {
      this.el.sceneEl.addEventListener('conway-step', () => {
        this.checkAlignment();
      });
    });
  },

  checkAlignment: function () {

    const layers = window.conwayLayers;
    if (!layers || !layers.lower || !layers.upper) return;

    const lower = layers.lower;
    const upper = layers.upper;

    const size = lower.data.size;
    const cellSize = lower.cellSize;
    const half = lower.data.worldSize / 2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {

        if (lower.grid[y][x] && upper.grid[y][x]) {

          const beam = document.createElement('a-cylinder');

          beam.setAttribute('radius', cellSize * 0.15);
          beam.setAttribute('height', 10);
          beam.setAttribute('color', '#ffff00');
          beam.setAttribute('material', 'transparent: true; opacity: 1');

          beam.setAttribute('position', {
            x: x * cellSize - half + cellSize / 2,
            y: 0,
            z: y * cellSize - half + cellSize / 2
          });

          beam.setAttribute('animation', {
            property: 'material.opacity',
            to: 0,
            dur: 400
          });

          this.el.appendChild(beam);

          setTimeout(() => beam.remove(), 400);
        }
      }
    }
  }
});
