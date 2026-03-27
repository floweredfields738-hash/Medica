/* ==========================================================================
   Home Page JS — Before/After Slider + Review Ticker
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initBeforeAfterSlider();
  initReviewTicker();
  initTreatmentsFan();
});


/* ==========================================================================
   Preloader — 0.7s display, then morph into hero container
   ========================================================================== */

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // After 0.7s, start dismiss
  setTimeout(() => {
    preloader.classList.add('preloader--done');

    // After bg morph completes, hide entirely
    setTimeout(() => {
      preloader.classList.add('preloader--hidden');
    }, 900);
  }, 700);
}


/* ==========================================================================
   Before / After Slider
   ========================================================================== */

function initBeforeAfterSlider() {
  const slider = document.querySelector('.ba-slider');
  if (!slider) return;

  const before = slider.querySelector('.ba-slider__img--before');
  const handle = slider.querySelector('.ba-slider__handle');
  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));

    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  function onPointerDown(e) {
    isDragging = true;
    slider.setPointerCapture(e.pointerId);
    setPosition(e.clientX);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    setPosition(e.clientX);
  }

  function onPointerUp() {
    isDragging = false;
  }

  slider.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointermove', onPointerMove);
  slider.addEventListener('pointerup', onPointerUp);
  slider.addEventListener('pointercancel', onPointerUp);
}


/* ==========================================================================
   Review Ticker — Infinite auto-scroll with drag + hover control
   ========================================================================== */

function initReviewTicker() {
  const ticker = document.querySelector('.bento__e-ticker');
  const track = document.querySelector('.bento__e-track');
  if (!ticker || !track) return;

  // Clone reviews for seamless loop
  const reviews = Array.from(track.children);
  reviews.forEach(r => {
    const clone = r.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Auto-scroll state
  let scrollSpeed = 0.15; // px per frame
  let baseSpeed = 0.15;
  let currentScroll = 0;
  let isHovering = false;
  let isDragging = false;
  let dragStartY = 0;
  let dragScrollStart = 0;
  let animId;

  // Calculate reset point (height of original items)
  function getResetHeight() {
    let h = 0;
    for (let i = 0; i < reviews.length; i++) {
      h += reviews[i].offsetHeight + 12; // 12px gap
    }
    return h;
  }

  function animate() {
    if (!isDragging) {
      const speed = isHovering ? baseSpeed * 0.2 : baseSpeed;
      currentScroll += speed;

      const resetH = getResetHeight();
      if (resetH > 0 && currentScroll >= resetH) {
        currentScroll -= resetH;
      }
    }

    track.style.transform = `translateY(-${currentScroll}px)`;
    animId = requestAnimationFrame(animate);
  }

  animate();

  // Hover — slow down
  ticker.addEventListener('mouseenter', () => { isHovering = true; });
  ticker.addEventListener('mouseleave', () => { isHovering = false; });

  // Drag to scroll
  ticker.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragStartY = e.clientY;
    dragScrollStart = currentScroll;
    ticker.setPointerCapture(e.pointerId);
  });

  ticker.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const delta = dragStartY - e.clientY;
    currentScroll = Math.max(0, dragScrollStart + delta);
  });

  ticker.addEventListener('pointerup', () => { isDragging = false; });
  ticker.addEventListener('pointercancel', () => { isDragging = false; });
}


/* ==========================================================================
   Treatments Fan — Rotating circle of cards + click to change heading
   ========================================================================== */

function initTreatmentsFan() {
  const fan = document.querySelector('.treatments__fan');
  const heading = document.querySelector('.treatments__heading');
  const sub = document.querySelector('.treatments__sub');
  if (!fan || !heading) return;

  const cards = Array.from(fan.querySelectorAll('.treatments__card'));
  const count = cards.length;
  if (!count) return;

  // Treatment data
  const data = {
    'skin-rejuvenation': {
      heading: 'Healthy, confident<br>skin starts here',
      sub: 'Advanced dermatology and modern<br>aesthetic treatments designed to improve'
    },
    'laser-treatments': {
      heading: 'Precision laser<br>technology',
      sub: 'Targeted light-based treatments for<br>lasting skin clarity and renewal'
    },
    'chemical-peels': {
      heading: 'Reveal your<br>natural glow',
      sub: 'Clinical-grade peels that resurface<br>and rejuvenate from within'
    },
    'acne-skin-health': {
      heading: 'Clear skin,<br>real confidence',
      sub: 'Evidence-based acne solutions<br>for every skin type and age'
    },
    'botox-fillers': {
      heading: 'Subtle enhancements,<br>natural results',
      sub: 'Expert injectables that refresh<br>without changing who you are'
    },
    'scar-reduction': {
      heading: 'Smooth away<br>the past',
      sub: 'Advanced scar therapies that restore<br>texture and confidence'
    },
    'aging-solutions': {
      heading: 'Age gracefully,<br>on your terms',
      sub: 'Anti-ageing treatments that<br>work with your natural beauty'
    },
    'prp-therapy': {
      heading: 'Heal from<br>within',
      sub: 'Platelet-rich plasma therapy<br>for natural tissue regeneration'
    }
  };

  // Circle rotation state
  const radius = 220;
  const sliceAngle = 360 / count;
  let angle = 0;
  let speed = 0.018; // degrees per frame
  let isHovered = false;

  let lastTopTreatment = null;

  // Position cards in a circle + detect which is at the top
  function positionCards() {
    let topCard = null;
    let topY = Infinity;

    cards.forEach((card, i) => {
      const cardAngle = angle + (i * sliceAngle);
      const rad = (cardAngle - 90) * (Math.PI / 180);
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;

      card.style.transform = `translate(${x}px, ${y}px) rotate(${cardAngle}deg)`;
      card.style.transformOrigin = 'center center';

      const normalizedY = Math.sin(rad);
      card.style.zIndex = Math.round((1 - normalizedY) * 10);

      // Track the card closest to the top (most negative y)
      if (y < topY) {
        topY = y;
        topCard = card;
      }
    });

    // If the top card changed, update heading
    if (topCard && topCard.dataset.treatment !== lastTopTreatment) {
      lastTopTreatment = topCard.dataset.treatment;
      const info = data[lastTopTreatment];
      if (info) {
        cards.forEach(c => c.classList.remove('treatments__card--active'));
        topCard.classList.add('treatments__card--active');

        heading.style.opacity = '0';
        heading.style.transform = 'translateY(8px)';
        setTimeout(() => {
          heading.innerHTML = info.heading;
          if (sub) sub.innerHTML = info.sub;
          heading.style.opacity = '1';
          heading.style.transform = 'translateY(0)';
        }, 250);
      }
    }
  }

  // Animation loop
  function animate() {
    if (!isHovered) {
      angle += speed;
      if (angle >= 360) angle -= 360;
    }
    positionCards();
    requestAnimationFrame(animate);
  }

  // Initial position + start
  positionCards();
  requestAnimationFrame(animate);

  // Hover — pause rotation
  fan.addEventListener('mouseenter', () => { isHovered = true; });
  fan.addEventListener('mouseleave', () => { isHovered = false; });

  // Click handler — update heading
  heading.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const treatment = card.dataset.treatment;
      const info = data[treatment];
      if (!info) return;

      cards.forEach(c => c.classList.remove('treatments__card--active'));
      card.classList.add('treatments__card--active');

      heading.style.opacity = '0';
      heading.style.transform = 'translateY(8px)';

      setTimeout(() => {
        heading.innerHTML = info.heading;
        if (sub) sub.innerHTML = info.sub;
        heading.style.opacity = '1';
        heading.style.transform = 'translateY(0)';
      }, 250);
    });
  });
}
