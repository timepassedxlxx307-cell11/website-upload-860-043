(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[type="search"], input[name="q"]');
      const value = input ? input.value.trim() : '';
      const target = value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html';
      window.location.href = target;
    });
  });

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let index = 0;
    let timer = null;

    function activate(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
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
        activate(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        activate(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    activate(0);
    start();
  }

  const filterRoot = document.querySelector('[data-card-filter]');

  if (filterRoot) {
    const queryInput = filterRoot.querySelector('[data-filter-query]');
    const typeSelect = filterRoot.querySelector('[data-filter-type]');
    const yearSelect = filterRoot.querySelector('[data-filter-year]');
    const clearButton = filterRoot.querySelector('[data-filter-clear]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const empty = document.querySelector('[data-empty-state]');

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function apply() {
      const query = normalize(queryInput ? queryInput.value : '');
      const type = typeSelect ? typeSelect.value : '';
      const year = yearSelect ? yearSelect.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const text = normalize(card.getAttribute('data-search-text'));
        const cardType = card.getAttribute('data-type') || '';
        const cardYear = card.getAttribute('data-year') || '';
        const matchQuery = !query || text.indexOf(query) !== -1;
        const matchType = !type || cardType === type;
        const matchYear = !year || cardYear === year;
        const show = matchQuery && matchType && matchYear;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [queryInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (queryInput) {
          queryInput.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        apply();
      });
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && queryInput) {
      queryInput.value = q;
    }
    apply();
  }
})();
