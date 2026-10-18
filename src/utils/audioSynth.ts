// Audio synth generator providing real audio synthesis and spectrum analyser fallback
// Ensures offline-capable playback and real-time audio visualization

class SynthAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.25;
      
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume * 0.35));
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public playTrackMelody(seed: number = 1) {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stop();
    this.isRunning = true;

    // Harmonic musical scales (Pentatonic Major / Minor)
    const scale1 = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // C Major
    const scale2 = [220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00]; // A Minor
    const scale = (seed % 2 === 0) ? scale1 : scale2;
    
    const bassFreqs = [130.81, 146.83, 164.81, 196.00, 110.00]; // Bass roots

    let step = 0;

    const playNote = () => {
      if (!this.isRunning || !this.ctx || !this.gainNode) return;

      const now = this.ctx.currentTime;

      // 1. Lead melody note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freqIndex = (step * seed + Math.floor(step / 4)) % scale.length;
      osc.type = (step % 3 === 0) ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(scale[freqIndex], now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.75);

      // 2. Warm bass pulse on beats
      if (step % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassIndex = Math.floor(step / 4) % bassFreqs.length;
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreqs[bassIndex], now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.exponentialRampToValueAtTime(0.25, now + 0.08);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);

        bassOsc.start(now);
        bassOsc.stop(now + 1.25);
      }

      step++;
      const tempoMs = 450 + (seed % 150);
      this.timer = window.setTimeout(playNote, tempoMs);
    };

    playNote();
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const synthAudioEngine = new SynthAudioEngine();

