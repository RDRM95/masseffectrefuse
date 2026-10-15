import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

// Use the pre-installed Chromium headless shell when available (cloud sessions),
// otherwise Remotion downloads its own compatible browser.
const headlessShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
} else if (existsSync(headlessShell)) {
  Config.setBrowserExecutable(headlessShell);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY ?? 3));
Config.setPublicDir('public');
Config.setEntryPoint('src/index.ts');
