import "./style/main.less";
import { startSearchChromeObserver } from "./search-chrome";
import { startSearchNavigation } from "./search-navigation";

async function main() {
  console.log("[mcpmarket-better] loaded on", location.href);
  startSearchChromeObserver();
  startSearchNavigation();
}

main().catch((e) => {
  console.error("[mcpmarket-better]", e);
});
