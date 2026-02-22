// beam.js

AFRAME.registerComponent('beam-system', {

  init: function () {

    this.tick = this.tick.bind(this);
    this.el.sceneEl.addEventListener('loaded', () => {
      this.el.sceneEl.addBehavior(this);
    });
  },

  tick: function () {

    const layers = window.conwayLayers;
    if (!layers || !layers.lower || !layers.upper) return;

    const lower = layers.lower;
    const upper = layers.upper;

    const size = lower.data.size;
    const cellSize = lower.cellSize;
    const half = lower.data.worldSize / 2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {

        if (lower.grid[y][x] === 1 && upper.grid[y][x] === 1) {

          const beam = document.createElement('a-cylinder');

          beam.setAttribute('radius', cellSize * 0.2);
          beam.setAttribute('height', 10);
          beam.setAttribute('color', '#ffff00');

          beam.setAttribute('position', {
            x: x * cellSize - half + cellSize / 2,
            y: 0,
            z: y * cellSize - half + cellSize / 2
          });

          beam.setAttribute('animation', {
            property: 'material.opacity',
            from: 1,
            to: 0,
            dur: 500,
            easing: 'linear'
          });

          beam.setAttribute('material', 'transparent: true');

          this.el.appendChild(beam);

          setTimeout(() => {
            beam.remove();
          }, 500);
        }
      }
    }
  }
});
