/**
 * Master timeline for MASS EFFECT: REFUSE.
 *
 * Every chapter is an independently renderable composition. The full film
 * composition concatenates them in this order. Durations are in seconds so the
 * shot list and the subtitle files can reason about real time; frame counts
 * are derived from FPS.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type ChapterId =
  | 'opening'
  | 'prepared-galaxy'
  | 'catalyst'
  | 'long-war'
  | 'reapers-respond'
  | 'final-harvest'
  | 'victory'
  | 'future';

export interface ChapterDef {
  id: ChapterId;
  /** Remotion composition id (PascalCase). */
  compositionId: string;
  title: string;
  /** Chapter card number shown in the player. 0 = prologue. */
  number: number;
  durationSeconds: number;
  /** Music cue file (under public/audio/music). */
  music: string;
}

export const CHAPTERS: ChapterDef[] = [
  {id: 'opening', compositionId: 'Opening', title: 'The Cycle', number: 0, durationSeconds: 78, music: 'opening.mp3'},
  {id: 'prepared-galaxy', compositionId: 'PreparedGalaxy', title: 'The Prepared Galaxy', number: 1, durationSeconds: 84, music: 'prepared-galaxy.mp3'},
  {id: 'catalyst', compositionId: 'Catalyst', title: 'The Catalyst', number: 2, durationSeconds: 96, music: 'catalyst.mp3'},
  {id: 'long-war', compositionId: 'LongWar', title: 'The Long War', number: 3, durationSeconds: 66, music: 'long-war.mp3'},
  {id: 'reapers-respond', compositionId: 'ReapersRespond', title: 'The Reapers Respond', number: 4, durationSeconds: 36, music: 'reapers-respond.mp3'},
  {id: 'final-harvest', compositionId: 'FinalHarvest', title: 'The Final Harvest', number: 5, durationSeconds: 84, music: 'final-harvest.mp3'},
  {id: 'victory', compositionId: 'Victory', title: 'Victory', number: 6, durationSeconds: 42, music: 'victory.mp3'},
  {id: 'future', compositionId: 'Future', title: 'The Future', number: 7, durationSeconds: 66, music: 'future.mp3'},
];

export const secondsToFrames = (s: number): number => Math.round(s * FPS);

export const chapterFrames = (c: ChapterDef): number => secondsToFrames(c.durationSeconds);

export const TOTAL_SECONDS = CHAPTERS.reduce((a, c) => a + c.durationSeconds, 0);
export const TOTAL_FRAMES = CHAPTERS.reduce((a, c) => a + chapterFrames(c), 0);

/** Start frame of each chapter in the combined film. */
export const chapterStartFrame = (id: ChapterId): number => {
  let f = 0;
  for (const c of CHAPTERS) {
    if (c.id === id) return f;
    f += chapterFrames(c);
  }
  throw new Error(`Unknown chapter ${id}`);
};

export const chapterById = (id: ChapterId): ChapterDef => {
  const c = CHAPTERS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown chapter ${id}`);
  return c;
};

export const formatTimecode = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};
