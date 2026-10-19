import {defineConfig, devices} from '@playwright/test';
import {existsSync} from 'node:fs';

// Prefer the pre-installed Chromium in cloud sessions; CI installs its own.
const localChromium = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? (existsSync(localChromium) ? localChromium : undefined);

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4178',
    ...devices['Desktop Chrome'],
    launchOptions: executablePath ? {executablePath} : undefined,
  },
  webServer: {
    command: 'node scripts/serve-static.mjs dist-site 4178',
    url: 'http://127.0.0.1:4178/generated/chapters.json',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
