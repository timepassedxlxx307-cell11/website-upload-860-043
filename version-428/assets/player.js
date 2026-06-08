(function () {
  function mountPlayer(box) {
    const video = box.querySelector('video');
    const overlay = box.querySelector('.play-overlay');
    const button = box.querySelector('.play-button');
    const playUrl = video ? video.getAttribute('data-play') : '';
    let attached = false;
    let hls = null;

    function attach() {
      if (!video || !playUrl || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        return;
      }
      video.src = playUrl;
    }

    function start() {
      if (!video) {
        return;
      }
      attach();
      video.setAttribute('controls', 'controls');
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(mountPlayer);
})();
