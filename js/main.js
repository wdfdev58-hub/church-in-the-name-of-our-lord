/* Revival Fire Ministry — motion & the living ember field.
   Signature element: canvas embers rising through the Kalahari night,
   with a GSAP-orchestrated hero and scroll-triggered reveals. */

(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------- Embers */
  class EmberField {
    constructor(canvas, { density = 1, reactive = false } = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.density = density;
      this.reactive = reactive;
      this.embers = [];
      this.mouse = { x: 0.5, y: 0.5, active: false };
      this.resize();
      window.addEventListener('resize', () => this.resize());
      if (reactive) {
        canvas.parentElement.addEventListener('pointermove', (e) => {
          const r = this.c.getBoundingClientRect();
          this.mouse.x = (e.clientX - r.left) / r.width;
          this.mouse.y = (e.clientY - r.top) / r.height;
          this.mouse.active = true;
        });
      }
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.c.clientWidth, h = this.c.clientHeight;
      this.c.width = w * dpr; this.c.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      const target = Math.round((w * h) / 26000 * this.density);
      this.count = Math.max(18, Math.min(target, 150));
      this.embers = Array.from({ length: this.count }, () => this.spawn(true));
    }
    spawn(initial = false) {
      const palette = ['#3B6EF5', '#F5C542', '#1E3A8F', '#9DC0FF'];
      return {
        x: Math.random() * this.w,
        y: initial ? Math.random() * this.h : this.h + 10,
        r: Math.random() * 2 + 0.6,
        vy: -(Math.random() * 0.5 + 0.18),
        vx: (Math.random() - 0.5) * 0.3,
        life: 0,
        max: Math.random() * 320 + 180,
        color: palette[(Math.random() * palette.length) | 0],
        flick: Math.random() * Math.PI * 2,
      };
    }
    step() {
      const { ctx, w, h } = this;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.embers.length; i++) {
        const e = this.embers[i];
        e.life++;
        e.flick += 0.08;
        let drift = e.vx + Math.sin(e.life * 0.02) * 0.15;
        if (this.reactive && this.mouse.active) {
          drift += (this.mouse.x - e.x / w) * 0.25;
          e.vy -= 0.0009;
        }
        e.x += drift;
        e.y += e.vy;
        const p = e.life / e.max;
        const alpha = Math.sin(Math.min(p, 1) * Math.PI) * (0.55 + Math.sin(e.flick) * 0.25);
        const radius = e.r * (1 + Math.sin(e.flick) * 0.2);
        ctx.beginPath();
        ctx.fillStyle = e.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 12;
        ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (e.y < -10 || e.life > e.max || e.x < -20 || e.x > w + 20) this.embers[i] = this.spawn();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      this.raf = requestAnimationFrame(() => this.step());
    }
    start() { if (!this.raf) this.step(); }
    // A calm, static single frame for reduced-motion users.
    paintStatic() {
      const { ctx, w, h } = this;
      ctx.globalCompositeOperation = 'lighter';
      this.embers.forEach((e) => {
        ctx.beginPath(); ctx.fillStyle = e.color; ctx.globalAlpha = 0.4;
        ctx.shadowColor = e.color; ctx.shadowBlur = 10;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
  }

  const heroCanvas = document.getElementById('embers');
  const scrCanvas = document.getElementById('embers2');
  const heroField = heroCanvas && new EmberField(heroCanvas, { density: 1.2, reactive: true });
  const scrField = scrCanvas && new EmberField(scrCanvas, { density: 0.7 });
  if (reduce) {
    heroField && heroField.paintStatic();
    scrField && scrField.paintStatic();
  } else {
    heroField && heroField.start();
    scrField && scrField.start();
  }

  /* ----------------------------------------------------------------- Nav + progress */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------------- GSAP */
  if (reduce || !window.gsap) {
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Ignite intro → hero
  const intro = document.getElementById('intro');
  const tl = gsap.timeline();
  tl.to('.intro-spark', { boxShadow: '0 0 60px 24px rgba(59,110,245,0.9)', scale: 3, duration: 0.7, ease: 'power2.out' })
    .to('#intro', { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => intro && (intro.style.display = 'none') }, '+=0.15')
    // Hero headline: rise + fade, line by line
    .from('.hero-title .line', { yPercent: 115, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.12 }, '-=0.3')
    .from('section:first-of-type .reveal', { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, '-=0.7');

  // Scroll reveals (skip the hero's, already handled)
  gsap.utils.toArray('.reveal').forEach((el) => {
    if (el.closest('section:first-of-type')) return;
    gsap.from(el, {
      y: 34, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  // Pinned scripture: hold, drift the embers, gently scale the verse
  ScrollTrigger.create({
    trigger: '#scripture',
    start: 'top top',
    end: '+=120%',
    pin: true,
    pinSpacing: true,
  });
  gsap.fromTo('#verse',
    { scale: 0.94, opacity: 0.25 },
    { scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '#scripture', start: 'top 80%', end: 'top top', scrub: true } });
  gsap.to('#verseTag', {
    letterSpacing: '0.6em', ease: 'none',
    scrollTrigger: { trigger: '#scripture', start: 'top bottom', end: 'top top', scrub: true },
  });

  // Subtle parallax on the two big gradient statements
  gsap.utils.toArray('.hero-title').forEach((el) => {
    gsap.to(el, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
  });
})();
