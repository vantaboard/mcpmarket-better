const { author, dependencies, version } = require("../package.json");

module.exports = {
  name: {
    $: "MCP Market Better",
    en: "MCP Market Better",
  },
  namespace: "https://mcpmarket.com/",
  version: version,
  author: author,
  description: "Enhances mcpmarket.com search and browsing",
  match: ["*://mcpmarket.com/search*", "*://mcpmarket.com/*"],
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: ["GM.xmlHttpRequest", "GM.setValue", "GM.getValue"],
  "run-at": "document-end",
};
