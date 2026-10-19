/**
 * Exports data the web player needs from the production source of truth:
 *  - site/generated/chapters.json   chapter list with start times
 *  - site/generated/film.vtt        full-film subtitles (chapter offsets applied)
 *  - site/generated/<chapter>.vtt   per-chapter subtitles
 *
 * Usage: npx tsx scripts/export-site-data.ts
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {CHAPTERS, TOTAL_SECONDS} from '../src/timeline/chapters';
import {toVtt, Cue} from '../src/subtitles/Subtitles';
import {CUES_CH1} from '../src/compositions/PreparedGalaxy';
import {CUES_CH2} from '../src/compositions/Catalyst';
import {CUES_CH3} from '../src/compositions/LongWar';
import {CUES_CH4} from '../src/compositions/ReapersRespond';
import {CUES_CH5} from '../src/compositions/FinalHarvest';
import {CUES_CH6} from '../src/compositions/Victory';
import {CUES_CH7} from '../src/compositions/Future';

export const CUES_BY_CHAPTER: Record<string, Cue[]> = {
  opening: [],
  'prepared-galaxy': CUES_CH1,
  catalyst: CUES_CH2,
  'long-war': CUES_CH3,
  'reapers-respond': CUES_CH4,
  'final-harvest': CUES_CH5,
  victory: CUES_CH6,
  future: CUES_CH7,
};

const out = path.resolve('site/generated');
mkdirSync(out, {recursive: true});

let start = 0;
const chapters = CHAPTERS.map((c) => {
  const entry = {id: c.id, number: c.number, title: c.title, start, duration: c.durationSeconds, compositionId: c.compositionId};
  start += c.durationSeconds;
  return entry;
});
writeFileSync(path.join(out, 'chapters.json'), JSON.stringify({totalSeconds: TOTAL_SECONDS, chapters}, null, 2));

const all: Cue[] = [];
for (const c of chapters) {
  const cues = CUES_BY_CHAPTER[c.id] ?? [];
  writeFileSync(path.join(out, `${c.id}.vtt`), toVtt(cues));
  for (const cue of cues) all.push({...cue, start: cue.start + c.start, end: cue.end + c.start});
}
writeFileSync(path.join(out, 'film.vtt'), toVtt(all));
console.log(`wrote ${chapters.length} chapters, ${all.length} cues, total ${TOTAL_SECONDS}s`);
