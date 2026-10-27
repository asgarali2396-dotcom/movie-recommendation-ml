/**
 * CineMatch ML - Web Audio Synthesizer
 * Zero-latency audio feedback synthesized directly in-browser using HTML5 Web Audio API.
 * No external sound files required.
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('cinematch_sound') !== 'false';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('cinematch_sound', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.playClick();
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  /**
   * Crisp UI click chime
   */
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  /**
   * Cinematic Recommendation Engine Harmonic Sweep
   * Synthesizes an arpeggiated tri-tone sweep when ML calculations complete.
   */
  playRecommend() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A major triad with octave

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.06));

        gain.gain.setValueAtTime(0, now + (idx * 0.06));
        gain.gain.linearRampToValueAtTime(0.12, now + (idx * 0.06) + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.06) + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + (idx * 0.06));
        osc.stop(now + (idx * 0.06) + 0.30);
      });
    } catch (e) {}
  }

  /**
   * Watchlist Bookmark Pop
   */
  playBookmark() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, this.audioCtx.currentTime + 0.08); // G5

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  /**
   * Sliding Modal Open Whoosh
   */
  playModalOpen() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    } catch (e) {}
  }

  /**
   * Login / Admin Authorization Fanfare
   */
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C

      chords.forEach((f, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + (i * 0.05));

        gain.gain.setValueAtTime(0.08, now + (i * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + (i * 0.05));
        osc.stop(now + (i * 0.05) + 0.42);
      });
    } catch (e) {}
  }
}

// Global Sound Controller
if (typeof window !== 'undefined') {
  window.soundEngine = new SoundSynthesizer();
}
