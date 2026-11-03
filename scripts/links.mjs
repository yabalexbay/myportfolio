// Requests every external link on the page and in the resume and requires a 200.
// LinkedIn answers 999 to every non browser client, so it is reported, not failed.
import { existsSync, readFileSync } from 'node:fs';

const SITE = new URL(JSON.parse(readFileSync('data/profile.json', 'utf8')).site.url);

const BOT_BLOCKED = new Set(['www.linkedin.com']);
const sources = [readFileSync('index.html', 'utf8'), readFileSync('docs/evidence/resume-rendered.txt', 'utf8'), readFileSync('data/profile.json', 'utf8')];
const urls = [...new Set(sources.flatMap((s) => [...s.matchAll(/https:\/\/[^\s"'<>)]+/g)].map((m) => m[0])))]
  .filter((u) => !u.startsWith('https://schema.org') && !u.includes('sitemaps.org'));

let failed = 0;
for (const url of urls.sort()) {
  let status;
  const own = new URL(url).host === SITE.host && new URL(url).pathname !== '/';
  if (own) {
    // Files on our own domain are checked in the repo, since they ship with the next deploy.
    status = existsSync(`.${decodeURIComponent(new URL(url).pathname)}`) ? 200 : 404;
    console.log(`${status === 200 ? 'ok  ' : 'FAIL'} ${status} (local file) ${url}`);
    if (status !== 200) failed++;
    continue;
  }
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (link check)' }, signal: AbortSignal.timeout(20000) });
    status = res.status;
  } catch (e) {
    status = e.name;
  }
  const blocked = BOT_BLOCKED.has(new URL(url).host);
  const ok = status === 200 || blocked;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${status}${blocked && status !== 200 ? ' (bot blocked, check by hand)' : ''} ${url}`);
}
if (failed) { console.error(`${failed} link(s) failed`); process.exit(1); }
