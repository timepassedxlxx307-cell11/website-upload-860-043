(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const sliders = document.querySelectorAll('[data-hero-slider]');

  sliders.forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    let index = 0;
    let timer = null;

    function activate(nextIndex) {
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
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    activate(0);
    start();
  });

  const filterScopes = document.querySelectorAll('[data-filter-scope]');

  filterScopes.forEach(function (scope) {
    const searchInput = scope.querySelector('[data-filter-search]');
    const regionSelect = scope.querySelector('[data-filter-region]');
    const yearSelect = scope.querySelector('[data-filter-year]');
    const typeSelect = scope.querySelector('[data-filter-type]');
    const sortSelect = scope.querySelector('[data-filter-sort]');
    const countTarget = scope.querySelector('[data-filter-count]');
    const grid = scope.parentElement.querySelector('[data-filter-grid]');

    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-movie-card]'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      const query = normalize(searchInput && searchInput.value);
      const region = normalize(regionSelect && regionSelect.value);
      const year = normalize(yearSelect && yearSelect.value);
      const type = normalize(typeSelect && typeSelect.value);
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize(card.getAttribute('data-search'));
        const cardRegion = normalize(card.getAttribute('data-region'));
        const cardYear = normalize(card.getAttribute('data-year'));
        const cardType = normalize(card.getAttribute('data-type'));
        const matched = (!query || haystack.indexOf(query) !== -1) &&
          (!region || cardRegion === region) &&
          (!year || cardYear === year) &&
          (!type || cardType === type);

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countTarget) {
        countTarget.textContent = String(visible);
      }
    }

    function applySort() {
      if (!sortSelect) {
        return;
      }

      const mode = sortSelect.value;
      const sorted = cards.slice().sort(function (a, b) {
        if (mode === 'score') {
          return Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score'));
        }
        if (mode === 'year') {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        }
        if (mode === 'title') {
          return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
        }
        return 0;
      });

      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      applyFilters();
    }

    [searchInput, regionSelect, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', applySort);
    }

    applyFilters();
  });
})();
