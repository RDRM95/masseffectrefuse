import React from 'react';
import type {ChapterDef, ChapterId} from '../timeline/chapters';
import {CHAPTERS} from '../timeline/chapters';
import {Opening} from './Opening';
import {PreparedGalaxy} from './PreparedGalaxy';
import {Catalyst} from './Catalyst';
import {LongWar} from './LongWar';
import {ReapersRespond} from './ReapersRespond';
import {FinalHarvest} from './FinalHarvest';
import {Victory} from './Victory';
import {Future} from './Future';
import {Placeholder} from './Placeholder';

/**
 * Maps chapter ids to their React components. Chapters still in production
 * fall back to the Placeholder card so the full film always assembles.
 */
const BUILT: Partial<Record<ChapterId, React.FC>> = {
  opening: Opening,
  'prepared-galaxy': PreparedGalaxy,
  catalyst: Catalyst,
  'long-war': LongWar,
  'reapers-respond': ReapersRespond,
  'final-harvest': FinalHarvest,
  victory: Victory,
  future: Future,
};

export const chapterComponent = (c: ChapterDef): React.FC => {
  const built = BUILT[c.id];
  if (built) return built;
  const P: React.FC = () => <Placeholder chapter={c} />;
  P.displayName = `Placeholder(${c.compositionId})`;
  return P;
};

export const isBuilt = (id: ChapterId): boolean => Boolean(BUILT[id]);

export const builtChapters = (): ChapterDef[] => CHAPTERS.filter((c) => isBuilt(c.id));
