// ---- Pill Tabs — JS-driven tab switching ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init() {
    var tabGroups = document.querySelectorAll('.smb-pill-tabs');
    tabGroups.forEach(function (group) {
      var buttons = group.querySelectorAll('.smb-pill-tab-label');
      var panels = group.querySelectorAll('.smb-pill-tab-panel');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');

          buttons.forEach(function (b) { b.classList.remove('smb-pill-tab-active'); });
          btn.classList.add('smb-pill-tab-active');

          panels.forEach(function (p) {
            if (p.getAttribute('data-panel') === target) {
              p.classList.remove('smb-hidden');
            } else {
              p.classList.add('smb-hidden');
            }
          });
        });
      });
    });
  }

  if (u.waitForSelector) {
    u.waitForSelector('.smb-pill-tabs', init);
  }
})();