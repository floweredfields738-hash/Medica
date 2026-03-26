/* ==========================================================================
   About Page JS
   ========================================================================== */

/* --- Interactive Showcase Tabs --- */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.showcase__tab');
  const panels = document.querySelectorAll('.showcase__panel');
  const statNumbers = document.querySelectorAll('.showcase__stat-number');
  const statLabels = document.querySelectorAll('.showcase__stat-label');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('showcase__tab--active'));
      tab.classList.add('showcase__tab--active');

      // Switch panel
      panels.forEach(p => {
        p.classList.remove('showcase__panel--active');
        if (p.dataset.panel === target) {
          p.classList.add('showcase__panel--active');
        }
      });

      // Switch stat
      statNumbers.forEach(s => {
        s.style.display = s.dataset.stat === target ? '' : 'none';
      });
      statLabels.forEach(s => {
        s.style.display = s.dataset.statLabel === target ? '' : 'none';
      });
    });
  });
});
