// Captures desktop and mobile screenshots of the built web player for visual QA.
// Usage: node scripts/serve-static.mjs dist-site 4178 &  node scripts/qa/site-screenshot.mjs
import {chromium} from '@playwright/test';
import {existsSync} from 'node:fs';
const local = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch(existsSync(local) ? {executablePath: local} : {});
const url = process.env.SITE_URL ?? 'http://127.0.0.1:4178/?src=media/test.webm';
for (const [name, viewport] of [['desktop', {width: 1440, height: 1000}], ['mobile', {width: 390, height: 844}]]) {
  const p = await b.newPage({viewport});
  await p.goto(url);
  await p.waitForFunction(() => window.__refuseReady === true);
  await p.screenshot({path: `frames/site-${name}.png`});
  console.log('wrote', `frames/site-${name}.png`);
}
await b.close();
