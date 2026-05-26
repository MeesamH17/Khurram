/* ═══════════════════════════════════════
   INKBOUND — SERVICES.JS
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── WAVEFORM GENERATOR ──────────────────
  const wfBars = document.getElementById('wfBars');
  if (wfBars) {
    const barCount = 60;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'wf-bar';
      const baseHeight = 20 + Math.random() * 60;
      bar.style.height = baseHeight + 'px';
      bar.style.animationDelay = (Math.random() * 0.6) + 's';
      bar.style.animationDuration = (0.4 + Math.random() * 0.4) + 's';
      wfBars.appendChild(bar);
    }
  }

  // ── AUDIO PLAYER SIMULATION ─────────────
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const audioFill = document.getElementById('audioFill');
  const audioTime = document.getElementById('audioTime');

  let isPlaying = false;
  let progress = 0;
  let playInterval;
  const totalSeconds = 287; // ~4:47

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playIcon.style.display = isPlaying ? 'none' : 'block';
      pauseIcon.style.display = isPlaying ? 'block' : 'none';

      if (isPlaying) {
        playInterval = setInterval(() => {
          progress += 100 / totalSeconds;
          if (progress >= 100) { progress = 0; isPlaying = false; playIcon.style.display = 'block'; pauseIcon.style.display = 'none'; clearInterval(playInterval); }
          audioFill.style.width = progress + '%';
          const elapsed = Math.floor((progress / 100) * totalSeconds);
          const m = Math.floor(elapsed / 60);
          const s = elapsed % 60;
          audioTime.textContent = `${m}:${s.toString().padStart(2,'0')}`;

          // Animate waveform bars while playing
          document.querySelectorAll('.wf-bar').forEach(bar => {
            bar.style.height = (15 + Math.random() * 65) + 'px';
          });
        }, 1000);
      } else {
        clearInterval(playInterval);
        // Stop waveform animation
        document.querySelectorAll('.wf-bar').forEach((bar, i) => {
          bar.style.height = (15 + (i % 8) * 8) + 'px';
        });
      }
    });
  }


  // ── PACKAGE TOGGLE ───────────────────────
  const pkgToggle = document.getElementById('pkgToggle');
  if (pkgToggle) {
    const btns = pkgToggle.querySelectorAll('.pt-btn');
    const slider = pkgToggle.querySelector('.pt-slider');

    // Set initial slider size
    function updateSlider(btn) {
      slider.style.left = btn.offsetLeft + 'px';
      slider.style.width = btn.offsetWidth + 'px';
    }
    updateSlider(btns[0]);

    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('pt-active'));
        btn.classList.add('pt-active');
        updateSlider(btn);

        const type = btn.dataset.type;
        document.querySelectorAll('.pp-standard').forEach(el => {
          el.textContent = el.dataset[type];
          // Animate price change
          el.style.transform = 'scale(0.8)';
          el.style.opacity = '0';
          setTimeout(() => {
            el.textContent = el.dataset[type];
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
            el.style.transition = 'transform 0.3s, opacity 0.3s';
          }, 150);
        });
      });
    });
  }


  // ── FAQ ACCORDION ────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });


  // ── SCROLL REVEAL ────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


  // ── BAR CHART ANIMATION ──────────────────
  // Re-trigger bar animations when chart enters view
  const chartObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.sc-bar').forEach((bar, i) => {
        bar.style.animation = 'none';
        bar.offsetHeight; // reflow
        bar.style.animation = `barGrow 0.6s ease ${i * 0.06}s both`;
      });
      chartObserver.disconnect();
    }
  }, { threshold: 0.3 });

  const chart = document.querySelector('.sv-chart');
  if (chart) chartObserver.observe(chart);


  // ── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  // ── MOBILE NAV ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  if (hamburger) {
    hamburger.addEventListener('click', () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; });
    mobileClose.addEventListener('click', () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });


  // ── BACK TO TOP ──────────────────────────
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400), { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  // ── CONTACT FORM ─────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
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


  // ── SERVICE CARD GLOW ────────────────────
  document.querySelectorAll('.pkg-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.pc-glow');
      if (glow) glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,169,110,0.12), transparent 60%)`;
    });
  });

});
