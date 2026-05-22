/* ═══════════════════════════════════════
   INKBOUND PUBLISHING — MAIN.JS
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderText = document.getElementById('loaderText');
  const messages = ['Turning pages...', 'Setting the type...', 'Binding your story...'];
  let progress = 0;
  let msgIndex = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    loaderProgress.style.width = progress + '%';

    if (progress > 33 && msgIndex === 0) { msgIndex = 1; loaderText.textContent = messages[1]; }
    if (progress > 66 && msgIndex === 1) { msgIndex = 2; loaderText.textContent = messages[2]; }

    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroReveal();
      }, 400);
    }
  }, 80);


  // ── CUSTOM CURSOR ────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();


  // ── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileNav.classList.contains('open')) closeMobileNav();
      }
    });
  });


  // ── MOBILE NAV ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileNav() { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMobileNav() { mobileNav.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', openMobileNav);
  mobileClose.addEventListener('click', closeMobileNav);


  // ── HERO REVEAL ──────────────────────────
  function triggerHeroReveal() {
    const reveals = document.querySelectorAll('#hero .reveal-up');
    reveals.forEach(el => el.classList.add('visible'));
    startCounters();
  }


  // ── SCROLL REVEAL ────────────────────────
  const scrollRevealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  scrollRevealElements.forEach(el => revealObserver.observe(el));

  // Also add data-reveal to major section elements dynamically
  const revealTargets = document.querySelectorAll(
    '.about-grid, .service-card, .process-step, .genre-card, .testi-card, .cta-content, .contact-info, .contact-form-wrap, .section-header'
  );
  revealTargets.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    const delay = Math.min(i % 4 + 1, 5);
    el.setAttribute('data-reveal-delay', delay);
    revealObserver.observe(el);
  });


  // ── STAT COUNTERS ────────────────────────
  function startCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  // Also trigger counters when stats section is visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }


  // ── TESTIMONIALS SLIDER ──────────────────
  const testiTrack = document.getElementById('testiTrack');
  const testiDots = document.querySelectorAll('.tdot');
  let currentSlide = 0;
  const totalSlides = 4;
  let autoplayTimer;

  function goToSlide(n) {
    currentSlide = n;
    // On mobile show 1, on desktop show 2
    const visibleCount = window.innerWidth > 768 ? 2 : 1;
    const slideWidth = 100 / visibleCount;
    testiTrack.style.transform = `translateX(-${n * slideWidth}%)`;
    testiDots.forEach((d, i) => d.classList.toggle('active', i === n));
  }

  testiDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoplayTimer);
      goToSlide(i);
      startAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      const next = (currentSlide + 1) % (window.innerWidth > 768 ? 3 : totalSlides);
      goToSlide(next);
    }, 5000);
  }
  startAutoplay();

  // Touch/swipe support
  let touchStartX = 0;
  const slider = document.getElementById('testiSlider');
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
  slider.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > 50) {
      clearInterval(autoplayTimer);
      if (delta > 0) goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      else goToSlide(Math.max(currentSlide - 1, 0));
      startAutoplay();
    }
  });


  // ── CONTACT FORM ─────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"] span');
      btn.textContent = 'Sending...';

      // Simulate submission (replace with real backend call)
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.style.display = 'block';
      }, 1400);
    });

    // Input focus effects
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.style.setProperty('--focus', '1');
      });
    });
  }


  // ── BACK TO TOP ──────────────────────────
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ── PARALLAX (lightweight) ───────────────
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero orbs subtle parallax
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.1}px)`;

    // Floating books parallax
    document.querySelectorAll('.book').forEach((book, i) => {
      const speed = 0.04 + i * 0.02;
      book.style.transform += ` translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });


  // ── SERVICE CARD GLOW TRACK ──────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.sc-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,169,110,0.15), transparent 60%)`;
      }
    });
  });


  // ── MAGNETIC BUTTONS ─────────────────────
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

});
