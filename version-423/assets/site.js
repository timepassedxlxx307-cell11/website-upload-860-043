(function () {
  const ready = function (callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  };

  ready(function () {
    const menuButton = document.querySelector(".menu-toggle");
    const mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        const isOpen = !mobilePanel.hasAttribute("hidden");
        if (isOpen) {
          mobilePanel.setAttribute("hidden", "");
          menuButton.setAttribute("aria-expanded", "false");
        } else {
          mobilePanel.removeAttribute("hidden");
          menuButton.setAttribute("aria-expanded", "true");
        }
      });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let currentSlide = 0;
    let heroTimer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === currentSlide);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === currentSlide);
      });
    }

    function startHero() {
      if (slides.length <= 1) {
        return;
      }
      window.clearInterval(heroTimer);
      heroTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.slide || 0));
        startHero();
      });
    });

    showSlide(0);
    startHero();

    document.querySelectorAll(".filter-row").forEach(function (row) {
      const firstButton = row.querySelector(".filter-button");
      if (firstButton) {
        firstButton.classList.add("active");
      }
    });

    const filterInputs = Array.from(document.querySelectorAll(".page-filter-input"));
    const filterButtons = Array.from(document.querySelectorAll(".filter-button"));

    function activeFilters() {
      const data = {};
      filterButtons.forEach(function (button) {
        if (button.classList.contains("active")) {
          data[button.dataset.filterGroup] = button.dataset.filter;
        }
      });
      return data;
    }

    function applyPageFilter() {
      const cards = Array.from(document.querySelectorAll("[data-filter-scope] .movie-card"));
      if (!cards.length) {
        return;
      }
      const query = filterInputs.map(function (input) {
        return input.value.trim().toLowerCase();
      }).join(" ").trim();
      const filters = activeFilters();

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags
        ].join(" ").toLowerCase();
        const matchQuery = !query || text.indexOf(query) !== -1;
        const matchRegion = !filters.region || filters.region === "全部" || card.dataset.region === filters.region;
        const matchYear = !filters.year || filters.year === "全部" || card.dataset.year === filters.year;
        const matchType = !filters.type || filters.type === "全部" || card.dataset.type === filters.type;
        card.classList.toggle("is-hidden-card", !(matchQuery && matchRegion && matchYear && matchType));
      });
    }

    filterInputs.forEach(function (input) {
      input.addEventListener("input", applyPageFilter);
    });

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const group = button.dataset.filterGroup;
        filterButtons.forEach(function (item) {
          if (item.dataset.filterGroup === group) {
            item.classList.remove("active");
          }
        });
        button.classList.add("active");
        applyPageFilter();
      });
    });

    applyPageFilter();

    const pageInput = document.getElementById("search-page-input");
    const resultBox = document.getElementById("search-results");
    const summary = document.getElementById("search-summary");
    const suggestions = document.getElementById("search-suggestions");

    if (pageInput && resultBox && window.SITE_MOVIES) {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      pageInput.value = q;
      const keyword = q.trim().toLowerCase();

      if (keyword) {
        const results = window.SITE_MOVIES.filter(function (movie) {
          return [
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            movie.tags,
            movie.line
          ].join(" ").toLowerCase().indexOf(keyword) !== -1;
        }).slice(0, 240);

        if (suggestions) {
          suggestions.style.display = "none";
        }

        if (summary) {
          summary.textContent = results.length ? "以下是匹配关键词的影片内容" : "暂未找到匹配内容";
        }

        resultBox.innerHTML = results.map(function (movie) {
          return [
            '<article class="movie-card">',
            '  <a class="card-poster" href="' + movie.url + '">',
            '    <img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '    <span class="quality-badge">HD</span>',
            '    <span class="poster-play">▶</span>',
            '  </a>',
            '  <div class="card-body">',
            '    <a class="card-title" href="' + movie.url + '">' + escapeHtml(movie.title) + '</a>',
            '    <div class="card-line"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
            '    <div class="card-meta"><span class="rating">★ ' + movie.rating + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
            '  </div>',
            '</article>'
          ].join("\n");
        }).join("\n");
      }
    }
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
