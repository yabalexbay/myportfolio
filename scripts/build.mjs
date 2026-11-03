// Renders index.html, robots.txt, and sitemap.xml from data/profile.json.
// The output is committed, so Vercel keeps serving plain static files.
// Run: npm run build
import { readFileSync, writeFileSync } from 'node:fs';
import { loadProfile, formatMonth, duration, esc, assertCleanText } from './lib.mjs';

const p = loadProfile();
const { site, person, ui } = p;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Stroke icons (24px grid), drawn in currentColor so they follow the theme.
const stroke = (body, size = 16, cls = '') =>
  `<svg${cls ? ` class="${cls}"` : ''} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

// Brand marks come from the vendored devicon files; only the first path is the mark itself.
const mark = (name, size = 16) => {
  const svg = readFileSync(`assets/icons/${name}.svg`, 'utf8');
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)[1];
  return `<svg width="${size}" height="${size}" viewBox="0 0 128 128" fill="currentColor" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="${d}"/></svg>`;
};

const ICON = {
  arrow: stroke('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  download: stroke('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  external: stroke('<path d="M7 17 17 7M8 7h9v9"/>', 14),
  mail: stroke('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', 18),
  building: stroke('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>', 15),
  cap: stroke('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>', 15),
  chevron: stroke('<path d="m6 9 6 6 6-6"/>', 20),
  sun: stroke('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', 16, 'ico-sun'),
  moon: stroke('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', 16, 'ico-moon'),
  system: stroke('<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>', 16, 'ico-system'),
  github: mark('github'),
  linkedin: mark('linkedin'),
  githubLg: mark('github', 18),
  linkedinLg: mark('linkedin', 18),
};

// "**word**" in profile copy becomes <strong>word</strong>; everything else is escaped.
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const external = 'target="_blank" rel="noopener"';

const sectionHead = (key) => {
  const s = ui.sections[key];
  return `
    <div class="section-head reveal">
      <p class="section-label">${esc(s.label)}</p>
      <h2 class="section-title" id="${key}-title">${esc(s.title)} <span>${esc(s.accent)}</span></h2>
    </div>`;
};

const chips = (list, cls) =>
  `<ul class="${cls}" data-stagger aria-label="${esc(ui.tagsLabel)}">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

const bulletList = (list, cls) => `<ul class="${cls}">${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

const period = (start, end) =>
  `<span class="exp-period"><time datetime="${start}">${esc(formatMonth(start))}</time> ${esc(ui.dateJoiner)} <time datetime="${end}">${esc(formatMonth(end))}</time></span>`;

const projectCard = (proj, i) => `
      <article class="project-card reveal" data-dir="${i % 2 ? 'right' : 'left'}" data-delay="${i % 2 ? 90 : 0}">
        ${proj.kicker ? `<p class="proj-kicker">${esc(proj.kicker)}</p>` : ''}
        <h3>${esc(proj.name)}</h3>
        <p class="proj-desc">${esc(proj.summary)}</p>
        ${chips(proj.tags, 'proj-chips')}
        ${bulletList(proj.bullets, 'proj-bullets')}
        <div class="project-links">
          <a href="${esc(proj.url)}" ${external} class="proj-btn" aria-label="${esc(proj.linkLabel || ui.projectLinkLabel.replace('{name}', proj.name))}">${ICON.github} ${esc(ui.projectLink)}</a>
        </div>
      </article>`;

const role = (job, i) => `
      <li class="exp-item reveal" data-delay="${Math.min(i, 4) * 90}">
        <span class="exp-dot" aria-hidden="true"></span>
        <article class="exp-card">
          <div class="exp-top">
            <h3>${esc(job.title)}</h3>
            ${period(job.start, job.end)}
          </div>
          <p class="exp-org">${ICON.building} ${esc(job.company)}</p>
          <p class="exp-meta">${esc(duration(job.start, job.end))}${job.location ? ` · ${esc(job.location)}` : ''}</p>
          ${bulletList(job.bullets, 'exp-bullets')}
          ${chips(job.tags, 'exp-tags')}
        </article>
      </li>`;

const school = (ed, i) => `
          <li class="exp-item reveal" data-delay="${i * 90}">
            <span class="exp-dot" aria-hidden="true"></span>
            <article class="exp-card">
              <div class="exp-top">
                <h4>${esc(ed.degree)}</h4>
                ${period(ed.start, ed.end)}
              </div>
              <p class="exp-org">${ICON.cap} ${esc(ed.school)}${ed.gpa ? ` <span class="exp-loc">· ${esc(ui.gpaLabel)} ${esc(ed.gpa)}</span>` : ''}</p>
            </article>
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
  address: { '@type': 'PostalAddress', addressLocality: person.location.city, addressCountry: person.location.countryCode },
  sameAs: [person.links.linkedin, person.links.github],
};

const ogImage = new URL(site.ogImage, site.url).href;
const pre = ui.preloader;
const [firstName, ...rest] = person.name.split(' ');
const lastName = rest.join(' ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(site.title)}</title>
  <meta name="description" content="${esc(site.description)}" />
  <link rel="canonical" href="${esc(site.url)}" />
  <meta name="robots" content="index, follow" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#f8fafd" />

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

  <link rel="preload" href="fonts/geist-latin-wght.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="fonts/geist-mono-latin-wght.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="tokens.css" />
  <link rel="stylesheet" href="style.css" />

  <script type="application/ld+json">${JSON.stringify(personLd)}</script>
</head>

<body>

  <!-- Paint the saved theme and arm the intro before anything renders (no flash).
       Mode is light, dark, or system; system follows the OS. The intro plays once
       per browser session and never under reduced motion. -->
  <script>
    (function () {
      var root = document.documentElement, mode = 'system', seen = false;
      try { mode = localStorage.getItem('folio-theme') || 'system'; } catch (e) {}
      if (mode !== 'light' && mode !== 'dark') mode = 'system';
      var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.dataset.theme = dark ? 'dark' : 'light';
      root.dataset.themeMode = mode;
      root.classList.add('js');
      try { seen = sessionStorage.getItem('folio-intro') === 'seen'; } catch (e) {}
      if (!seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.body.classList.add('preloading');
    })();
  </script>

  <a class="skip-link" href="#main">${esc(ui.skipLink)}</a>

  <!-- Loading screen: decorative, so it is hidden from assistive tech. Click or Escape skips it. -->
  <div class="preloader" id="preloader" aria-hidden="true">
    <div class="pre-field">
      ${pre.tags.map((t, i) => {
        const spots = [[-34, -12], [-26, 3], [-15, -19], [15, -19], [27, -6], [33, 8], [-31, 14], [31, 21]];
        const [tx, ty] = spots[i % spots.length];
        return `<span class="pre-tag" style="--tx:${tx}rem;--ty:${ty}rem;--d:${(0.1 + i * 0.06).toFixed(2)}s">${esc(t)}</span>`;
      }).join('\n      ')}
    </div>

    <div class="pre-core">
      <div class="pre-mark">
        <svg class="pre-ring" viewBox="0 0 132 132">
          <circle class="pre-ring-track" cx="66" cy="66" r="58" />
          <circle class="pre-ring-arc" cx="66" cy="66" r="58" id="pre-arc" />
        </svg>
        <div class="pre-tile"><span>${esc(person.name.split(' ').map((w) => w[0]).join(''))}</span></div>
      </div>

      <p class="pre-name">${esc(person.name)}</p>
      <p class="pre-role">${esc(person.title)}</p>

      <div class="pre-panel">
        <div class="pre-panel-top">
          <span class="pre-led"></span>
          <span class="pre-panel-title">${esc(pre.panelTitle)}</span>
        </div>
        <p class="pre-status" id="pre-status">${esc(pre.stages[0].text)}</p>
        <div class="pre-track"><span class="pre-fill" id="pre-fill"></span></div>
        <div class="pre-readout">
          <span id="pre-modules" data-label="${esc(pre.modules)}">${esc(pre.modules)} 00 / 12</span>
          <span id="pre-pct">0%</span>
        </div>
      </div>
      <template id="pre-stages">${pre.stages.map((s) => `<span data-at="${s.at}">${esc(s.text)}</span>`).join('')}</template>
    </div>
  </div>

  <!-- Night sky twinkle over the dotted canvas -->
  <canvas class="starfield" id="starfield" aria-hidden="true"></canvas>

  <!-- Grain size dot that springs after the pointer -->
  <div class="cursor-dot" aria-hidden="true"></div>

  <header id="site-header">
    <a href="#home" class="logo" id="logo-sig">
      <span class="sig" aria-hidden="true">${esc(ui.brandMark.first)}<span class="sig-dot">${esc(ui.brandMark.dot)}</span>${esc(ui.brandMark.last)}</span>
      <span class="sr-only">${esc(ui.brandLabel)}</span>
      <svg class="sig-rule" viewBox="0 0 60 6" preserveAspectRatio="none" aria-hidden="true"><path d="M1 4 C 15 1.5, 30 5, 59 2.5" /></svg>
    </a>

    <div class="nav-shell">
      <nav aria-label="${esc(ui.navLabel)}">
        <span class="nav-pill" id="nav-pill" aria-hidden="true"></span>
        ${ui.nav.map((n, i) => `<a href="${esc(n.href)}"${i === 0 ? ' class="active"' : ''}>${esc(n.label)}</a>`).join('\n        ')}
      </nav>
      <button class="theme-switch" id="theme-toggle" type="button" data-mode="system" aria-label="${esc(ui.themeLabels.system)}" data-label-light="${esc(ui.themeLabels.light)}" data-label-dark="${esc(ui.themeLabels.dark)}" data-label-system="${esc(ui.themeLabels.system)}">${ICON.sun}${ICON.moon}${ICON.system}</button>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="hero" id="home" aria-labelledby="hero-name">
      <div class="hero-inner" id="hero-inner">
        <h1 class="hero-title" id="hero-name"><span class="nm-first">${esc(firstName)}</span> <span class="nm-last">${esc(lastName)}</span></h1>

        <p class="hero-role"><span id="role-typing" class="role-typed">${esc(person.title)}</span></p>

        <p class="hero-quote">${esc(person.valueStatement)}</p>

        <div class="hero-actions">
          <a href="#projects" class="btn-primary">${esc(ui.heroButtons.projects)} ${ICON.arrow}</a>
          <a href="${esc(site.resumeFile)}" download="${esc(site.resumeDownloadName)}" class="btn-secondary">${ICON.download} ${esc(ui.heroButtons.resume)}</a>
          <a href="${esc(person.links.github)}" ${external} class="btn-secondary">${ICON.github} ${esc(ui.heroButtons.github)}</a>
          <a href="${esc(person.links.linkedin)}" ${external} class="btn-secondary">${ICON.linkedin} ${esc(ui.heroButtons.linkedin)}</a>
        </div>

        <ul class="tech-strip" aria-label="${esc(ui.techLabel)}">
          ${p.tech.map((t) => `<li><img src="assets/icons/${t.icon}.svg" alt="${esc(t.name)}" title="${esc(t.name)}" width="36" height="36"${t.mono ? ' class="mono"' : ''} /></li>`).join('\n          ')}
        </ul>
      </div>

      <a href="#projects" class="scroll-cue" aria-label="${esc(ui.scrollCue)}">${ICON.chevron}</a>
    </section>

    <section class="pg-section" id="projects" aria-labelledby="projects-title">${sectionHead('projects')}
      <div class="projects-grid">${p.projects.map(projectCard).join('')}
      </div>
      <p class="more-link reveal"><a href="${esc(person.links.github)}" ${external} class="proj-btn">${esc(ui.moreOnGitHub)} ${ICON.external}</a></p>
    </section>

    <section class="pg-section experience-section" id="experience" aria-labelledby="experience-title">${sectionHead('experience')}
      <ol class="timeline">${p.experience.map(role).join('')}
      </ol>
    </section>

    <section class="pg-section about-section" id="about" aria-labelledby="about-title">${sectionHead('about')}
      <div class="about-wrap">
        <div class="about-lead reveal" data-dir="left">
          <p>${p.about.map(rich).join(' ')}</p>
        </div>
        <div class="about-edu reveal" data-dir="right" data-delay="120" id="education">
          <h3>${esc(ui.headings.education)}</h3>
          <ol class="timeline edu-timeline">${p.education.map(school).join('')}
          </ol>
        </div>
      </div>
    </section>

    <section class="pg-section contact-section" id="contact" aria-labelledby="contact-title">${sectionHead('contact')}
      <div class="contact-card reveal" data-delay="100">
        <p class="contact-line">${esc(p.contact.line)}</p>
        <div class="contact-icons">
          <a href="mailto:${esc(person.email)}" aria-label="${esc(ui.contactLabels.email)}">${ICON.mail}</a>
          <a href="${esc(person.links.github)}" ${external} aria-label="${esc(ui.contactLabels.github)}">${ICON.githubLg}</a>
          <a href="${esc(person.links.linkedin)}" ${external} aria-label="${esc(ui.contactLabels.linkedin)}">${ICON.linkedinLg}</a>
        </div>
        <a href="mailto:${esc(person.email)}" class="contact-email">${esc(person.email)}</a>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-inner">
      <p class="foot-copy">${esc(ui.footer)}</p>
    </div>
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
