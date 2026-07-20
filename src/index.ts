import "./style/main.less";
import { startCardNavigation } from "./card-navigation";
import { startFavorites } from "./favorites-ui";
import { startSearchChromeObserver } from "./search-chrome";
import { startSearchNavigation } from "./search-navigation";
import { ensureInfiniteScroll } from "./soft-search";

async function main() {
  console.log("[mcpmarket-better] loaded on", location.href);
  startSearchChromeObserver();
  startSearchNavigation();
  startFavorites();
  startCardNavigation();
  ensureInfiniteScroll();
}

main().catch((e) => {
  console.error("[mcpmarket-better]", e);
});
