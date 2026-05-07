/* =========================================================
   DCGP Landing Page — Interactive behaviour
   - Scroll-triggered reveal animations
   - Mobile menu toggle
   - Smooth scroll polish for anchor links
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- Reveal on scroll ---------------- */
  // Mark elements that should fade in: section headers, cards, photo blocks.
  const revealCandidates = document.querySelectorAll(
    '.section__header, .problem-card, .feature, .audience__card, ' +
    '.commercial__card, .screen, .value__col, .market__copy, .market__panel, ' +
    '.developer__photo, .developer__copy, .workflow__step, .solution-item, ' +
    '.cta__inner'
  );
  revealCandidates.forEach((el) => el.classList.add('reveal'));

  // IntersectionObserver triggers the reveal exactly once per element.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small staggered delay for siblings inside the same parent
            const siblings = Array.from(entry.target.parentElement?.children || []);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx >= 0 ? Math.min(idx, 6) * 60 : 0) + 'ms';
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything if IO unsupported
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Mobile menu toggle ---------------- */
  // The hamburger appears below 1024px. Tapping it expands an inline list.
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav__links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Inline styles let us avoid touching the desktop CSS
      if (isOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255,255,255,0.98)';
        navLinks.style.padding = '20px 28px';
        navLinks.style.borderBottom = '1px solid rgba(15,23,42,0.06)';
        navLinks.style.gap = '16px';
      } else {
        navLinks.removeAttribute('style');
      }
    });

    // Close the menu when a nav link is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          navLinks.removeAttribute('style');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------------- Subtle nav shadow on scroll ---------------- */
  // Adds a faint elevation to the sticky nav once the user scrolls past the hero edge.
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        nav.style.boxShadow = '0 1px 0 rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
