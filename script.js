/* ================================================
   YABETSE TESFAYE PORTFOLIO, script.js
   Every visible string comes from the page itself (built from
   data/profile.json), so nothing here needs editing when content changes.
   ================================================ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ---------- HERO INTRO: typing and signature logo ---------- */
const roleEl = document.getElementById('role-typing');
const ROLE_TEXT = roleEl ? roleEl.textContent.trim() : '';
const logoEl = document.getElementById('logo-sig');

const ROLE_SPEED = 62;        // ms per character
let roleFrame = null;

/* Reserve exactly the finished line's width, measured at the current font
   size, so characters land in place instead of shunting the centred line
   sideways on every keystroke. */
function measureRoleWidth() {
  if (!roleEl) return;
  const prev = roleEl.textContent;
  roleEl.style.width = 'auto';
  roleEl.textContent = ROLE_TEXT;
  const w = Math.ceil(roleEl.getBoundingClientRect().width) + 1;
  roleEl.style.width = '';
  roleEl.style.setProperty('--role-len', w + 'px');
  roleEl.textContent = prev;
}

if (roleEl) {
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureRoleWidth);
  window.addEventListener('resize', measureRoleWidth);
}

/* Type the role once, from empty, then stop. Driven off the frame clock, so
   the cadence stays even under load. The full text is already in the HTML
   for crawlers and for visitors without JavaScript. */
function typeRole() {
  if (!roleEl) return;
  if (roleFrame) cancelAnimationFrame(roleFrame);
  measureRoleWidth();
  if (REDUCED) { roleEl.textContent = ROLE_TEXT; return; }

  roleEl.textContent = '';
  const started = performance.now();
  let shown = -1;
  const step = (now) => {
    const i = Math.min(ROLE_TEXT.length, Math.floor((now - started) / ROLE_SPEED));
    if (i !== shown) {
      shown = i;
      roleEl.textContent = ROLE_TEXT.slice(0, i);
    }
    roleFrame = i < ROLE_TEXT.length ? requestAnimationFrame(step) : null;
  };
  roleFrame = requestAnimationFrame(step);
}

/* Replay the signature write on. */
function playSignature() {
  if (!logoEl || REDUCED) return;
  logoEl.classList.remove('play');
  void logoEl.offsetWidth; // force reflow so the animation restarts
  logoEl.classList.add('play');
}

function playHeroIntro() {
  playSignature();
  typeRole();
}

/* Replay the intro when the visitor scrolls back to the top after going down. */
let scrolledAway = false;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 500) scrolledAway = true;
  if (scrolledAway && y < 30) {
    scrolledAway = false;
    playHeroIntro();
  }
}, { passive: true });


/* ---------- LOADING SCREEN ----------
   Plays once per browser session (the inline script in <body> decides). The
   ring and bar fill while the build log ticks over, then the panel
   dissolves into the hero. A click or Escape skips it. */
(function preloader() {
  const root = document.getElementById('preloader');
  if (!root || !document.body.classList.contains('preloading')) {
    if (root) root.classList.add('gone');
    playHeroIntro();
    return;
  }

  const arcEl     = document.getElementById('pre-arc');
  const fillEl    = document.getElementById('pre-fill');
  const statusEl  = document.getElementById('pre-status');
  const modulesEl = document.getElementById('pre-modules');
  const pctEl     = document.getElementById('pre-pct');
  const MODULES   = modulesEl ? modulesEl.dataset.label : '';
  const STAGES = Array.from(document.getElementById('pre-stages').content.querySelectorAll('span'))
    .map((s) => ({ at: Number(s.dataset.at), text: s.textContent }));

  const TOTAL_MODULES = 12;
  const ARC_LENGTH    = 364.4;              // 2 * PI * r, r = 58
  const DURATION      = 1500;

  let finished = false;
  let pageReady = document.readyState === 'complete';
  window.addEventListener('load', () => { pageReady = true; });

  let stage = -1;
  function paint(p) {
    const pct = Math.round(p);
    if (fillEl) fillEl.style.width = pct + '%';
    if (arcEl)  arcEl.style.strokeDashoffset = ARC_LENGTH * (1 - p / 100);
    if (pctEl)  pctEl.textContent = pct + '%';
    if (modulesEl) {
      const done = Math.min(TOTAL_MODULES, Math.round((p / 100) * TOTAL_MODULES));
      modulesEl.textContent = MODULES + ' ' + String(done).padStart(2, '0') + ' / ' + TOTAL_MODULES;
    }
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (pct >= STAGES[i].at) {
        if (stage !== i) { stage = i; if (statusEl) statusEl.textContent = STAGES[i].text; }
        break;
      }
    }
  }

  function dismiss() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem('folio-intro', 'seen'); } catch (e) { /* storage blocked */ }
    document.body.classList.remove('preloading');
    playHeroIntro();
    setTimeout(() => root.classList.add('gone'), 900);
  }

  root.addEventListener('click', dismiss);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dismiss(); });

  const started = performance.now();
  function frame(now) {
    if (finished) return;
    const t = Math.min((now - started) / DURATION, 1);
    paint((1 - Math.pow(1 - t, 2.2)) * 100);
    if (t < 1) { requestAnimationFrame(frame); return; }
    // Sit at 100% until the page itself is ready, but never stall.
    const holdStarted = performance.now();
    (function hold() {
      if (pageReady || performance.now() - holdStarted > 1200) setTimeout(dismiss, 250);
      else requestAnimationFrame(hold);
    })();
  }
  paint(0);
  requestAnimationFrame(frame);

  // Hard safety net: never trap the visitor behind the loader.
  setTimeout(dismiss, 4500);
})();


/* ---------- THEME: light, dark, system ----------
   The inline script already resolved and painted the mode before first
   paint; this mirrors it into the toggle and cycles it on click. */
const themeToggle = document.getElementById('theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const THEME_KEY = 'folio-theme';
const THEME_MODES = ['light', 'dark', 'system'];
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(mode) {
  const resolved = mode === 'system' ? (systemDark.matches ? 'dark' : 'light') : mode;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeMode = mode;
  if (themeToggle) {
    themeToggle.dataset.mode = mode;
    themeToggle.setAttribute('aria-label', themeToggle.dataset['label' + mode[0].toUpperCase() + mode.slice(1)]);
  }
  if (themeColorMeta) themeColorMeta.setAttribute('content', resolved === 'dark' ? '#06080c' : '#f8fafd');
}

let themeMode = document.documentElement.dataset.themeMode || 'system';
if (THEME_MODES.indexOf(themeMode) === -1) themeMode = 'system';
applyTheme(themeMode);

// In system mode, follow the OS if it flips while the page is open.
systemDark.addEventListener('change', () => {
  if (themeMode === 'system') applyTheme('system');
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    themeMode = THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length];
    try { localStorage.setItem(THEME_KEY, themeMode); } catch (e) { /* storage blocked */ }
    applyTheme(themeMode);
  });
}


/* ---------- CURSOR TRAILING DOT ----------
   Spring physics: hard acceleration toward the pointer, slightly
   underdamped, so quick direction changes overshoot and snap back. The dot
   stays hidden until the pointer has actually moved. */
const cursorDot = document.querySelector('.cursor-dot');
if (cursorDot && !REDUCED && !window.matchMedia('(pointer: coarse)').matches) {
  const lag = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cursor-dot-lag')) || 0.18;
  const stiffness = 320 * lag / 0.18;
  const damping = 2 * Math.sqrt(stiffness) * 0.62;   // under critical, so it overshoots on turns

  let tx = -100, ty = -100, x = -100, y = -100, vx = 0, vy = 0, seen = false, lastT = 0, running = false;

  function loopDot(t) {
    const dt = Math.min((t - (lastT || t)) / 1000, 0.05);
    lastT = t;
    vx += (stiffness * (tx - x) - damping * vx) * dt;
    vy += (stiffness * (ty - y) - damping * vy) * dt;
    x += vx * dt; y += vy * dt;
    const half = cursorDot.offsetWidth / 2;
    cursorDot.style.transform = `translate(${(x - half).toFixed(2)}px, ${(y - half).toFixed(2)}px)`;
    // Rest once the dot has caught up, instead of spinning every frame forever.
    if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.05) requestAnimationFrame(loopDot);
    else { running = false; lastT = 0; }
  }

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!seen) { seen = true; x = tx; y = ty; cursorDot.style.opacity = '1'; }
    if (!running) { running = true; requestAnimationFrame(loopDot); }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    seen = false;
    cursorDot.style.opacity = '0';
  });
}


/* ---------- ACTIVE NAV AND MAGNETIC PILL ----------
   One lozenge glides between nav items instead of each link carrying its
   own underline. It stretches slightly in the direction of travel, so a
   long jump reads as momentum rather than a teleport. */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('nav a');
const navEl    = document.querySelector('nav');
const navPill  = document.getElementById('nav-pill');

function activeLink() {
  return document.querySelector('nav a.active') || navLinks[0];
}

function movePill(link) {
  if (!navPill || !navEl || !link) return;
  const nav = navEl.getBoundingClientRect();
  const box = link.getBoundingClientRect();
  if (!box.width) return;

  const x    = box.left - nav.left;
  const prev = parseFloat(navPill.style.getPropertyValue('--pill-x')) || 0;
  const trip = Math.abs(x - prev);

  navPill.style.width = box.width + 'px';
  navPill.style.top   = (box.top - nav.top + box.height / 2) + 'px';
  navPill.style.setProperty('--pill-x', x + 'px');

  if (!REDUCED && trip > 8) {
    navPill.style.setProperty('--pill-squash', Math.min(1 + trip / 900, 1.14));
    clearTimeout(navPill._settle);
    navPill._settle = setTimeout(() => navPill.style.setProperty('--pill-squash', 1), 200);
  }
  navPill.classList.add('ready');
}

function updateNav() {
  const scrollY = window.scrollY + 180;
  sections.forEach((sec) => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
    }
  });
  if (!navEl || !navEl.matches(':hover')) movePill(activeLink());
}

navLinks.forEach((link) => link.addEventListener('mouseenter', () => movePill(link)));
if (navEl) navEl.addEventListener('mouseleave', () => movePill(activeLink()));

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', () => movePill(activeLink()));
// Nav widths shift once the web font swaps in, so measure again when it lands.
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => movePill(activeLink()));
updateNav();


/* ---------- MOBILE MENU ----------
   On narrow screens the links fold into a dropdown behind the menu button.
   It closes on a link tap, Escape, a tap outside, or widening the window. */
const menuToggle = document.getElementById('menu-toggle');
const headerElForMenu = document.getElementById('site-header');
const MOBILE = window.matchMedia('(max-width: 768px)');

function setMenu(open) {
  if (!menuToggle || !headerElForMenu) return;
  headerElForMenu.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? menuToggle.dataset.labelClose : menuToggle.dataset.labelOpen);
}

if (menuToggle) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!headerElForMenu.contains(e.target)) setMenu(false);
  });
  MOBILE.addEventListener('change', () => setMenu(false));
}


/* ---------- SECTION TITLES: SPLIT INTO RISING WORDS ---------- */
document.querySelectorAll('.section-title').forEach((title) => {
  if (title.dataset.split) return;
  title.dataset.split = '1';

  const frag = document.createDocumentFragment();
  let index = 0;

  const addWords = (text, accent) => {
    text.split(/\s+/).filter(Boolean).forEach((word) => {
      const outer = document.createElement('span');
      outer.className = accent ? 'w w-accent' : 'w';
      outer.style.setProperty('--i', index++);
      const inner = document.createElement('span');
      inner.className = 'w-in';
      inner.textContent = word;
      outer.appendChild(inner);
      frag.appendChild(outer);
      frag.appendChild(document.createTextNode(' '));
    });
  };

  Array.from(title.childNodes).forEach((node) => {
    addWords(node.textContent, node.nodeType !== Node.TEXT_NODE);   // the <span> is the accent
  });

  title.textContent = '';
  title.appendChild(frag);
});


/* ---------- SCROLL REVEAL, CHIP CASCADES, TIMELINE DRAW ---------- */
function onceVisible(selector, options, fn) {
  const els = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      fn(entry.target);
      obs.unobserve(entry.target);
    });
  }, options);
  els.forEach((el) => obs.observe(el));
}

onceVisible('.reveal', { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }, (el) => {
  const delay = REDUCED ? 0 : parseInt(el.dataset.delay || 0, 10);
  setTimeout(() => el.classList.add('visible'), delay);
});

document.querySelectorAll('[data-stagger]').forEach((group) => {
  Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
});
onceVisible('[data-stagger]', { threshold: 0.2 }, (el) => el.classList.add('shown'));

onceVisible('.timeline', { threshold: 0.05 }, (el) => el.classList.add('drawn'));


/* ---------- SCROLL: HERO PARALLAX AND NAV ELEVATION ---------- */
const heroInner = document.getElementById('hero-inner');
const headerEl  = document.getElementById('site-header');

let scrollTicking = false;
function onScrollFrame() {
  scrollTicking = false;
  const y = window.scrollY;

  if (heroInner && !REDUCED) {
    const vh = window.innerHeight || 1;
    const p = Math.min(y / vh, 1);
    heroInner.style.setProperty('--hero-shift', (p * 90).toFixed(1) + 'px');
    heroInner.style.setProperty('--hero-fade', Math.max(0, 1 - p * 1.25).toFixed(3));
  }

  // The floating pill deepens its shadow once it lifts off the top of the page.
  if (headerEl) headerEl.classList.toggle('scrolled', y > 20);
}

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(onScrollFrame);
}, { passive: true });
onScrollFrame();


/* ---------- CARD PHYSICS ----------
   A resting tilted card straightens the moment the pointer enters (CSS
   handles that), then tracks the cursor in 3D: the edge under the pointer
   recedes while the opposite edge pops. */
(function () {
  if (!window.matchMedia('(hover: hover)').matches || REDUCED) return;
  const MAX = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-tilt-max')) || 5;

  document.querySelectorAll('.project-card, .exp-card, .contact-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.classList.add('tracking'));

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 to 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rotX = (py * MAX * 2).toFixed(2);
      const rotY = (-px * MAX * 2).toFixed(2);
      card.style.transform = `perspective(var(--card-perspective)) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tracking');
      card.style.transform = '';   // settles back to its resting tilt
    });
  });
})();


/* ---------- STARFIELD ----------
   Grain size stars scattered over the canvas light up one by one and fade,
   like a night sky. Whisper quiet in light, the signature ambience in dark.
   Colors come from --star and --star-glow so it follows the theme. It pauses
   while the tab is hidden. */
(function starfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || REDUCED) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [], w = 0, h = 0, last = 0, color = '', glow = '';

  function readColors() {
    const css = getComputedStyle(document.documentElement);
    color = css.getPropertyValue('--star').trim() || '#6cc4ff';
    glow  = css.getPropertyValue('--star-glow').trim() || 'rgba(108,196,255,0.6)';
  }

  function seed() {
    const count = Math.round((w * h) / 30000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.6,
      t: Math.random() * Math.PI * 2,        // twinkle phase
      v: 0.25 + Math.random() * 0.65,        // twinkle speed
      drift: Math.random() * 0.02 - 0.01,
    }));
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || now - last < 40) return;   // about 25 fps is plenty for a twinkle
    last = now;

    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.t += 0.06 * s.v;
      s.x += s.drift;
      const a = Math.max(0, Math.sin(s.t));   // dark for half the cycle: appear, then fade
      if (a < 0.02) continue;
      ctx.globalAlpha = Math.pow(a, 1.3);
      ctx.shadowBlur = 8 + 10 * a;
      ctx.shadowColor = glow;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  readColors();
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
})();
