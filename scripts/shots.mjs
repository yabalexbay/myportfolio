// Full page screenshots at the four required widths, in dark and light.
// Expects the static server on PORT (npm run serve). Output: docs/screenshots/.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = `http://localhost:${process.env.PORT || 4173}/`;
const WIDTHS = [375, 768, 1440, 1920];
const THEMES = ['dark', 'light'];
const OUT = process.env.SHOTS_DIR || 'docs/screenshots';

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 1000 }, colorScheme: theme, reducedMotion: 'reduce', deviceScaleFactor: width < 768 ? 2 : 1 });
      const page = await ctx.newPage();
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${OUT}/home-${width}-${theme}.png`, fullPage: true });
      await page.screenshot({ path: `${OUT}/hero-${width}-${theme}.png` });
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`saved ${WIDTHS.length * THEMES.length * 2} screenshots to ${OUT}`);
