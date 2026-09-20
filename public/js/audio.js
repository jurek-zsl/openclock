/**
 * Enhanced Web Audio API Synthesizer with Procedural Synthwave BGM Engine
 * 100% self-contained; zero external mp3/wav files required!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmMuted = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.bgmStep = 0;
  }

  get bgmActive() {
    return !this.bgmMuted;
  }

  isBgmActive() {
    return !this.bgmMuted;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.65;
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.22;
        this.bgmGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playUiHover() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.04);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {}
  }

  playUiClick() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) {}
  }

  playDeploy() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(850, t + 0.35);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.4);
    } catch (e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.muted ? 0 : 0.65;
    }
    return this.muted;
  }

  toggleBGM() {
    this.bgmMuted = !this.bgmMuted;
    if (this.ctx && this.bgmGain) {
      try {
        const t = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(t);
        this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.22, t);
      } catch (e) {
        this.bgmGain.gain.value = this.bgmMuted ? 0 : 0.22;
      }
    } else if (this.bgmGain) {
      this.bgmGain.gain.value = this.bgmMuted ? 0 : 0.22;
    }
    if (!this.bgmPlaying && !this.bgmMuted) {
      this.startSynthwaveBGM();
    }
    return !this.bgmMuted;
  }

  stopSynthwaveBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmPlaying = false;
    if (this.ctx && this.bgmGain) {
      try {
        const t = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(t);
        this.bgmGain.gain.setValueAtTime(0, t);
      } catch (e) {}
    }
  }

  stopAllAudio() {
    this.stopSynthwaveBGM();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (this.ctx) {
      try {
        const t = this.ctx.currentTime;
        if (this.sfxGain) {
          this.sfxGain.gain.cancelScheduledValues(t);
          this.sfxGain.gain.setValueAtTime(0, t);
          // Restore sfx gain slightly later so UI clicks still work
          this.sfxGain.gain.setValueAtTime(this.muted ? 0 : 0.65, t + 0.05);
        }
      } catch (e) {}
    }
  }

  stopBGM() {
    this.stopSynthwaveBGM();
  }

  startBGM() {
    this.startSynthwaveBGM();
  }

  speak(text) {
    this.speakAnnouncer(text);
  }

  startSynthwaveBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    if (this.bgmGain) {
      try {
        const t = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(t);
        this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.22, t);
      } catch (e) {}
    }

    // 136 BPM Industrial Darksynth Combat Track: 16th note = 110ms
    const stepTime = 110;

    // Relentless Cyberpunk Phrygian Combat Bassline (D, Eb, F, G, Ab, A)
    const bassline = [
      73.42, 73.42, 146.83, 73.42, 77.78, 77.78, 155.56, 77.78,
      73.42, 73.42, 146.83, 73.42, 87.31, 87.31, 103.83, 98.00,
      73.42, 73.42, 146.83, 73.42, 77.78, 77.78, 155.56, 77.78,
      65.41, 65.41, 130.81, 65.41, 110.00, 103.83, 98.00, 87.31
    ];

    // Menacing cutting battle arpeggio
    const melody = [
      293.66, 311.13, 349.23, 440.00, 311.13, 293.66, 440.00, 587.33,
      311.13, 349.23, 440.00, 622.25, 440.00, 349.23, 311.13, 293.66,
      293.66, 311.13, 349.23, 440.00, 311.13, 293.66, 440.00, 587.33,
      261.63, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 311.13
    ];

    this.bgmInterval = setInterval(() => {
      if (this.bgmMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const beat = this.bgmStep % 32;

      // 1. Heavy Cyber Kick on beats 0, 4, 8, 12, 16, 20, 24, 28 + syncopated on 14 & 30
      if (beat % 4 === 0 || beat === 14 || beat === 30) {
        this.playDrumKick(t);
      }

      // 2. Heavy Snare with metallic crack on beats 4, 12, 20, 28
      if (beat % 8 === 4) {
        this.playDrumSnare(t);
      }

      // 3. Sizzling 16th-note Industrial Hi-Hats
      this.playDrumHiHat(t, beat % 2 === 0 ? 0.08 : 0.04);

      // 4. Aggressive Sawtooth Battle Bass
      const bassFreq = bassline[beat];
      if (bassFreq) {
        this.playSynthBass(t, bassFreq);
      }

      // 5. Menacing Darksynth Lead
      const arpFreq = melody[beat];
      if (arpFreq && beat % 2 === 0) {
        this.playSynthArp(t, arpFreq);
      }

      this.bgmStep++;
    }, stepTime);
  }

  playDrumKick(t) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(170, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.08);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }

  playDrumSnare(t) {
    try {
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.13, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1400;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.38, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.13);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);
      noise.start(t);

      // Snare tone body
      const tone = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      tone.type = 'triangle';
      tone.frequency.setValueAtTime(230, t);
      tone.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      toneGain.gain.setValueAtTime(0.25, t);
      toneGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      tone.connect(toneGain);
      toneGain.connect(this.bgmGain);
      tone.start(t);
      tone.stop(t + 0.08);
    } catch (e) {}
  }

  playDrumHiHat(t, vol = 0.05) {
    try {
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.035, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7500;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);
      noise.start(t);
    } catch (e) {}
  }

  playSynthBass(t, freq) {
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, t);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.007, t); // Heavy detuned unison

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(780, t);
      filter.Q.value = 3.5;
      filter.frequency.exponentialRampToValueAtTime(140, t + 0.095);

      gain.gain.setValueAtTime(0.38, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.095);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.095);
      osc2.stop(t + 0.095);
    } catch (e) {}
  }

  playSynthArp(t, freq) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch (e) {}
  }

  playParry() {
    this.playParryActivate();
  }

  playParryActivate() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Forcefield deployment rising energy hum
      const osc1 = this.ctx.createOscillator();
      const oscGain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(240, t);
      osc1.frequency.exponentialRampToValueAtTime(1100, t + 0.16);
      oscGain1.gain.setValueAtTime(0.45, t);
      oscGain1.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
      osc1.connect(oscGain1);
      oscGain1.connect(this.sfxGain);
      osc1.start(t);
      osc1.stop(t + 0.28);

      // 2. High-tech forcefield resonance shimmer
      const osc2 = this.ctx.createOscillator();
      const oscGain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1450, t);
      osc2.frequency.exponentialRampToValueAtTime(2200, t + 0.12);
      oscGain2.gain.setValueAtTime(0.35, t);
      oscGain2.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      osc2.connect(oscGain2);
      oscGain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.22);
    } catch (e) {}
  }

  playParryDeflect() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Kinetic metal impact ping
      const oscPing = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      oscPing.type = 'triangle';
      oscPing.frequency.setValueAtTime(2200, t);
      oscPing.frequency.exponentialRampToValueAtTime(4200, t + 0.08);
      pingGain.gain.setValueAtTime(0.7, t);
      pingGain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
      oscPing.connect(pingGain);
      pingGain.connect(this.sfxGain);
      oscPing.start(t);
      oscPing.stop(t + 0.32);

      // 2. Resonant metallic chime ring
      const oscRing = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      oscRing.type = 'sine';
      oscRing.frequency.setValueAtTime(1320, t);
      ringGain.gain.setValueAtTime(0.5, t);
      ringGain.gain.exponentialRampToValueAtTime(0.005, t + 0.45);
      oscRing.connect(ringGain);
      ringGain.connect(this.sfxGain);
      oscRing.start(t);
      oscRing.stop(t + 0.45);

      // 3. Concussive deflection punch
      const oscPunch = this.ctx.createOscillator();
      const punchGain = this.ctx.createGain();
      oscPunch.type = 'sine';
      oscPunch.frequency.setValueAtTime(200, t);
      oscPunch.frequency.exponentialRampToValueAtTime(45, t + 0.18);
      punchGain.gain.setValueAtTime(0.65, t);
      punchGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      oscPunch.connect(punchGain);
      punchGain.connect(this.sfxGain);
      oscPunch.start(t);
      oscPunch.stop(t + 0.18);
    } catch (e) {}
  }

  playPortalCharge() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.36);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.38);
    } catch (e) {}
  }

  playPortalWarp() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Sci-fi dematerialization whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.28);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.28);

      // 2. Rematerialization arrival chime
      const oscChime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      oscChime.type = 'triangle';
      oscChime.frequency.setValueAtTime(880, t + 0.08);
      oscChime.frequency.exponentialRampToValueAtTime(1320, t + 0.22);
      chimeGain.gain.setValueAtTime(0.35, t + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.01, t + 0.36);
      oscChime.connect(chimeGain);
      chimeGain.connect(this.sfxGain);
      oscChime.start(t + 0.08);
      oscChime.stop(t + 0.36);
    } catch (e) {}
  }

  // Weapons SFX
  playLaser() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  playScatter() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 300, t + i * 0.02);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.14);
        gain.gain.setValueAtTime(0.2, t + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + i * 0.02);
        osc.stop(t + 0.14);
      }
    } catch (e) {}
  }

  playRailgun() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.38);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.38);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.38);
    } catch (e) {}
  }

  playBouncing() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.07);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.22);
      gain.gain.setValueAtTime(0.42, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {}
  }

  playRocket() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.26);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.26);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch (e) {}
  }

  playCryo() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.linearRampToValueAtTime(1700, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  playFlame() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(t);
    } catch (e) {}
  }

  playSeeker() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.1);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {}
  }

  playSuper(superType) {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.35);
      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.4);
    } catch (e) {}
  }

  playExplosion(large = false) {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const dur = large ? 0.65 : 0.35;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) output[i] = Math.random() * 2 - 1;

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(large ? 420 : 750, t);
      filter.frequency.exponentialRampToValueAtTime(25, t + dur);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(large ? 0.75 : 0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      whiteNoise.start(t);
    } catch (e) {}
  }

  playWallDestroyed() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Heavy low-frequency rubble collapse
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.55);
      oscGain.gain.setValueAtTime(0.75, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.55);

      // 2. Concrete/metallic crunch noise burst
      const dur = 0.5;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, t);
      filter.frequency.exponentialRampToValueAtTime(140, t + dur);
      filter.Q.value = 2.5;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(t);
    } catch (e) {}
  }

  playWallHit() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  playShieldHit() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Resonant plasma shield absorption zap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.12);

      gain.gain.setValueAtTime(0.48, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.14);

      // 2. High-frequency electrical displacement ping
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, t);
      osc2.frequency.exponentialRampToValueAtTime(900, t + 0.08);
      gain2.gain.setValueAtTime(0.32, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.08);
    } catch (e) {}
  }

  playBarrelExplosion() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // 1. Sub-bass concussive shockwave thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(22, t + 0.65);
      oscGain.gain.setValueAtTime(0.85, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.65);

      // 2. Volatile roaring chemical blast
      const dur = 0.7;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, t);
      filter.frequency.exponentialRampToValueAtTime(30, t + dur);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(t);

      // 3. High-pressure canister metal rupture crack
      const crackOsc = this.ctx.createOscillator();
      const crackGain = this.ctx.createGain();
      crackOsc.type = 'triangle';
      crackOsc.frequency.setValueAtTime(950, t);
      crackOsc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
      crackGain.gain.setValueAtTime(0.55, t);
      crackGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      crackOsc.connect(crackGain);
      crackGain.connect(this.sfxGain);
      crackOsc.start(t);
      crackOsc.stop(t + 0.12);
    } catch (e) {}
  }

  playDash() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, t);
      osc.frequency.exponentialRampToValueAtTime(650, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {}
  }

  playSpeedPad() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(260, t);
      osc1.frequency.exponentialRampToValueAtTime(1450, t + 0.16);
      osc1.frequency.exponentialRampToValueAtTime(320, t + 0.38);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(3600, t + 0.15);
      filter.frequency.exponentialRampToValueAtTime(500, t + 0.38);

      gain1.gain.setValueAtTime(0.4, t);
      gain1.gain.exponentialRampToValueAtTime(0.005, t + 0.38);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(t);
      osc1.stop(t + 0.38);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(580, t);
      osc2.frequency.exponentialRampToValueAtTime(1760, t + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(660, t + 0.32);
      gain2.gain.setValueAtTime(0.25, t);
      gain2.gain.exponentialRampToValueAtTime(0.005, t + 0.32);

      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.32);
    } catch (e) {}
  }

  playPowerup() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.2, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.18);
      });
    } catch (e) {}
  }

  playKill() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        gain.gain.setValueAtTime(0.25, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playCrownAlert() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0.3, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  playHitmarker() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1850, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.04);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {}
  }

  playTierUp() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [440, 659.25, 880, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.25, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.04 + 0.16);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.16);
      });
    } catch (e) {}
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        gain.gain.setValueAtTime(0.35, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + 0.35);
      });
    } catch (e) {}
  }

  playAnnouncerChime() {
    if (this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  speakAnnouncer(text) {
    if (this.muted) return;
    if (!text) return;

    // TTS is strictly restricted to combat kill streaks, rampages, and apex champion
    const isCombatMilestone = /(double kill|triple kill|mega kill|rampage|killing spree|unstoppable|godlike|apex champion)/i.test(text);
    if (!isCombatMilestone) return;

    this.playAnnouncerChime();
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.72;
      utterance.rate = 1.18;
      utterance.volume = 0.95;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Fred')));
        if (englishVoice) utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

export const sounds = new SoundEngine();
