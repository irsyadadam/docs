// ---- Doc Page: Auto-generated floating TOC ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function init(page) {
    if (document.querySelector('.smb-landing')) return;

    var headings = page.querySelectorAll('.smb-h2[id], .smb-h3[id], h2[id], h3[id]');
    if (headings.length < 2) return;

    var toc = document.createElement('nav');
    toc.className = 'smb-doc-toc';
    toc.setAttribute('aria-label', 'On this page');

    var tocTitle = document.createElement('div');
    tocTitle.className = 'smb-doc-toc-title';
    tocTitle.textContent = 'On this page';
    toc.appendChild(tocTitle);

    var tocList = document.createElement('div');
    tocList.className = 'smb-doc-toc-list';

    var clickLock = false;

    headings.forEach(function (h) {
      var item = document.createElement('div');
      item.className = 'smb-doc-toc-item';
      if (h.classList.contains('smb-h3') || h.tagName === 'H3') {
        item.classList.add('smb-doc-toc-item-sub');
      }

      var link = document.createElement('a');
      link.className = 'smb-doc-toc-link';
      link.dataset.target = h.id;

      var label = document.createElement('span');
      label.className = 'smb-doc-toc-label';
      label.textContent = h.textContent;
      link.appendChild(label);

      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(link.dataset.target);
        if (target) {
          clickLock = true;
          setTimeout(function () { clickLock = false; }, 1000);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          var allLinks = toc.querySelectorAll('.smb-doc-toc-link');
          allLinks.forEach(function (l) { l.classList.remove('smb-doc-toc-active'); });
          link.classList.add('smb-doc-toc-active');
        }
      });

      item.appendChild(link);
      tocList.appendChild(item);
    });

    toc.appendChild(tocList);
    document.body.appendChild(toc);

    var tocLinks = toc.querySelectorAll('.smb-doc-toc-link');
    var tocObserver = new IntersectionObserver(
      function (entries) {
        if (clickLock) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove('smb-doc-toc-active'); });
            var activeLink = toc.querySelector('[data-target="' + entry.target.id + '"]');
            if (activeLink) activeLink.classList.add('smb-doc-toc-active');
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach(function (h) { tocObserver.observe(h); });
  }

  if (u.waitForSelector) {
    u.waitForSelector('.smb-page', init);
  }
})();