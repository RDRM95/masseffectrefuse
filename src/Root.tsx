import React, {useEffect} from 'react';
import {Composition, Folder} from 'remotion';
import {CHAPTERS, chapterFrames, FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timeline/chapters';
import {chapterComponent} from './compositions/registry';
import {FullFilm} from './compositions/FullFilm';
import {Trailer, TRAILER_SECONDS} from './compositions/Trailer';
import {loadFonts} from './fonts';

export const RemotionRoot: React.FC = () => {
  useEffect(() => {
    loadFonts();
  }, []);
  return (
    <>
      <Composition id="FullFilm" component={FullFilm} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Trailer" component={Trailer} durationInFrames={TRAILER_SECONDS * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Folder name="Chapters">
        {CHAPTERS.map((c) => (
          <Composition key={c.id} id={c.compositionId} component={chapterComponent(c)} durationInFrames={chapterFrames(c)} fps={FPS} width={WIDTH} height={HEIGHT} />
        ))}
      </Folder>
    </>
  );
};
