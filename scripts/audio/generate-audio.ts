/**
 * Composes and renders the original score and sound effects for
 * MASS EFFECT: REFUSE. Output: public/audio/music/*.mp3, public/audio/sfx/*.mp3
 *
 * Usage: npx tsx scripts/audio/generate-audio.ts [cueName ...]
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {Buffer2, VoiceOpts, SR, automate, chord, delay, fadeInOut, hat, hz, kick, master, mix, note, reverb, rumble, setSeed, snare, sweep, taiko, tick, toWav, rnd} from './synth';

const OUT_MUSIC = path.resolve('public/audio/music');
const OUT_SFX = path.resolve('public/audio/sfx');
const TMP = path.resolve(process.env.AUDIO_TMP ?? 'renders/audio-tmp');
mkdirSync(OUT_MUSIC, {recursive: true});
mkdirSync(OUT_SFX, {recursive: true});
mkdirSync(TMP, {recursive: true});

// ---------- instrument presets ----------
const PAD: VoiceOpts = {wave: 'saw', unison: 5, detune: 9, a: 2.4, d: 1, s: 0.85, r: 3.5, cutoff: 700, cutoffEnv: 300, gain: 0.07};
const GLASS: VoiceOpts = {wave: 'tri', unison: 3, detune: 5, a: 3, d: 1, s: 0.9, r: 5, cutoff: 2600, gain: 0.07};
const DRONE: VoiceOpts = {wave: 'sine', a: 4, d: 1, s: 1, r: 5, cutoff: 400, sub: 0.6, gain: 0.22};
const PIANO: VoiceOpts = {wave: 'sine', fm: 1.6, fmRatio: 1, a: 0.004, d: 3.2, s: 0, r: 1.2, cutoff: 5000, gain: 0.22};
const STRINGS: VoiceOpts = {wave: 'saw', unison: 4, detune: 11, a: 0.7, d: 0.4, s: 0.9, r: 1.0, cutoff: 1700, cutoffEnv: 600, vibrato: 7, vibratoRate: 5.2, gain: 0.06};
const STRINGS_STACC: VoiceOpts = {wave: 'saw', unison: 3, detune: 9, a: 0.02, d: 0.08, s: 0.5, r: 0.08, cutoff: 2200, gain: 0.07};
const BRASS: VoiceOpts = {wave: 'saw', unison: 2, detune: 6, a: 0.09, d: 0.3, s: 0.85, r: 0.5, cutoff: 900, cutoffEnv: 1800, q: 0.9, gain: 0.1};
const BASS: VoiceOpts = {wave: 'pulse', a: 0.008, d: 0.18, s: 0.35, r: 0.08, cutoff: 420, cutoffEnv: 500, sub: 0.6, gain: 0.26};
const ARP: VoiceOpts = {wave: 'square', a: 0.004, d: 0.25, s: 0.15, r: 0.2, cutoff: 2400, gain: 0.05};
const CHOIR: VoiceOpts = {wave: 'tri', unison: 6, detune: 14, a: 1.8, d: 1, s: 0.9, r: 3, cutoff: 1500, gain: 0.06};
const SINE_LEAD: VoiceOpts = {wave: 'sine', a: 0.05, d: 0.3, s: 0.8, r: 0.6, vibrato: 9, vibratoRate: 4.6, gain: 0.14};

/** Reaper horn: huge detuned low cluster with a cutoff sweep and growl. */
const reaperHorn = (buf: Buffer2, at: number, gain = 1, dur = 3.2) => {
  note(buf, hz('Bb0'), at, dur, {wave: 'saw', unison: 5, detune: 22, a: 0.25, d: 0.8, s: 0.8, r: 1.6, cutoff: 150, cutoffEnv: 900, q: 1.1, gain: 0.5 * gain, sub: 0.5});
  note(buf, hz('Bb1'), at + 0.05, dur, {wave: 'saw', unison: 4, detune: 18, a: 0.3, d: 0.8, s: 0.8, r: 1.6, cutoff: 300, cutoffEnv: 1500, q: 1.2, gain: 0.3 * gain});
  note(buf, hz('E1'), at + 0.1, dur, {wave: 'square', unison: 2, detune: 15, a: 0.4, d: 0.8, s: 0.6, r: 1.4, cutoff: 200, cutoffEnv: 700, gain: 0.22 * gain});
  sweep(buf, at, dur + 0.5, 200, 2400, 0.12 * gain, 0.5);
  rumble(buf, at, dur + 1.5, 0.25 * gain, 70);
};

const writeMp3 = (name: string, buf: Buffer2, dir: string) => {
  const wav = path.join(TMP, `${name}.wav`);
  writeFileSync(wav, toWav(buf));
  const mp3 = path.join(dir, `${name}.mp3`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3]);
  rmSync(wav);
  console.log('wrote', path.relative(process.cwd(), mp3), `${buf.seconds}s`);
};

// ---------- cues ----------

const opening = (): Buffer2 => {
  setSeed(11);
  const dry = new Buffer2(80);
  // deep drone D
  note(dry, hz('D1'), 0, 74, {...DRONE, a: 6});
  note(dry, hz('A1'), 8, 66, {...DRONE, gain: 0.08, a: 8});
  // slow synthetic arpeggio — mysterious, restrained
  const arp = ['D4', 'A4', 'F5', 'E5', 'D5', 'A4', 'F4', 'E4'];
  for (let t = 3; t < 41; t += 0.5) {
    const n = arp[Math.round(t * 2) % arp.length];
    note(dry, hz(n), t, 0.45, {...ARP, wave: 'sine', gain: 0.07 * Math.min(1, (t - 3) / 6), pan: Math.sin(t * 0.7) * 0.5});
  }
  // pad chords under the text
  const padChords: Array<[number, string[]]> = [
    [3, ['D3', 'F3', 'A3']],
    [11, ['Bb2', 'D3', 'F3']],
    [19, ['F3', 'A3', 'C4']],
    [29, ['D3', 'F3', 'A3', 'E4']],
    [36, ['Bb2', 'D3', 'F3', 'A3']],
  ];
  for (const [t, c] of padChords) chord(dry, c, t, 7, {...GLASS, gain: 0.05});
  // "The Reapers." — dissonant swell and a deep hit
  note(dry, hz('Eb1'), 22.5, 5.5, {...DRONE, a: 2.5, r: 2, gain: 0.16});
  chord(dry, ['Eb2', 'A2', 'D3'], 23, 4.5, {...PAD, a: 1.5, cutoff: 400, gain: 0.05});
  taiko(dry, 23.2, 0.7, 50);
  // "In 2186..." sparse piano
  for (const [t, n] of [[30, 'D5'], [33, 'A4'], [36.5, 'F5'], [39.5, 'E5']] as Array<[number, string]>) note(dry, hz(n), t, 2.5, {...PIANO, gain: 0.16, pan: -0.2});
  // fleet reveal: strings swell, drums
  const prog: Array<[number, string[]]> = [
    [42, ['D3', 'F3', 'A3', 'D4']],
    [46, ['Bb2', 'D3', 'F3', 'Bb3']],
    [50, ['F3', 'A3', 'C4', 'F4']],
    [54, ['C3', 'E3', 'G3', 'C4']],
  ];
  for (const [t, c] of prog) {
    chord(dry, c, t, 4.2, {...STRINGS, gain: 0.05});
    chord(dry, c, t, 4.2, {...CHOIR, gain: 0.035});
    taiko(dry, t, 0.8, 60);
    taiko(dry, t + 2, 0.45, 60);
  }
  for (let t = 50; t < 58; t += 0.5) snare(dry, t, t % 2 === 0 ? 0.22 : 0.12, true);
  // title theme 58–72
  const titleChords: Array<[number, string[]]> = [
    [58, ['D3', 'F3', 'A3', 'D4']],
    [61.5, ['Bb2', 'D3', 'F3', 'Bb3']],
    [65, ['F3', 'A3', 'C4', 'F4']],
    [68.5, ['C3', 'E3', 'G3', 'C4']],
  ];
  for (const [t, c] of titleChords) {
    chord(dry, c, t, 3.4, {...BRASS, gain: 0.07});
    chord(dry, c, t, 3.4, {...STRINGS, gain: 0.05});
    chord(dry, c.map((n) => n.replace(/\d/, (d) => String(Number(d) - 1))), t, 3.4, {...PAD, gain: 0.05});
  }
  const melody: Array<[number, string, number]> = [[58, 'D5', 1.6], [59.75, 'F5', 1.6], [61.5, 'A5', 3.4], [65, 'G5', 1.6], [66.75, 'F5', 1.6], [68.5, 'E5', 1.6], [70.25, 'D5', 3.5]];
  for (const [t, n, d] of melody) {
    note(dry, hz(n), t, d, {...STRINGS, gain: 0.09, unison: 5});
    note(dry, hz(n), t, d, {...SINE_LEAD, gain: 0.05});
  }
  for (let t = 58; t < 72; t += 0.8) taiko(dry, t, Math.round((t - 58) / 0.8) % 4 === 0 ? 0.8 : 0.4, 58);
  for (let t = 58; t < 72; t += 0.4) snare(dry, t, Math.round((t - 58) / 0.4) % 2 === 0 ? 0.24 : 0.1, true);
  // 72–78: collapse to a low drone + distant horn
  note(dry, hz('D1'), 72, 7, {...DRONE, a: 0.5, gain: 0.2});
  reaperHorn(dry, 73.5, 0.35, 3);
  rumble(dry, 72, 8, 0.12, 90);
  const wet = reverb(dry, 0.32, 0.86, 30);
  const d = delay(wet, 0.5, 0.25, 0.12);
  automate(d, [[0, 1], [72, 1], [78, 0.0]]);
  fadeInOut(d, 0.5, 3);
  return master(d, 1.0);
};

const preparedGalaxy = (): Buffer2 => {
  setSeed(22);
  const dry = new Buffer2(86);
  const bpm = 100;
  const beat = 60 / bpm;
  // arrival: drone + horn
  note(dry, hz('D1'), 0, 84, {...DRONE, a: 1, gain: 0.16});
  reaperHorn(dry, 0.6, 0.9, 3.5);
  // ostinato from bar 2
  const bassPat = ['D2', 'D2', 'D2', 'F2', 'D2', 'D2', 'C2', 'A1'];
  const start = 4;
  for (let i = 0; start + i * beat * 0.5 < 80; i++) {
    const t = start + i * beat * 0.5;
    const bar = Math.floor(i / 8);
    const shift = bar % 8 >= 6 ? 'G' : 'D'; // modulate for the Palaven stretch
    let n = bassPat[i % 8];
    if (shift === 'G') n = n.replace('D2', 'G2').replace('F2', 'Bb2').replace('C2', 'F2').replace('A1', 'D2');
    note(dry, hz(n), t, beat * 0.42, {...BASS, gain: 0.22, cutoff: 380 + (i % 8 === 0 ? 250 : 0)});
  }
  // percussion
  for (let t = start; t < 80; t += beat) {
    const b = Math.round((t - start) / beat);
    if (b % 4 === 0) taiko(dry, t, 0.7, 62);
    if (b % 4 === 2) kick(dry, t, 0.5);
    snare(dry, t + beat * 0.5, 0.22, true);
    if (b % 2 === 1) snare(dry, t, 0.32);
    hat(dry, t + beat * 0.25, 0.08);
    hat(dry, t + beat * 0.75, 0.08);
    if (b % 8 === 7) for (let k = 0; k < 6; k++) snare(dry, t + (k * beat) / 6, 0.14 + k * 0.03, true);
  }
  // string stabs and chords
  const chords: Array<[string[], string[]]> = [
    [['D3', 'F3', 'A3'], ['D4', 'F4', 'A4']],
    [['Bb2', 'D3', 'F3'], ['Bb3', 'D4', 'F4']],
    [['G2', 'Bb2', 'D3'], ['G3', 'Bb3', 'D4']],
    [['A2', 'C#3', 'E3'], ['A3', 'C#4', 'E4']],
  ];
  for (let bar = 0; start + bar * beat * 4 < 78; bar++) {
    const t = start + bar * beat * 4;
    const [low, high] = chords[bar % 4];
    for (let k = 0; k < 8; k++) chord(dry, high, t + k * beat * 0.5, beat * 0.25, {...STRINGS_STACC, gain: k % 2 === 0 ? 0.05 : 0.035});
    if (bar % 2 === 0) chord(dry, low, t, beat * 4, {...PAD, gain: 0.045, a: 0.4});
    if (bar % 4 === 0 && bar > 0) chord(dry, low.map((n) => n.replace(/\d/, (d) => String(Number(d) + 1))), t, beat * 2, {...BRASS, gain: 0.08});
  }
  // the hyper-mass accelerator kill at ~40s: riser then hit
  sweep(dry, 36.5, 3.5, 200, 6000, 0.22, 2);
  taiko(dry, 40.0, 1.0, 45);
  chord(dry, ['D2', 'A2', 'D3', 'F3'], 40.0, 3.5, {...BRASS, gain: 0.12, a: 0.02});
  // Palaven: turian brass line at 50-66
  const turian: Array<[number, string, number]> = [[50, 'G4', 0.9], [51, 'Bb4', 0.9], [52, 'D5', 1.8], [54, 'C5', 0.9], [55, 'Bb4', 0.9], [56, 'A4', 1.8], [58, 'G4', 0.9], [59, 'D5', 2.7]];
  for (const [t, n, d] of turian) note(dry, hz(n), t, d, {...BRASS, gain: 0.09, cutoff: 1200});
  sweep(dry, 62.5, 3.2, 200, 5000, 0.18, 2);
  taiko(dry, 66, 1.0, 48);
  // closing: both homeworlds hold — sustained resolve
  chord(dry, ['D3', 'A3', 'D4', 'F#4'], 78, 6, {...STRINGS, gain: 0.07, a: 1.2});
  chord(dry, ['D2', 'A2'], 78, 6, {...PAD, gain: 0.06});
  const wet = reverb(dry, 0.24, 0.8, 18);
  fadeInOut(wet, 0.2, 3.5);
  return master(wet, 1.0);
};

const catalyst = (): Buffer2 => {
  setSeed(33);
  const dry = new Buffer2(114);
  // 0–12: exterior, the Citadel and the Crucible — cold, immense
  note(dry, hz('A1'), 0, 92, {...DRONE, a: 6, gain: 0.16});
  chord(dry, ['A2', 'E3', 'A3'], 2, 10, {...PAD, a: 4, cutoff: 500, gain: 0.05});
  // glassy chords through the chamber, very slow
  const prog: Array<[number, string[]]> = [
    [12, ['A3', 'C4', 'E4', 'B4']],
    [24, ['F3', 'A3', 'C4', 'E4']],
    [36, ['C3', 'E3', 'G3', 'D4']],
    [48, ['G3', 'B3', 'D4', 'A4']],
    [60, ['A3', 'C4', 'E4', 'B4']],
    [72, ['F3', 'A3', 'C4', 'E4']],
  ];
  for (const [t, c] of prog) chord(dry, c, t, 12.5, {...GLASS, gain: 0.05, a: 4});
  // sparse piano, high register, lots of space
  const piano: Array<[number, string]> = [[14, 'E5'], [19, 'C5'], [25, 'A4'], [31, 'B4'], [40, 'E5'], [47, 'D5'], [53, 'C5'], [59, 'A4'], [66, 'E5'], [71, 'C5'], [77, 'B4']];
  for (const [t, n] of piano) note(dry, hz(n), t, 3.5, {...PIANO, gain: 0.14, pan: rnd() * 0.6 - 0.3});
  // the three choices (26–40): a colour for each — cold blue, hard red, strange green
  chord(dry, ['E2', 'B2', 'E3'], 29.5, 4, {...PAD, a: 1, cutoff: 900, gain: 0.05});
  chord(dry, ['Eb2', 'A2', 'Eb3'], 25, 4, {...PAD, a: 1, cutoff: 500, gain: 0.06});
  chord(dry, ['C3', 'G3', 'D4', 'A4'], 34, 4.5, {...GLASS, a: 1, gain: 0.05});
  // the Crucible's hum
  for (let t = 12; t < 84; t += 4) tick(dry, t, 1320, 0.05, 0.6);
  // "I choose us" (≈ 82 s): warmth enters, then everything falls silent
  chord(dry, ['F3', 'A3', 'C4', 'F4'], 81, 5, {...STRINGS, gain: 0.06, a: 2});
  note(dry, hz('A4'), 82, 4, {...SINE_LEAD, gain: 0.06});
  // 86–90: silence apart from the drone decaying (handled by automation)
  // extraction (≈ 90–98): a soft pulse, hope under exhaustion
  for (let t = 90; t < 98; t += 0.857) note(dry, hz('D2'), t, 0.3, {...BASS, gain: 0.1, cutoff: 280});
  chord(dry, ['D3', 'F3', 'A3'], 90, 8, {...PAD, gain: 0.05, a: 2});
  note(dry, hz('F5'), 92, 4, {...STRINGS, gain: 0.05, a: 1.5});
  // Hackett (≈ 98–112): a quiet, determined pulse in D
  note(dry, hz('D1'), 97, 17, {...DRONE, a: 2, gain: 0.18});
  for (let t = 98; t < 110; t += 0.857) {
    note(dry, hz('D2'), t, 0.3, {...BASS, gain: 0.12, cutoff: 300});
    if (Math.round((t - 98) / 0.857) % 4 === 0) taiko(dry, t, 0.3, 58);
  }
  chord(dry, ['D3', 'F3', 'A3'], 99, 7, {...PAD, gain: 0.05});
  chord(dry, ['Bb2', 'D3', 'F3'], 106, 7, {...PAD, gain: 0.05});
  note(dry, hz('D5'), 104, 4, {...STRINGS, gain: 0.07});
  note(dry, hz('F5'), 108, 4, {...STRINGS, gain: 0.07});
  const wet = reverb(dry, 0.42, 0.9, 40);
  const d = delay(wet, 0.75, 0.3, 0.15);
  automate(d, [[0, 1], [85.5, 1], [87, 0.25], [89.5, 0.25], [91, 1], [114, 1]]);
  fadeInOut(d, 1, 3);
  return master(d, 1.0);
};

const longWar = (): Buffer2 => {
  setSeed(44);
  const dry = new Buffer2(68);
  const bpm = 132;
  const beat = 60 / bpm; // eighth in 6/8 feel
  const bar = beat * 6;
  const chords = [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['F3', 'A3', 'C4'], ['C3', 'E3', 'G3']];
  const arpNotes = [['D4', 'F4', 'A4', 'D5', 'A4', 'F4'], ['Bb3', 'D4', 'F4', 'Bb4', 'F4', 'D4'], ['F4', 'A4', 'C5', 'F5', 'C5', 'A4'], ['C4', 'E4', 'G4', 'C5', 'G4', 'E4']];
  note(dry, hz('D1'), 0, 66, {...DRONE, a: 3, gain: 0.12});
  for (let b = 0; b * bar < 62; b++) {
    const t0 = b * bar;
    const ci = Math.floor(b / 2) % 4;
    const grow = Math.min(1, b / 10);
    chord(dry, chords[ci], t0, bar * 1.02, {...PAD, gain: 0.045 + 0.02 * grow, a: 0.3});
    for (let k = 0; k < 6; k++) {
      note(dry, hz(arpNotes[ci][k]), t0 + k * beat, beat * 0.8, {...ARP, wave: 'pulse', gain: 0.045 + 0.02 * grow, pan: (k % 2 ? 0.35 : -0.35)});
    }
    note(dry, hz(chords[ci][0].replace(/\d/, '2')), t0, beat * 2.6, {...BASS, gain: 0.18});
    note(dry, hz(chords[ci][0].replace(/\d/, '2')), t0 + beat * 3, beat * 2.6, {...BASS, gain: 0.14});
    if (b >= 2) {
      taiko(dry, t0, 0.55 + 0.3 * grow, 60);
      taiko(dry, t0 + beat * 3, 0.35 + 0.2 * grow, 60);
      for (let k = 0; k < 6; k++) hat(dry, t0 + k * beat, k % 3 === 0 ? 0.12 : 0.06);
      if (b >= 6) snare(dry, t0 + beat * 3, 0.26);
      if (b >= 10 && b % 2 === 1) for (let k = 0; k < 6; k++) snare(dry, t0 + beat * 3 + (k * beat) / 2, 0.1 + k * 0.03, true);
    }
    if (b >= 14) chord(dry, chords[ci].map((n) => n.replace(/\d/, (d) => String(Number(d) + 1))), t0, bar, {...BRASS, gain: 0.05, a: 0.2});
  }
  // melody on strings from ~18s
  const mel: Array<[number, string, number]> = [
    [8 * bar, 'D5', bar], [9 * bar, 'E5', bar * 0.5], [9.5 * bar, 'F5', bar * 0.5], [10 * bar, 'A5', bar * 1.5], [11.5 * bar, 'G5', bar * 0.5], [12 * bar, 'F5', bar], [13 * bar, 'E5', bar],
    [14 * bar, 'D5', bar], [15 * bar, 'F5', bar * 0.5], [15.5 * bar, 'A5', bar * 0.5], [16 * bar, 'C6', bar * 1.5], [17.5 * bar, 'Bb5', bar * 0.5], [18 * bar, 'A5', bar], [19 * bar, 'G5', bar],
    [20 * bar, 'A5', bar * 2], [22 * bar, 'D6', bar * 2],
  ];
  for (const [t, n, d] of mel) {
    note(dry, hz(n), t, d, {...STRINGS, gain: 0.085, unison: 5});
    note(dry, hz(n), t, d, {...CHOIR, gain: 0.03});
  }
  // lift to D major at the end
  chord(dry, ['D3', 'F#3', 'A3', 'D4'], 62, 5.5, {...STRINGS, gain: 0.08, a: 0.8});
  chord(dry, ['D2', 'A2', 'D3'], 62, 5.5, {...BRASS, gain: 0.07});
  taiko(dry, 62, 0.9, 55);
  const wet = reverb(dry, 0.26, 0.82, 22);
  fadeInOut(wet, 0.3, 3);
  return master(wet, 1.0);
};

const reapersRespond = (): Buffer2 => {
  setSeed(55);
  const dry = new Buffer2(38);
  note(dry, hz('Eb1'), 0, 36, {...DRONE, a: 3, gain: 0.2});
  note(dry, hz('D1'), 0, 36, {...DRONE, a: 3, gain: 0.14}); // beating minor second
  reaperHorn(dry, 1.5, 1, 3.6);
  reaperHorn(dry, 22, 0.8, 3.2);
  chord(dry, ['C#3', 'D3', 'G#3', 'A3'], 4, 30, {...PAD, a: 8, cutoff: 500, gain: 0.04});
  // irregular mechanical ticks
  let t = 2;
  while (t < 34) {
    tick(dry, t, 600 + rnd() * 1800, 0.08 + rnd() * 0.08, 0.05 + rnd() * 0.1);
    t += 0.15 + rnd() * 0.9;
  }
  // slow, synthetic "thought" pulses
  for (let k = 0; k < 7; k++) note(dry, hz('Bb2'), 5 + k * 3.7, 1.2, {...ARP, wave: 'sine', gain: 0.07, cutoff: 1200});
  // building sub pulse toward the final offensive
  for (let s = 26; s < 36; s += 0.5) {
    const g = 0.1 + ((s - 26) / 10) * 0.25;
    kick(dry, s, g, 40);
  }
  sweep(dry, 30, 6.5, 120, 7000, 0.3, 2.2);
  rumble(dry, 0, 36, 0.14, 60);
  const wet = reverb(dry, 0.3, 0.9, 25);
  fadeInOut(wet, 0.5, 1.5);
  return master(wet, 1.0);
};

const finalHarvest = (): Buffer2 => {
  setSeed(66);
  const dry = new Buffer2(86);
  const bpm = 140;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const chords = [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3']];
  const KILL = 64; // Harbinger destroyed
  note(dry, hz('D1'), 0, KILL, {...DRONE, a: 0.5, gain: 0.14});
  for (let b = 0; b * bar < KILL - 4; b++) {
    const t0 = b * bar;
    const ci = b % 4;
    const intro = b < 2;
    const tension = t0 >= 48; // Harbinger isolated: thinner, higher
    // sixteenth-note staccato strings
    for (let k = 0; k < 16; k++) {
      const n = chords[ci][k % 3].replace(/\d/, (d) => String(Number(d) + 1));
      note(dry, hz(n), t0 + k * beat * 0.25, beat * 0.18, {...STRINGS_STACC, gain: intro ? 0.03 : tension ? 0.045 : 0.06});
    }
    // bass
    for (let k = 0; k < 8; k++) note(dry, hz(chords[ci][0].replace(/\d/, '2')), t0 + k * beat * 0.5, beat * 0.4, {...BASS, gain: intro ? 0.12 : 0.22});
    // drums
    if (!intro) {
      for (let k = 0; k < 4; k++) {
        kick(dry, t0 + k * beat, 0.55);
        snare(dry, t0 + k * beat + beat * 0.5, k % 2 ? 0.34 : 0.22);
        hat(dry, t0 + k * beat + beat * 0.25, 0.08);
        hat(dry, t0 + k * beat + beat * 0.75, 0.08);
      }
      taiko(dry, t0, 0.8, 58);
      if (ci === 3) for (let k = 0; k < 8; k++) snare(dry, t0 + beat * 2 + (k * beat) / 4, 0.12 + k * 0.03, true);
    }
    // brass theme every two bars
    if (!intro && !tension && b % 2 === 0) chord(dry, chords[ci], t0, bar * 1.6, {...BRASS, gain: 0.1, a: 0.05});
    chord(dry, chords[ci], t0, bar, {...CHOIR, gain: tension ? 0.06 : 0.04, a: 0.3});
  }
  // heroic melody 16–44
  const mel: Array<[number, string, number]> = [
    [16, 'D5', 1.5], [17.7, 'F5', 0.8], [18.6, 'A5', 2.4], [21.4, 'G5', 0.8], [22.3, 'F5', 0.8], [23.1, 'E5', 1.6], [24.8, 'D5', 2.5],
    [30, 'A5', 1.5], [31.7, 'Bb5', 0.8], [32.6, 'C6', 2.4], [35.4, 'Bb5', 0.8], [36.3, 'A5', 0.8], [37.1, 'G5', 1.6], [38.8, 'A5', 4],
  ];
  for (const [t, n, d] of mel) {
    note(dry, hz(n), t, d, {...BRASS, gain: 0.1, cutoff: 1300});
    note(dry, hz(n), t, d, {...STRINGS, gain: 0.07, unison: 5});
  }
  // Harbinger isolated (48–60): tension line climbing
  for (let k = 0; k < 12; k++) note(dry, hz(['A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'G#5'][k]), 48 + k, 1.1, {...STRINGS, gain: 0.07, a: 0.2});
  // firing sequence (60–64): riser and roll
  sweep(dry, 59.5, 4.5, 150, 8000, 0.3, 2);
  for (let k = 0; k < 32; k++) snare(dry, 60 + k * 0.125, 0.12 + k * 0.012, true);
  for (let k = 0; k < 8; k++) taiko(dry, 60 + k * 0.5, 0.5 + k * 0.06, 55);
  // THE HIT and the silence
  taiko(dry, KILL, 1.0, 40);
  kick(dry, KILL, 1.0, 36);
  chord(dry, ['D2', 'A2', 'D3'], KILL, 1.2, {...BRASS, gain: 0.16, a: 0.01, r: 1.5});
  // aftermath: one sustained note, very low drone
  note(dry, hz('D1'), KILL + 1.5, 20, {...DRONE, a: 2, gain: 0.15});
  note(dry, hz('A4'), KILL + 2.5, 9, {...STRINGS, gain: 0.05, a: 2, unison: 3});
  note(dry, hz('F4'), KILL + 11, 8, {...STRINGS, gain: 0.05, a: 2, unison: 3});
  chord(dry, ['D3', 'F3', 'A3'], KILL + 12, 9, {...PAD, gain: 0.04, a: 3});
  for (let t = KILL + 6; t < 84; t += 2.4) taiko(dry, t, 0.3, 55);
  const wet = reverb(dry, 0.24, 0.82, 20);
  automate(wet, [[0, 1], [KILL + 0.9, 1], [KILL + 1.0, 0.35], [KILL + 6, 0.8], [84, 0.8]]);
  fadeInOut(wet, 0.2, 2.5);
  return master(wet, 1.0);
};

const victory = (): Buffer2 => {
  setSeed(77);
  const dry = new Buffer2(44);
  note(dry, hz('F1'), 0, 42, {...DRONE, a: 4, gain: 0.12});
  const prog: Array<[number, string[]]> = [
    [0, ['F3', 'A3', 'C4']],
    [8, ['A2', 'C3', 'E3', 'A3']],
    [16, ['Bb2', 'D3', 'F3', 'A3']],
    [24, ['C3', 'E3', 'G3', 'Bb3']],
    [32, ['F3', 'A3', 'C4', 'F4']],
  ];
  for (const [t, c] of prog) {
    chord(dry, c, t, 8.6, {...GLASS, gain: 0.05, a: 3});
    chord(dry, c, t, 8.6, {...PAD, gain: 0.03, a: 3});
  }
  const mel: Array<[number, string, number]> = [[3, 'A4', 2.5], [6, 'C5', 2.5], [10, 'F5', 3.5], [14, 'E5', 2.5], [18, 'D5', 2.5], [21, 'C5', 3.5], [26, 'Bb4', 2.5], [29, 'A4', 2.5], [33, 'C5', 3], [37, 'F5', 5]];
  for (const [t, n, d] of mel) note(dry, hz(n), t, d, {...PIANO, gain: 0.15, d: 4});
  note(dry, hz('F5'), 34, 8, {...STRINGS, gain: 0.04, a: 3});
  const wet = reverb(dry, 0.45, 0.9, 45);
  const d = delay(wet, 0.6, 0.3, 0.12);
  fadeInOut(d, 2, 3);
  return master(d, 1.0);
};

const future = (): Buffer2 => {
  setSeed(88);
  const dry = new Buffer2(86);
  note(dry, hz('D1'), 0, 82, {...DRONE, a: 4, gain: 0.12});
  const prog = [['D3', 'F#3', 'A3'], ['A2', 'C#3', 'E3'], ['B2', 'D3', 'F#3'], ['G2', 'B2', 'D3']];
  for (let i = 0; i * 6 < 74; i++) {
    const t = i * 6;
    const c = prog[i % 4];
    const grow = Math.min(1, i / 7);
    chord(dry, c, t, 6.3, {...PAD, gain: 0.05 + 0.02 * grow, a: 1.5});
    chord(dry, c.map((n) => n.replace(/\d/, (d) => String(Number(d) + 1))), t, 6.3, {...STRINGS, gain: 0.03 + 0.04 * grow, a: 1.5});
    if (i >= 5) chord(dry, c, t, 6.3, {...CHOIR, gain: 0.04});
    if (i >= 7) {
      taiko(dry, t, 0.4, 60);
      taiko(dry, t + 3, 0.25, 60);
    }
    note(dry, hz(c[0].replace(/\d/, '2')), t, 5.5, {...BASS, gain: 0.1, cutoff: 260, a: 0.4});
  }
  // the title motif in D major — first statement gentle (piano), second full (strings + brass)
  const mel: Array<[number, string, number]> = [
    [14, 'D5', 2.5], [17, 'F#5', 2.5], [20, 'A5', 5], [26, 'G5', 2.5], [29, 'F#5', 2.5], [32, 'E5', 2.5], [35, 'D5', 4],
    [44, 'D5', 2.5], [47, 'F#5', 2.5], [50, 'A5', 5], [56, 'G5', 2.5], [59, 'F#5', 2.5], [62, 'E5', 2.5], [65, 'D5', 4],
    [70, 'A5', 2.5], [73, 'B5', 2.5], [76, 'D6', 6],
  ];
  for (const [t, n, d] of mel) {
    note(dry, hz(n), t, d, {...PIANO, gain: t < 44 ? 0.12 : 0.07, d: 5});
    if (t >= 44) note(dry, hz(n), t, d, {...STRINGS, gain: 0.08, unison: 5});
    if (t >= 56) note(dry, hz(n), t, d, {...BRASS, gain: 0.05, cutoff: 1100});
  }
  // final resolution (closing text)
  chord(dry, ['D3', 'F#3', 'A3', 'D4', 'F#4'], 74, 11, {...STRINGS, gain: 0.08, a: 1});
  chord(dry, ['D2', 'A2', 'D3'], 74, 11, {...BRASS, gain: 0.06, a: 0.5});
  chord(dry, ['D3', 'F#3', 'A3', 'D4'], 74, 11, {...CHOIR, gain: 0.05});
  taiko(dry, 74, 0.8, 55);
  const wet = reverb(dry, 0.38, 0.88, 35);
  fadeInOut(wet, 2, 6);
  return master(wet, 1.0);
};

// ---------- sound effects ----------

const sfx = (): Record<string, () => Buffer2> => ({
  'reaper-horn': () => {
    setSeed(101);
    const b = new Buffer2(5);
    reaperHorn(b, 0.05, 1, 3.4);
    return master(reverb(b, 0.3, 0.88, 20), 1);
  },
  'explosion-large': () => {
    setSeed(102);
    const b = new Buffer2(4.5);
    kick(b, 0, 1, 30);
    taiko(b, 0.02, 1, 40);
    sweep(b, 0, 2.6, 3000, 80, 0.8, 0.6);
    rumble(b, 0.1, 4, 0.5, 80);
    return master(reverb(b, 0.25, 0.85, 10), 1);
  },
  'explosion-small': () => {
    setSeed(103);
    const b = new Buffer2(1.6);
    kick(b, 0, 0.8, 50);
    sweep(b, 0, 0.9, 4000, 150, 0.7, 0.5);
    rumble(b, 0.05, 1.2, 0.3, 120);
    return master(b, 1);
  },
  'ma-shot': () => {
    setSeed(104);
    const b = new Buffer2(0.9);
    sweep(b, 0, 0.18, 9000, 800, 0.9, 0.3);
    kick(b, 0.01, 0.7, 70);
    tick(b, 0, 220, 0.5, 0.25);
    return master(b, 1);
  },
  'hma-charge': () => {
    setSeed(105);
    const b = new Buffer2(3.5);
    note(b, hz('A1'), 0, 3.2, {wave: 'saw', unison: 3, detune: 10, a: 0.5, d: 0.2, s: 1, r: 0.2, cutoff: 200, cutoffEnv: 3000, gain: 0.3});
    sweep(b, 0, 3.4, 100, 9000, 0.4, 1.4);
    for (let k = 0; k < 24; k++) tick(b, 0.2 + k * (0.12 - k * 0.003), 900 + k * 60, 0.12, 0.05);
    return master(b, 1);
  },
  'hma-shot': () => {
    setSeed(106);
    const b = new Buffer2(4);
    sweep(b, 0, 0.3, 12000, 600, 1, 0.3);
    kick(b, 0.02, 1, 28);
    taiko(b, 0.05, 1, 36);
    rumble(b, 0.1, 3.5, 0.5, 60);
    sweep(b, 0.3, 2.5, 1200, 60, 0.4, 0.8);
    return master(reverb(b, 0.25, 0.86, 10), 1);
  },
  'shield-impact': () => {
    setSeed(107);
    const b = new Buffer2(0.9);
    tick(b, 0, 1800, 0.5, 0.35);
    tick(b, 0.02, 2700, 0.3, 0.25);
    sweep(b, 0, 0.5, 6000, 1500, 0.4, 0.5);
    return master(reverb(b, 0.3, 0.8, 5), 1);
  },
  'beam': () => {
    setSeed(108);
    const b = new Buffer2(3.5);
    note(b, hz('F#5'), 0, 2.8, {wave: 'saw', unison: 4, detune: 30, a: 0.08, d: 0.2, s: 0.9, r: 0.4, cutoff: 3000, gain: 0.25, noise: 0.3});
    note(b, hz('C2'), 0, 2.8, {wave: 'square', a: 0.05, d: 0.2, s: 0.9, r: 0.4, cutoff: 500, gain: 0.3, sub: 0.7});
    rumble(b, 0, 3.2, 0.4, 90);
    return master(b, 1);
  },
  'radio-click': () => {
    setSeed(109);
    const b = new Buffer2(0.25);
    tick(b, 0, 3000, 0.4, 0.03);
    sweep(b, 0.01, 0.12, 4000, 2500, 0.2, 1);
    return master(b, 1);
  },
  'ui-beep': () => {
    setSeed(110);
    const b = new Buffer2(0.35);
    note(b, 1760, 0, 0.08, {wave: 'sine', a: 0.003, d: 0.05, s: 0.3, r: 0.1, gain: 0.4});
    note(b, 2349, 0.1, 0.1, {wave: 'sine', a: 0.003, d: 0.05, s: 0.3, r: 0.12, gain: 0.3});
    return master(b, 1);
  },
  'ui-alert': () => {
    setSeed(111);
    const b = new Buffer2(0.8);
    for (let k = 0; k < 3; k++) note(b, 1245, k * 0.22, 0.12, {wave: 'square', a: 0.003, d: 0.08, s: 0.2, r: 0.08, cutoff: 3000, gain: 0.25});
    return master(b, 1);
  },
  'engine-rumble': () => {
    setSeed(112);
    const b = new Buffer2(12);
    rumble(b, 0, 12, 0.5, 70);
    note(b, 55, 0, 11.5, {wave: 'sine', a: 0.5, d: 0.1, s: 1, r: 0.5, gain: 0.25, sub: 0.5});
    fadeInOut(b, 0.5, 0.5);
    return master(b, 1);
  },
  'hull-breach': () => {
    setSeed(113);
    const b = new Buffer2(2.5);
    note(b, 70, 0, 1.8, {wave: 'saw', unison: 3, detune: 40, a: 0.1, d: 0.5, s: 0.6, r: 0.6, cutoff: 600, gain: 0.3, pitchEnv: -5, pitchEnvTime: 1.5});
    tick(b, 0, 400, 0.6, 0.4);
    rumble(b, 0, 2.2, 0.3, 100);
    return master(reverb(b, 0.3, 0.85, 15), 1);
  },
  'relay-jump': () => {
    setSeed(114);
    const b = new Buffer2(2.5);
    sweep(b, 0, 1.2, 300, 9000, 0.6, 1.5);
    note(b, hz('E4'), 0.6, 1.2, {wave: 'sine', a: 0.1, d: 0.3, s: 0.5, r: 0.6, gain: 0.3, fm: 3, fmRatio: 1.5});
    kick(b, 1.1, 0.7, 40);
    return master(reverb(b, 0.3, 0.85, 10), 1);
  },
  'bridge-ambience': () => {
    setSeed(115);
    const b = new Buffer2(12);
    rumble(b, 0, 12, 0.18, 60);
    note(b, 110, 0, 11.5, {wave: 'tri', a: 0.5, d: 0.1, s: 1, r: 0.5, cutoff: 300, gain: 0.08});
    for (let t = 0.5; t < 11.5; t += 0.9 + rnd() * 1.4) note(b, 1200 + rnd() * 1200, t, 0.05, {wave: 'sine', a: 0.003, d: 0.04, s: 0.2, r: 0.05, gain: 0.05});
    fadeInOut(b, 0.3, 0.3);
    return master(b, 1);
  },
  'reaper-interior': () => {
    setSeed(116);
    const b = new Buffer2(12);
    note(b, hz('Eb1'), 0, 11.5, {...DRONE, a: 0.5, gain: 0.3});
    rumble(b, 0, 12, 0.15, 50);
    for (let t = 0.3; t < 11.5; t += 0.2 + rnd() * 1.1) tick(b, t, 500 + rnd() * 2000, 0.1 + rnd() * 0.1, 0.04 + rnd() * 0.1);
    fadeInOut(b, 0.3, 0.3);
    return master(reverb(b, 0.35, 0.9, 30), 1);
  },
});

const CUES: Record<string, () => Buffer2> = {
  opening,
  'prepared-galaxy': preparedGalaxy,
  catalyst,
  'long-war': longWar,
  'reapers-respond': reapersRespond,
  'final-harvest': finalHarvest,
  victory,
  future,
};

const wanted = process.argv.slice(2);
const t0 = Date.now();
for (const [name, fn] of Object.entries(CUES)) {
  if (wanted.length && !wanted.includes(name)) continue;
  writeMp3(name, fn(), OUT_MUSIC);
}
for (const [name, fn] of Object.entries(sfx())) {
  if (wanted.length && !wanted.includes(name) && !wanted.includes('sfx')) continue;
  writeMp3(name, fn(), OUT_SFX);
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
