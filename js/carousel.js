// ---- Paper Carousel — Clone cards for seamless infinite loop ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(carousel) {
    var track = carousel.querySelector('.smb-paper-carousel-track');
    if (!track) return;
    var cards = track.querySelectorAll('.smb-paper-card');
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  if (u.waitForElement) {
    u.waitForElement('smb-paper-carousel', init);
  }
})();