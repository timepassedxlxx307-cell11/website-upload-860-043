(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(active + 1);
        startTimer();
      });
    }

    startTimer();
  }

  var filterWrap = document.querySelector('[data-local-filter]');

  if (filterWrap) {
    var input = filterWrap.querySelector('[data-filter-input]');
    var year = filterWrap.querySelector('[data-filter-year]');
    var type = filterWrap.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-no-results]');

    function applyFilter() {
      var keyword = input && input.value ? input.value.trim().toLowerCase() : '';
      var yearValue = year && year.value ? year.value : '';
      var typeValue = type && type.value ? type.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var matchType = !typeValue || card.getAttribute('data-type') === typeValue;
        var isVisible = matchKeyword && matchYear && matchType;
        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  }

  var results = document.querySelector('[data-search-results]');

  if (results && window.MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var form = document.querySelector('[data-search-page-form]');
    var searchInput = form ? form.querySelector('input[name="q"]') : null;
    var emptyBox = document.querySelector('[data-search-empty]');

    if (searchInput) {
      searchInput.value = query;
    }

    function movieTemplate(movie) {
      return [
        '<article class="movie-card" data-movie-card>',
        '<a class="poster-link" href="' + movie.url + '">',
        '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '</a>',
        '<div class="movie-info">',
        '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
        '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
        '<p>' + escapeHtml(movie.oneLine) + '</p>',
        '<div class="tag-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
        '<a class="card-action" href="' + movie.url + '">立即观看</a>',
        '</div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function runSearch(value) {
      var key = value.trim().toLowerCase();

      if (!key) {
        results.innerHTML = '';
        if (emptyBox) {
          emptyBox.textContent = '请输入关键词开始搜索';
          emptyBox.classList.add('is-visible');
        }
        return;
      }

      var matched = window.MOVIES.filter(function (movie) {
        return movie.search.indexOf(key) !== -1;
      }).slice(0, 120);

      results.innerHTML = matched.map(movieTemplate).join('');

      if (emptyBox) {
        emptyBox.textContent = matched.length ? '' : '没有匹配的影片';
        emptyBox.classList.toggle('is-visible', matched.length === 0);
      }
    }

    runSearch(query);
  }
}());
