import "./style/main.less";

async function main() {
  console.log("[mcpmarket-better] loaded on", location.href);
}

main().catch((e) => {
  console.error("[mcpmarket-better]", e);
});
