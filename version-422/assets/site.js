(function () {
  var navButton = document.querySelector('.nav-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (navButton && mobilePanel) {
    navButton.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('open');
      navButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var slideIndex = 0;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    slideIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, index) {
      slide.classList.toggle('active', index === slideIndex);
    });

    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === slideIndex);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var nextIndex = Number(dot.getAttribute('data-slide')) || 0;
      showSlide(nextIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5600);
  }

  function normalize(text) {
    return (text || '').toString().trim().toLowerCase();
  }

  function initFilterPanel(panel) {
    var input = panel.querySelector('.js-search-input');
    var clear = panel.querySelector('.search-clear');
    var sort = panel.querySelector('.js-sort-select');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-category]'));
    var list = panel.parentElement.querySelector('.js-sortable-list');

    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.js-movie-card'));
    var activeCategory = 'all';
    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get('q');

    if (input && queryFromUrl) {
      input.value = queryFromUrl;
    }

    function applyFilters() {
      var query = normalize(input ? input.value : '');

      cards.forEach(function (card) {
        var matchesText = !query || normalize(card.getAttribute('data-search')).indexOf(query) !== -1;
        var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        card.classList.toggle('hide-card', !(matchesText && matchesCategory));
      });
    }

    function applySort() {
      if (!sort) {
        applyFilters();
        return;
      }

      var mode = sort.value;
      var sorted = cards.slice();

      sorted.sort(function (a, b) {
        if (mode === 'latest') {
          return Number(b.getAttribute('data-title').length + b.getAttribute('data-year')) - Number(a.getAttribute('data-title').length + a.getAttribute('data-year'));
        }

        if (mode === 'year') {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        }

        if (mode === 'title') {
          return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'), 'zh-CN');
        }

        return 0;
      });

      sorted.forEach(function (card) {
        list.appendChild(card);
      });

      cards = sorted;
      applyFilters();
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    if (clear) {
      clear.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        applyFilters();
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.getAttribute('data-filter-category') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        applyFilters();
      });
    });

    if (sort) {
      sort.addEventListener('change', applySort);
    }

    applySort();
  }

  Array.prototype.slice.call(document.querySelectorAll('.filter-panel')).forEach(initFilterPanel);

  function initPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var source = shell.getAttribute('data-video-src');
    var attached = false;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return Promise.resolve();
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        shell.hlsInstance = hls;
        return Promise.resolve();
      }

      video.src = source;
      return Promise.resolve();
    }

    function playVideo() {
      attachSource().then(function () {
        if (button) {
          button.classList.add('hidden');
        }
        var playResult = video.play();
        if (playResult && playResult.catch) {
          playResult.catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (!attached || video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hidden');
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(initPlayer);
})();
