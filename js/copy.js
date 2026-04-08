// ---- Copy Button (landing page hero install block) ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(btn) {
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

  if (u.waitForElement) {
    u.waitForElement('smb-copy-btn', init);
  }
})();