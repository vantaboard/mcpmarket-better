/**
 * Homepage hero search: clicking/focusing the box goes to /search
 * (we can't change mcpmarket.com itself — this is a userscript enhance).
 */

let listenersBound = false;

function isHomePage(): boolean {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  return path === "/";
}

function isHomeSearchInput(el: Element | null): el is HTMLInputElement {
  if (!(el instanceof HTMLInputElement)) return false;
  if (el.name !== "search") return false;
  // Search-page chrome lives in the sticky search header — leave that alone.
  if (el.closest("header.sticky.top-14")) return false;
  return true;
}

function goToSearch(input?: HTMLInputElement): void {
  const q = input?.value?.trim();
  const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
  if (location.pathname.includes("/search")) return;
  location.assign(url);
}

function onActivate(e: Event): void {
  if (!isHomePage()) return;
  const target = e.target as Element | null;
  const input =
    (target instanceof HTMLInputElement && isHomeSearchInput(target)
      ? target
      : target?.closest?.("input[name='search']")) ?? null;
  if (!isHomeSearchInput(input)) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  goToSearch(input);
}

export function startHomeSearchRedirect(): void {
  if (listenersBound) return;
  listenersBound = true;

  // Capture early so the host doesn't keep focus on the home input.
  document.addEventListener("pointerdown", onActivate, true);
  document.addEventListener("focusin", onActivate, true);
  document.addEventListener("click", onActivate, true);
}
