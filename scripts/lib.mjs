// Helpers shared by the site build, the resume renderer, and the tests.
import { readFileSync } from 'node:fs';

export const loadProfile = () => JSON.parse(readFileSync('data/profile.json', 'utf8'));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-02" -> "Feb, 2026"; a bare year stays a year (no invented months).
export function formatMonth(ym) {
  const [y, m] = ym.split('-');
  return m ? `${MONTHS[Number(m) - 1]}, ${y}` : y;
}

export const formatRange = (start, end, joiner = 'to') =>
  `${formatMonth(start)} ${joiner} ${formatMonth(end)}`;

// LinkedIn counts both the start and the end month: Feb to Oct is 9 mos.
export function duration(start, end) {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  const total = (ey * 12 + em) - (sy * 12 + sm) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Hyphen, every Unicode dash, the minus sign, and their small and full width forms.
export const DASH_RE = /[-‐-―−﹘﹣－]/;
export const BANNED_RE = /Nova|Eureka|30%|2014/;

// Text a person can read: element text plus the attributes browsers and
// screen readers expose. Scripts, styles, and URLs are not visible text.
export function visibleTextOf(html) {
  const attrs = [...html.matchAll(/\s(?:alt|aria-label|title|content|data-label(?:-[a-z]+)?)="([^"]*)"/g)]
    .map((m) => m[1])
    .filter((v) => !/^(https?:|mailto:|width=|#|[\w.\/]+\.(png|svg|pdf)$|summary_large_image|website|en_US|index, follow)/.test(v));
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return [text, ...attrs].join('\n')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

export function assertCleanText(html, where) {
  const text = visibleTextOf(html);
  const problems = [];
  for (const line of text.split('\n')) {
    if (DASH_RE.test(line)) problems.push(`dash: ${line.trim()}`);
    if (BANNED_RE.test(line)) problems.push(`banned term: ${line.trim()}`);
  }
  if (problems.length) {
    throw new Error(`${where} has forbidden visible text:\n  ${problems.join('\n  ')}`);
  }
}
