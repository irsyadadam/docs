// ---- Standard Model Bio — Unified Navigation System ----
// Handles: copy button, paper carousel, floating nav (landing),
//          scroll-spy TOC (doc pages), right-side floating nav (doc pages)

(function () {
  'use strict';

  // ---- Utility: poll for an element ----
  function waitForElement(id, callback, maxAttempts) {
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
  }

  function waitForSelector(selector, callback, maxAttempts) {
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

  // ---- Copy button (landing page) ----
  waitForElement('smb-copy-btn', function (btn) {
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
  });

  // ---- Infinite carousel — clone cards for seamless loop ----
  waitForElement('smb-paper-carousel', function (carousel) {
    var cards = carousel.querySelectorAll('.smb-paper-card');
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      carousel.appendChild(clone);
    });
  });

  // ---- Landing page floating nav ----
  waitForElement('smb-floating-nav', function (fnav) {
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
  });

  // ===========================================================
  // PIPELINE CAROUSEL — Animated step-through
  // ===========================================================

  waitForSelector('.smb-pipeline', function () {
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

        // Slide cards
        cards.style.transform = 'translateX(-' + (current * 100) + '%)';

        // Update dots
        dots.forEach(function (d, i) {
          d.classList.remove('smb-pipeline-dot-active', 'smb-pipeline-dot-done');
          if (i < current) d.classList.add('smb-pipeline-dot-done');
          if (i === current) d.classList.add('smb-pipeline-dot-active');
        });

        // Update progress fill
        if (fill) {
          var pct = ((current + 1) / total) * 100;
          fill.style.width = pct + '%';
          fill.style.left = '0%';
        }

        // Update counter
        if (counter) {
          counter.textContent = (current + 1) + ' / ' + total;
        }
      }

      // Dot clicks
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          goTo(i);
        });
      });

      // Prev/Next
      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          goTo(current - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          goTo(current + 1);
        });
      }

      // Init
      goTo(0);
    });
  });

  // ===========================================================
  // PILL TABS — JS-driven tab switching
  // ===========================================================

  waitForSelector('.smb-pill-tabs', function () {
    var tabGroups = document.querySelectorAll('.smb-pill-tabs');
    tabGroups.forEach(function (group) {
      var buttons = group.querySelectorAll('.smb-pill-tab-label');
      var panels = group.querySelectorAll('.smb-pill-tab-panel');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');

          // Update button active states
          buttons.forEach(function (b) { b.classList.remove('smb-pill-tab-active'); });
          btn.classList.add('smb-pill-tab-active');

          // Show/hide panels via class toggle
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
  });

  // ===========================================================
  // CODE BLOCKS: Syntax highlighting + copy buttons
  // ===========================================================

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightPython(code) {
    var html = escapeHtml(code);

    // Strings (triple-quoted first, then single/double)
    html = html.replace(/((&quot;){3}[\s\S]*?(&quot;){3}|(&#x27;){3}[\s\S]*?(&#x27;){3})/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(f?&quot;(?:[^&]|&(?!quot;))*?&quot;|f?&#x27;(?:[^&]|&(?!#x27;))*?&#x27;)/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(f?"[^"]*?"|f?'[^']*?')/g, '<span class="smb-hl-str">$1</span>');

    // Comments
    html = html.replace(/(#[^\n]*)/g, '<span class="smb-hl-cmt">$1</span>');

    // Keywords
    html = html.replace(/\b(from|import|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|with|try|except|finally|raise|pass|break|continue|yield|lambda|assert|True|False|None|self)\b/g, '<span class="smb-hl-kw">$1</span>');

    // Function/method calls (word followed by parenthesis)
    html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, function(match, name) {
      if (/^(from|import|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|with|try|except|finally|raise|pass|True|False|None|self)$/.test(name)) return match;
      return '<span class="smb-hl-fn">' + name + '</span>';
    });

    // Numbers
    html = html.replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/g, '<span class="smb-hl-num">$1</span>');

    // Decorators
    html = html.replace(/(@\w+)/g, '<span class="smb-hl-dec">$1</span>');

    return html;
  }

  function highlightBash(code) {
    var html = escapeHtml(code);
    // Strings
    html = html.replace(/("[^"]*?"|'[^']*?')/g, '<span class="smb-hl-str">$1</span>');
    // Comments
    html = html.replace(/(#[^\n]*)/g, '<span class="smb-hl-cmt">$1</span>');
    // Commands at start of line
    html = html.replace(/^(\s*)(pip|cd|git|uv|bash|curl|source|python|nvidia-smi|huggingface-cli)\b/gm, '$1<span class="smb-hl-kw">$2</span>');
    // Flags
    html = html.replace(/(\s)(--?\w[\w-]*)/g, '$1<span class="smb-hl-flag">$2</span>');
    return html;
  }

  waitForSelector('.smb-page', function (page) {
    var wraps = page.querySelectorAll('.smb-code-wrap');
    wraps.forEach(function (wrap) {
      var pre = wrap.querySelector('pre');
      if (!pre) return;
      var codeEl = pre.querySelector('code') || pre;
      var label = wrap.querySelector('.smb-code-label');
      var lang = '';
      if (label) lang = label.textContent.trim().toLowerCase();

      // Get raw text for copy and highlighting
      var raw = codeEl.textContent || '';

      // Strip leading/trailing blank lines from template literal whitespace
      raw = raw.replace(/^\n+/, '').replace(/\n+$/, '');

      // Syntax highlight
      try {
        if (lang.indexOf('python') !== -1) {
          codeEl.innerHTML = highlightPython(raw);
        } else if (lang === 'bash') {
          codeEl.innerHTML = highlightBash(raw);
        } else {
          // Still escape HTML for non-highlighted blocks and strip whitespace
          codeEl.innerHTML = escapeHtml(raw);
        }
      } catch (e) {
        // Fallback: just escape
        codeEl.innerHTML = escapeHtml(raw);
      }

      // Add copy button (skip if already present or if it's an output block)
      if (wrap.querySelector('.smb-code-copy')) return;
      if (pre.classList.contains('smb-code-output')) return;

      var btn = document.createElement('button');
      btn.className = 'smb-code-copy';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(raw).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        });
      });

      wrap.appendChild(btn);
    });
  });

  // ===========================================================
  // DOC PAGE: Auto-generated floating nav TOC (matches landing)
  // ===========================================================

  waitForSelector('.smb-page', function (page) {
    // Don't run on landing page
    if (document.querySelector('.smb-landing')) return;

    var headings = page.querySelectorAll('.smb-h2[id], .smb-h3[id], h2[id], h3[id]');
    if (headings.length < 2) return;

    // Build the floating nav — mirrors .smb-floating-nav structure
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

      // Build label as a span (dot is via ::before pseudo-element)
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

          // Immediately update active state
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

    // Scroll spy — mirrors landing page floating nav behavior
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

    headings.forEach(function (h) {
      tocObserver.observe(h);
    });
  });

  // ===========================================================
  // DOC PAGE: Smooth entrance animations
  // ===========================================================

  waitForSelector('.smb-page', function (page) {
    if (document.querySelector('.smb-landing')) return;

    // Animate cards, steps, code blocks on scroll
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
  });

})();