// VR.js - VR-specific event handlers for Conway's Game of Life
// Handles controller interactions and fixes cell creation issues

AFRAME.registerComponent('vr-interaction', {
  init: function () {
    this.scene = this.el.sceneEl;
    this.controllers = {};
    this.lastTriggerTime = {};
    this.debounceTime = 200; // ms to prevent duplicate triggers
    
    // Wait for scene to load
    this.scene.addEventListener('loaded', () => {
      this.setupControllers();
    });
  },

  setupControllers: function () {
    // Find controllers
    const leftController = document.getElementById('left-controller');
    const rightController = document.getElementById('right-controller');
    
    if (leftController) {
      this.controllers.left = leftController;
      this.setupControllerEvents(leftController, 'left');
    }
    
    if (rightController) {
      this.controllers.right = rightController;
      this.setupControllerEvents(rightController, 'right');
    }
  },

  setupControllerEvents: function (controller, hand) {
    // Track trigger events for cell creation
    controller.addEventListener('triggerdown', (evt) => {
      this.handleTriggerDown(evt, hand);
    });

    // Track A button for play/pause (right controller only)
    if (hand === 'right') {
      controller.addEventListener('abuttondown', () => {
        this.toggleSimulation();
      });
    }
  },

  handleTriggerDown: function (evt, hand) {
    const now = Date.now();
    
    // Debounce to prevent rapid-fire triggers
    if (this.lastTriggerTime[hand] && (now - this.lastTriggerTime[hand] < this.debounceTime)) {
      return;
    }
    
    this.lastTriggerTime[hand] = now;
    
    // Get intersection point from raycaster
    const controller = this.controllers[hand];
    const raycaster = controller.components.raycaster;
    
    if (!raycaster || !raycaster.intersections || raycaster.intersections.length === 0) {
      return;
    }
    
    const intersection = raycaster.intersections[0];
    const targetEl = intersection.object.el;
    
    // Check if we hit an interactive cell
    if (targetEl && targetEl.classList.contains('interactive')) {
      this.toggleCell(targetEl);
    }
  },

  toggleCell: function (cellElement) {
    const x = parseInt(cellElement.dataset.x);
    const y = parseInt(cellElement.dataset.y);
    
    if (isNaN(x) || isNaN(y)) {
      console.warn('Invalid cell coordinates:', cellElement.dataset);
      return;
    }
    
    // Find which layer this cell belongs to
    const layerId = this.findLayerForCell(cellElement);
    if (!layerId) {
      console.warn('Cell does not belong to any layer:', cellElement);
      return;
    }
    
    const layer = window.conwayLayers[layerId];
    if (!layer) {
      console.warn('Layer not found:', layerId);
      return;
    }
    
    // Toggle cell state
    layer.grid[y][x] = layer.grid[y][x] ? 0 : 1;
    cellElement.setAttribute(
      'color',
      layer.grid[y][x] ? layer.data.colorAlive : layer.data.colorDead
    );
  },

  findLayerForCell: function (cellElement) {
    // Check which layer contains this cell
    for (const [layerId, layer] of Object.entries(window.conwayLayers || {})) {
      if (layer.el && layer.el.contains(cellElement)) {
        return layerId;
      }
    }
    return null;
  },

  toggleSimulation: function () {
    // Toggle all Conway layers
    for (const layer of Object.values(window.conwayLayers || {})) {
      if (layer.toggleRun) {
        layer.toggleRun();
      }
    }
  }
});

// Register the component on the scene
AFRAME.registerComponent('vr-system', {
  init: function () {
    // Add VR interaction component to scene
    this.el.setAttribute('vr-interaction', '');
  }
});
