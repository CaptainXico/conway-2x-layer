// beam.js
// Creates beams when both layers have parallel live cells
// Also plays musical notes based on grid position

AFRAME.registerComponent('beam-system', {

  init: function () {

    this.scene = this.el.sceneEl;
    this.activeBeams = [];

    this.scene.addEventListener('conway-step', () => {
      this.checkBeams();
    });
  },

  checkBeams: function () {

    // ✅ MATCH YOUR ACTUAL LAYER IDS
    const lower = window.conwayLayers?.lower;
    const upper = window.conwayLayers?.upper;

    if (!lower || !upper) return;

    const size = lower.data.size;

    // Remove old beams
    this.activeBeams.forEach(beam => beam.remove());
    this.activeBeams = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {

        const alive1 = lower.grid[y][x];
        const alive2 = upper.grid[y][x];

        if (alive1 && alive2) {

          const cell1 = lower.cells[y][x];
          const cell2 = upper.cells[y][x];

          const pos1 = cell1.getAttribute('position');
          const pos2 = cell2.getAttribute('position');

          const beam = document.createElement('a-cylinder');

          beam.setAttribute('radius', 0.05);
          beam.setAttribute('height', Math.abs(pos2.y - pos1.y));
          beam.setAttribute('color', '#ffff00');

          beam.setAttribute('position', {
            x: pos1.x,
            y: (pos1.y + pos2.y) / 2,
            z: pos1.z
          });

          this.scene.appendChild(beam);
          this.activeBeams.push(beam);

          // Play note
          if (window.conwayMusic) {
            window.conwayMusic.playNote(x % 7, y % 7);
          }
        }
      }
    }
  }

});
