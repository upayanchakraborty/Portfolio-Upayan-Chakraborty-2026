  // ─── HAMBURGER MENU ───
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('navDrawer');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navDrawer.classList.toggle('open');
    document.body.style.overflow = navDrawer.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── HERO NAME FIT ───
  function fitHeroName() {
    const el = document.querySelector('.hero-name');
    if (!el) return;
    const container = el.parentElement;
    const maxW = container.clientWidth - 32;
    el.style.fontSize = '';
    el.style.whiteSpace = 'nowrap';
    let computed = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > maxW && computed > 14) {
      computed -= 1;
      el.style.fontSize = computed + 'px';
    }
    if (computed <= 14) {
      el.style.whiteSpace = 'normal';
      el.style.fontSize = '';
    }
  }
  fitHeroName();
  window.addEventListener('resize', fitHeroName);

  // ─── CUSTOM CURSOR ───
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let mx = 0, my = 0, tx = 0, ty = 0, visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = (mx - 6) + 'px';
    cursor.style.top = (my - 6) + 'px';
    if (!visible) {
      visible = true;
      cursor.style.opacity = '1';
      trail.style.opacity = '0.55';
    }
  });

  function animateCursor() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    trail.style.left = (tx - 18) + 'px';
    trail.style.top = (ty - 18) + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn, .pill, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2.5)';
      trail.style.transform = 'scale(0.5)';
      trail.style.borderColor = 'var(--accent2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      trail.style.transform = 'scale(1)';
      trail.style.borderColor = 'var(--accent)';
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if(visible){ cursor.style.opacity = '1'; trail.style.opacity = '0.55'; }});

  // ─── NAVBAR SCROLL ───
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // ─── COUNTER ANIMATION ───
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        const raw = e.target.dataset.target;
        const suffix = raw === '400' ? 'K+' : raw === '85' ? '%+' : '+';
        animateCounter(e.target, target, suffix);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.stat-num').forEach(el => {
    const raw = el.dataset.target;
    const suffix = raw === '400' ? 'K+' : raw === '85' ? '%+' : '+';
    el.textContent = raw + suffix;
    setTimeout(() => counterObserver.observe(el), 300);
  });

  // ─── PROJECT CARD MOUSE GLOW ───
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  // ─── SCROLL REVEAL ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove('hidden');
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('hidden');
    revealObserver.observe(el);
  });

  // Also apply to exp-item and project-card
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove('hidden');
        e.target.classList.add('visible');
        slideObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.exp-item, .project-card').forEach(el => {
    el.classList.add('hidden');
    slideObserver.observe(el);
  });

  // ─── ACTIVE NAV HIGHLIGHT ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObserver.observe(s));
// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      formStatus.textContent = '✗ Something went wrong. Try emailing me directly.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}
