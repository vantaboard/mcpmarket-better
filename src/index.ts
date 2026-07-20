import "./style/main.less";
import { startSearchChromeObserver } from "./search-chrome";

async function main() {
  console.log("[mcpmarket-better] loaded on", location.href);
  startSearchChromeObserver();
}

main().catch((e) => {
  console.error("[mcpmarket-better]", e);
});
