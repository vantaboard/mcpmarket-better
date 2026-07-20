import { navigateSearch, readSearchParams } from "./search-params";
import { softSearch } from "./soft-search";

const HEADER_SEL = "header.sticky.top-14";
const DEBOUNCE_MS = 300;

const boundInputs = new WeakSet<HTMLInputElement>();
let documentListenersBound = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastSyncedHref = "";

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

function getSearchInput(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `${HEADER_SEL} input[name="search"]`,
  );
}

/** Set React-controlled input value via native setter. */
function setNativeInputValue(input: HTMLInputElement, value: string): void {
  const proto = Object.getPrototypeOf(input) as HTMLInputElement;
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  if (desc?.set) {
    desc.set.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function navigateFromQuery(raw: string): void {
  const q = raw.trim() || null;
  navigateSearch({ q });
}

function onSearchSubmit(e: Event): void {
  if (!isSearchPage()) return;
  const form = e.target as HTMLFormElement | null;
  if (!(form instanceof HTMLFormElement)) return;
  const input = form.querySelector<HTMLInputElement>('input[name="search"]');
  if (!input) return;

  e.preventDefault();
  e.stopImmediatePropagation();
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  navigateFromQuery(input.value);
}

function onSearchInput(e: Event): void {
  if (!isSearchPage()) return;
  const input = e.target as HTMLInputElement;
  if (!(input instanceof HTMLInputElement) || input.name !== "search") return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const next = input.value.trim() || null;
    const current = readSearchParams().q;
    if (next === current) return;
    // Soft update: fetch + replace results grid, replaceState URL — no
    // full navigation, so the sticky chrome does not skeleton-remount.
    void softSearch(next).then((ok) => {
      if (!ok) navigateSearch({ q: next });
    });
  }, DEBOUNCE_MS);
}

function onTypeTabClick(e: Event): void {
  if (!isSearchPage()) return;
  const target = e.target as Element | null;
  const tab = target?.closest?.(
    `${HEADER_SEL} [role="tablist"] [role="tab"]`,
  ) as HTMLElement | null;
  if (!tab) return;

  const selected =
    tab.getAttribute("aria-selected") === "true" ||
    tab.getAttribute("data-state") === "active";
  if (selected) return;

  const label = tab.textContent?.trim() || "";
  if (label !== "Agent Skills" && label !== "MCP Servers") return;

  e.preventDefault();
  e.stopImmediatePropagation();

  if (label === "Agent Skills") {
    navigateSearch({ type: "skills" });
  } else {
    navigateSearch({ type: null });
  }
}

export function bindSearchInput(input: HTMLInputElement): void {
  if (boundInputs.has(input)) return;
  boundInputs.add(input);
  input.addEventListener("input", onSearchInput);
}

export function ensureSearchInputBound(): void {
  if (!isSearchPage()) return;
  const input = getSearchInput();
  if (input) bindSearchInput(input);
}

/** Sync search input value from URL `q` (back/forward / external nav). */
export function syncSearchInputFromUrl(): void {
  if (!isSearchPage()) return;
  if (location.href === lastSyncedHref) return;
  lastSyncedHref = location.href;

  const input = getSearchInput();
  if (!input) return;

  const q = readSearchParams().q || "";
  if (input.value === q) return;

  // Don't fight the user while they're typing.
  if (document.activeElement === input) return;

  setNativeInputValue(input, q);
}

export function startSearchNavigation(): void {
  if (!documentListenersBound) {
    documentListenersBound = true;

    document.addEventListener("submit", onSearchSubmit, true);
    document.addEventListener("click", onTypeTabClick, true);

    window.addEventListener("popstate", () => {
      lastSyncedHref = "";
      syncSearchInputFromUrl();
    });
    setInterval(() => {
      ensureSearchInputBound();
      syncSearchInputFromUrl();
    }, 500);
  }

  ensureSearchInputBound();
  syncSearchInputFromUrl();
}
