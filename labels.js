// labels.js
// Adds musical note + scale labels to a Conway grid

AFRAME.registerComponent('grid-labels', {
  schema: {
    size: { type: 'int', default: 30 },
    worldSize: { type: 'number', default: 30 },
    yOffset: { type: 'number', default: 0 },
    layerId: { type: 'string', default: 'lower' }
  },

  init: function () {

    const d = this.data;
    const cellSize = d.worldSize / d.size;
    const half = d.worldSize / 2;

    const notes = ["Do", "Re", "Mi", "Fa", "So", "La", "Si"];

    // Store labels globally so music system can access them
    window.noteLabels = window.noteLabels || {};
    window.noteLabels[d.layerId] = [];

    // === COLUMN LABELS ===
    for (let x = 0; x < d.size; x++) {

      const note = notes[x % 7];

      const label = document.createElement('a-text');
      label.setAttribute('value', note);
      label.setAttribute('align', 'center');
      label.setAttribute('color', '#ffffff');
      label.setAttribute('width', 4);

      label.setAttribute('position', {
        x: x * cellSize - half + cellSize / 2,
        y: d.yOffset + 0.3,
        z: -half - 1
      });

      label.setAttribute('billboard', '');

      this.el.appendChild(label);

      window.noteLabels[d.layerId][x] = label;
    }

    // === ROW LABELS (numbers) ===
    for (let y = 0; y < d.size; y++) {

      const scaleNumber = (y % 7) + 1;

      const label = document.createElement('a-text');
      label.setAttribute('value', scaleNumber);
      label.setAttribute('align', 'center');
      label.setAttribute('color', '#ffffff');
      label.setAttribute('width', 4);

      label.setAttribute('position', {
        x: -half - 1,
        y: d.yOffset + 0.3,
        z: y * cellSize - half + cellSize / 2
      });

      label.setAttribute('billboard', '');

      this.el.appendChild(label);
    }
  }
});


/* BILLBOARD COMPONENT */
AFRAME.registerComponent('billboard', {
  tick: function () {
    const camera = this.el.sceneEl.camera;
    if (!camera) return;
    this.el.object3D.lookAt(camera.position);
  }
});
