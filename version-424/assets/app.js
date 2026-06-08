(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function initMobileMenu() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        if (!slides.length) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        show(0);
        if (slides.length > 1) {
            setInterval(function () {
                show(index + 1);
            }, 5600);
        }
    }

    function loadStream(video, url) {
        if (!video || !url) {
            return;
        }
        if (video.dataset.loaded === url) {
            return;
        }
        if (video._hlsInstance) {
            video._hlsInstance.destroy();
            video._hlsInstance = null;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            video._hlsInstance = hls;
        } else {
            video.src = url;
        }
        video.dataset.loaded = url;
    }

    function initPlayers() {
        document.querySelectorAll('[data-player]').forEach(function (box) {
            var video = box.querySelector('video');
            var layer = box.querySelector('.player-layer');
            var button = box.querySelector('.play-button');
            var url = box.getAttribute('data-stream');
            function play() {
                loadStream(video, url);
                box.classList.add('is-playing');
                var result = video.play();
                if (result && result.catch) {
                    result.catch(function () {
                        box.classList.remove('is-playing');
                    });
                }
            }
            if (layer) {
                layer.addEventListener('click', play);
            }
            if (button) {
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    play();
                });
            }
            if (video) {
                video.addEventListener('play', function () {
                    box.classList.add('is-playing');
                });
                video.addEventListener('pause', function () {
                    if (!video.currentTime) {
                        box.classList.remove('is-playing');
                    }
                });
            }
        });
    }

    function initPageFilter() {
        var input = document.querySelector('[data-page-filter]');
        var select = document.querySelector('[data-year-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        if (!cards.length || (!input && !select)) {
            return;
        }
        function apply() {
            var q = input ? input.value.trim().toLowerCase() : '';
            var y = select ? select.value : '';
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var year = card.getAttribute('data-year') || '';
                var ok = (!q || text.indexOf(q) !== -1) && (!y || y === year);
                card.style.display = ok ? '' : 'none';
            });
        }
        if (input) {
            input.addEventListener('input', apply);
        }
        if (select) {
            select.addEventListener('change', apply);
        }
    }

    function renderSearchPage() {
        var root = document.querySelector('[data-search-results]');
        if (!root || !window.SITE_ITEMS) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim();
        var input = document.querySelector('[data-search-input]');
        if (input) {
            input.value = query;
        }
        var list = window.SITE_ITEMS;
        var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        var results = !terms.length ? list.slice(0, 60) : list.filter(function (item) {
            var haystack = item.search.toLowerCase();
            return terms.every(function (term) {
                return haystack.indexOf(term) !== -1;
            });
        }).slice(0, 120);
        if (!results.length) {
            root.innerHTML = '<div class="empty-state">没有找到匹配内容，可以换一个片名、类型、年份或地区继续搜索。</div>';
            return;
        }
        root.innerHTML = results.map(function (item) {
            return '<article class="movie-card" data-card data-year="' + item.year + '" data-search="' + escapeHtml(item.search) + '">' +
                '<a href="' + item.file + '">' +
                '<div class="card-cover"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '"><span class="card-badge">' + escapeHtml(item.type) + '</span></div>' +
                '<div class="card-body"><h3 class="card-title">' + escapeHtml(item.title) + '</h3><div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div><p class="card-line">' + escapeHtml(item.line) + '</p></div>' +
                '</a></article>';
        }).join('');
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (ch) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[ch];
        });
    }

    ready(function () {
        initMobileMenu();
        initHero();
        initPlayers();
        initPageFilter();
        renderSearchPage();
    });
}());
