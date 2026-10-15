import React from 'react';
import type {ChapterDef, ChapterId} from '../timeline/chapters';
import {CHAPTERS} from '../timeline/chapters';
import {Opening} from './Opening';
import {Placeholder} from './Placeholder';

/**
 * Maps chapter ids to their React components. Chapters still in production
 * fall back to the Placeholder card so the full film always assembles.
 */
const BUILT: Partial<Record<ChapterId, React.FC>> = {
  opening: Opening,
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
