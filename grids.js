// grids.js

AFRAME.registerComponent('double-grid', {
  schema: {
    size: { type: 'number', default: 100 },
    divisions: { type: 'number', default: 100 },
    heightOffset: { type: 'number', default: 5 }, // distance above/below player
    colorCenter: { type: 'color', default: '#888888' },
    colorGrid: { type: 'color', default: '#cccccc' }
  },

  init: function () {
    const data = this.data;

    // LOWER GRID (below player)
    this.lowerGrid = new THREE.GridHelper(
      data.size,
      data.divisions,
      data.colorCenter,
      data.colorGrid
    );
    this.lowerGrid.position.y = -data.heightOffset;

    // UPPER GRID (above player)
    this.upperGrid = new THREE.GridHelper(
      data.size,
      data.divisions,
      data.colorCenter,
      data.colorGrid
    );
    this.upperGrid.position.y = data.heightOffset;

    // Add to entity
    this.el.object3D.add(this.lowerGrid);
    this.el.object3D.add(this.upperGrid);
  }
});
