/**
 * Extension: scripty
 * Name: Youtube AD Auto Remove
 * Run script if: Path -> Equals -> /watch
 * Trigger: Automatically -> On Page Load
 */

setInterval(function () {
  //Skip AD Video
  if (document.querySelector(".ytp-ad-text.ytp-ad-skip-button-text")) {
    document.querySelector(".ytp-ad-text.ytp-ad-skip-button-text").click();
  }

  //Close AD Banner
  if (document.querySelector(".ytp-ad-overlay-close-button")) {
    document.querySelector(".ytp-ad-overlay-close-button").click();
  }
}, 3000);
