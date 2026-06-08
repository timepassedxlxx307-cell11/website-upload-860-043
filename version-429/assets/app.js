(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileMenu() {
        var button = document.querySelector(".mobile-menu-button");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var open = menu.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHeroSlider() {
        var slides = all(".hero-slide");
        var dots = all(".hero-dot");
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(parseInt(dot.getAttribute("data-slide"), 10) || 0);
                start();
            });
        });
        start();
    }

    function uniqueValues(cards, attr) {
        var values = [];
        cards.forEach(function (card) {
            var value = card.getAttribute(attr) || "";
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values.sort(function (a, b) {
            return String(b).localeCompare(String(a), "zh-CN");
        });
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function setupFilters() {
        var cards = all(".filter-scope .movie-card");
        if (!cards.length) {
            return;
        }
        var search = document.getElementById("movieSearch");
        var region = document.getElementById("regionFilter");
        var type = document.getElementById("typeFilter");
        var year = document.getElementById("yearFilter");
        var empty = document.getElementById("emptyState");
        fillSelect(region, uniqueValues(cards, "data-region"));
        fillSelect(type, uniqueValues(cards, "data-type"));
        fillSelect(year, uniqueValues(cards, "data-year"));
        var params = new URLSearchParams(window.location.search);
        if (search && params.get("q")) {
            search.value = params.get("q");
        }
        function match(card) {
            var text = [
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" ").toLowerCase();
            var keyword = search ? search.value.trim().toLowerCase() : "";
            if (keyword && text.indexOf(keyword) === -1) {
                return false;
            }
            if (region && region.value && card.getAttribute("data-region") !== region.value) {
                return false;
            }
            if (type && type.value && card.getAttribute("data-type") !== type.value) {
                return false;
            }
            if (year && year.value && card.getAttribute("data-year") !== year.value) {
                return false;
            }
            return true;
        }
        function apply() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = match(card);
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }
        [search, region, type, year].forEach(function (el) {
            if (el) {
                el.addEventListener("input", apply);
                el.addEventListener("change", apply);
            }
        });
        apply();
    }

    window.initSitePlayer = function (videoId, sourceUrl, coverId, buttonId) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var button = document.getElementById(buttonId);
        if (!video) {
            return;
        }
        var loaded = false;
        function attach() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                video.hlsController = hls;
            } else {
                video.src = sourceUrl;
            }
            loaded = true;
        }
        function play() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener("click", play);
        }
        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("click", play);
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMobileMenu();
        setupHeroSlider();
        setupFilters();
    });
})();
