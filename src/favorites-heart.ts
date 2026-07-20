const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;

export function renderHeartButton(id: string, active: boolean): string {
  const activeClass = active ? " mmb-fav-heart--active" : "";
  const pressed = active ? "true" : "false";
  return `<button type="button" class="mmb-fav-heart${activeClass}" data-mmb-fav-id="${escapeAttr(id)}" aria-label="Favorite" title="Favorite" aria-pressed="${pressed}">${HEART_SVG}</button>`;
}

export function createHeartButton(
  id: string,
  active: boolean,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = active
    ? "mmb-fav-heart mmb-fav-heart--active"
    : "mmb-fav-heart";
  btn.setAttribute("data-mmb-fav-id", id);
  btn.setAttribute("aria-label", "Favorite");
  btn.setAttribute("title", "Favorite");
  btn.setAttribute("aria-pressed", active ? "true" : "false");
  btn.innerHTML = HEART_SVG;
  return btn;
}

export function setHeartActive(btn: HTMLElement, active: boolean): void {
  btn.classList.toggle("mmb-fav-heart--active", active);
  btn.setAttribute("aria-pressed", active ? "true" : "false");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
