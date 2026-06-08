(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    var search = document.querySelector('.header-search');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      if (search) {
        search.classList.toggle('is-open');
      }
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');

    if (!root) {
      return;
    }

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim().toLowerCase();
  }

  function initFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    forms.forEach(function (form) {
      var grid = form.parentElement ? form.parentElement.querySelector('[data-card-grid]') : document.querySelector('[data-card-grid]');
      var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('.movie-card')) : [];
      var keywordInput = form.querySelector('[data-filter-keyword]');
      var yearSelect = form.querySelector('[data-filter-year]');
      var regionSelect = form.querySelector('[data-filter-region]');
      var typeSelect = form.querySelector('[data-filter-type]');
      var count = form.querySelector('[data-filter-count]');
      var initialQuery = readQuery();

      if (keywordInput && initialQuery) {
        keywordInput.value = initialQuery;
      }

      function applyFilters() {
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var region = regionSelect ? regionSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var searchText = card.getAttribute('data-search') || '';
          var matchesKeyword = !keyword || searchText.indexOf(keyword) !== -1;
          var matchesYear = !year || card.getAttribute('data-year') === year;
          var matchesRegion = !region || card.getAttribute('data-region') === region;
          var matchesType = !type || card.getAttribute('data-type') === type;
          var shouldShow = matchesKeyword && matchesYear && matchesRegion && matchesType;

          card.classList.toggle('is-hidden', !shouldShow);

          if (shouldShow) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部';
        }
      }

      ['input', 'change'].forEach(function (eventName) {
        [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (element) {
          if (element) {
            element.addEventListener(eventName, applyFilters);
          }
        });
      });

      form.addEventListener('submit', function (event) {
        if (cards.length) {
          event.preventDefault();
          applyFilters();
        }
      });

      applyFilters();
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (shell) {
      var video = shell.querySelector('video');
      var startButton = shell.querySelector('[data-player-start]');
      var status = shell.querySelector('[data-player-status]');
      var source = shell.getAttribute('data-video-src');
      var hlsInstance = null;

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function play() {
        if (!video || !source) {
          setStatus('当前影片播放源暂不可用。');
          return;
        }

        shell.classList.add('is-playing');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.play().catch(function () {
            shell.classList.remove('is-playing');
            setStatus('浏览器阻止自动播放，请再次点击播放。');
          });
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          if (!hlsInstance) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });

            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);

            hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
              if (data && data.fatal) {
                setStatus('播放加载失败，可刷新页面后重试。');
                shell.classList.remove('is-playing');
              }
            });
          }

          video.play().catch(function () {
            shell.classList.remove('is-playing');
            setStatus('浏览器阻止自动播放，请再次点击播放。');
          });
          return;
        }

        setStatus('当前浏览器不支持 HLS 播放。');
        shell.classList.remove('is-playing');
      }

      if (startButton) {
        startButton.addEventListener('click', play);
      }

      shell.addEventListener('dblclick', function () {
        if (video && video.requestFullscreen) {
          video.requestFullscreen();
        }
      });
    });
  }

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
    initPlayers();
  });
})();
