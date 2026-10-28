import {describe, expect, it} from 'vitest';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {CHAPTERS, TOTAL_SECONDS, chapterStartFrame, chapterFrames, FPS} from '../src/timeline/chapters';
import {CUES_CH1} from '../src/compositions/PreparedGalaxy';
import {CUES_CH2} from '../src/compositions/Catalyst';
import {CUES_CH3} from '../src/compositions/LongWar';
import {CUES_CH4} from '../src/compositions/ReapersRespond';
import {CUES_CH5} from '../src/compositions/FinalHarvest';
import {CUES_CH6} from '../src/compositions/Victory';
import {CUES_CH7} from '../src/compositions/Future';
import {toVtt} from '../src/subtitles/Subtitles';

const root = path.resolve(__dirname, '..');
const CUES = {
  'prepared-galaxy': CUES_CH1,
  catalyst: CUES_CH2,
  'long-war': CUES_CH3,
  'reapers-respond': CUES_CH4,
  'final-harvest': CUES_CH5,
  victory: CUES_CH6,
  future: CUES_CH7,
} as const;

describe('timeline', () => {
  it('runs between six and ten minutes', () => {
    expect(TOTAL_SECONDS).toBeGreaterThanOrEqual(6 * 60);
    expect(TOTAL_SECONDS).toBeLessThanOrEqual(10 * 60);
  });
  it('has eight chapters in order with positive durations', () => {
    expect(CHAPTERS).toHaveLength(8);
    CHAPTERS.forEach((c, i) => {
      expect(c.number).toBe(i);
      expect(c.durationSeconds).toBeGreaterThan(0);
    });
  });
  it('chapter start frames are contiguous', () => {
    let f = 0;
    for (const c of CHAPTERS) {
      expect(chapterStartFrame(c.id)).toBe(f);
      f += chapterFrames(c);
    }
    expect(f).toBe(Math.round(TOTAL_SECONDS * FPS));
  });
});

describe('audio assets', () => {
  it('every chapter has its music cue rendered', () => {
    for (const c of CHAPTERS) {
      expect(existsSync(path.join(root, 'public/audio/music', c.music)), c.music).toBe(true);
    }
  });
  it('every sound effect referenced by a composition exists', () => {
    const dir = path.join(root, 'src/compositions');
    const referenced = new Set<string>();
    for (const f of readdirSync(dir)) {
      const src = readFileSync(path.join(dir, f), 'utf8');
      for (const m of src.matchAll(/<Sfx file="([^"]+)"/g)) referenced.add(m[1]);
    }
    expect(referenced.size).toBeGreaterThan(5);
    for (const f of referenced) expect(existsSync(path.join(root, 'public/audio/sfx', f)), f).toBe(true);
  });
  it('fonts are present with their licences', () => {
    for (const f of ['Michroma-Regular.ttf', 'Exo2-Variable.ttf', 'Jura-Variable.ttf', 'Rajdhani-Medium.ttf', 'OFL-michroma.txt']) {
      expect(existsSync(path.join(root, 'public/fonts', f)), f).toBe(true);
    }
  });
});

describe('subtitles', () => {
  it('cues fall inside their chapter and do not run backwards', () => {
    for (const [id, cues] of Object.entries(CUES)) {
      const chapter = CHAPTERS.find((c) => c.id === id)!;
      let last = 0;
      for (const cue of cues) {
        expect(cue.end, `${id}: ${cue.text}`).toBeGreaterThan(cue.start);
        expect(cue.end, `${id}: ${cue.text}`).toBeLessThanOrEqual(chapter.durationSeconds);
        expect(cue.start, `${id}: ${cue.text} overlaps the previous cue`).toBeGreaterThanOrEqual(last - 0.01);
        last = cue.end;
      }
    }
  });
  it('exports valid WebVTT', () => {
    const vtt = toVtt(CUES_CH2, 10);
    expect(vtt.startsWith('WEBVTT')).toBe(true);
    expect(vtt).toContain('-->');
    expect(vtt).toContain('<v CATALYST>');
  });
  it('no subtitle line is too long to read', () => {
    for (const cues of Object.values(CUES)) {
      for (const cue of cues) {
        const seconds = cue.end - cue.start;
        const wordsPerSecond = cue.text.split(/\s+/).length / seconds;
        expect(wordsPerSecond, cue.text).toBeLessThan(5.5);
      }
    }
  });
});
