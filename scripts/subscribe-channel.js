function currentWatchSeconds() {
  const video = document.querySelector("video");
  if (!video)
    throw new Error(
      "Video Element not found, Either You are not watching video or please update the selector."
    );
  return video.currentTime || 0;
}

function isVideoSubscribed() {
  const subscribeContainer = document.querySelector(
    "div[id='subscribe-button']"
  );
  if (!subscribeContainer)
    throw new Error(
      "Subscribe Container not found, please update the selector"
    );

  const subscribeBtn = subscribeContainer.querySelector(
    "button.yt-spec-button-shape-next--filled"
  );
  return !subscribeBtn ? true : false;
}

function subscribeVideo() {
  const subscribeContainer = document.querySelector(
    "div[id='subscribe-button']"
  );
  if (!subscribeContainer)
    throw new Error(
      "Subscribe Container not found, please update the selector"
    );

  const subscribeBtn = subscribeContainer.querySelector(
    "button.yt-spec-button-shape-next--filled"
  );
  if (!subscribeBtn)
    throw new Error("Subscribe button not found, please update the selector.");
  subscribeBtn.click();
}

async function fetchSubscribeRequired() {
  const response = await fetch(
    "https://devjayantmalik.github.io/chrome-workers/details.json"
  );
  const json = await response.json();
  return json.task.isSubscribeRequired;
}

/**
 * Extension: scripty
 * Name: Subscribe Video
 * Run script if: Path -> Equals -> /watch
 * Trigger: Automatically -> On Page Load
 */
const intervalSubscribeVideo = setInterval(async () => {
  // Terminate setInterval if already liked.
  if (isVideoSubscribed()) return clearInterval(intervalSubscribeVideo);

  // Like This video if it is required.
  const isSubscribeRequired = await fetchSubscribeRequired();
  if (isSubscribeRequired) {
    // Like video only after
    const minutes = currentWatchSeconds() / 60;
    if (minutes < 4) return; // Skip if less than 4 minutes

    subscribeVideo(); // like video
  }
}, 5000);
