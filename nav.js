// ---- Standard Model Bio — Floating Nav + Copy Button ----

function waitForElement(id, callback, maxAttempts) {
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    var el = document.getElementById(id);
    if (el) {
      clearInterval(interval);
      callback(el);
    } else if (attempts >= (maxAttempts || 50)) {
      clearInterval(interval);
    }
  }, 100);
}

// ---- Copy button ----
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

// ---- Floating nav ----
waitForElement('smb-floating-nav', function (fnav) {
  var dots = fnav.querySelectorAll('.smb-fnav-dot');
  var sectionIds = [];
  var clickLock = false;

  dots.forEach(function (d) {
    if (d.dataset.section) sectionIds.push(d.dataset.section);
  });

  // ---- Click handler — scroll + update active dot ----
  dots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(dot.dataset.section);
      if (target) {
        // Lock observer from overriding for 1 second while scroll settles
        clickLock = true;
        setTimeout(function () { clickLock = false; }, 1000);

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        dots.forEach(function (d) {
          d.classList.remove('smb-fnav-active');
        });
        dot.classList.add('smb-fnav-active');
      }
    });
  });

  // ---- IntersectionObserver — highlight active section on scroll ----
  var observer = new IntersectionObserver(
    function (entries) {
      if (clickLock) return; // Don't override during click scroll
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          dots.forEach(function (d) {
            d.classList.remove('smb-fnav-active');
          });
          var active = fnav.querySelector(
            '[data-section="' + entry.target.id + '"]'
          );
          if (active) active.classList.add('smb-fnav-active');
        }
      });
    },
    {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
    }
  );

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Ensure nav is always visible
  fnav.classList.remove('smb-fnav-hidden');
});