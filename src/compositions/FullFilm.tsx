import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CHAPTERS, chapterFrames} from '../timeline/chapters';
import {chapterComponent} from './registry';

/** The complete film: every chapter in order, back to back. */
export const FullFilm: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {CHAPTERS.map((c) => {
        const Comp = chapterComponent(c);
        const start = from;
        const dur = chapterFrames(c);
        from += dur;
        return (
          <Sequence key={c.id} from={start} durationInFrames={dur} name={c.title}>
            <Comp />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
