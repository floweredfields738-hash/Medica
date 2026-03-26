/* ==========================================================================
   Home Page JS — Before/After Slider + Review Ticker
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initReviewTicker();
});


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
