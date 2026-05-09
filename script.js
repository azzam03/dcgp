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
    '.solution-card, .comparison__row, .section__note, ' +
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

  /* ---------------- Project screen preview ---------------- */
  const screenItems = document.querySelectorAll('.screen');

  if (screenItems.length) {
    const preview = document.createElement('div');
    preview.className = 'screen-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.innerHTML = `
      <div class="screen-preview__backdrop" data-preview-close></div>
      <figure class="screen-preview__panel" role="dialog" aria-modal="true" aria-label="Project screen preview">
        <button class="screen-preview__close" type="button" aria-label="Close preview" data-preview-close>&times;</button>
        <img class="screen-preview__image" alt="" />
        <figcaption class="screen-preview__caption"></figcaption>
      </figure>
    `;
    document.body.appendChild(preview);

    const previewImage = preview.querySelector('.screen-preview__image');
    const previewCaption = preview.querySelector('.screen-preview__caption');
    let pinned = false;

    const showPreview = (screen, pin = false) => {
      const image = screen.querySelector('img');
      if (!image || !previewImage || !previewCaption) return;

      pinned = pin;
      previewImage.src = image.currentSrc || image.src;
      previewImage.alt = image.alt || '';
      previewCaption.textContent = screen.querySelector('.screen__caption')?.textContent || image.alt || 'Project screen';
      preview.classList.add('is-visible');
      preview.classList.toggle('is-pinned', pinned);
      preview.setAttribute('aria-hidden', 'false');
      document.body.classList.toggle('is-preview-open', pinned);
    };

    const hidePreview = (force = false) => {
      if (pinned && !force) return;
      pinned = false;
      preview.classList.remove('is-visible', 'is-pinned');
      preview.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-preview-open');
    };

    screenItems.forEach((screen) => {
      screen.addEventListener('mouseenter', () => showPreview(screen, false));
      screen.addEventListener('mouseleave', () => hidePreview(false));

      screen.addEventListener('click', (event) => {
        if (!screen.querySelector('img')) return;
        event.preventDefault();
        showPreview(screen, true);
      });
    });

    preview.querySelectorAll('[data-preview-close]').forEach((control) => {
      control.addEventListener('click', () => hidePreview(true));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hidePreview(true);
    });
  }
})();
