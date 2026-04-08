// ---- Doc Page: Smooth scroll-reveal entrance animations ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(page) {
    if (document.querySelector('.smb-landing')) return;

    var animTargets = page.querySelectorAll(
      '.smb-card, .smb-step, .smb-code-wrap, .smb-table-wrap, .smb-callout, .smb-contact'
    );

    if (!animTargets.length) return;

    var animObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('smb-animate-in');
            animObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    animTargets.forEach(function (el) {
      el.classList.add('smb-animate-target');
      animObserver.observe(el);
    });
  }

  if (u.waitForSelector) {
    u.waitForSelector('.smb-page', init);
  }
})();