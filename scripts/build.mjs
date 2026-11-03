// Renders index.html, robots.txt, and sitemap.xml from data/profile.json.
// The output is committed, so Vercel keeps serving plain static files.
// Run: npm run build
import { writeFileSync } from 'node:fs';
import { loadProfile, formatMonth, formatRange, duration, esc, assertCleanText } from './lib.mjs';

const p = loadProfile();
const { site, person, ui } = p;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const ICON_SIZE = 40;
const ARROW = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SUN = '<svg class="ico-sun" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g></svg>';
const MOON = '<svg class="ico-moon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

// Fixed seed, so every build writes the same particle positions.
function particles(count, seed) {
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const round = (n, d = 1) => Number(n.toFixed(d));
  return Array.from({ length: count }, () => {
    const style = [
      `left:${round(rand() * 100)}%`,
      `top:${round(rand() * 100)}%`,
      `--size:${round(2 + rand() * 2.5)}px`,
      `--dur:${Math.round(38 + rand() * 40)}s`,
      `--delay:${Math.round(rand() * -40)}s`,
      `--dx:${Math.round(rand() * 80 - 40)}px`,
      `--dy:${Math.round(rand() * 80 - 40)}px`,
    ].join(';');
    return `<span style="${style}"></span>`;
  }).join('');
}

const tags = (list) =>
  `<ul class="tags" aria-label="${esc(ui.tagsLabel)}">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

const bullets = (list) => `<ul class="bullets">${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

const timeRange = (start, end) =>
  `<time datetime="${start}">${esc(formatMonth(start))}</time> ${esc(ui.dateJoiner)} <time datetime="${end}">${esc(formatMonth(end))}</time>`;

const projectCard = (proj) => `
        <article class="card project">
          ${proj.kicker ? `<p class="kicker">${esc(proj.kicker)}</p>` : ''}
          <h3>${esc(proj.name)}</h3>
          <p class="summary">${esc(proj.summary)}</p>
          ${tags(proj.tags)}
          ${bullets(proj.bullets)}
          <a class="text-link" href="${esc(proj.url)}" rel="noopener" target="_blank" aria-label="${esc(proj.linkLabel || ui.projectLinkLabel.replace('{name}', proj.name))}">${esc(ui.projectLink)}${ARROW}</a>
        </article>`;

const role = (job) => `
        <li class="role">
          <article>
            <header class="role-head">
              <h3>${esc(job.title)}</h3>
              <p class="company">${esc(job.company)}${job.location ? `<span class="sep" aria-hidden="true"> · </span><span class="loc">${esc(job.location)}</span>` : ''}</p>
              <p class="dates">${timeRange(job.start, job.end)}<span class="sep" aria-hidden="true"> · </span><span class="dur">${esc(duration(job.start, job.end))}</span></p>
            </header>
            ${bullets(job.bullets)}
            ${tags(job.tags)}
          </article>
        </li>`;

const school = (ed) => `
          <li class="school">
            <h4>${esc(ed.school)}</h4>
            <p>${esc(ed.degree)}</p>
            <p class="dates">${timeRange(ed.start, ed.end)}${ed.gpa ? `<span class="sep" aria-hidden="true"> · </span>${esc(ui.gpaLabel)} ${esc(ed.gpa)}` : ''}</p>
          </li>`;

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.title,
  description: person.valueStatement,
  url: site.url,
  email: `mailto:${person.email}`,
  image: new URL(site.ogImage, site.url).href,
  address: {
    '@type': 'PostalAddress',
    addressLocality: person.location.city,
    addressCountry: person.location.countryCode,
  },
  sameAs: [person.links.linkedin, person.links.github],
};

const ogImage = new URL(site.ogImage, site.url).href;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(site.title)}</title>
  <meta name="description" content="${esc(site.description)}" />
  <link rel="canonical" href="${esc(site.url)}" />
  <meta name="robots" content="index, follow" />
  <meta name="color-scheme" content="dark light" />
  <meta name="theme-color" content="#0B0D0F" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#F7F9FC" media="(prefers-color-scheme: light)" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${esc(site.url)}" />
  <meta property="og:title" content="${esc(site.title)}" />
  <meta property="og:description" content="${esc(site.description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(site.ogImageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(site.title)}" />
  <meta name="twitter:description" content="${esc(site.description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />

  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="alternate icon" href="favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="favicon.png" />

  <link rel="preload" href="fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="fonts/jetbrains-mono-latin-400.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="tokens.css" />
  <link rel="stylesheet" href="style.css" />

  <!-- Apply the saved or system theme before first paint, so there is no flash. -->
  <script>
    (function () {
      var t = null;
      try { t = localStorage.getItem('theme'); } catch (e) {}
      if (t !== 'light' && t !== 'dark') {
        t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.dataset.theme = t;
      document.documentElement.classList.add('js');
    })();
  </script>

  <script type="application/ld+json">${JSON.stringify(personLd)}</script>
</head>

<body>
  <a class="skip-link" href="#main">${esc(ui.skipLink)}</a>

  <div class="particles" aria-hidden="true">${particles(9, 20261103)}</div>

  <header class="site-header">
    <div class="header-bar">
      <a class="brand" href="#top">${esc(person.name)}</a>
      <nav class="site-nav" aria-label="${esc(ui.navLabel)}">
        <ul>
          ${ui.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <button class="theme-toggle" type="button" aria-label="${esc(ui.themeToLight)}" data-label-light="${esc(ui.themeToLight)}" data-label-dark="${esc(ui.themeToDark)}">${SUN}${MOON}</button>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="hero" id="top" aria-labelledby="hero-name">
      <div class="hero-copy">
        <h1 id="hero-name">${esc(person.name)}</h1>
        <p class="hero-title">${esc(person.title)}</p>
        <p class="hero-value">${esc(person.valueStatement)}</p>
        <div class="actions">
          <a class="btn" href="#projects">${esc(ui.heroButtons.projects)}</a>
          <a class="btn" href="${esc(site.resumeFile)}" download="${esc(site.resumeDownloadName)}">${esc(ui.heroButtons.resume)}</a>
          <a class="btn" href="${esc(person.links.github)}" rel="noopener" target="_blank">${esc(ui.heroButtons.github)}</a>
          <a class="btn" href="${esc(person.links.linkedin)}" rel="noopener" target="_blank">${esc(ui.heroButtons.linkedin)}</a>
        </div>
      </div>
      <ul class="tech" aria-label="${esc(ui.techLabel)}">
        ${p.tech.map((t) => `<li><img src="assets/icons/${t.icon}.svg" alt="${esc(t.name)}" title="${esc(t.name)}" width="${ICON_SIZE}" height="${ICON_SIZE}"${t.mono ? ' class="mono"' : ''} /></li>`).join('\n        ')}
      </ul>
    </section>

    <section class="section" id="projects" aria-labelledby="projects-title">
      <h2 id="projects-title">${esc(ui.headings.projects)}</h2>
      <div class="project-grid">${p.projects.map(projectCard).join('')}
      </div>
      <p class="more"><a class="text-link" href="${esc(person.links.github)}" rel="noopener" target="_blank">${esc(ui.moreOnGitHub)}${ARROW}</a></p>
    </section>

    <section class="section" id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title">${esc(ui.headings.experience)}</h2>
      <ol class="timeline">${p.experience.map(role).join('')}
      </ol>
    </section>

    <section class="section" id="about" aria-labelledby="about-title">
      <h2 id="about-title">${esc(ui.headings.about)}</h2>
      <p class="prose">${p.about.map(esc).join(' ')}</p>
      <h3 class="subhead">${esc(ui.headings.education)}</h3>
      <ul class="schools">${p.education.map(school).join('')}
      </ul>
    </section>

    <section class="section" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">${esc(ui.headings.contact)}</h2>
      <p class="prose">${esc(p.contact.line)}</p>
      <ul class="contact-links">
        <li><a class="text-link" href="mailto:${esc(person.email)}">${esc(person.email)}</a></li>
        <li><a class="text-link" href="${esc(person.links.linkedin)}" rel="noopener" target="_blank">${esc(ui.contactLabels.linkedin)}${ARROW}</a></li>
        <li><a class="text-link" href="${esc(person.links.github)}" rel="noopener" target="_blank">${esc(ui.contactLabels.github)}${ARROW}</a></li>
      </ul>
    </section>
  </main>

  <footer class="site-footer">
    <p>${esc(ui.footer)}</p>
  </footer>

  <script src="script.js" defer></script>
</body>
</html>
`;

assertCleanText(html, 'index.html');
writeFileSync('index.html', html);

writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site.url).href}\n`);
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </url>
</urlset>
`);

console.log('built index.html, robots.txt, sitemap.xml');
