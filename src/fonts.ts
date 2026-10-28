import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Loads the production's open-licensed fonts (SIL OFL) from /public/fonts.
 * Fonts are loaded through the FontFace API so Remotion waits for them
 * before capturing a frame.
 */
const FONT_FILES: Array<{family: string; file: string; weight?: string}> = [
  {family: 'Michroma', file: 'fonts/Michroma-Regular.ttf', weight: '400'},
  {family: 'Exo 2', file: 'fonts/Exo2-Variable.ttf', weight: '100 900'},
  {family: 'Jura', file: 'fonts/Jura-Variable.ttf', weight: '300 700'},
  {family: 'Rajdhani', file: 'fonts/Rajdhani-Regular.ttf', weight: '400'},
  {family: 'Rajdhani', file: 'fonts/Rajdhani-Medium.ttf', weight: '500'},
  {family: 'Rajdhani', file: 'fonts/Rajdhani-SemiBold.ttf', weight: '600'},
];

let loaded: Promise<void> | null = null;

export const loadFonts = (): Promise<void> => {
  if (loaded) return loaded;
  if (typeof document === 'undefined') {
    loaded = Promise.resolve();
    return loaded;
  }
  const handle = delayRender('Loading fonts');
  loaded = Promise.all(
    FONT_FILES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {weight: f.weight});
      const result = await face.load();
      document.fonts.add(result);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      // Never block a render on a font: fall back to system fonts.
      console.error('Font load failed', err);
      continueRender(handle);
    });
  return loaded;
};
