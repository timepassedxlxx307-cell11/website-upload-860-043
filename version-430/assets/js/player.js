function createMoviePlayer(streamUrl) {
  var start = function () {
    var video = document.getElementById('movie-video');
    var button = document.getElementById('play-button');
    if (!video || !button || !streamUrl) {
      return;
    }

    var load = function () {
      button.classList.add('hidden');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.src) {
          video.src = streamUrl;
        }
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!video.hlsReady) {
          var hls = new window.Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          video.hlsReady = true;
        }
        video.play().catch(function () {});
        return;
      }
      if (!video.src) {
        video.src = streamUrl;
      }
      video.play().catch(function () {});
    };

    button.addEventListener('click', load);
    video.addEventListener('click', load);
    video.addEventListener('play', function () {
      button.classList.add('hidden');
    });
  };

  if (document.readyState !== 'loading') {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }
}
