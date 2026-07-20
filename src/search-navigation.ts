import { readSearchParams } from "./search-params";
import { softSearch, softSearchOrNavigate } from "./soft-search";

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
  softSearchOrNavigate({ q: input.value.trim() || null });
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
    // Soft update only — do not fall back to location.assign on empty /
    // redirect; that can 301-loop on some category+q combinations.
    void softSearch({ q: next });
  }, DEBOUNCE_MS);
}

/** Keep Radix tab visuals in sync when we intercept navigation. */
function syncTypeTabs(type: string | null): void {
  const tabs = document.querySelectorAll<HTMLElement>(
    `${HEADER_SEL} [role="tablist"] [role="tab"]`,
  );
  for (const tab of tabs) {
    const label = tab.textContent?.trim() || "";
    const shouldActive =
      (type === "skills" && label === "Agent Skills") ||
      (type !== "skills" && label === "MCP Servers");
    tab.setAttribute("data-state", shouldActive ? "active" : "inactive");
    tab.setAttribute("aria-selected", shouldActive ? "true" : "false");
    tab.tabIndex = shouldActive ? 0 : -1;
    if (!shouldActive && document.activeElement === tab) {
      tab.blur();
    }
  }

  // Placeholder copy flips with type on the host.
  const input = getSearchInput();
  if (input) {
    const catHint = input.placeholder.match(/\.\.\.\s+(.+)$/)?.[1] ?? "";
    const base =
      type === "skills"
        ? "Search for Agent Skills..."
        : "Search for MCP servers...";
    input.placeholder = catHint ? `${base} ${catHint}` : base;
  }
}

/**
 * Host Radix tabs navigate on mousedown (not click). Intercept early in
 * capture so q / category_slug are not wiped by the host handler.
 */
function onTypeTabActivate(e: Event): void {
  if (!isSearchPage()) return;
  // Ignore non-primary mouse buttons on mouse/pointer events.
  if ("button" in e && (e as MouseEvent).button !== 0) return;

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

  const nextType = label === "Agent Skills" ? "skills" : null;
  syncTypeTabs(nextType);
  softSearchOrNavigate({ type: nextType });
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

  syncTypeTabs(readSearchParams().type);

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
    // Radix tabs fire navigation on mousedown; also catch click/keydown.
    document.addEventListener("mousedown", onTypeTabActivate, true);
    document.addEventListener("click", onTypeTabActivate, true);
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        onTypeTabActivate(e);
      },
      true,
    );

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
