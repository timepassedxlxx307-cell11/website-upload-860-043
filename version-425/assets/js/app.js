(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(dotIndex);
                startTimer();
            });
        });

        startTimer();
    }

    var filterInput = document.querySelector("[data-local-filter]");

    if (filterInput) {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        filterInput.addEventListener("input", function () {
            var keyword = filterInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();
                card.classList.toggle("is-hidden", keyword && text.indexOf(keyword) === -1);
            });
        });
    }

    if (document.querySelector("[data-search-results]") && window.searchMovies) {
        runSearchPage();
    }

    function runSearchPage() {
        var params = new URLSearchParams(window.location.search);
        var keyword = (params.get("q") || "").trim();
        var input = document.querySelector("[data-search-input]");
        var title = document.querySelector("[data-search-title]");
        var subtitle = document.querySelector("[data-search-subtitle]");
        var results = document.querySelector("[data-search-results]");

        if (input) {
            input.value = keyword;
        }

        if (!keyword) {
            return;
        }

        var lowerKeyword = keyword.toLowerCase();
        var matched = window.searchMovies.filter(function (movie) {
            return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine]
                .join(" ")
                .toLowerCase()
                .indexOf(lowerKeyword) !== -1;
        });

        if (title) {
            title.textContent = "搜索结果";
        }
        if (subtitle) {
            subtitle.textContent = matched.length ? "以下内容与关键词匹配。" : "未找到匹配影片，可尝试更换关键词。";
        }
        if (results) {
            results.textContent = "";
            matched.slice(0, 120).forEach(function (movie) {
                results.appendChild(createMovieCard(movie));
            });
        }
    }

    function createMovieCard(movie) {
        var article = document.createElement("article");
        article.className = "movie-card";

        var posterLink = document.createElement("a");
        posterLink.className = "poster-link";
        posterLink.href = movie.href;
        posterLink.setAttribute("aria-label", movie.title);

        var posterFrame = document.createElement("span");
        posterFrame.className = "poster-frame";

        var image = document.createElement("img");
        image.src = movie.cover;
        image.alt = movie.title;
        image.loading = "lazy";

        var shade = document.createElement("span");
        shade.className = "poster-shade";

        var quality = document.createElement("span");
        quality.className = "quality-badge";
        quality.textContent = "HD";

        var year = document.createElement("span");
        year.className = "year-badge";
        year.textContent = movie.year;

        var play = document.createElement("span");
        play.className = "play-chip";
        play.textContent = "▶";

        posterFrame.appendChild(image);
        posterFrame.appendChild(shade);
        posterFrame.appendChild(quality);
        posterFrame.appendChild(year);
        posterFrame.appendChild(play);
        posterLink.appendChild(posterFrame);

        var body = document.createElement("div");
        body.className = "movie-card-body";

        var link = document.createElement("a");
        link.className = "movie-title";
        link.href = movie.href;
        link.textContent = movie.title;

        var line = document.createElement("p");
        line.className = "movie-line";
        line.textContent = movie.oneLine;

        var meta = document.createElement("div");
        meta.className = "movie-meta";
        [movie.region, movie.type, movie.genre].forEach(function (value) {
            var span = document.createElement("span");
            span.textContent = value;
            meta.appendChild(span);
        });

        var tags = document.createElement("div");
        tags.className = "movie-tags";
        movie.tags.split(" ").filter(Boolean).slice(0, 3).forEach(function (value) {
            var span = document.createElement("span");
            span.textContent = value;
            tags.appendChild(span);
        });

        body.appendChild(link);
        body.appendChild(line);
        body.appendChild(meta);
        body.appendChild(tags);
        article.appendChild(posterLink);
        article.appendChild(body);

        return article;
    }
})();
