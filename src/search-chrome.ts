import { ensureFavoritesModeButton } from "./favorites-ui";
import { ensureSearchInputBound } from "./search-navigation";
import { softSearchOrNavigate } from "./soft-search";

const HEADER_SEL = "header.sticky.top-14";

type Category = { name: string; count: number; slug: string };

let categoriesCache: Category[] | null = null;
let enhanceScheduled = false;
let documentListenersBound = false;
let observer: MutationObserver | null = null;

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getHeader(): HTMLElement | null {
  return document.querySelector(HEADER_SEL);
}

function getStack(header: HTMLElement): HTMLElement | null {
  return header.querySelector("section.py-4 .flex.flex-col");
}

function getSelectedCategory(header: HTMLElement): string | null {
  // URL is source of truth — host chip/placeholder lag after soft clears.
  const slug = new URLSearchParams(location.search).get("category_slug");
  if (!slug) return null;

  if (categoriesCache) {
    const match = categoriesCache.find((c) => c.slug === slug);
    if (match) return match.name;
  }

  const primary = header.querySelector(
    "section.border-t .scrollbar-hide > button[class*='bg-primary']",
  );
  const chipName = primary?.querySelector("span")?.textContent?.trim();
  if (chipName) return chipName;

  const placeholder =
    header.querySelector<HTMLInputElement>('input[name="search"]')
      ?.placeholder || "";
  const fromPlaceholder = placeholder.match(/\.\.\.\s*(.+)$/);
  if (fromPlaceholder) return fromPlaceholder[1].trim();

  // Last resort: title-case the slug
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Host-style placeholder: "Search for MCP servers... {Category}". */
function syncSearchPlaceholder(header: HTMLElement): void {
  const input = header.querySelector<HTMLInputElement>('input[name="search"]');
  if (!input) return;

  const type = new URLSearchParams(location.search).get("type");
  const category = getSelectedCategory(header);
  const base =
    type === "skills"
      ? "Search for Agent Skills..."
      : "Search for MCP servers...";
  const next = category ? `${base} ${category}` : base;
  if (input.placeholder !== next) {
    input.placeholder = next;
  }
}

function navigateCategory(slug: string | null): void {
  softSearchOrNavigate({ category_slug: slug });
  // Soft nav uses replaceState; sync Filter label + placeholder from URL.
  const header = getHeader();
  if (!header) return;
  syncFilterControl(header);
}

async function loadCategories(header: HTMLElement): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;

  try {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data: { name: string; count: number }[] = await res.json();
      categoriesCache = data.map((c) => ({
        name: c.name,
        count: c.count,
        slug: slugify(c.name),
      }));
      return categoriesCache;
    }
  } catch {
    // fall through to DOM scrape
  }

  const scraped: Category[] = [];
  const seen = new Set<string>();

  const chips = header.querySelectorAll(
    "section.border-t .scrollbar-hide > button",
  );
  chips.forEach((btn) => {
    const name = btn.querySelector("span")?.textContent?.trim();
    if (!name || name === "More categories" || seen.has(name)) return;
    const countText = btn.textContent?.replace(name, "").replace(/\D/g, "");
    scraped.push({
      name,
      count: Number(countText) || 0,
      slug: slugify(name),
    });
    seen.add(name);
  });

  categoriesCache = scraped;
  return scraped;
}

function closeFilterPanel(root: HTMLElement): void {
  const panel = root.querySelector<HTMLElement>(".mmb-filter-panel");
  const btn = root.querySelector<HTMLElement>(".mmb-filter-btn");
  if (panel) panel.hidden = true;
  btn?.setAttribute("aria-expanded", "false");
}

function updateFilterButtonLabel(
  btn: HTMLElement,
  selected: string | null,
): void {
  const label = btn.querySelector(".mmb-filter-label");
  if (!label) return;
  const next = selected || "Filter";
  if (label.textContent !== next) {
    label.textContent = next;
  }
  const shouldBeActive = !!selected;
  if (btn.classList.contains("mmb-filter-btn--active") !== shouldBeActive) {
    btn.classList.toggle("mmb-filter-btn--active", shouldBeActive);
  }
  const nextTitle = selected ? `Category: ${selected}` : "Filter by category";
  if (btn.title !== nextTitle) {
    btn.title = nextTitle;
  }
}

function renderFilterPanel(
  panel: HTMLElement,
  categories: Category[],
  selected: string | null,
): void {
  panel.replaceChildren();

  const list = document.createElement("div");
  list.className = "mmb-filter-list";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className =
    "mmb-filter-item" + (!selected ? " mmb-filter-item--active" : "");
  allBtn.innerHTML = `<span class="mmb-filter-item-name">All categories</span>`;
  allBtn.addEventListener("click", () => {
    closeFilterPanel(panel.closest(".mmb-filter") || panel);
    navigateCategory(null);
  });
  list.appendChild(allBtn);

  for (const cat of categories) {
    const item = document.createElement("button");
    item.type = "button";
    const isActive = selected === cat.name;
    item.className =
      "mmb-filter-item" + (isActive ? " mmb-filter-item--active" : "");
    item.innerHTML = `
      <span class="mmb-filter-item-name"></span>
      <span class="mmb-filter-item-count"></span>
    `;
    item.querySelector(".mmb-filter-item-name")!.textContent = cat.name;
    item.querySelector(".mmb-filter-item-count")!.textContent = String(
      cat.count,
    );
    item.addEventListener("click", () => {
      closeFilterPanel(panel.closest(".mmb-filter") || panel);
      if (isActive) {
        navigateCategory(null);
      } else {
        navigateCategory(cat.slug);
      }
    });
    list.appendChild(item);
  }

  panel.appendChild(list);
}

function syncFilterControl(header: HTMLElement): void {
  const btn = header.querySelector<HTMLElement>(".mmb-filter-btn");
  if (btn) {
    updateFilterButtonLabel(btn, getSelectedCategory(header));
  }
  syncSearchPlaceholder(header);
}

/**
 * Wrap search + Filter in a flex row (full grid width) so the input
 * fills up to the Filter with only a small gap — no empty column.
 */
function ensureFilterControl(stack: HTMLElement, header: HTMLElement): void {
  const existingRow = stack.querySelector<HTMLElement>(
    ":scope > .mmb-search-row",
  );
  if (existingRow) {
    ensureFavoritesModeButton(existingRow);
    syncFilterControl(header);
    return;
  }

  const searchWrap = stack.querySelector<HTMLElement>(
    ':scope > .flex-1:has(input[name="search"])',
  );
  if (!searchWrap) return;

  const row = document.createElement("div");
  row.className = "mmb-search-row";
  row.setAttribute("data-mmb", "search-row");
  searchWrap.before(row);
  row.appendChild(searchWrap);

  const filterRoot = document.createElement("div");
  filterRoot.className = "mmb-filter";
  filterRoot.setAttribute("data-mmb", "filter");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mmb-filter-btn";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `
    <svg class="mmb-filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
    <span class="mmb-filter-label">Filter</span>
  `;

  const panel = document.createElement("div");
  panel.className = "mmb-filter-panel";
  panel.hidden = true;
  panel.setAttribute("role", "listbox");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.hidden;
    if (open) {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      void loadCategories(header).then((cats) => {
        renderFilterPanel(panel, cats, getSelectedCategory(header));
      });
    } else {
      closeFilterPanel(filterRoot);
    }
  });

  filterRoot.appendChild(btn);
  filterRoot.appendChild(panel);
  ensureFavoritesModeButton(row);
  row.appendChild(filterRoot);

  const selected = getSelectedCategory(header);
  updateFilterButtonLabel(btn, selected);
  void loadCategories(header).then((cats) => {
    renderFilterPanel(panel, cats, selected);
  });
}

function headerNeedsFilter(header: HTMLElement): boolean {
  const stack = getStack(header);
  if (!stack) return false;
  const hasSearch = !!stack.querySelector('input[name="search"]');
  const hasRow = !!stack.querySelector(":scope > .mmb-search-row");
  return hasSearch && !hasRow;
}

/** Icon-only tabs: expose label via native tooltip + aria-label. */
function ensureTypeTabTooltips(header: HTMLElement): void {
  const tabs = header.querySelectorAll<HTMLElement>(
    '[role="tablist"] [role="tab"]',
  );
  for (const tab of tabs) {
    const label =
      tab.querySelector("span")?.textContent?.trim() ||
      tab.textContent?.trim() ||
      "";
    if (!label) continue;
    if (tab.getAttribute("title") !== label) tab.setAttribute("title", label);
    if (tab.getAttribute("aria-label") !== label) {
      tab.setAttribute("aria-label", label);
    }
  }
}

export function enhanceSearchChrome(): void {
  if (!isSearchPage()) return;

  const header = getHeader();
  if (!header) return;

  const stack = getStack(header);
  if (!stack) return;

  // Layout/hide is pure CSS — only inject the Filter control.
  ensureFilterControl(stack, header);
  ensureTypeTabTooltips(header);
  syncSearchPlaceholder(header);
  ensureSearchInputBound();
}

function scheduleEnhance(): void {
  if (enhanceScheduled) return;
  enhanceScheduled = true;
  requestAnimationFrame(() => {
    enhanceScheduled = false;
    try {
      observer?.disconnect();
      enhanceSearchChrome();
    } catch (e) {
      console.error("[mcpmarket-better] enhance failed", e);
    } finally {
      observeHeader();
    }
  });
}

function observeHeader(): void {
  if (!observer) return;
  const header = getHeader();
  observer.observe(header ?? document.body, {
    childList: true,
    subtree: true,
  });
}

export function startSearchChromeObserver(): void {
  if (!documentListenersBound) {
    documentListenersBound = true;

    document.addEventListener("click", (e) => {
      const target = e.target as Element | null;
      if (!target?.closest?.(".mmb-filter")) {
        document.querySelectorAll(".mmb-filter").forEach((root) => {
          closeFilterPanel(root as HTMLElement);
        });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".mmb-filter").forEach((root) => {
          closeFilterPanel(root as HTMLElement);
        });
      }
    });

    let lastHref = location.href;
    const syncFromUrl = () => {
      if (location.href === lastHref) return;
      lastHref = location.href;
      const header = getHeader();
      if (!header) return;
      if (headerNeedsFilter(header)) {
        scheduleEnhance();
      } else {
        syncFilterControl(header);
      }
    };
    window.addEventListener("popstate", syncFromUrl);
    setInterval(syncFromUrl, 500);
  }

  if (!observer) {
    observer = new MutationObserver((mutations) => {
      const header = getHeader();
      if (!header) {
        scheduleEnhance();
        return;
      }

      const onlyOurs = mutations.every((m) => {
        const el =
          m.target instanceof Element ? m.target : m.target.parentElement;
        return !!el?.closest?.(".mmb-filter, .mmb-search-row");
      });
      if (onlyOurs) return;

      if (headerNeedsFilter(header)) {
        scheduleEnhance();
      }
    });
  }

  // Run after hydration so we don't move nodes React still owns.
  scheduleEnhance();
  window.setTimeout(() => scheduleEnhance(), 0);
  window.setTimeout(() => scheduleEnhance(), 250);
  window.setTimeout(() => scheduleEnhance(), 1000);
}
