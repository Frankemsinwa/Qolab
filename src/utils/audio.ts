/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentPan = 0;
  private isEnabled = false;

  constructor() {
    // Lazy initialization on interaction
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master volume node
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);

      // Ambient oscillator volume
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.ambientGain.connect(this.masterVolume);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  setMute(muted: boolean) {
    this.init();
    if (!this.ctx || !this.masterVolume) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !muted;

    // Fade master volume smoothly to prevent pops
    const targetGain = muted ? 0 : 1;
    this.masterVolume.gain.setValueAtTime(this.masterVolume.gain.value, this.ctx.currentTime);
    this.masterVolume.gain.exponentialRampToValueAtTime(targetGain === 0 ? 0.0001 : 1, this.ctx.currentTime + 0.5);

    if (!muted) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }

  toggle() {
    this.setMute(this.isEnabled);
    return this.isEnabled;
  }

  getIsEnabled() {
    return this.isEnabled;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.ambientGain || this.ambientOscs.length > 0) return;

    // Beautiful minor 9th ambient space pad: C2, G2, D3, Eb3, Bb3
    const chord = [65.41, 98.00, 146.83, 155.56, 233.08]; // Hz frequencies

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();

      // Soft triangle wave for rich but warm texture
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Low-pass filter to keep it deep and warm
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250 + idx * 80, this.ctx.currentTime);

      // Micro-detuning for chorusing organic depth
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx.currentTime);

      // Individual osc volume with slight random variance
      oscGain.gain.setValueAtTime(0, this.ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.12 - idx * 0.01, this.ctx.currentTime + 3.0);

      // Panning wide across the stereo field
      panner.pan.setValueAtTime((idx / (chord.length - 1)) * 1.6 - 0.8, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(panner);
      panner.connect(this.ambientGain);

      osc.start();

      this.ambientOscs.push({ osc, gain: oscGain });

      // Ambient low-frequency lfo-like movement
      this.modulateOsc(osc, oscGain, idx);
    });
  }

  private stopAmbientDrone() {
    this.ambientOscs.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
          setTimeout(() => {
            try {
              osc.stop();
            } catch (err) {}
          }, 900);
        }
      } catch (e) {}
    });
    this.ambientOscs = [];
  }

  private modulateOsc(osc: OscillatorNode, oscGain: GainNode, index: number) {
    if (!this.ctx || !this.isEnabled) return;
    const interval = setInterval(() => {
      if (!this.isEnabled || !this.ctx || this.ambientOscs.length === 0) {
        clearInterval(interval);
        return;
      }
      try {
        // Soft modulation of frequency and volume to simulate analog warmth
        const detuneVal = (Math.sin(this.ctx.currentTime * 0.5 + index) * 5) + (Math.random() - 0.5) * 2;
        osc.detune.setValueAtTime(detuneVal, this.ctx.currentTime);
        
        const baseGain = 0.12 - index * 0.01;
        const gainVal = baseGain + Math.sin(this.ctx.currentTime * 0.3 + index) * 0.03;
        oscGain.gain.setValueAtTime(oscGain.gain.value, this.ctx.currentTime);
        oscGain.gain.linearRampToValueAtTime(Math.max(0.01, gainVal), this.ctx.currentTime + 1.0);
      } catch (err) {
        clearInterval(interval);
      }
    }, 1200);
  }

  // Hover sound - brief spatial sine wave chord tap
  triggerHover(normalizedX: number = 0.5) {
    if (!this.isEnabled || !this.ctx || !this.masterVolume) return;

    try {
      this.currentPan = normalizedX * 2 - 1; // Map 0..1 to -1..1 stereo field

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      // Harmonic frequency matching the G-major / C-minor vibe based on mouse coordinate
      const baseFreq = 440; // A4
      const scale = [1, 1.25, 1.5, 1.68, 1.875, 2]; // Major scale multipliers
      const scaleIdx = Math.floor(normalizedX * scale.length);
      const freq = baseFreq * (scale[scaleIdx] || 1);

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      panner.pan.setValueAtTime(this.currentPan, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(this.masterVolume);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.error(e);
    }
  }

  // Click feedback - resonant wooden/organic chime pop
  triggerClick() {
    if (!this.isEnabled || !this.ctx || !this.masterVolume) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();
      const filter = this.ctx.createBiquadFilter();

      // Sharp transient spike with decay
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);

      panner.pan.setValueAtTime(this.currentPan, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(8, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(this.masterVolume);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {
      console.error(e);
    }
  }

  // Section transition tone - dynamic filter sweeping upward
  triggerTransition() {
    if (!this.isEnabled || !this.ctx || !this.masterVolume) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.95);
    } catch (e) {
      console.error(e);
    }
  }
}

export const audioEngine = new AudioEngine();
