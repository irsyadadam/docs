// ---- Pipeline Carousel — Animated step-through with progress ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init() {
    var pipelines = document.querySelectorAll('.smb-pipeline');
    pipelines.forEach(function (pipeline) {
      var cards = pipeline.querySelector('.smb-pipeline-cards');
      var items = pipeline.querySelectorAll('.smb-pipeline-card');
      var dots = pipeline.querySelectorAll('.smb-pipeline-dot');
      var fill = pipeline.querySelector('.smb-pipeline-progress-fill');
      var counter = pipeline.querySelector('.smb-pipeline-counter');
      var prevBtn = pipeline.querySelector('.smb-pipeline-prev');
      var nextBtn = pipeline.querySelector('.smb-pipeline-next');
      var total = items.length;
      var current = 0;

      function goTo(idx) {
        if (idx < 0) idx = total - 1;
        if (idx >= total) idx = 0;
        current = idx;

        cards.style.transform = 'translateX(-' + (current * 100) + '%)';

        dots.forEach(function (d, i) {
          d.classList.remove('smb-pipeline-dot-active', 'smb-pipeline-dot-done');
          if (i < current) d.classList.add('smb-pipeline-dot-done');
          if (i === current) d.classList.add('smb-pipeline-dot-active');
        });

        if (fill) {
          fill.style.width = ((current + 1) / total) * 100 + '%';
          fill.style.left = '0%';
        }

        if (counter) {
          counter.textContent = (current + 1) + ' / ' + total;
        }
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
      });

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      goTo(0);
    });
  }

  if (u.waitForSelector) {
    u.waitForSelector('.smb-pipeline', init);
  }
})();