// ---- Terminal copy button (install page) ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(btn) {
    var cmd =
      'bash -c "$(curl -fsSL https://docs.standardmodel.bio/quickstart.sh)"';
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(cmd).then(function () {
        btn.textContent = 'Copied!';
        btn.style.color = 'rgba(40,200,64,0.8)';
        btn.style.borderColor = 'rgba(40,200,64,0.2)';
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      });
    });
  }

  if (u.waitForElement) {
    u.waitForElement('smb-terminal-copy', init);
  }
})();

// ---- Terminal styling + copy (install page) ----

(function () {
  'use strict';

  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    var terminals = document.querySelectorAll('.smb-terminal-body code');
    if (terminals.length > 0) {
      clearInterval(interval);
      terminals.forEach(function (code) {
        var text = code.textContent || '';
        if (text.trim().startsWith('$')) {
          var rest = text.slice(text.indexOf('$') + 1);
          code.innerHTML =
            '<span style="color:#E8573A;font-weight:600">$</span>' +
            '<span style="color:#e8e8e8">' + rest + '</span>';
        }
      });
    } else if (attempts >= 80) {
      clearInterval(interval);
    }
  }, 100);

  // Copy button
  var copyAttempts = 0;
  var copyInterval = setInterval(function () {
    copyAttempts++;
    var btn = document.getElementById('smb-terminal-copy');
    if (btn) {
      clearInterval(copyInterval);
      var cmd = 'bash -c "$(curl -fsSL https://docs.standardmodel.bio/quickstart.sh)"';
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(cmd).then(function () {
          btn.textContent = 'Copied!';
          btn.style.color = 'rgba(40,200,64,0.8)';
          btn.style.borderColor = 'rgba(40,200,64,0.2)';
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2000);
        });
      });
    } else if (copyAttempts >= 80) {
      clearInterval(copyInterval);
    }
  }, 100);

})();