// ---- Standard Model Bio — Floating Nav + Copy Button ----
// Mintlify auto-includes .js files on every page.
// Each block guards itself so it only runs when relevant elements exist.

(function () {
  // ---- Copy button ----
  var btn = document.getElementById('smb-copy-btn');
  if (btn) {
    var cmd =
      'bash -c "$(curl -fsSL https://docs.standardmodel.bio/quickstart.sh)"';
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(cmd).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () {
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  }

  // ---- Infinite carousel — clone cards for seamless loop ----
  var carousel = document.getElementById('smb-paper-carousel');
  if (carousel) {
    var cards = carousel.querySelectorAll('.smb-paper-card');
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      carousel.appendChild(clone);
    });
  }

  // ---- Floating nav (only exists on landing page) ----
  var fnav = document.getElementById('smb-floating-nav');
  if (!fnav) return;

  var dots = fnav.querySelectorAll('.smb-fnav-dot');
  var sectionIds = [];
  dots.forEach(function (d) {
    if (d.dataset.section) sectionIds.push(d.dataset.section);
  });

  // ---- Smooth scroll on click (enhances the native href="#id" behavior) ----
  dots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(dot.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      history.replaceState(null, '', '#' + dot.dataset.section);
    });
  });

  // ---- IntersectionObserver — highlight active section ----
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          dots.forEach(function (d) {
            d.classList.remove('smb-fnav-active');
          });
          var active = fnav.querySelector(
            '[data-section="' + entry.target.id + '"]'
          );
          if (active) active.classList.add('smb-fnav-active');
        }
      });
    },
    {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
    }
  );

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ---- Show/hide floating nav based on scroll position ----
  function checkScroll() {
    var scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollTop < 200) {
      fnav.classList.add('smb-fnav-hidden');
    } else {
      fnav.classList.remove('smb-fnav-hidden');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();