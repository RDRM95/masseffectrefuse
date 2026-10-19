import {expect, test} from '@playwright/test';

/**
 * End-to-end checks for the GitHub Pages player. The web server (see
 * playwright.config.ts) serves dist-site/ with a short test clip at
 * media/test.webm so playback can be verified without the full film.
 */
const url = '/?src=media/test.webm&trailer=media/test.webm';

test('player loads with title, controls and eight chapters', async ({page}) => {
  await page.goto(url);
  await expect(page).toHaveTitle(/MASS EFFECT: REFUSE/);
  await page.waitForFunction(() => (window as unknown as {__refuseReady?: boolean}).__refuseReady === true);
  await expect(page.locator('#chapterList li')).toHaveCount(8);
  for (const id of ['play', 'restart', 'mute', 'cc', 'trailer', 'fullscreen', 'progress']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#runtime')).toHaveText(/\d+:\d\d/);
  await expect(page.locator('.marker')).toHaveCount(7);
});

test('subtitle track and chapter data are served', async ({page, request}) => {
  const vtt = await request.get('/generated/film.vtt');
  expect(vtt.ok()).toBeTruthy();
  expect((await vtt.text()).startsWith('WEBVTT')).toBeTruthy();
  const chapters = await request.get('/generated/chapters.json');
  expect(chapters.ok()).toBeTruthy();
  const data = await chapters.json();
  expect(data.chapters).toHaveLength(8);
  expect(data.totalSeconds).toBeGreaterThan(360);
  await page.goto(url);
  await expect(page.locator('#subs')).toHaveAttribute('src', /film\.vtt/);
});

test('play, pause, restart and chapter seeking work on the test clip', async ({page}) => {
  await page.goto(url);
  await page.waitForFunction(() => (window as unknown as {__refuseReady?: boolean}).__refuseReady === true);
  await page.click('#bigplay');
  await page.waitForFunction(() => !(document.getElementById('video') as HTMLVideoElement).paused);
  await expect(page.locator('#player')).toHaveClass(/playing/);
  await page.click('#play');
  await page.waitForFunction(() => (document.getElementById('video') as HTMLVideoElement).paused);
  // chapter selection seeks (clamped to the short clip length, but must not throw)
  await page.click('#chapterList li:nth-child(2) button');
  await page.waitForFunction(() => (document.getElementById('video') as HTMLVideoElement).currentTime > 0);
  await page.click('#restart');
  await page.waitForFunction(() => (document.getElementById('video') as HTMLVideoElement).currentTime < 1);
  // mute / subtitles toggles
  await page.click('#mute');
  await expect(page.locator('#player')).toHaveClass(/muted/);
  await page.click('#cc');
  await expect(page.locator('#cc')).toHaveAttribute('aria-pressed', 'false');
  await page.click('#trailer');
  await expect(page.locator('#modeTag')).toHaveText('TRAILER');
});

test('mobile layout has no horizontal overflow', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(url);
  await page.waitForFunction(() => (window as unknown as {__refuseReady?: boolean}).__refuseReady === true);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('#play')).toBeVisible();
  await expect(page.locator('#fullscreen')).toBeVisible();
  await expect(page.locator('#chapterList')).toBeVisible();
});
