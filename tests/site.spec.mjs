import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { DASH_RE, BANNED_RE } from '../scripts/lib.mjs';

// Typed from the CONTENT section of PORTFOLIO_BRIEF.md, not read from
// data/profile.json, so a typo in the data file fails here.
const EXPECTED = [
  'Yabetse Tesfaye',
  'Backend Software Engineer',
  'I build backend services and APIs in Python, FastAPI, and PostgreSQL, with a focus on application security and maintainable architecture.',
  'AI Infrastructure and DevOps Training Engineer', 'Revelo', 'Feb, 2026 to Oct, 2026', '9 mos',
  'LLM Trainer and AI Data Annotator', 'Turing', 'Apr, 2025 to Feb, 2026', '11 mos',
  'FlutterFlow Mobile Application Developer', 'Upwork', 'Dec, 2024 to Apr, 2025', '5 mos',
  'Backend Engineer and Project Co Lead', 'AfroChat', 'Jan, 2023 to Dec, 2024', '2 yrs',
  'Full Stack Engineer', 'Eskalate', 'Jan, 2021 to Jan, 2023', '2 yrs 1 mo',
  'Junior Full Stack Engineer', 'Nov, 2019 to Jan, 2021', '1 yr 3 mos', 'Addis Ababa',
  'American College of Technology (ACT)', 'Bachelor of Software Engineering', 'Oct, 2018 to Jul, 2022', 'GPA 3.82',
  'A2SV, Africa to Silicon Valley', 'Software Engineering Program, Data Structures and Algorithms', 'Jan, 2022 to Mar, 2023',
  'ImmuStore DB', 'Nodechain Lab', 'RustV OS Lab', 'Litestar', 'More on GitHub',
  'Open to backend and full stack engineering roles.',
  'yabtesfu@gmail.com',
  '© 2026 Yabetse Tesfaye',
];

// Everything a visitor or a link preview can read.
async function readableText(page) {
  return page.evaluate(() => {
    const attrs = [...document.querySelectorAll('[alt], [aria-label], [title]')]
      .flatMap((el) => ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a)).filter(Boolean));
    const metas = [...document.querySelectorAll('meta[name="description"], meta[property^="og:"][property$="title"], meta[property$="description"], meta[property$="alt"], meta[name^="twitter:"][name$="title"], meta[name$="description"]')]
      .map((m) => m.content);
    return [document.title, document.body.innerText, ...attrs, ...metas].join('\n');
  });
}

for (const theme of ['dark', 'light']) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });

    test('visible text has no dashes or banned terms', async ({ page }) => {
      await page.goto('/');
      const lines = (await readableText(page)).split('\n');
      expect(lines.filter((l) => DASH_RE.test(l))).toEqual([]);
      expect(lines.filter((l) => BANNED_RE.test(l))).toEqual([]);
    });

    test('axe finds no violations', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    });

    test('theme matches the system setting', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    });
  });
}

test('every CONTENT title and date appears exactly as written', async ({ page }) => {
  await page.goto('/');
  const text = await page.evaluate(() => document.body.innerText);
  const missing = EXPECTED.filter((s) => !text.includes(s));
  expect(missing).toEqual([]);
});

test('experience is listed newest first', async ({ page }) => {
  await page.goto('/');
  const starts = await page.locator('.role .dates time:first-child').evaluateAll((els) => els.map((e) => e.getAttribute('datetime')));
  expect(starts).toEqual([...starts].sort().reverse());
});

test('removed content stays removed', async ({ page }) => {
  await page.goto('/');
  const text = await page.evaluate(() => document.documentElement.outerHTML);
  for (const s of ['Amazon Nova', 'improving platform security', 'Adwa', 'Alemu', 'Instagram', 'WhatsApp', 'Telegram', 'Blog', 'Mar 2026', 'Sep 2024']) {
    expect(text, s).not.toContain(s);
  }
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(scroll).toBeLessThanOrEqual(client);
  });
}

test('resume download serves the PDF', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.getByRole('link', { name: 'Download Resume' }).getAttribute('href');
  const res = await request.get(href);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toBe('application/pdf');
});

test('hero buttons and nav are in the briefed order', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.actions a')).toHaveText(['View Projects', 'Download Resume', 'GitHub', 'LinkedIn']);
  await expect(page.locator('.site-nav a')).toHaveText(['Projects', 'Experience', 'About', 'Contact']);
  await expect(page.locator('.project')).toHaveCount(4);
  await expect(page.locator('.tech img')).toHaveCount(12);
});

test('page makes no third party requests', async ({ page }) => {
  const hosts = new Set();
  page.on('request', (r) => hosts.add(new URL(r.url()).host));
  await page.goto('/', { waitUntil: 'networkidle' });
  expect([...hosts]).toEqual(['localhost:4174']);
});

test('theme toggle switches and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.locator('.theme-toggle');
  await expect(toggle).toHaveAccessibleName('Switch to light theme');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAccessibleName('Switch to dark theme');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('particles stop under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const anim = await page.locator('.particles span').first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('none');
});

test('particle positions are identical across builds', async () => {
  const html = readFileSync('index.html', 'utf8');
  expect(html).not.toMatch(/Math\.random/);
  expect((html.match(/<div class="particles"[^]*?<\/div>/) || [''])[0]).toMatch(/left:\d/);
});

test('structured data describes the person', async ({ page }) => {
  await page.goto('/');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(ld).toMatchObject({ '@type': 'Person', name: 'Yabetse Tesfaye', jobTitle: 'Backend Software Engineer' });
  expect(ld.sameAs).toEqual(['https://www.linkedin.com/in/yabetse-tesfaye/', 'https://github.com/yabtesfu']);
});

test('resume text matches the site and is clean', async () => {
  const text = readFileSync('docs/evidence/resume-rendered.txt', 'utf8');
  for (const line of text.split('\n')) {
    expect(DASH_RE.test(line), line).toBe(false);
    expect(BANNED_RE.test(line), line).toBe(false);
  }
  for (const s of ['Backend Software Engineer', 'yabtesfu@gmail.com', 'AI Infrastructure and DevOps Training Engineer', 'Feb, 2026 to Oct, 2026',
    'Full Stack Engineer', 'Jan, 2021 to Jan, 2023', 'Backend Engineer and Project Co Lead', 'Oct, 2018 to Jul, 2022', 'Aug, 2024']) {
    expect(text, s).toContain(s);
  }
  expect(text).not.toMatch(/pgxmock|GAN Observatory|Internal Tooling|Sep, 2018|Jul, 2024/);
});
