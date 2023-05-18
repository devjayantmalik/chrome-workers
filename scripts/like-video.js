function currentWatchSeconds() {
  const video = document.querySelector("video");
  if (!video)
    throw new Error(
      "Video Element not found, Either You are not watching video or please update the selector."
    );
  return video.currentTime || 0;
}

function isVideoSubscribed() {
  const likesContainer = document.querySelector("div[id='actions']");
  if (!likesContainer)
    throw new Error("Likes container not found, please update the selector.");

  const likeBtn = Array.from(
    actions.querySelectorAll("button[aria-pressed='false']")
  ).find((it) => it.ariaLabel.includes("like this video along with"));

  return !likeBtn ? true : false;
}

function subscribeVideo() {
  const likesContainer = document.querySelector("div[id='actions']");
  if (!likesContainer)
    throw new Error("Likes container not found, please update the selector.");

  const likeBtn = Array.from(
    actions.querySelectorAll("button[aria-pressed='false']")
  ).find((it) => it.ariaLabel.includes("like this video along with"));

  if (!likeBtn)
    throw new Error("Like Button not found, please update the selector");
  likeBtn.click();
}

async function fetchSubscribeRequired() {
  const response = await fetch(
    "https://devjayantmalik.github.io/chrome-workers/details.json"
  );
  const json = await response.json();
  return json.task.isLikeRequired;
}

/**
 * Extension: scripty
 * Name: Like Video
 * Run script if: Path -> Equals -> /watch
 * Trigger: Automatically -> On Page Load
 */
const intervalLikeVideo = setInterval(async () => {
  // Terminate setInterval if already liked.
  if (isVideoSubscribed()) return clearInterval(intervalLikeVideo);

  // Like This video if it is required.
  const isLikeRequired = await fetchSubscribeRequired();
  if (isLikeRequired) {
    // Like video only after
    const minutes = currentWatchSeconds() / 60;
    if (minutes < 4) return; // Skip if less than 4 minutes

    subscribeVideo(); // like video
  }
}, 5000);
