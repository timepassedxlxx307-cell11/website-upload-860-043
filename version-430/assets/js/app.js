(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var show = function (next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('active', dotIndex === index);
        });
      };
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
      });
      setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    var searchForm = document.querySelector('[data-search-form]');
    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = searchForm.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        window.location.href = query ? './library.html?q=' + encodeURIComponent(query) : './library.html';
      });
    }

    var filterInput = document.querySelector('[data-card-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var noResults = document.querySelector('[data-no-results]');
    var applyFilter = function () {
      if (!filterInput || !cards.length) {
        return;
      }
      var query = filterInput.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-category'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var matched = !query || text.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (noResults) {
        noResults.classList.toggle('hidden', visible !== 0);
      }
    };
    if (filterInput) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q');
      if (initial) {
        filterInput.value = initial;
      }
      filterInput.addEventListener('input', applyFilter);
      applyFilter();
    }
  });
})();
