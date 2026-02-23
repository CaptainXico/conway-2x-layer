// labels.js
// Adds musical note + scale labels to a Conway grid

AFRAME.registerComponent('grid-labels', {
  schema: {
    size: { type: 'int', default: 30 },
    worldSize: { type: 'number', default: 30 },
    yOffset: { type: 'number', default: 0 },
    side: { type: 'string', default: 'front' } // front or left
  },

  init: function () {

    const d = this.data;
    const cellSize = d.worldSize / d.size;
    const half = d.worldSize / 2;

    const notes = ["Do", "Re", "Mi", "Fa", "So", "La", "Si"];

    // === COLUMN LABELS (Do Re Mi...) ===
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

      this.el.appendChild(label);
    }

    // === ROW LABELS (1 → 7 scales) ===
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

      label.setAttribute('rotation', '0 90 0');

      this.el.appendChild(label);
    }

  }
});
