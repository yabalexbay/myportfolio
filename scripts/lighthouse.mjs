// Lighthouse, mobile and desktop, against the local static server (npm run serve).
// Uses Playwright's Chromium so no system Chrome is needed. Reports to docs/evidence/.
import { writeFileSync } from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const URL = `http://localhost:${process.env.PORT || 4173}/`;
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
let failed = false;
try {
  for (const formFactor of ['mobile', 'desktop']) {
    const config = formFactor === 'desktop'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : undefined;
    const { lhr } = await lighthouse(URL, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
    const scores = Object.fromEntries(Object.values(lhr.categories).map((c) => [c.title, Math.round(c.score * 100)]));
    writeFileSync(`docs/evidence/lighthouse-${formFactor}.json`, JSON.stringify(lhr, null, 1));
    console.log(formFactor, scores, `CLS ${lhr.audits['cumulative-layout-shift'].displayValue}`, `LCP ${lhr.audits['largest-contentful-paint'].displayValue}`);
    if (Object.values(scores).some((s) => s < 95)) failed = true;
  }
} finally {
  await chrome.kill();
}
if (failed) { console.error('a category scored below 95'); process.exit(1); }
