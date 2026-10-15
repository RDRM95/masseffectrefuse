/**
 * A small offline synthesiser used to compose the production's original
 * score and sound effects. Everything is rendered to 44.1 kHz stereo float
 * buffers, then written as 16-bit WAV (converted to MP3 by FFmpeg).
 *
 * The aim is the atmosphere of late-2000s electronic/orchestral science
 * fiction scoring: analog-style pads, low drones, restrained strings, military
 * percussion. All material here is original.
 */

export const SR = 44100;

export class Buffer2 {
  l: Float32Array;
  r: Float32Array;
  constructor(public seconds: number) {
    const n = Math.ceil(seconds * SR);
    this.l = new Float32Array(n);
    this.r = new Float32Array(n);
  }
  get length() {
    return this.l.length;
  }
}

// ---------- utilities ----------

let seed = 12345;
export const rnd = (): number => {
  // xorshift32
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) % 1000000) / 1000000;
};
export const setSeed = (s: number) => {
  seed = s || 1;
};

const NOTE_INDEX: Record<string, number> = {C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11};

/** "A3" -> Hz. */
export const hz = (note: string): number => {
  const m = note.match(/^([A-G][#b]?)(-?\d)$/);
  if (!m) throw new Error(`Bad note ${note}`);
  const midi = (Number(m[2]) + 1) * 12 + NOTE_INDEX[m[1]];
  return 440 * Math.pow(2, (midi - 69) / 12);
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** ADSR envelope value at time t (seconds) for a note of duration dur. */
export const adsr = (t: number, dur: number, a: number, d: number, s: number, r: number): number => {
  if (t < 0) return 0;
  let env: number;
  if (t < a) env = t / a;
  else if (t < a + d) env = 1 - (1 - s) * ((t - a) / d);
  else env = s;
  if (t > dur) {
    const rt = t - dur;
    if (rt > r) return 0;
    env *= 1 - rt / r;
  }
  return env;
};

// ---------- oscillators ----------

export type Wave = 'sine' | 'saw' | 'tri' | 'square' | 'noise' | 'pulse';

export const osc = (wave: Wave, phase: number): number => {
  const p = phase - Math.floor(phase);
  switch (wave) {
    case 'sine':
      return Math.sin(p * Math.PI * 2);
    case 'saw':
      return 2 * p - 1;
    case 'tri':
      return 1 - 4 * Math.abs(p - 0.5);
    case 'square':
      return p < 0.5 ? 1 : -1;
    case 'pulse':
      return p < 0.25 ? 1 : -1;
    case 'noise':
      return rnd() * 2 - 1;
  }
};

// ---------- filters ----------

/** Simple state-variable low-pass, processed per sample. */
export class LowPass {
  private low = 0;
  private band = 0;
  constructor(public cutoff: number, public q = 0.7) {}
  process(x: number, cutoff = this.cutoff): number {
    const f = 2 * Math.sin((Math.PI * clamp(cutoff, 20, 18000)) / SR);
    const qq = 1 / this.q;
    const high = x - this.low - qq * this.band;
    this.band += f * high;
    this.low += f * this.band;
    return this.low;
  }
}

export class OnePoleLP {
  private y = 0;
  constructor(public cutoff: number) {}
  process(x: number): number {
    const a = clamp((2 * Math.PI * this.cutoff) / SR, 0, 1);
    this.y += a * (x - this.y);
    return this.y;
  }
}

export class OnePoleHP {
  private y = 0;
  private px = 0;
  constructor(public cutoff: number) {}
  process(x: number): number {
    const rc = 1 / (2 * Math.PI * this.cutoff);
    const a = rc / (rc + 1 / SR);
    this.y = a * (this.y + x - this.px);
    this.px = x;
    return this.y;
  }
}

// ---------- effects ----------

/** Schroeder reverb: 4 parallel combs + 2 series allpasses, stereo-decorrelated. */
export const reverb = (buf: Buffer2, mix = 0.3, decay = 0.82, predelayMs = 20): Buffer2 => {
  const out = new Buffer2(buf.seconds);
  const combs = [1557, 1617, 1491, 1422];
  const combsR = [1617, 1557, 1422, 1491].map((c) => c + 23);
  const aps = [225, 556];
  const run = (input: Float32Array, output: Float32Array, cl: number[]) => {
    const cbuf = cl.map((n) => new Float32Array(n));
    const ci = cl.map(() => 0);
    const abuf = aps.map((n) => new Float32Array(n));
    const ai = aps.map(() => 0);
    const pre = Math.round((predelayMs / 1000) * SR);
    const dampL = new OnePoleLP(4200);
    for (let i = 0; i < input.length; i++) {
      const x = i >= pre ? input[i - pre] : 0;
      let acc = 0;
      for (let c = 0; c < cl.length; c++) {
        const y = cbuf[c][ci[c]];
        cbuf[c][ci[c]] = x + y * decay;
        ci[c] = (ci[c] + 1) % cl[c];
        acc += y;
      }
      acc = dampL.process(acc / cl.length);
      for (let a = 0; a < aps.length; a++) {
        const y = abuf[a][ai[a]];
        const v = acc + y * 0.5;
        abuf[a][ai[a]] = v;
        ai[a] = (ai[a] + 1) % aps[a];
        acc = y - v * 0.5;
      }
      output[i] = input[i] * (1 - mix) + acc * mix * 2.2;
    }
  };
  run(buf.l, out.l, combs);
  run(buf.r, out.r, combsR);
  return out;
};

/** Stereo ping-pong delay. */
export const delay = (buf: Buffer2, timeSec: number, feedback: number, mix: number): Buffer2 => {
  const out = new Buffer2(buf.seconds);
  const n = Math.round(timeSec * SR);
  const dl = new Float32Array(n);
  const dr = new Float32Array(n);
  let i0 = 0;
  for (let i = 0; i < buf.length; i++) {
    const yl = dl[i0];
    const yr = dr[i0];
    dl[i0] = buf.l[i] + yr * feedback;
    dr[i0] = buf.r[i] + yl * feedback;
    out.l[i] = buf.l[i] + yl * mix;
    out.r[i] = buf.r[i] + yr * mix;
    i0 = (i0 + 1) % n;
  }
  return out;
};

/** Soft-clip limiter with normalisation. */
export const master = (buf: Buffer2, gain = 1, ceiling = 0.95): Buffer2 => {
  let peak = 0;
  for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf.l[i]), Math.abs(buf.r[i]));
  const g = peak > 0 ? Math.min(gain, ceiling / peak) * gain : 1;
  const out = new Buffer2(buf.seconds);
  for (let i = 0; i < buf.length; i++) {
    out.l[i] = Math.tanh(buf.l[i] * g * 1.1) * ceiling;
    out.r[i] = Math.tanh(buf.r[i] * g * 1.1) * ceiling;
  }
  return out;
};

export const mix = (into: Buffer2, from: Buffer2, gain = 1, offsetSec = 0) => {
  const o = Math.round(offsetSec * SR);
  for (let i = 0; i < from.length && i + o < into.length; i++) {
    if (i + o < 0) continue;
    into.l[i + o] += from.l[i] * gain;
    into.r[i + o] += from.r[i] * gain;
  }
};

/** Apply a linear gain automation: points [timeSec, gain]. */
export const automate = (buf: Buffer2, points: Array<[number, number]>) => {
  for (let i = 0; i < buf.length; i++) {
    const t = i / SR;
    let g = points[0][1];
    for (let k = 0; k < points.length - 1; k++) {
      const [t0, g0] = points[k];
      const [t1, g1] = points[k + 1];
      if (t >= t0 && t <= t1) {
        g = g0 + ((g1 - g0) * (t - t0)) / Math.max(1e-6, t1 - t0);
        break;
      }
      if (t > t1) g = g1;
    }
    buf.l[i] *= g;
    buf.r[i] *= g;
  }
};

export const fadeInOut = (buf: Buffer2, fadeIn: number, fadeOut: number) => {
  const n = buf.length;
  const fi = Math.round(fadeIn * SR);
  const fo = Math.round(fadeOut * SR);
  for (let i = 0; i < n; i++) {
    let g = 1;
    if (i < fi) g = i / fi;
    if (i > n - fo) g = Math.min(g, (n - i) / fo);
    buf.l[i] *= g;
    buf.r[i] *= g;
  }
};

// ---------- instruments ----------

export interface VoiceOpts {
  wave?: Wave;
  /** Number of detuned unison voices. */
  unison?: number;
  detune?: number; // cents
  a?: number;
  d?: number;
  s?: number;
  r?: number;
  cutoff?: number;
  cutoffEnv?: number; // additional cutoff Hz scaled by envelope
  q?: number;
  gain?: number;
  pan?: number; // -1..1
  vibrato?: number; // Hz depth in cents
  vibratoRate?: number;
  sub?: number; // sub-oscillator (one octave down) gain
  noise?: number; // noise mix
  pitchEnv?: number; // semitone sweep downward over pitchEnvTime
  pitchEnvTime?: number;
  fm?: number; // FM index (modulator at ratio fmRatio)
  fmRatio?: number;
}

const DEFAULT: Required<VoiceOpts> = {
  wave: 'saw',
  unison: 1,
  detune: 8,
  a: 0.01,
  d: 0.1,
  s: 0.8,
  r: 0.3,
  cutoff: 4000,
  cutoffEnv: 0,
  q: 0.7,
  gain: 0.3,
  pan: 0,
  vibrato: 0,
  vibratoRate: 5,
  sub: 0,
  noise: 0,
  pitchEnv: 0,
  pitchEnvTime: 0.1,
  fm: 0,
  fmRatio: 2,
};

/** Render one note into the buffer at time `at` (seconds). */
export const note = (buf: Buffer2, freq: number, at: number, dur: number, o: VoiceOpts = {}) => {
  const p = {...DEFAULT, ...o};
  const start = Math.round(at * SR);
  const total = Math.round((dur + p.r) * SR);
  const phases = new Float32Array(p.unison).map(() => rnd());
  const dets = new Float32Array(p.unison).map((_, i) => (p.unison === 1 ? 0 : ((i / (p.unison - 1)) * 2 - 1) * p.detune));
  const pans = new Float32Array(p.unison).map((_, i) => (p.unison === 1 ? p.pan : clamp(p.pan + ((i / (p.unison - 1)) * 2 - 1) * 0.6, -1, 1)));
  const lp = new LowPass(p.cutoff, p.q);
  let subPhase = 0;
  let modPhase = 0;
  const gl = Math.sqrt((1 - p.pan) / 2);
  const gr = Math.sqrt((1 + p.pan) / 2);
  for (let i = 0; i < total; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    const env = adsr(t, dur, p.a, p.d, p.s, p.r);
    if (env <= 0) continue;
    const vib = p.vibrato ? Math.sin(t * p.vibratoRate * Math.PI * 2) * p.vibrato * Math.min(1, t / 0.6) : 0;
    const pe = p.pitchEnv ? p.pitchEnv * Math.max(0, 1 - t / p.pitchEnvTime) : 0;
    const f = freq * Math.pow(2, (vib + pe * 100) / 1200);
    let sl = 0;
    let sr = 0;
    modPhase += (f * p.fmRatio) / SR;
    const fmv = p.fm ? Math.sin(modPhase * Math.PI * 2) * p.fm * env : 0;
    for (let u = 0; u < p.unison; u++) {
      const fu = f * Math.pow(2, dets[u] / 1200);
      phases[u] += fu / SR + fmv / SR;
      const v = osc(p.wave, phases[u]);
      const pl = Math.sqrt((1 - pans[u]) / 2);
      const pr = Math.sqrt((1 + pans[u]) / 2);
      sl += v * pl;
      sr += v * pr;
    }
    sl /= Math.sqrt(p.unison);
    sr /= Math.sqrt(p.unison);
    if (p.sub) {
      subPhase += f / 2 / SR;
      const sv = Math.sin(subPhase * Math.PI * 2) * p.sub;
      sl += sv * gl;
      sr += sv * gr;
    }
    if (p.noise) {
      const nv = (rnd() * 2 - 1) * p.noise;
      sl += nv;
      sr += nv;
    }
    const cutoff = p.cutoff + p.cutoffEnv * env;
    const mono = lp.process((sl + sr) * 0.5, cutoff);
    const side = (sl - sr) * 0.5;
    const outL = (mono + side) * env * p.gain;
    const outR = (mono - side) * env * p.gain;
    buf.l[idx] += outL;
    buf.r[idx] += outR;
  }
};

/** Chord: array of note names. */
export const chord = (buf: Buffer2, notes: string[], at: number, dur: number, o: VoiceOpts = {}) => {
  for (const n of notes) note(buf, hz(n), at, dur, o);
};

// ---------- percussion ----------

export const kick = (buf: Buffer2, at: number, gain = 0.8, lowFreq = 48) => {
  const start = Math.round(at * SR);
  let ph = 0;
  for (let i = 0; i < SR * 0.6; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    const f = lowFreq + 140 * Math.exp(-t * 28);
    ph += f / SR;
    const env = Math.exp(-t * 7) * (1 - Math.exp(-t * 900));
    const v = Math.sin(ph * Math.PI * 2) * env * gain;
    buf.l[idx] += v;
    buf.r[idx] += v;
  }
};

/** Taiko / war drum: big low body with a noisy transient. */
export const taiko = (buf: Buffer2, at: number, gain = 0.9, f0 = 70) => {
  const start = Math.round(at * SR);
  let ph = 0;
  const lp = new OnePoleLP(1800);
  for (let i = 0; i < SR * 1.2; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    const f = f0 + 60 * Math.exp(-t * 18);
    ph += f / SR;
    const body = Math.sin(ph * Math.PI * 2) * Math.exp(-t * 4.5);
    const skin = lp.process(rnd() * 2 - 1) * Math.exp(-t * 30) * 0.9;
    const v = (body + skin) * gain * (1 - Math.exp(-t * 600));
    buf.l[idx] += v * 0.95;
    buf.r[idx] += v * 1.05;
  }
};

/** Military snare: bright noise burst with short body; optional roll ticks. */
export const snare = (buf: Buffer2, at: number, gain = 0.5, tight = false) => {
  const start = Math.round(at * SR);
  const hp = new OnePoleHP(1500);
  let ph = 0;
  const len = tight ? 0.12 : 0.22;
  for (let i = 0; i < SR * len; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    ph += 190 / SR;
    const body = Math.sin(ph * Math.PI * 2) * Math.exp(-t * 40) * 0.5;
    const n = hp.process(rnd() * 2 - 1) * Math.exp(-t * (tight ? 45 : 22));
    const v = (body + n) * gain;
    buf.l[idx] += v * 1.05;
    buf.r[idx] += v * 0.95;
  }
};

export const hat = (buf: Buffer2, at: number, gain = 0.15, len = 0.05) => {
  const start = Math.round(at * SR);
  const hp = new OnePoleHP(7000);
  for (let i = 0; i < SR * len; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    const v = hp.process(rnd() * 2 - 1) * Math.exp(-t * 60) * gain;
    buf.l[idx] += v;
    buf.r[idx] += v;
  }
};

/** Metallic tick/clank for Reaper interiors and consoles. */
export const tick = (buf: Buffer2, at: number, freq: number, gain = 0.2, len = 0.08) => {
  const start = Math.round(at * SR);
  let ph = 0;
  for (let i = 0; i < SR * len; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / SR;
    ph += freq / SR;
    const v = (Math.sin(ph * Math.PI * 2) + 0.4 * Math.sin(ph * Math.PI * 2 * 2.76)) * Math.exp(-t * 45) * gain;
    buf.l[idx] += v;
    buf.r[idx] += v * 0.8;
  }
};

/** Low rumble bed (filtered noise) — engine/space ambience. */
export const rumble = (buf: Buffer2, at: number, dur: number, gain = 0.2, cutoff = 120) => {
  const start = Math.round(at * SR);
  const lp = new OnePoleLP(cutoff);
  const lp2 = new OnePoleLP(cutoff * 1.6);
  for (let i = 0; i < SR * dur; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const v = lp.process(rnd() * 2 - 1) * 4;
    const v2 = lp2.process(rnd() * 2 - 1) * 4;
    buf.l[idx] += v * gain;
    buf.r[idx] += v2 * gain;
  }
};

/** Noise sweep (risers, whooshes). */
export const sweep = (buf: Buffer2, at: number, dur: number, fromHz: number, toHz: number, gain = 0.3, curve = 1) => {
  const start = Math.round(at * SR);
  const lp = new LowPass(fromHz, 1.2);
  for (let i = 0; i < SR * dur; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / (SR * dur);
    const c = fromHz + (toHz - fromHz) * Math.pow(t, curve);
    const env = Math.sin(t * Math.PI);
    const v = lp.process(rnd() * 2 - 1, c) * env * gain * 2;
    buf.l[idx] += v;
    buf.r[idx] += v * (0.8 + 0.4 * t);
  }
};

// ---------- WAV output ----------

export const toWav = (buf: Buffer2): Uint8Array => {
  const n = buf.length;
  const bytes = 44 + n * 4;
  const out = new ArrayBuffer(bytes);
  const v = new DataView(out);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, 'RIFF');
  v.setUint32(4, bytes - 8, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 2, true);
  v.setUint32(24, SR, true);
  v.setUint32(28, SR * 4, true);
  v.setUint16(32, 4, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n * 4, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    v.setInt16(o, Math.round(clamp(buf.l[i], -1, 1) * 32767), true);
    v.setInt16(o + 2, Math.round(clamp(buf.r[i], -1, 1) * 32767), true);
    o += 4;
  }
  return new Uint8Array(out);
};
