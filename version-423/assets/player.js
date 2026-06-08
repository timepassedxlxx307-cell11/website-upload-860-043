function initializeMoviePlayer(streamUrl) {
  const video = document.getElementById("movie-player");
  const overlay = document.querySelector("[data-player-overlay]");
  const button = document.querySelector("[data-play-button]");
  let isLoaded = false;
  let hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function attachStream() {
    if (isLoaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      isLoaded = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      isLoaded = true;
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      }, { once: true });
      return;
    }

    video.src = streamUrl;
    isLoaded = true;
  }

  function startPlayback() {
    attachStream();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      startPlayback();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });
}
