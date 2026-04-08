// ---- Standard Model Bio — Shared Utilities ----
// Provides waitForElement and waitForSelector on window
// so other modules can use them without duplication.

(function () {
  'use strict';

  window.smbUtils = {
    waitForElement: function (id, callback, maxAttempts) {
      var attempts = 0;
      var interval = setInterval(function () {
        attempts++;
        var el = document.getElementById(id);
        if (el) {
          clearInterval(interval);
          callback(el);
        } else if (attempts >= (maxAttempts || 80)) {
          clearInterval(interval);
        }
      }, 100);
    },

    waitForSelector: function (selector, callback, maxAttempts) {
      var attempts = 0;
      var interval = setInterval(function () {
        attempts++;
        var el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          callback(el);
        } else if (attempts >= (maxAttempts || 80)) {
          clearInterval(interval);
        }
      }, 100);
    }
  };
})();

