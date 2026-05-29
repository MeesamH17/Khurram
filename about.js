/* ═══════════════════════════════════════
   INKBOUND — ABOUT.JS
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR ──────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
  });
  (function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // ── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  // ── MOBILE NAV ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  hamburger.addEventListener('click', () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; });
  mobileClose.addEventListener('click', () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });

  // ── SMOOTH SCROLL ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── PARTICLES ────────────────────────────
  const particleContainer = document.getElementById('ahParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'ah-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
      particleContainer.appendChild(p);
    }
  }

  // ── HERO STAT COUNTERS ───────────────────
  function runCounters(els) {
    els.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  const heroStats = document.querySelectorAll('.aqs-num[data-target]');
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { runCounters(heroStats); heroObserver.disconnect(); }
  }, { threshold: 0.5 });
  if (heroStats.length) heroObserver.observe(heroStats[0].closest('.ah-quick-stats'));

  // ── NUMBER CARDS COUNTERS ────────────────
  const numCards = document.querySelectorAll('.num-card');
  const numObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('counted');
        const numEl = card.querySelector('.nc-num[data-target]');
        if (numEl) runCounters([numEl]);
        numObserver.unobserve(card);
      }
    });
  }, { threshold: 0.3 });
  numCards.forEach(c => numObserver.observe(c));

  // ── SCROLL REVEAL ────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // ── BACK TO TOP ──────────────────────────
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── CONTACT FORM ─────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"] span');
      btn.textContent = 'Sending...';
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.classList.add('visible');
      }, 1400);
    });
  }

  // ── MAGNETIC BUTTONS ─────────────────────
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

});
