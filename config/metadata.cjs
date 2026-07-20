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
  // Page CSP on mcpmarket.com blocks unsafe-eval; Tampermonkey Beta's
  // UserScripts API injects via eval into the page world. Running in the
  // content-script world avoids that CSP (we only need DOM access).
  "inject-into": "content",
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: ["GM.xmlHttpRequest"],
  "run-at": "document-end",
};
