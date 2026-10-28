import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ChapterCard} from '../effects/TextCards';
import {Grade} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Music} from '../audio/Music';
import type {ChapterDef} from '../timeline/chapters';
import {chapterFrames} from '../timeline/chapters';

/**
 * Temporary stand-in for a chapter that has not yet been produced: a chapter
 * card over a starfield with the chapter's music cue. Replaced chapter by
 * chapter as production advances (see PRODUCTION_ROADMAP.md).
 */
export const Placeholder: React.FC<{chapter: ChapterDef}> = ({chapter}) => {
  const total = chapterFrames(chapter);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file={chapter.music} />
      <Starfield seed={chapter.id} brightness={0.5} />
      <ChapterCard number={chapter.number} title={chapter.title} from={20} to={total - 20} />
      <Grade />
    </AbsoluteFill>
  );
};
