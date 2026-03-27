/* ==========================================================================
   Main JS — Medica
   Shared functionality: nav, Lenis, AOS, GSAP, Vanilla Tilt,
   Intersection Observer, smooth anchor scrolling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setActiveNavLink();
  initLenis();
  initAOS();
  initVanillaTilt();
  initScrollReveal();
  initHeaderScroll();
  initCopyrightYear();
});


/* ==========================================================================
   0. AUTO-UPDATE COPYRIGHT YEAR
   ========================================================================== */

function initCopyrightYear() {
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}


/* ==========================================================================
   1. MOBILE NAV TOGGLE
   ========================================================================== */

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('site-nav--open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('site-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ==========================================================================
   2. ACTIVE NAV LINK
   ========================================================================== */

function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (path.includes(href) && href !== '/' && href !== '../') {
      link.classList.add('site-nav__link--active');
    }
  });
}


/* ==========================================================================
   3. LENIS SMOOTH SCROLL
   Handles page scrolling + smooth anchor links
   ========================================================================== */

let lenis = null;

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // Connect Lenis to GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && gsap.ticker) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });
  } else {
    // Standalone rAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth anchor scrolling — intercept all hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    });
  });
}


/* ==========================================================================
   4. AOS — Animate on Scroll
   Initialise with conservative, performant defaults
   ========================================================================== */

function initAOS() {
  if (typeof AOS === 'undefined') return;

  AOS.init({
    duration: 600,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    delay: 0,
    disable: 'mobile',       // Disable on mobile for performance
  });
}


/* ==========================================================================
   5. VANILLA TILT — Card Hover
   Applied to elements with [data-tilt]
   ========================================================================== */

function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (!tiltElements.length) return;

  VanillaTilt.init(Array.from(tiltElements), {
    max: 6,
    speed: 400,
    scale: 1.02,
    glare: true,
    'max-glare': 0.08,
    perspective: 1000,
  });
}


/* ==========================================================================
   6. INTERSECTION OBSERVER — Custom Scroll Reveal
   For elements with [data-reveal] that don't use AOS
   Lightweight alternative for fine-grained control
   ========================================================================== */

function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay, 10) || 0;

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  });

  revealElements.forEach(el => observer.observe(el));
}


/* ==========================================================================
   7. HEADER SCROLL BEHAVIOUR
   Add shadow + background on scroll via Intersection Observer
   ========================================================================== */

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const scrollThreshold = 80;
  let ticking = false;
  let wasScrolled = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isScrolled = scrollY > scrollThreshold;

      if (isScrolled !== wasScrolled) {
        header.classList.toggle('site-header--scrolled', isScrolled);
        wasScrolled = isScrolled;
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ==========================================================================
   8. GSAP — Light Entrance Animations
   Only runs if GSAP + ScrollTrigger are loaded
   ========================================================================== */

window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero content stagger
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    gsap.from(heroContent.children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  // Hero image slide in
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual) {
    gsap.from(heroVisual, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  // Section headers — fade up on scroll
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    });
  });

  // Stagger grid children on scroll
  gsap.utils.toArray('.grid-3, .grid-4').forEach(grid => {
    const children = grid.children;
    if (!children.length) return;

    gsap.from(children, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    });
  });
});
