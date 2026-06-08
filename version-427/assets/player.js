(function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var cover = shell.querySelector('.player-cover');
  var trigger = shell.querySelector('.play-trigger');
  var streamUrl = shell.getAttribute('data-stream') || '';
  var hlsInstance = null;
  var attached = false;

  function attachStream() {
    if (attached || !video || !streamUrl) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function startPlayback() {
    attachStream();
    shell.classList.add('is-playing');

    if (cover) {
      cover.setAttribute('aria-hidden', 'true');
    }

    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        shell.classList.remove('is-playing');
        if (cover) {
          cover.removeAttribute('aria-hidden');
        }
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', startPlayback);
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}());
