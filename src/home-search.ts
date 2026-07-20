import { markSearchShouldFocus } from "./search-focus";

/**
 * Landing / category hero search: clicking/focusing the box goes to /search
 * (userscript-side — we can't change mcpmarket.com itself).
 */

let listenersBound = false;

function normalizedPath(): string {
  return location.pathname.replace(/\/+$/, "") || "/";
}

/** Home or /categories/:slug — not the sticky /search chrome. */
function isLandingSearchPage(): boolean {
  const path = normalizedPath();
  return path === "/" || path.startsWith("/categories/");
}

function categorySlugFromPath(): string | null {
  const match = normalizedPath().match(/^\/categories\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isLandingSearchInput(el: Element | null): el is HTMLInputElement {
  if (!(el instanceof HTMLInputElement)) return false;
  if (el.name !== "search") return false;
  // Search-page chrome lives in the sticky search header — leave that alone.
  if (el.closest("header.sticky.top-14")) return false;
  return true;
}

function goToSearch(input?: HTMLInputElement): void {
  if (location.pathname.includes("/search")) return;

  const params = new URLSearchParams();
  const q = input?.value?.trim();
  if (q) params.set("q", q);

  const category = categorySlugFromPath();
  if (category) params.set("category_slug", category);

  // Stable order used elsewhere: category_slug → q → type
  const ordered = new URLSearchParams();
  const slug = params.get("category_slug");
  const query = params.get("q");
  if (slug) ordered.set("category_slug", slug);
  if (query) ordered.set("q", query);

  const qs = ordered.toString();
  markSearchShouldFocus();
  location.assign("/search" + (qs ? `?${qs}` : ""));
}

function onActivate(e: Event): void {
  if (!isLandingSearchPage()) return;
  const target = e.target as Element | null;
  const input =
    (target instanceof HTMLInputElement && isLandingSearchInput(target)
      ? target
      : target?.closest?.("input[name='search']")) ?? null;
  if (!isLandingSearchInput(input)) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  goToSearch(input);
}

export function startHomeSearchRedirect(): void {
  if (listenersBound) return;
  listenersBound = true;

  // Capture early so the host doesn't keep focus on the landing input.
  document.addEventListener("pointerdown", onActivate, true);
  document.addEventListener("focusin", onActivate, true);
  document.addEventListener("click", onActivate, true);
}
