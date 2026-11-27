/* =====================================================================
   Zarin Saima Rithy — Portfolio interactions
   Theme toggle · mobile nav · active link · reveal · counters · typing
   ===================================================================== */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const metaTheme = $('meta[name="theme-color"]');
  const THEME_COLOR = { dark: '#0a1828', light: '#f3f9fd' };

  function applyTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    if (save) localStorage.setItem('theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', THEME_COLOR[theme]);
  }
  applyTheme(root.getAttribute('data-theme') || 'light', false);
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- Sticky nav shadow + scroll progress + back-to-top ---------- */
  const nav = $('#nav');
  const progress = $('.scroll-progress');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('is-scrolled', y > 10);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop.classList.toggle('is-visible', y > 600);
    setActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Mobile menu ---------- */
  const burger = $('#navBurger');
  const links = $('#navLinks');

  function closeMenu() {
    burger.classList.remove('is-open');
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  burger.addEventListener('click', () => {
    const open = !links.classList.contains('is-open');
    burger.classList.toggle('is-open', open);
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', links).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  /* ---------- Active nav link while scrolling ---------- */
  const navAnchors = $$('a[href^="#"]', links);
  const sections = navAnchors.map(a => $(a.getAttribute('href'))).filter(Boolean);

  function setActiveLink() {
    const offset = window.innerHeight * 0.35;
    let current = null;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top - offset <= 0) current = sec;
    }
    navAnchors.forEach(a => a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters (supports decimals, e.g. CGPA 3.78) ---------- */
  const counters = $$('.stat__num');

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const fmt = n => n.toFixed(decimals);
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Typing effect (hero) ---------- */
  const typedEl = $('#typed');
  const phrases = ['Environmental Philosophy', 'Deep Ecology', 'Spinoza Studies', 'Ethics & Metaphysics'];
  if (reduceMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = phrases[pi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);
      let delay = deleting ? 45 : 85;
      if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  }

  /* ---------- 3D tilt on hobby cards (desktop pointer only) ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    $$('.tilt').forEach(card => {
      const MAX = 7; // degrees
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', ((px - .5) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - py) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Anime ring: rotate, mark the front card, show its poster behind ---------- */
  const stage = $('.ring-stage');
  const ring = stage && $('.ring', stage);
  if (ring) {
    const tiles = $$('li', ring);
    const n = tiles.length;
    const step = 360 / n;
    const flat = window.matchMedia('(max-width: 420px), (prefers-reduced-motion: reduce)');
    const backLayers = $$('.anime-backdrop span');
    let layer = 0;
    let front = -1;

    const posterOf = li => { const p = $('.ring__poster', li); return p ? p.style.backgroundImage : ''; };

    function setFront(i) {
      if (i === front) return;
      front = i;
      tiles.forEach((t, k) => t.classList.toggle('is-front', k === i));
      if (backLayers.length === 2) {
        layer = 1 - layer;
        backLayers[layer].style.backgroundImage = posterOf(tiles[i]);
        backLayers[layer].classList.add('is-on');
        backLayers[1 - layer].classList.remove('is-on');
      }
    }

    // pause while hovered/focused or scrolled out of view
    let hovered = false, onScreen = true;
    stage.addEventListener('pointerenter', () => { hovered = true; });
    stage.addEventListener('pointerleave', () => { hovered = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }).observe(stage);
    }

    const SPEED = 360 / 40000; // one full turn every 40 s
    let angle = 0, last = performance.now();
    stage.classList.add('is-js');
    function frame(now) {
      const dt = Math.min(now - last, 250); // cap jumps after a hidden tab or a slow frame
      last = now;
      if (!flat.matches) {
        if (!hovered && onScreen) angle = (angle + dt * SPEED) % 360;
        ring.style.transform = `rotateY(${-angle}deg)`;
        setFront(Math.round(angle / step) % n);
      } else if (front !== -1) {
        front = -1;
        tiles.forEach(t => t.classList.remove('is-front'));
        backLayers.forEach(b => b.classList.remove('is-on'));
      }
      requestAnimationFrame(frame);
    }
    setFront(0);
    requestAnimationFrame(frame);
  }

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Subtle parallax on hero blobs (desktop, pointer only) ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const blobs = $$('.blob');
    let raf = null;
    window.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        blobs.forEach((b, i) => {
          const k = (i + 1) * 12;
          b.style.translate = `${x * k}px ${y * k}px`;
        });
        raf = null;
      });
    }, { passive: true });
  }

  onScroll();
})();
