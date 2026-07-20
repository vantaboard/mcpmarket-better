const { author, version } = require("../package.json");

const authorName =
  typeof author === "string" ? author : `${author.name} <${author.email}>`;

module.exports = {
  name: {
    $: "MCP Market Better",
    en: "MCP Market Better",
  },
  // Unique identity for updates — not the site being enhanced.
  namespace: "https://github.com/vantaboard/mcpmarket-better",
  version: version,
  author: authorName,
  description: {
    $: "Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, open-in-background tabs, and home/category search → /search.",
    en: "Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, open-in-background tabs, and home/category search → /search.",
  },
  // Load site-wide so SPA navigations from / → /search still enhance.
  // Features no-op off /search via isSearchPage() checks.
  match: ["*://mcpmarket.com/search*", "*://mcpmarket.com/*"],
  // SPDX identifier — required for a clear Greasy Fork listing.
  license: "MIT",
  grant: [
    "GM.xmlHttpRequest",
    "GM.setValue",
    "GM.getValue",
    "GM.openInTab",
  ],
  "run-at": "document-end",
};
