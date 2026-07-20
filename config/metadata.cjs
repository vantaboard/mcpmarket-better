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
    $: "Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, and open-in-background tabs.",
    en: "Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, and open-in-background tabs.",
  },
  // Search is the only surface this script enhances.
  match: ["*://mcpmarket.com/search*"],
  // SPDX identifier — required for a clear Greasy Fork listing.
  license: "WTFPL",
  grant: [
    "GM.xmlHttpRequest",
    "GM.setValue",
    "GM.getValue",
    "GM.openInTab",
  ],
  "run-at": "document-end",
};
