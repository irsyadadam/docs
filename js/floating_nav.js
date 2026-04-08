// ---- Landing Page Floating Nav + Scroll Spy ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(fnav) {
    var dots = fnav.querySelectorAll('.smb-fnav-dot');
    var sectionIds = [];
    var clickLock = false;

    dots.forEach(function (d) {
      if (d.dataset.section) sectionIds.push(d.dataset.section);
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(dot.dataset.section);
        if (target) {
          clickLock = true;
          setTimeout(function () { clickLock = false; }, 1000);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          dots.forEach(function (d) { d.classList.remove('smb-fnav-active'); });
          dot.classList.add('smb-fnav-active');
        }
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        if (clickLock) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            dots.forEach(function (d) { d.classList.remove('smb-fnav-active'); });
            var active = fnav.querySelector('[data-section="' + entry.target.id + '"]');
            if (active) active.classList.add('smb-fnav-active');
          }
        });
      },
      { root: null, rootMargin: '-30% 0px -60% 0px' }
    );

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    fnav.classList.remove('smb-fnav-hidden');
  }

  if (u.waitForElement) {
    u.waitForElement('smb-floating-nav', init);
  }
})();

link.addEventListener('click', function (e) {
  e.preventDefault();
  var target = document.getElementById(dot.dataset.section);
  if (target) {
    clickLock = true;
    setTimeout(function () { clickLock = false; }, 1000);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    dots.forEach(function (d) { d.classList.remove('smb-fnav-active'); });
    dot.classList.add('smb-fnav-active');
  }
});