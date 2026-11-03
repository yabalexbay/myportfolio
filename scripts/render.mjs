// Renders the resume PDF and the Open Graph image from data/profile.json, so the
// resume and the website always say the same thing.
// Run: npm run resume
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { loadProfile, formatMonth, formatRange, esc, assertCleanText } from './lib.mjs';

const p = loadProfile();
const { site, person, resume } = p;

const font = (file) => `data:font/woff2;base64,${readFileSync(file).toString('base64')}`;
const FONTS = `
  @font-face { font-family: "Geist"; src: url(${font('fonts/geist-latin-wght.woff2')}) format("woff2-variations"); font-weight: 100 900; }
  @font-face { font-family: "Geist Mono"; src: url(${font('fonts/geist-mono-latin-wght.woff2')}) format("woff2-variations"); font-weight: 100 900; }`;

const contactBits = [
  `<a href="mailto:${esc(person.email)}">${esc(person.email)}</a>`,
  esc(person.phone),
  esc(`${person.location.city}, ${person.location.country}`),
  `<a href="${esc(person.links.linkedin)}">${esc(resume.linkLabels.linkedin)}</a>`,
  `<a href="${esc(site.url)}">${esc(resume.linkLabels.portfolio)}</a>`,
  `<a href="${esc(person.links.github)}">${esc(resume.linkLabels.github)}</a>`,
];

const row = (left, right) => `<div class="row"><div>${left}</div><div class="when">${right}</div></div>`;
const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const section = (title, body) => `<section><h2>${esc(title)}</h2>${body}</section>`;

const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${esc(resume.pageTitle)}</title>
<style>
  ${FONTS}
  @page { size: Letter; margin: 0.4in 0.5in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Geist", sans-serif; font-size: 9pt; line-height: 1.28; color: #111820; }
  a { color: inherit; text-decoration: none; }
  header { text-align: center; margin-bottom: 8pt; }
  h1 { margin: 0; font-size: 20pt; font-weight: 800; letter-spacing: -0.02em; }
  .title { margin: 1pt 0 4pt; font-family: "Geist Mono", monospace; font-size: 10pt; color: #3a4652; }
  .contact { font-size: 8.8pt; color: #3a4652; }
  .contact span + span::before { content: "|"; margin: 0 6pt; color: #9aa6b2; }
  .contact a { color: #23508a; }
  section { margin-top: 6pt; }
  h2 { margin: 0 0 3pt; padding-bottom: 1.5pt; font-size: 9.6pt; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 0.75pt solid #c4ccd5; }
  p { margin: 0; }
  .row { display: flex; justify-content: space-between; gap: 12pt; margin-top: 3pt; }
  .row:first-of-type { margin-top: 0; }
  .when { flex: none; font-family: "Geist Mono", monospace; font-size: 8.4pt; color: #3a4652; padding-top: 0.6pt; }
  .org { font-weight: 700; }
  .role { font-weight: 500; }
  ul { margin: 1pt 0 0; padding-left: 12pt; }
  li { margin: 0.6pt 0; }
  .skills p { margin: 0.6pt 0; }
  .skills b { font-weight: 650; }
  .note { color: #3a4652; }
</style>
</head>
<body>
  <header>
    <h1>${esc(person.name.split(' ')[0])} <span>${esc(person.name.split(' ').slice(1).join(' '))}</span></h1>
    <p class="title">${esc(person.title)}</p>
    <p class="contact">${contactBits.map((b) => `<span>${b}</span>`).join('')}</p>
  </header>

  ${section(resume.sections.summary, `<p>${esc(resume.summary)}</p>`)}

  ${section(resume.sections.skills, `<div class="skills">${resume.skills.map((s) => `<p><b>${esc(s.name)}:</b> ${esc(s.items.join(', '))}</p>`).join('')}</div>`)}

  ${section(resume.sections.experience, p.experience.map((job) =>
    row(`<span class="org">${esc(job.company)}</span>, <span class="role">${esc(job.title)}</span>${job.location ? `, ${esc(job.location)}` : ''}`, esc(formatRange(job.start, job.end, p.ui.dateJoiner)))
    + list(job.resumeBullets || job.bullets)).join(''))}

  ${section(resume.sections.projects, p.projects.map((proj) =>
    row(`<a href="${esc(proj.url)}"><span class="org">${esc(proj.name)}</span></a>${proj.kicker ? `, ${esc(proj.kicker)}` : ''}: ${esc(proj.resumeLine)}`, proj.date ? esc(formatMonth(proj.date)) : '')).join(''))}

  ${section(resume.sections.education, p.education.map((ed) =>
    row(`<span class="org">${esc(ed.school)}</span>, ${esc(ed.degree)}${ed.gpa ? `, ${esc(p.ui.gpaLabel)} ${esc(ed.gpa)}` : ''}`, esc(formatRange(ed.start, ed.end, p.ui.dateJoiner)))).join(''))}

  ${section(resume.sections.awards, resume.awards.map((a) =>
    row(`<span class="org">${esc(a.title)}</span>${a.note ? `<span class="note">. ${esc(a.note)}</span>` : ''}`, esc(formatMonth(a.date)))).join(''))}

  ${section(resume.sections.volunteering, resume.volunteering.map((v) =>
    row(`<span class="org">${esc(v.title)}</span>, ${esc(v.organization)}<span class="note">. ${esc(v.note)}</span>`, esc(formatMonth(v.date)))).join(''))}
</body>
</html>`;

const ogHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><style>
  ${FONTS}
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    display: flex; flex-direction: column; justify-content: center; padding: 0 96px; box-sizing: border-box;
    font-family: "Geist", sans-serif; color: #E9EDF1; background-color: #0B0D0F;
    background-image: radial-gradient(circle at center, rgb(222 232 245 / 0.3) 1.4px, transparent 1.9px);
    background-size: 39px 39px;
  }
  h1 { margin: 0; font-size: 104px; font-weight: 850; letter-spacing: -0.035em; line-height: 0.98; text-transform: uppercase; }
  h1 span { color: #8ec8ff; }
  .t { margin: 28px 0 0; font-family: "Geist Mono", monospace; font-size: 34px; color: #bfcad7; }
  .v { margin: 28px 0 0; max-width: 900px; font-size: 27px; line-height: 1.45; color: #8696a9; }
  .u { position: absolute; left: 96px; bottom: 56px; font-family: "Geist Mono", monospace; font-size: 22px; color: #8ec8ff; }
</style></head><body>
  <h1>${esc(person.name.split(' ')[0])} <span>${esc(person.name.split(' ').slice(1).join(' '))}</span></h1>
  <p class="t">${esc(person.title)}</p>
  <p class="v">${esc(person.valueStatement)}</p>
  <p class="u">${esc(new URL(site.url).host)}</p>
</body></html>`;

assertCleanText(resumeHtml, 'resume');
assertCleanText(ogHtml, 'og image');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: Math.round((8.5 - 1) * 96), height: 1000 } });
  await page.setContent(resumeHtml, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  // Letter is 11in tall; subtract the top and bottom page margins.
  const usable = (11 - 0.8) * 96;
  const height = await page.evaluate(() => document.body.scrollHeight);
  const sizes = await page.evaluate(() => [...document.querySelectorAll('header, section')].map((s) => `${s.querySelector('h2')?.textContent ?? 'header'}: ${s.offsetHeight}`));
  if (process.env.RESUME_DEBUG) await page.screenshot({ path: process.env.RESUME_DEBUG, fullPage: true });
  if (height > usable) console.error(sizes.join('\n'));
  if (height > usable) throw new Error(`resume overflows one page: ${height}px of ${Math.round(usable)}px`);
  await page.pdf({ path: site.resumeFile, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  writeFileSync('docs/evidence/resume-rendered.txt', await page.evaluate(() => document.body.innerText));
  console.log(`wrote ${site.resumeFile} (${height}px of ${Math.round(usable)}px used)`);

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.setContent(ogHtml, { waitUntil: 'load' });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: site.ogImage });
  console.log(`wrote ${site.ogImage}`);
} finally {
  await browser.close();
}
