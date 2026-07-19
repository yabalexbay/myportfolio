/* ================================================
   YABETSE PORTFOLIO - script.js
   ================================================ */

/* ---------- HERO INTRO: typing + signature logo ---------- */
const ROLE_TEXT = 'Full-Stack & Systems Engineer';
const roleEl = document.getElementById('role-typing');
const logoEl = document.getElementById('logo-sig');

let roleTimer = null;

/* Type the role once, from empty, then stop. */
function typeRole() {
  if (!roleEl) return;
  if (roleTimer) clearTimeout(roleTimer);
  roleEl.textContent = '';
  let i = 0;
  const step = () => {
    roleEl.textContent = ROLE_TEXT.slice(0, i);
    if (i <= ROLE_TEXT.length) {
      i++;
      roleTimer = setTimeout(step, 55);
    }
  };
  step();
}

/* Replay the cursive signature write-on animation. */
function playSignature() {
  if (!logoEl) return;
  logoEl.classList.remove('play');
  void logoEl.offsetWidth; // force reflow so the animation restarts
  logoEl.classList.add('play');
}

function playHeroIntro() {
  playSignature();
  typeRole();
}

window.addEventListener('load', playHeroIntro);
/* Fallback in case load already fired */
document.addEventListener('DOMContentLoaded', () => {
  if (document.readyState === 'complete') playHeroIntro();
});

/* Replay the intro when the user scrolls back to the top after going down. */
let scrolledAway = false;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 500) scrolledAway = true;
  if (scrolledAway && y < 30) {
    scrolledAway = false;
    playHeroIntro();
  }
}, { passive: true });


/* ---------- THEME TOGGLE + LIVE FAVICON ---------- */
const themeToggle = document.getElementById('theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const faviconLink = document.querySelector('link[rel="icon"]');

/* The brand "y" mark is drawn on a canvas so it can smoothly morph between the
   dark palette (dark bg, cream y) and the light palette (white bg, black y)
   as the in-page theme toggle flips. The lime dot stays constant. */
const faviconCanvas = document.createElement('canvas');
faviconCanvas.width = faviconCanvas.height = 64;

const FAV_BG_DARK = [16, 17, 9],    FAV_BG_LIGHT = [255, 255, 255];
const FAV_Y_DARK  = [243, 240, 231], FAV_Y_LIGHT  = [16, 17, 9];
const FAV_DOT     = 'rgb(155,224,0)';

function favMix(a, b, t) {
  const c = i => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

function favRoundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

/* t = 0 -> dark theme, t = 1 -> light theme */
function drawFavicon(t) {
  if (!faviconLink) return;
  const ctx = faviconCanvas.getContext('2d');
  const S = faviconCanvas.width;
  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.scale(S / 512, S / 512);
  // squircle background
  ctx.fillStyle = favMix(FAV_BG_DARK, FAV_BG_LIGHT, t);
  favRoundRect(ctx, 0, 0, 512, 512, 128);
  ctx.fill();
  // script "y"
  ctx.strokeStyle = favMix(FAV_Y_DARK, FAV_Y_LIGHT, t);
  ctx.lineWidth = 48;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(150, 156); ctx.lineTo(245, 300);
  ctx.moveTo(340, 156); ctx.lineTo(245, 300);
  ctx.bezierCurveTo(243, 362, 236, 398, 168, 400);
  ctx.stroke();
  // lime dot
  ctx.fillStyle = FAV_DOT;
  ctx.beginPath();
  ctx.arc(372, 322, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  faviconLink.type = 'image/png';
  faviconLink.href = faviconCanvas.toDataURL('image/png');
}

let faviconT = 0;
let faviconAnim = null;
function animateFavicon(target) {
  if (faviconAnim) cancelAnimationFrame(faviconAnim);
  const start = faviconT;
  const t0 = performance.now();
  const dur = 450;
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
    faviconT = start + (target - start) * e;
    drawFavicon(faviconT);
    faviconAnim = p < 1 ? requestAnimationFrame(step) : null;
  }
  faviconAnim = requestAnimationFrame(step);
}

function applyThemeChrome(isLight) {
  if (themeColorMeta) themeColorMeta.setAttribute('content', isLight ? '#f6f6f4' : '#09090b');
}

if (themeToggle) {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');

  if (theme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.classList.add('light');
  }
  applyThemeChrome(theme === 'light');

  // paint the initial favicon to match the starting theme (no animation)
  faviconT = theme === 'light' ? 1 : 0;
  drawFavicon(faviconT);

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.classList.toggle('light');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    applyThemeChrome(isLight);
    animateFavicon(isLight ? 1 : 0); // smooth morph between palettes
  });
}


/* ---------- CURSOR-FOLLOWING GLOW DOT ---------- */
const cursorDot = document.querySelector('.cursor-dot');
if (cursorDot && window.matchMedia('(hover: hover)').matches) {
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let cx = tx, cy = ty;

  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursorDot.style.opacity = '';
  }, { passive: true });

  document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; });

  const interactive = 'a, button, .project-card, .exp-card, .theme-switch, .social-pill, .tag, .contact-chip';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) cursorDot.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) cursorDot.classList.remove('hovering');
  });

  (function loopDot() {
    cx += (tx - cx) * 0.16;
    cy += (ty - cy) * 0.16;
    cursorDot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loopDot);
  })();
}


/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');

function updateNav() {
  const scrollY = window.scrollY + 180;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
document.addEventListener('DOMContentLoaded', updateNav);


/* ---------- SMOOTH SCROLL ---------- */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObs.observe(el));


/* ---------- COUNTER ANIMATION ---------- */
function formatCountValue(value, prefix = '', suffix = '') {
  return `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
}

function animateCount(el, target, ms = 1400, options = {}) {
  if (!el) return;
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';
  if (el._countFrame) cancelAnimationFrame(el._countFrame);
  if (target === 0) {
    el.textContent = formatCountValue(0, prefix, suffix);
    return;
  }
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / ms, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatCountValue(ease * target, prefix, suffix);
    if (p < 1) {
      el._countFrame = requestAnimationFrame(update);
    } else {
      el._countFrame = null;
    }
  };
  el._countFrame = requestAnimationFrame(update);
}

function resetCount(el) {
  if (!el) return;
  if (el._countFrame) cancelAnimationFrame(el._countFrame);
  el._countFrame = null;
  el.textContent = formatCountValue(0, el.dataset.prefix || '', el.dataset.suffix || '');
}

function playTypingStats() {
  document.querySelectorAll('#typing .count-up').forEach(el => {
    animateCount(el, Number(el.dataset.target || 0), 1300, {
      prefix: el.dataset.prefix || '',
      suffix: el.dataset.suffix || '',
    });
  });
}

function resetTypingStats() {
  document.querySelectorAll('#typing .count-up').forEach(resetCount);
}


/* ---------- CHESS CANVAS DONUT ---------- */
let chessAnimationFrame = null;
let chessBarsTimeout = null;
let chessInView = false;
let latestChessStats = null;

function renderChessDonut(win, draw, loss, progress = 1) {
  const canvas = document.getElementById('chessDonut');
  if (!canvas) return;

  const dpr  = window.devicePixelRatio || 1;
  const size = 180;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx    = size / 2;
  const cy    = size / 2;
  const R     = 72;
  const lw    = 15;
  const total = win + draw + loss;

  const segments = total > 0
    ? [
        { val: win,  color: '#00b8a9' },
        { val: draw, color: '#ffc01e' },
        { val: loss, color: '#ef4743' },
      ]
    : [];

  ctx.clearRect(0, 0, size, size);

  // Background track
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth   = lw;
  ctx.stroke();

  if (total === 0) return;

  const gap     = 0.04;
  const filled  = segments.filter(s => s.val > 0);
  const totalAngle = 2 * Math.PI - filled.length * gap;
  let start     = -0.01;

  filled.forEach(seg => {
    const fullAngle = (seg.val / total) * totalAngle;
    const drawAngle = fullAngle * progress;

    ctx.beginPath();
    ctx.arc(cx, cy, R, start, start + drawAngle);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.stroke();
    start += fullAngle + gap;
  });
}

function playChessAnimation(stats = latestChessStats) {
  if (!stats) return;
  if (chessAnimationFrame) cancelAnimationFrame(chessAnimationFrame);

  latestChessStats = stats;
  resetChessStats(false);

  const total = stats.total || (stats.win + stats.draw + stats.loss);
  const totalEl = document.getElementById('chess-total');
  if (totalEl) animateCount(totalEl, total, 1500);

  setText('chess-rapid',   stats.rapid   > 0 ? stats.rapid.toLocaleString()   : 'N/A');
  setText('chess-blitz',   stats.blitz   > 0 ? stats.blitz.toLocaleString()   : 'N/A');
  setText('chess-tactics', stats.tactics > 0 ? stats.tactics.toLocaleString() : 'N/A');

  setText('chess-win',  stats.win.toLocaleString());
  setText('chess-draw', stats.draw.toLocaleString());
  setText('chess-loss', stats.loss.toLocaleString());

  if (chessBarsTimeout) clearTimeout(chessBarsTimeout);
  chessBarsTimeout = setTimeout(() => {
    setWidth('chess-win-bar',  pct(stats.win,  total));
    setWidth('chess-draw-bar', pct(stats.draw, total));
    setWidth('chess-loss-bar', pct(stats.loss, total));
    chessBarsTimeout = null;
  }, 180);

  const duration = 1500;
  const started = performance.now();

  function frame(now) {
    const p = Math.min((now - started) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 2);
    renderChessDonut(stats.win, stats.draw, stats.loss, ease);
    if (p < 1) {
      chessAnimationFrame = requestAnimationFrame(frame);
    } else {
      chessAnimationFrame = null;
    }
  }

  chessAnimationFrame = requestAnimationFrame(frame);
}

function resetChessStats(clearText = true) {
  if (chessAnimationFrame) cancelAnimationFrame(chessAnimationFrame);
  if (chessBarsTimeout) clearTimeout(chessBarsTimeout);
  chessAnimationFrame = null;
  chessBarsTimeout = null;
  renderChessDonut(0, 0, 0);
  setWidth('chess-win-bar', 0);
  setWidth('chess-draw-bar', 0);
  setWidth('chess-loss-bar', 0);

  if (!clearText) return;
  const totalEl = document.getElementById('chess-total');
  if (totalEl) {
    if (totalEl._countFrame) cancelAnimationFrame(totalEl._countFrame);
    totalEl._countFrame = null;
    totalEl.textContent = '...';
  }
  setText('chess-win', '...');
  setText('chess-draw', '...');
  setText('chess-loss', '...');
  setText('chess-rapid', '...');
  setText('chess-blitz', '...');
  setText('chess-tactics', '...');
}

/* ---------- TYPING STATS WHEN VISIBLE ---------- */
const typingSection = document.getElementById('typing');
if (typingSection) {
  resetTypingStats();
  const typingObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      playTypingStats();
    } else {
      resetTypingStats();
    }
  }, { threshold: 0.28 });
  typingObs.observe(typingSection);
}


/* ---------- CHESS DATA FETCH (Chess.com public API) ---------- */
let chessLoaded = false;

async function loadChess() {
  if (chessLoaded) {
    if (chessInView) playChessAnimation();
    return;
  }
  chessLoaded = true;

  const username = 'yabtesfu';

  try {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/stats`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (!res.ok) throw new Error('chess api failed');
    const d = await res.json();
    applyChessStats(d);
  } catch {
    chessLoaded = false; // allow a retry next time the section scrolls into view
    showChessFallback();
  }
}

function applyChessStats(d) {
  const classes = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'];
  let win = 0, draw = 0, loss = 0, peak = 0;

  classes.forEach(key => {
    const c = d[key];
    if (!c) return;
    if (c.record) {
      win  += c.record.win  || 0;
      loss += c.record.loss || 0;
      draw += c.record.draw || 0;
    }
    if (c.best && c.best.rating > peak) peak = c.best.rating;
  });

  const rapid   = (d.chess_rapid && d.chess_rapid.last && d.chess_rapid.last.rating) || 0;
  const blitz   = (d.chess_blitz && d.chess_blitz.last && d.chess_blitz.last.rating) || 0;
  const tactics = (d.tactics && d.tactics.highest && d.tactics.highest.rating) || 0;

  latestChessStats = { win, draw, loss, rapid, blitz, tactics, peak, total: win + draw + loss };
  if (chessInView) playChessAnimation();
}

function showChessFallback() {
  // Draw an empty donut and keep the loading-style placeholders.
  resetChessStats();
}

// Helpers
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setWidth(id, w) {
  const el = document.getElementById(id);
  if (el) el.style.width = w + '%';
}

function pct(n, total) {
  return total > 0 ? Math.round((n / total) * 100) : 0;
}


/* ---------- TRIGGER CHESS WHEN VISIBLE ---------- */
const chessSection = document.getElementById('chess');
if (chessSection) {
  resetChessStats();
  const cObs = new IntersectionObserver(entries => {
    chessInView = entries[0].isIntersecting;
    if (chessInView) {
      loadChess();
    } else {
      resetChessStats();
    }
  }, { threshold: 0.28 });
  cObs.observe(chessSection);
}


/* ---------- HEADER SCROLL SHADOW ---------- */
const headerEl = document.getElementById('site-header');
if (headerEl) {
  window.addEventListener('scroll', () => {
    headerEl.style.boxShadow = window.scrollY > 20
      ? '0 1px 30px rgba(0,0,0,0.3)'
      : 'none';
  }, { passive: true });
}


/* ---------- EXPERIENCE CARD CURSOR-TILT ---------- */
(function () {
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0 = left edge, 1 = right edge
      const py = (e.clientY - r.top) / r.height;   // 0 = top,  1 = bottom
      const rotY = (px - 0.5) * 9;                 // lean toward the cursor side
      const rotX = (0.5 - py) * 5;
      card.style.transform =
        `perspective(900px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(1.025)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
