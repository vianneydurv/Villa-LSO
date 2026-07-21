document.addEventListener('DOMContentLoaded', function () {

  // Smooth cross-fade transition when navigating between pages
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return;
    if (link.target === '_blank') return;
    if (href.indexOf('.html') === -1) return;

    link.addEventListener('click', function (e) {
      var destination = href;
      var isSamePage = destination.split('#')[0] === '' || destination.split('#')[0] === window.location.pathname.split('/').pop();
      if (isSamePage && destination.indexOf('#') !== -1) return; // in-page anchor, let smooth scroll handle it
      e.preventDefault();
      document.body.classList.add('page-fade-out');
      setTimeout(function () {
        window.location.href = destination;
      }, 320);
    });
  });

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Accordion behaviour for "Chambres" submenu on mobile
  var hasSub = document.querySelector('.has-sub > a');
  var hasSubLi = document.querySelector('.has-sub');
  if (hasSub && hasSubLi) {
    hasSub.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        hasSubLi.classList.toggle('open');
      }
    });
  }

  // Photo slider (one image at a time, with arrows)
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('.slider-track');
    var slides = track ? track.children : [];
    var total = slides.length;
    var current = 0;
    var counterCurrent = slider.parentElement.querySelector('.slider-counter .current');
    var counterTotal = slider.parentElement.querySelector('.slider-counter .total');
    var captionEl = slider.parentElement.querySelector('.slider-caption-text');
    if (counterTotal) counterTotal.textContent = total;

    function goTo(index) {
      current = (index + total) % total;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('active', i === current);
      }
      if (counterCurrent) counterCurrent.textContent = current + 1;
      if (captionEl && slides[current]) captionEl.textContent = slides[current].getAttribute('alt') || '';
    }

    var AUTOPLAY_DELAY = 5000;
    var autoplayTimer = null;

    function stopAutoplay() {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function startAutoplay() {
      stopAutoplay();
      if (total > 1) {
        autoplayTimer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_DELAY);
      }
    }

    var prevBtn = slider.querySelector('.slider-arrow.prev');
    var nextBtn = slider.querySelector('.slider-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAutoplay(); });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    goTo(0);
    startAutoplay();
  });
});
