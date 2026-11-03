import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { DASH_RE, BANNED_RE } from '../scripts/lib.mjs';

// Typed from the CONTENT section of PORTFOLIO_BRIEF.md, not read from
// data/profile.json, so a typo in the data file fails here.
const EXPECTED = [
  'Yabetse', 'Tesfaye',
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

// Most tests start after the intro has been seen, the way a returning visitor sees the page.
async function skipIntro(page) {
  await page.addInitScript(() => sessionStorage.setItem('folio-intro', 'seen'));
}

// Reveal every section, as if the visitor had scrolled through, so checks see the real colors.
async function revealAll(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal, .section-head').forEach((el) => el.classList.add('visible'));
    document.querySelectorAll('[data-stagger]').forEach((el) => el.classList.add('shown'));
    document.querySelectorAll('.timeline').forEach((el) => el.classList.add('drawn'));
  });
  await page.waitForTimeout(1200);
}

// Everything a visitor or a link preview can read.
async function readableText(page) {
  return page.evaluate(() => {
    const attrs = [...document.querySelectorAll('[alt], [aria-label], [title], [data-label], [data-label-light]')]
      .flatMap((el) => ['alt', 'aria-label', 'title', 'data-label', 'data-label-light', 'data-label-dark', 'data-label-system'].map((a) => el.getAttribute(a)).filter(Boolean));
    const metas = [...document.querySelectorAll('meta[name="description"], meta[property$="title"], meta[property$="description"], meta[property$="alt"], meta[name$="title"], meta[name$="description"]')]
      .map((m) => m.content);
    const stages = [...document.getElementById('pre-stages').content.querySelectorAll('span')].map((s) => s.textContent);
    const preloader = document.getElementById('preloader').textContent;
    return [document.title, document.body.innerText, preloader, ...stages, ...attrs, ...metas].join('\n');
  });
}

for (const theme of ['dark', 'light']) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });
    test.beforeEach(async ({ page }) => skipIntro(page));

    test('visible text has no dashes or banned terms', async ({ page }) => {
      await page.goto('/');
      const lines = (await readableText(page)).split('\n');
      expect(lines.filter((l) => DASH_RE.test(l))).toEqual([]);
      expect(lines.filter((l) => BANNED_RE.test(l))).toEqual([]);
    });

    test('axe finds no violations', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await revealAll(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    });

    test('theme follows the system setting', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    });
  });
}

test.describe('content and layout', () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test('every CONTENT title and date appears exactly as written', async ({ page }) => {
    await page.goto('/');
    const text = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
    expect(EXPECTED.filter((s) => !text.includes(s))).toEqual([]);
  });

  test('experience is listed newest first', async ({ page }) => {
    await page.goto('/');
    const starts = await page.locator('.experience-section .exp-period time:first-child').evaluateAll((els) => els.map((e) => e.getAttribute('datetime')));
    expect(starts).toHaveLength(6);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  test('removed content stays removed', async ({ page }) => {
    await page.goto('/');
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    for (const s of ['Amazon Nova', 'improving platform security', 'Adwa', 'Alemu', 'Instagram', 'WhatsApp', 'Telegram', 'Blog', 'Mar 2026', 'Sep 2024', 'Sinoda', 'Kuraztech']) {
      expect(html, s).not.toContain(s);
    }
  });

  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await revealAll(page);
      const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(scroll).toBeLessThanOrEqual(client);
    });
  }

  test('mobile menu opens, closes, and never overlaps the header', async ({ page }) => {
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const toggle = page.locator('#menu-toggle');
      const link = page.locator('nav a', { hasText: 'Experience' });

      await expect(toggle, `${width}px`).toBeVisible();
      await expect(link).toBeHidden();
      const logo = await page.locator('.logo').boundingBox();
      const shell = await page.locator('.nav-shell').boundingBox();
      expect(logo.x + logo.width, `${width}px logo clears the buttons`).toBeLessThan(shell.x);

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle).toHaveAccessibleName('Close menu');
      await expect(link).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(link).toBeHidden();

      await toggle.click();
      await link.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('desktop keeps the inline nav without a menu button', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');
    await expect(page.locator('#menu-toggle')).toBeHidden();
    await expect(page.locator('nav a', { hasText: 'Contact' })).toBeVisible();
  });

  test('resume download serves the PDF', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.getByRole('link', { name: 'Download Resume' }).getAttribute('href');
    const res = await request.get(href);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toBe('application/pdf');
  });

  test('hero buttons, nav, and sections are in place', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-actions a')).toHaveText(['View Projects', 'Download Resume', 'GitHub', 'LinkedIn']);
    await expect(page.locator('nav a')).toHaveText(['Home', 'Projects', 'Experience', 'About', 'Contact']);
    await expect(page.locator('.project-card')).toHaveCount(4);
    await expect(page.locator('.tech-strip img')).toHaveCount(12);
    await expect(page.locator('#role-typing')).toHaveText('Backend Software Engineer', { timeout: 5000 });
  });

  test('page makes no third party requests', async ({ page }) => {
    const hosts = new Set();
    page.on('request', (r) => hosts.add(new URL(r.url()).host));
    await page.goto('/', { waitUntil: 'networkidle' });
    expect([...hosts]).toEqual(['localhost:4174']);
  });

  test('theme toggle cycles light, dark, system and remembers it', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toHaveAccessibleName('Theme: system. Switch to light');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAccessibleName('Theme: light. Switch to dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('#theme-toggle')).toHaveAttribute('data-mode', 'system');
  });

  test('structured data describes the person', async ({ page }) => {
    await page.goto('/');
    const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(ld).toMatchObject({ '@type': 'Person', name: 'Yabetse Tesfaye', jobTitle: 'Backend Software Engineer' });
    expect(ld.sameAs).toEqual(['https://www.linkedin.com/in/yabetse-tesfaye/', 'https://github.com/yabtesfu']);
  });

  test('content is fully visible without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('#preloader')).toBeHidden();
    for (const sel of ['.project-card', '.exp-card', '.contact-card']) {
      const opacity = await page.locator(sel).first().evaluate((el) => getComputedStyle(el).opacity);
      expect(opacity, sel).toBe('1');
    }
    await ctx.close();
  });
});

test.describe('intro', () => {
  test('plays on the first visit, then dismisses itself', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/preloading/);
    await expect(page.locator('body')).not.toHaveClass(/preloading/, { timeout: 5000 });
    await expect(page.locator('#preloader')).toBeHidden({ timeout: 2000 });
  });

  test('a click skips it, and it does not replay in the same session', async ({ page }) => {
    await page.goto('/');
    await page.locator('#preloader').click();
    await expect(page.locator('body')).not.toHaveClass(/preloading/);
    await page.reload();
    await expect(page.locator('body')).not.toHaveClass(/preloading/);
    await expect(page.locator('#preloader')).toBeHidden();
  });

  test('never shows under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('body')).not.toHaveClass(/preloading/);
    await expect(page.locator('#preloader')).toBeHidden();
    await expect(page.locator('#role-typing')).toHaveText('Backend Software Engineer');
  });
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
