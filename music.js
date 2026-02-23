// music.js
// Plays musical notes when beams appear

class ConwayMusic {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Notes in one octave (C major scale)
    this.baseFrequencies = [
      261.63, // Do (C4)
      293.66, // Re (D4)
      329.63, // Mi (E4)
      349.23, // Fa (F4)
      392.00, // So (G4)
      440.00, // La (A4)
      493.88  // Si (B4)
    ];
  }

  playNote(column, row) {
    if (column > 6) return; // Only 7 notes

    const baseFreq = this.baseFrequencies[column];

    // Row 0–6 → scale 1–7
    const octaveMultiplier = Math.pow(2, row - 3);
    const frequency = baseFreq * octaveMultiplier;

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = "sine"; // smooth tone
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      this.audioCtx.currentTime + 0.6
    );

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + 0.6);
  }
}

window.conwayMusic = new ConwayMusic();
