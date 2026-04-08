

(function () {
  'use strict';

  // Copy button
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    var btn = document.getElementById('smb-terminal-copy');
    if (btn) {
      clearInterval(interval);
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
    } else if (attempts >= 80) {
      clearInterval(interval);
    }
  }, 100);

})();