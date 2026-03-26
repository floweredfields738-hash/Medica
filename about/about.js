/* ==========================================================================
   About Page JS
   ========================================================================== */

/* --- Interactive Showcase Tabs --- */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.showcase__tab');
  const panels = document.querySelectorAll('.showcase__panel');
  const inner = document.querySelector('.showcase__inner');

  if (!tabs.length || !inner) return;

  let transitioning = false;

  // Set initial gradient
  inner.setAttribute('data-active-tab', 'partners');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (transitioning || tab.classList.contains('showcase__tab--active')) return;

      transitioning = true;

      // Update active tab immediately
      tabs.forEach(t => t.classList.remove('showcase__tab--active'));
      tab.classList.add('showcase__tab--active');

      // Fade out content
      inner.classList.add('showcase__inner--fading');

      // After fade out, swap content and fade back in
      setTimeout(() => {
        // Switch panels
        panels.forEach(p => {
          if (p.dataset.panel === target) {
            p.classList.add('showcase__panel--active');
          } else {
            p.classList.remove('showcase__panel--active');
          }
        });

        // Switch gradient
        inner.setAttribute('data-active-tab', target);

        // Fade back in
        inner.classList.remove('showcase__inner--fading');
        transitioning = false;
      }, 300);
    });
  });
});
