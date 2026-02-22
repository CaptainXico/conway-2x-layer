AFRAME.registerComponent('rx-hmi', {
  schema: {
    width: { type: 'number', default: 4 },
    height: { type: 'number', default: 1.5 },
    yOffset: { type: 'number', default: 2.5 }
  },

  init: function () {
    const d = this.data;

    // === MAIN BLUE RX PANEL ===
    const panel = document.createElement('a-plane');
    panel.setAttribute('width', d.width);
    panel.setAttribute('height', d.height);
    panel.setAttribute('color', '#4fa3c8');
    panel.setAttribute('opacity', 0.65);
    panel.setAttribute('position', `0 ${d.yOffset} -4`);
    panel.setAttribute('material', 'transparent: true; side: double');
    this.el.appendChild(panel);

    // === WHITE CENTER AREA (non RX area) ===
    const center = document.createElement('a-plane');
    center.setAttribute('width', d.width * 0.8);
    center.setAttribute('height', d.height * 0.6);
    center.setAttribute('color', '#ffffff');
    center.setAttribute('position', `0 0 0.01`);
    panel.appendChild(center);

    // === PLAY BUTTON (GREEN) ===
    const playBtn = document.createElement('a-box');
    playBtn.setAttribute('width', 0.4);
    playBtn.setAttribute('height', 0.4);
    playBtn.setAttribute('depth', 0.05);
    playBtn.setAttribute('color', '#7CFC00');
    playBtn.setAttribute('position', `-0.6 -0.5 0.05`);
    playBtn.classList.add('interactive');
    panel.appendChild(playBtn);

    // === PAUSE BUTTON (RED) ===
    const pauseBtn = document.createElement('a-box');
    pauseBtn.setAttribute('width', 0.4);
    pauseBtn.setAttribute('height', 0.4);
    pauseBtn.setAttribute('depth', 0.05);
    pauseBtn.setAttribute('color', '#ff0000');
    pauseBtn.setAttribute('position', `0.6 -0.5 0.05`);
    pauseBtn.classList.add('interactive');
    panel.appendChild(pauseBtn);

    // === BUTTON LOGIC ===
    playBtn.addEventListener('click', () => {
      this.setRunning(true);
    });

    pauseBtn.addEventListener('click', () => {
      this.setRunning(false);
    });

    // Optional hover effect
    this.addHoverEffect(playBtn);
    this.addHoverEffect(pauseBtn);
  },

  setRunning(state) {
    if (!window.conwayLayers) return;

    Object.values(window.conwayLayers).forEach(layer => {
      layer.running = state;
    });

    console.log("Simulation running:", state);
  },

  addHoverEffect(btn) {
    btn.addEventListener('mouseenter', () => {
      btn.setAttribute('scale', '1.2 1.2 1.2');
    });

    btn.addEventListener('mouseleave', () => {
      btn.setAttribute('scale', '1 1 1');
    });
  }
});
