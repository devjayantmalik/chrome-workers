function search(searchQuery) {
  const searchInput = document.querySelector("input[name='search_query']");
  const searchForm = document.querySelector("form[id='search-form']");
  if (!searchInput)
    throw new Error("Search Input Not Found, Please update the selector");
  if (!searchForm)
    throw new Error("Search Button Not Found, Please update the selector");

  searchInput.value = searchQuery;
  searchForm.submit();
}

async function fetchSearchQuery() {
  const response = await fetch(
    "https://devjayantmalik.github.io/chrome-workers/details.json"
  );
  const json = await response.json();
  return json.task.searchQuery;
}

/**
 * Extension: scripty
 * Name: Search Video
 * Run script if: Path -> Equals -> /
 * Trigger: Automatically -> On Page Load
 */
// TODO: Check if data has been changed on remote server:
// if server data updated -> Search again
setTimeout(async () => {
  if (window.location.href !== "https://www.youtube.com/") return;

  // Fetch Search Query and Perform Search.
  search(await fetchSearchQuery());
}, 3000);
