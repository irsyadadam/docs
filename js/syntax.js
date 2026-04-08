// ---- Code Blocks: Syntax highlighting + copy buttons ----

(function () {
  'use strict';
  var u = window.smbUtils || {};

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightPython(code) {
    var html = escapeHtml(code);
    html = html.replace(/((&quot;){3}[\s\S]*?(&quot;){3}|(&#x27;){3}[\s\S]*?(&#x27;){3})/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(f?&quot;(?:[^&]|&(?!quot;))*?&quot;|f?&#x27;(?:[^&]|&(?!#x27;))*?&#x27;)/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(f?"[^"]*?"|f?'[^']*?')/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(#[^\n]*)/g, '<span class="smb-hl-cmt">$1</span>');
    html = html.replace(/\b(from|import|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|with|try|except|finally|raise|pass|break|continue|yield|lambda|assert|True|False|None|self)\b/g, '<span class="smb-hl-kw">$1</span>');
    html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, function(match, name) {
      if (/^(from|import|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|with|try|except|finally|raise|pass|True|False|None|self)$/.test(name)) return match;
      return '<span class="smb-hl-fn">' + name + '</span>';
    });
    html = html.replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/g, '<span class="smb-hl-num">$1</span>');
    html = html.replace(/(@\w+)/g, '<span class="smb-hl-dec">$1</span>');
    return html;
  }

  function highlightBash(code) {
    var html = escapeHtml(code);
    html = html.replace(/("[^"]*?"|'[^']*?')/g, '<span class="smb-hl-str">$1</span>');
    html = html.replace(/(#[^\n]*)/g, '<span class="smb-hl-cmt">$1</span>');
    html = html.replace(/^(\s*)(pip|cd|git|uv|bash|curl|source|python|nvidia-smi|huggingface-cli)\b/gm, '$1<span class="smb-hl-kw">$2</span>');
    html = html.replace(/(\s)(--?\w[\w-]*)/g, '$1<span class="smb-hl-flag">$2</span>');
    return html;
  }

  function init(page) {
    var wraps = page.querySelectorAll('.smb-code-wrap');
    wraps.forEach(function (wrap) {
      var pre = wrap.querySelector('pre');
      if (!pre) return;
      var codeEl = pre.querySelector('code') || pre;
      var label = wrap.querySelector('.smb-code-label');
      var lang = '';
      if (label) lang = label.textContent.trim().toLowerCase();

      var raw = codeEl.textContent || '';
      raw = raw.replace(/^\n+/, '').replace(/\n+$/, '');

      try {
        if (lang.indexOf('python') !== -1) {
          codeEl.innerHTML = highlightPython(raw);
        } else if (lang === 'bash') {
          codeEl.innerHTML = highlightBash(raw);
        } else {
          codeEl.innerHTML = escapeHtml(raw);
        }
      } catch (e) {
        codeEl.innerHTML = escapeHtml(raw);
      }

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
  }

  if (u.waitForSelector) {
    u.waitForSelector('.smb-page', init);
  }
})();