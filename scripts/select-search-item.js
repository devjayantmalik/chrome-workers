async function fetchSearchItemSelector() {
  const response = await fetch(
    "https://devjayantmalik.github.io/chrome-workers/details.json"
  );
  const json = await response.json();
  return json.task.searchItemSelector;
}

/**
 * Extension: scripty
 * Name: Search Video
 * Run script if: Path -> Equals -> /results
 * Trigger: Automatically -> On Page Load
 */
setInterval(async () => {
  // Fetch Search Query and Perform Search.
  const selector = await fetchSearchItemSelector();
  const searchItem = document.querySelector(selector);
  if (!searchItem)
    throw new Error("Search item not found, Please update the selector.");
  searchItem.click();
}, 3000);
