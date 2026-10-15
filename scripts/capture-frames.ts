/**
 * QA tool: render still frames from representative points of a composition so
 * the actual animation can be inspected (not just the code).
 *
 * Usage: npx tsx scripts/capture-frames.ts <CompositionId> <frame,frame,...|every:N> [outDir]
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const [compId = 'Opening', framesArg = 'every:150', outDirArg = 'frames'] = process.argv.slice(2);
const headless = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (existsSync(headless) ? headless : undefined);

const main = async () => {
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
  const composition = await selectComposition({serveUrl, id: compId, inputProps: {noAudio: true}, browserExecutable, chromiumOptions: {gl: 'angle'}});
  let frames: number[] = [];
  if (framesArg.startsWith('every:')) {
    const step = Number(framesArg.slice(6));
    for (let f = 0; f < composition.durationInFrames; f += step) frames.push(f);
    frames.push(composition.durationInFrames - 1);
  } else {
    frames = framesArg.split(',').map(Number);
  }
  const outDir = path.resolve(outDirArg, compId);
  mkdirSync(outDir, {recursive: true});
  for (const frame of frames) {
    const output = path.join(outDir, `${compId}-${String(frame).padStart(5, '0')}.jpg`);
    await renderStill({composition, serveUrl, output, frame, imageFormat: 'jpeg', jpegQuality: 88, inputProps: {noAudio: true}, browserExecutable, chromiumOptions: {gl: 'angle'}});
    console.log('frame', frame, '->', output);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
